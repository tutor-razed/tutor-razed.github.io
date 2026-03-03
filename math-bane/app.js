let Q = null;
let QUESTIONS = [];

function el(id) { return document.getElementById(id); }

function approxEqual(a, b, tol) {
  if (Number.isNaN(a) || Number.isNaN(b)) return false;
  return Math.abs(a - b) <= (tol ?? 0);
}

async function loadQuestion() {
  const select = el("questionSelect");
  const selectedId = select?.value;
  Q = QUESTIONS.find((question) => String(question.id) === String(selectedId)) ?? QUESTIONS[0] ?? null;
  if (!Q) return;

  el("title").textContent = "Math Bane";
  document.title = "Math Bane";
  el("prompt").textContent = Q.prompt ?? "";
  el("meta").textContent = `Question ID: ${Q.id ?? "unknown"}`;
  el("questionHelp").textContent = Q.title ? `Selected: ${Q.title}` : "";

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
  el("finalAnswer").value = "";
  el("checkResult").textContent = "";
  el("submitStatus").textContent = "";
}

async function loadQuestionsList() {
  try {
    const res = await fetch("./questions.json", { cache: "no-store" });
    if (!res.ok) throw new Error(`questions.json returned ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      QUESTIONS = data;
      return;
    }
    throw new Error("questions.json did not contain an array of questions");
  } catch (_error) {
    const fallback = await fetch("./question.json", { cache: "no-store" });
    if (!fallback.ok) throw new Error(`question.json returned ${fallback.status}`);
    QUESTIONS = [await fallback.json()];
  }
}

function populateQuestionSelect() {
  const select = el("questionSelect");
  select.innerHTML = "";

  QUESTIONS.forEach((question, index) => {
    const option = document.createElement("option");
    option.value = question.id ?? `question-${index + 1}`;
    option.textContent = question.title ?? `Question ${index + 1}`;
    select.appendChild(option);
  });
}

function getAnswers() {
  const student = el("studentName").value.trim();

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
    classBlock: "",
    attempt: "",
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
  const viewport = {
    scale: 1,
    x: 0,
    y: 0
  };

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
  let panning = false;
  let last = null;
  let panStart = null;

  function applyViewport() {
    canvas.style.transformOrigin = "top left";
    canvas.style.transform = `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.scale})`;
  }

  function clampScale(nextScale) {
    return Math.min(3, Math.max(0.5, nextScale));
  }

  function setMode(mode) {
    erasing = mode === "eraser";
    panning = mode === "pan";

    el("penBtn").classList.toggle("primary", mode === "pen");
    el("eraserBtn").classList.toggle("primary", mode === "eraser");
    el("panBtn").classList.toggle("primary", mode === "pan");
    el("penBtn").classList.toggle("secondary", mode !== "pen");
    el("eraserBtn").classList.toggle("secondary", mode !== "eraser");
    el("panBtn").classList.toggle("secondary", mode !== "pan");
  }

  function getPos(evt) {
    const rect = canvas.getBoundingClientRect();
    const clientX = evt.touches?.[0]?.clientX ?? evt.clientX;
    const clientY = evt.touches?.[0]?.clientY ?? evt.clientY;
    const displayX = (clientX - rect.left) / viewport.scale;
    const displayY = (clientY - rect.top) / viewport.scale;
    const x = displayX * (canvas.width / canvas.clientWidth);
    const y = displayY * (canvas.height / canvas.clientHeight);
    return { x, y };
  }

  function down(evt) {
    if (panning) {
      panStart = {
        clientX: evt.touches?.[0]?.clientX ?? evt.clientX,
        clientY: evt.touches?.[0]?.clientY ?? evt.clientY,
        x: viewport.x,
        y: viewport.y
      };
      evt.preventDefault();
      return;
    }
    drawing = true;
    last = getPos(evt);
    evt.preventDefault();
  }
  function move(evt) {
    if (panning && panStart) {
      const clientX = evt.touches?.[0]?.clientX ?? evt.clientX;
      const clientY = evt.touches?.[0]?.clientY ?? evt.clientY;
      viewport.x = panStart.x + (clientX - panStart.clientX);
      viewport.y = panStart.y + (clientY - panStart.clientY);
      applyViewport();
      evt.preventDefault();
      return;
    }
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
    panStart = null;
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

  el("penBtn").addEventListener("click", () => { setMode("pen"); });
  el("eraserBtn").addEventListener("click", () => { setMode("eraser"); });
  el("panBtn").addEventListener("click", () => { setMode("pan"); });
  el("zoomInBtn").addEventListener("click", () => {
    viewport.scale = clampScale(viewport.scale + 0.2);
    applyViewport();
  });
  el("zoomOutBtn").addEventListener("click", () => {
    viewport.scale = clampScale(viewport.scale - 0.2);
    applyViewport();
  });
  el("centerBtn").addEventListener("click", () => {
    viewport.scale = 1;
    viewport.x = 0;
    viewport.y = 0;
    applyViewport();
  });
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

  setMode("pen");
  applyViewport();

  return {
    canvas,
    clear() {
      paintBackground();
    },
    resetView() {
      viewport.scale = 1;
      viewport.x = 0;
      viewport.y = 0;
      applyViewport();
    }
  };
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
  await loadQuestionsList();
  populateQuestionSelect();
  const canvasApi = setupCanvas();
  await loadQuestion();

  el("questionSelect").addEventListener("change", async () => {
    await loadQuestion();
    canvasApi.clear();
    canvasApi.resetView();
  });

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

    const drawingDataUrl = (Q?.submit?.includeDrawing) ? canvasToDataUrl(canvasApi.canvas) : null;

    try {
      submitToAppsScript({ ...answers, drawingDataUrl });
      el("submitStatus").textContent = "Submitted (opened in a new tab).";
    } catch (e) {
      el("submitStatus").textContent = `Submit failed: ${e.message}`;
    }
  });
}

main();
