let Q = null;

function el(id) { return document.getElementById(id); }

function approxEqual(a, b, tol) {
  if (Number.isNaN(a) || Number.isNaN(b)) return false;
  return Math.abs(a - b) <= (tol ?? 0);
}

async function loadQuestion() {
  const res = await fetch("./question.json", { cache: "no-store" });
  Q = await res.json();

  el("title").textContent = Q.title ?? "Math Practice";
  el("prompt").textContent = Q.prompt ?? "";
  el("meta").textContent = `Question ID: ${Q.id ?? "unknown"}`;

  const stepsDiv = el("steps");
  stepsDiv.innerHTML = "";

  (Q.steps ?? []).forEach((s) => {
    const wrap = document.createElement("div");
    wrap.className = "step";

    const label = document.createElement("label");
    label.className = "label";
    label.textContent = s.label;

    const input = document.createElement("input");
    input.className = "input";
    input.id = `step_${s.id}`;
    input.placeholder = "Enter your answer";
    input.inputMode = "decimal";

    const feedback = document.createElement("div");
    feedback.className = "muted small";
    feedback.id = `fb_${s.id}`;
    feedback.textContent = "";

    wrap.appendChild(label);
    wrap.appendChild(input);
    wrap.appendChild(feedback);
    stepsDiv.appendChild(wrap);
  });

  el("finalLabel").textContent = Q.final?.label ?? "Final Answer";
}

function getAnswers() {
  const student = el("studentName").value.trim();
  const block = el("classBlock").value.trim();
  const attempt = el("attempt").value.trim();

  const stepAnswers = (Q.steps ?? []).map((s) => {
    const raw = el(`step_${s.id}`).value.trim();
    const val = Number(raw);
    return { id: s.id, label: s.label, raw, value: val };
  });

  const finalRaw = el("finalAnswer").value.trim();
  const finalVal = Number(finalRaw);

  return {
    timestampIso: new Date().toISOString(),
    student,
    classBlock: block,
    attempt,
    questionId: Q.id ?? "",
    steps: stepAnswers,
    final: { label: Q.final?.label ?? "Final", raw: finalRaw, value: finalVal }
  };
}

function checkAnswers() {
  if (!Q) return;

  const ans = getAnswers();

  let allStepsFilled = true;

  (Q.steps ?? []).forEach((s) => {
    const got = ans.steps.find(x => x.id === s.id);
    const fb = el(`fb_${s.id}`);
    if (!got?.raw) {
      fb.textContent = "Required.";
      allStepsFilled = false;
      return;
    }
    const ok = approxEqual(got.value, Number(s.answer), Number(s.tolerance ?? 0));
    fb.textContent = ok ? "✅ Looks correct" : "❌ Check this step";
  });

  const finalOk = approxEqual(ans.final.value, Number(Q.final?.answer), Number(Q.final?.tolerance ?? 0));
  el("checkResult").textContent = finalOk ? "✅ Final looks correct" : "❌ Final may be incorrect";

  // Optional gating: you can prevent submit until steps are filled
  return allStepsFilled;
}

/* ===== Drawing canvas ===== */
function setupCanvas() {
  const canvas = el("board");
  const ctx = canvas.getContext("2d");

  // White background so exported PNG isn't transparent
  function paintBackground() {
    ctx.save();
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }
  paintBackground();

  let drawing = false;
  let erasing = false;
  let last = null;

  function getPos(evt) {
    const rect = canvas.getBoundingClientRect();
    const clientX = evt.touches?.[0]?.clientX ?? evt.clientX;
    const clientY = evt.touches?.[0]?.clientY ?? evt.clientY;
    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);
    return { x, y };
  }

  function down(evt) {
    drawing = true;
    last = getPos(evt);
    evt.preventDefault();
  }
  function move(evt) {
    if (!drawing) return;
    const p = getPos(evt);

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = erasing ? "#ffffff" : "#000000";
    ctx.lineWidth = erasing ? 22 : 3;

    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();

    last = p;
    evt.preventDefault();
  }
  function up(evt) {
    drawing = false;
    last = null;
    evt.preventDefault();
  }

  canvas.addEventListener("pointerdown", down);
  canvas.addEventListener("pointermove", move);
  canvas.addEventListener("pointerup", up);
  canvas.addEventListener("pointerleave", up);

  // Touch fallback
  canvas.addEventListener("touchstart", down, { passive: false });
  canvas.addEventListener("touchmove", move, { passive: false });
  canvas.addEventListener("touchend", up, { passive: false });

  el("penBtn").addEventListener("click", () => { erasing = false; });
  el("eraserBtn").addEventListener("click", () => { erasing = true; });
  el("clearBtn").addEventListener("click", () => {
    paintBackground();
  });

  el("saveBtn").addEventListener("click", () => {
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `work_${Q?.id ?? "question"}.png`;
    a.click();
  });

  return canvas;
}

function canvasToDataUrl(canvas) {
  // Keep it modest so form POST isn't huge
  return canvas.toDataURL("image/png");
}

/* ===== Submit to Google Sheet via Apps Script Web App ===== */
function submitToAppsScript(payload) {
  const url = Q?.submit?.appsScriptUrl;
  if (!url || url.includes("PASTE_YOUR_WEB_APP_URL_HERE")) {
    throw new Error("Apps Script URL not set in question.json");
  }

  // Use an HTML form POST (more reliable than fetch to Apps Script due to CORS/preflight)
  const form = document.createElement("form");
  form.method = "POST";
  form.action = url;
  form.target = "_blank"; // open response in new tab (student can close)

  function addField(name, value) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value ?? "";
    form.appendChild(input);
  }

  addField("student", payload.student);
  addField("classBlock", payload.classBlock);
  addField("attempt", payload.attempt);
  addField("questionId", payload.questionId);
  addField("timestampIso", payload.timestampIso);

  addField("stepsJson", JSON.stringify(payload.steps));
  addField("finalJson", JSON.stringify(payload.final));

  // Optional drawing
  if (Q?.submit?.includeDrawing && payload.drawingDataUrl) {
    addField("drawingDataUrl", payload.drawingDataUrl);
  }

  // Return URL (so script can redirect back)
  addField("returnUrl", window.location.href);

  document.body.appendChild(form);
  form.submit();
  form.remove();
}

async function main() {
  await loadQuestion();
  const canvas = setupCanvas();

  el("checkBtn").addEventListener("click", () => {
    checkAnswers();
  });

  el("submitBtn").addEventListener("click", () => {
    el("submitStatus").textContent = "";
    const answers = getAnswers();

    if (!answers.student) {
      el("submitStatus").textContent = "Please enter student name first.";
      return;
    }

    // Enforce filled steps (forces “show work” in a structured way)
    const filled = (Q.steps ?? []).every(s => el(`step_${s.id}`).value.trim().length > 0);
    if (!filled) {
      el("submitStatus").textContent = "Please fill in all step boxes before submitting.";
      return;
    }

    // Optional: check before submit (doesn't block)
    checkAnswers();

    const drawingDataUrl = (Q?.submit?.includeDrawing) ? canvasToDataUrl(canvas) : null;

    try {
      submitToAppsScript({ ...answers, drawingDataUrl });
      el("submitStatus").textContent = "Submitted (opened in a new tab).";
    } catch (e) {
      el("submitStatus").textContent = `Submit failed: ${e.message}`;
    }
  });
}

main();