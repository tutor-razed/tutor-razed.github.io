// -------------------------
// Game State
// -------------------------
let username = "";
let teamColor = "#0b95da";
let mode = "regular";

let wordBank = [];
let usedWords = [];
let currentRoundWords = [];

let leftPennants = [];
let rightPennants = [];

let totalScore = 0;
let totalBonus = 0;
let roundTimerId = null;
let roundTimeLeft = 45;
let roundActive = false;

const ROUND_DURATION = 45;
const URGENCY_THRESHOLD = 15;
const GOALIE_SAVE_CHANCE = 0.22;

// -------------------------
// DOM References
// -------------------------
const leftPennantsContainer = document.getElementById("leftPennants");
const rightPennantsContainer = document.getElementById("rightPennants");
const ticker = document.querySelector(".ticker");
const startPanel = document.getElementById("startPanel");
const usernameInput = document.getElementById("usernameInput");
const teamColorInput = document.getElementById("teamColor");
const teamSelectInput = document.getElementById("teamSelect");
const gameModeInput = document.getElementById("gameMode");
const startGameBtn = document.getElementById("startGameBtn");
const settingsBtn = document.getElementById("settingsBtn");

const wordPanel = document.getElementById("wordPanel");
const wordLetter = document.getElementById("wordLetter");
const wordFull = document.getElementById("wordFull");
const wordHint = document.getElementById("wordHint");
const wordInput = document.getElementById("wordInput");
const wordStatus = document.getElementById("wordStatus");
const wordScore = document.getElementById("wordScore");
const wordBonus = document.getElementById("wordBonus");
const roundTimer = document.getElementById("roundTimer");
const shotEvent = document.getElementById("shotEvent");
const shootBtn = document.getElementById("shootBtn");
const rink = document.getElementById("rink");


function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }


// Randomly move all skaters (exclude goalies)
const skaters = document.querySelectorAll('.player-circle');

skaters.forEach(skater => {
  // Initial random position
  skater.style.left = (Math.random() * 90 + 5) + '%';
  skater.style.top = (Math.random() * 80 + 10) + '%';

  // Move randomly every 3-6 seconds
  setInterval(() => {
    skater.style.left = (Math.random() * 90 + 5) + '%';
    skater.style.top = (Math.random() * 80 + 10) + '%';
  }, 3000 + Math.random() * 3000);
});




// -------------------------
// Overlay / Settings
// -------------------------
if (settingsBtn) {
  settingsBtn.addEventListener("click", () => {
    startPanel.classList.remove("hidden");
    usernameInput.value = username;
    teamColorInput.value = teamColor;
    gameModeInput.value = mode;
  });
}

if (startGameBtn) {
  startGameBtn.addEventListener("click", () => {
    username = usernameInput.value || "Player";
    teamColor = teamColorInput.value || "#0b95da";
    mode = gameModeInput.value || "regular";
    const teamName = teamSelectInput.value;

    if (rink) rink.style.backgroundColor = teamColor;
    initGame(mode, username, teamColor);
    startPanel.classList.add("hidden");
    console.log("Team selected:", teamName);
  });
}

// -------------------------
// Initialize Game
// -------------------------
async function initGame(selectedMode, name, color) {
  username = name || "Player";
  teamColor = color || "#0b95da";
  mode = selectedMode;

  try {
    const response = await fetch(mode === "regular" ? "wordList.json" : "wordListDiff.json");
    const data = await response.json();
    if (Array.isArray(data.words)) {
      wordBank = data.words.slice();
    } else if (Array.isArray(data.easy) || Array.isArray(data.medium) || Array.isArray(data.hard)) {
      const merged = [
        ...(Array.isArray(data.easy) ? data.easy : []),
        ...(Array.isArray(data.medium) ? data.medium : []),
        ...(Array.isArray(data.hard) ? data.hard : []),
      ];
      wordBank = [...new Set(merged)];
    } else if (Array.isArray(data)) {
      wordBank = data.slice();
    } else {
      wordBank = [];
    }
  } catch (err) {
    console.error("Failed to load word list:", err);
    wordBank = [];
  }

  usedWords = [];
  totalScore = 0;
  totalBonus = 0;
  updateScoreDisplay();

  if (wordBank.length > 0) startRound();
  else console.error("Word bank empty!");
}

// -------------------------
// Start a Round (6 words)
// -------------------------
function startRound() {
  stopRoundTimer();
  roundActive = true;
  currentRoundWords = [];

  // guard: ensure enough words
  const available = wordBank.filter(w => !usedWords.includes(w));
  if (available.length < 6) {
    // reset usedWords if insufficient remaining
    usedWords = [];
  }

  for (let i = 0; i < 6; i++) {
    let word;
    let attempts = 0;
    do {
      const idx = Math.floor(Math.random() * wordBank.length);
      word = wordBank[idx];
      attempts++;
      if (attempts > 1000) break;
    } while (!word || usedWords.includes(word));

    if (!word) continue;
    usedWords.push(word);
    currentRoundWords.push(word);
  }

  displayEmptyPennants();
  showWordPanel(currentRoundWords[0] || "");
  wordStatus.textContent = `0 / 6 words`;
  shotEvent.textContent = "";
  startRoundTimer();
}

// -------------------------
// Display Empty Pennants
// -------------------------
function displayEmptyPennants() {
  leftPennantsContainer.innerHTML = "";
  rightPennantsContainer.innerHTML = "";

  leftPennants = [];
  rightPennants = [];

  // Colors for the six banners
  const colorMap = ["#003366", "#cc0000", "#006400", "#ff6600", "#ffff00", "#ffd700"];

  // left 3
  for (let i = 0; i < 3; i++) {
    const pennant = createEmptyPennant(colorMap[i]);
    leftPennantsContainer.appendChild(pennant);
    leftPennants.push(pennant);
  }

  // right 3
  for (let i = 3; i < 6; i++) {
    const pennant = createEmptyPennant(colorMap[i]);
    rightPennantsContainer.appendChild(pennant);
    rightPennants.push(pennant);
  }
}

function createEmptyPennant(color) {
  const pennant = document.createElement("div");
  // Larger pennant + long-word friendly
  pennant.className = "pennant flex-shrink-0 w-36 h-48 sm:w-40 sm:h-56 flex items-center justify-center rounded-lg shadow-md";
  pennant.style.backgroundColor = color;
  pennant.style.color = "#C0C0C0"; // silver text
  pennant.style.fontWeight = "700";
  pennant.style.textAlign = "center";
  pennant.style.padding = "0.25rem";
  pennant.style.overflow = "hidden";
  pennant.style.display = "flex";
  pennant.style.alignItems = "center";
  pennant.style.justifyContent = "center";
  pennant.style.whiteSpace = "nowrap";
  pennant.style.textOverflow = "ellipsis";
  pennant.style.fontFamily = "inherit";
  pennant.style.fontSize = "20px"; // default, will be adjusted on fill
  return pennant;
}

// -------------------------
// Word Panel
// -------------------------
function showWordPanel(word) {
  if (!word) {
    wordPanel.classList.add("hidden");
    return;
  }
  wordPanel.classList.remove("hidden");
  wordLetter.textContent = word[0].toUpperCase();
  wordFull.textContent = word.toUpperCase();
  wordHint.textContent = "Type a sentence using this word.";
  wordInput.value = "";
  // completed = how many already filled = 6 - currentRoundWords.length
  const completed = 6 - currentRoundWords.length;
  wordStatus.textContent = `${completed}/6 words`;
  wordInput.focus();
}

function startRoundTimer() {
  roundTimeLeft = ROUND_DURATION;
  updateRoundTimerUI();
  roundTimerId = setInterval(() => {
    roundTimeLeft -= 1;
    updateRoundTimerUI();
    if (roundTimeLeft <= 0) {
      onRoundTimeExpired();
    }
  }, 1000);
}

function stopRoundTimer() {
  if (roundTimerId) {
    clearInterval(roundTimerId);
    roundTimerId = null;
  }
}

function updateRoundTimerUI() {
  if (!roundTimer) return;
  roundTimer.textContent = `Time: ${Math.max(0, roundTimeLeft)}s`;
  roundTimer.classList.remove("timer-warning");
  if (roundTimeLeft <= URGENCY_THRESHOLD) {
    roundTimer.classList.add("timer-warning");
  }
}

function getTimeMultiplier() {
  if (roundTimeLeft <= 5) return 1.5;
  if (roundTimeLeft <= URGENCY_THRESHOLD) return 1.25;
  return 1;
}

function onRoundTimeExpired() {
  stopRoundTimer();
  roundActive = false;
  wordStatus.textContent = "Time up - new shift starting...";
  shotEvent.textContent = "Buzzer! Round reset.";
  updateTicker(`${username.toUpperCase()} RAN OUT OF TIME.`);
  setTimeout(() => startRound(), 1400);
}

function goalieSavesShot() {
  return Math.random() < GOALIE_SAVE_CHANCE;
}

function triggerGoalieSaveEvent(word) {
  const goalie = Math.random() < 0.5 ? document.getElementById("goalieLeft") : document.getElementById("goalieRight");
  if (goalie) {
    goalie.classList.add("goalie-save");
    setTimeout(() => goalie.classList.remove("goalie-save"), 450);
  }
  shotEvent.textContent = `Saved! Use "${word}" in a stronger sentence.`;
  updateTicker(`GOALIE SAVE! "${word}" was blocked.`);
}

// -------------------------
// Sentence Scoring
// -------------------------
// Basic scoring heuristics: contains word, sentence length, punctuation, capitalization
function scoreSentence(sentence, word) {
  if (!sentence) return 0;
  const lower = sentence.toLowerCase();
  const target = word.toLowerCase();

  // must contain the word as a whole
  const wordRegex = new RegExp(`\\b${escapeRegex(target)}\\b`, "i");
  if (!wordRegex.test(lower)) return 0;

  let score = 10; // base

  const trimmed = sentence.trim();

  // --- Strict grammar heuristics ---
  const startsCap = /^[A-Z]/.test(trimmed);
  const endsPunct = /[.!?]$/.test(trimmed);
  if (startsCap && endsPunct) score += 5;
  else score -= 5;

  // --- Subject and verb check ---
  const hasSubject = /\b(i|you|he|she|it|we|they|my|the)\b/.test(lower);
  const hasVerb = /\b(is|are|was|were|have|has|do|did|go|went|play|like|love|make|see|run|jump|eat|think|say|feel)\b/.test(lower);
  if (hasSubject && hasVerb) score += 10;
  else score -= 3;

  // --- Descriptive language bonuses ---
  if (/\b(and|but|because|so|although|while)\b/.test(lower)) score += 4;
  if (/\b(very|really|quickly|slowly|happy|sad|loud|bright|dark)\b/.test(lower)) score += 3;
  if (/,/.test(sentence)) score += 2;

  // --- Sentence structure ---
  const wordsCount = sentence.split(/\s+/).length;
  if (wordsCount < 4) score -= 5;
  if (wordsCount > 10) score += 3;

  // --- Repetition penalty ---
  const tokens = lower.split(/\s+/);
  const repeated = tokens.filter((w, i) => tokens.indexOf(w) !== i);
  if (repeated.length > 1) score -= 3;

  // --- Random creative flair ---
  score += Math.floor(Math.random() * 6);

  return Math.max(0, score);
}


// -------------------------
// Shooting / Submitting
// -------------------------
shootBtn.addEventListener("click", () => {
  if (!roundActive || currentRoundWords.length === 0) return;

  const sentence = wordInput.value.trim();
  const word = wordFull.textContent;

  const basePoints = scoreSentence(sentence, word);
  const multiplier = getTimeMultiplier();
  const points = Math.round(basePoints * multiplier);

  if (points > 0) {
    if (goalieSavesShot()) {
      triggerGoalieSaveEvent(word);
      wordStatus.textContent = `Saved - try "${word}" again.`;
      return;
    }

    shotEvent.textContent = multiplier > 1 ? `Clutch bonus x${multiplier.toFixed(2)}!` : "Goal counted!";
    movePlayer();
    const bonus = Math.max(0, points - 10);
    totalScore += points;
    totalBonus += bonus;

    fillNextPennant(word, bonus);
    updateScoreDisplay();

    updateTicker(`${username} scored with "${word}" for ${points} points!`);

    currentRoundWords.shift();

    const completed = 6 - currentRoundWords.length;
    wordStatus.textContent = `${completed}/6 words`;

    if (completed === 6) {
      stopRoundTimer();
      roundActive = false;
      celebrateGoal();
      
      // after small delay start a fresh round
      setTimeout(() => startRound(), 1800);
    } else {
      showWordPanel(currentRoundWords[0]);
    }
  } else {
    // feedback message: missing word (whole-word match)
    wordStatus.textContent = `No match - make sure you used "${word}" as a whole word in a sentence.`;
    shotEvent.textContent = "Shot missed - sentence didn't qualify.";
  }
});

wordInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    shootBtn.click();
  }
});

// -------------------------
// Fill a Pennant
// -------------------------
function fillNextPennant(word, bonusScore) {
  const allPennants = [...leftPennants, ...rightPennants];
  const next = allPennants.find(p => p.textContent.trim() === "");
  if (!next) return;

  // scale font: for the largest known word (e.g. "information" ~11) we reduce font
  // baseline = 24px for short words; shrink for long words
  const calculated = Math.max(12, Math.round(28 - (Math.max(0, word.length - 7) * 1.1)));
  next.style.fontSize = `${calculated}px`;
  next.style.color = "#C0C0C0"; // silver
  next.textContent = word.toUpperCase();

  // small flourish for big bonus
  if (bonusScore >= 7) {
    next.classList.add("animate-bounce");
    setTimeout(() => next.classList.remove("animate-bounce"), 700);
  }
}

// -------------------------
// Score UI update
// -------------------------
function updateScoreDisplay() {
  wordScore.textContent = `Score: ${totalScore}`;
  wordBonus.textContent = `Bonus: ${totalBonus}`;
}

// -------------------------
// Goal Celebration
// -------------------------
function celebrateGoal() {
  updateTicker(`${username.toUpperCase()} SCORES A GOAL!`);
  const rink = document.getElementById("rink");
  const player = document.getElementById("player");
  if (rink && player) {
    player.style.transition = "all 0.8s ease-in-out";
    player.style.left = "90%";
    rink.style.borderColor = "gold";
    rink.classList.add("animate-pulse");
    setTimeout(() => {
      rink.classList.remove("animate-pulse");
      rink.style.borderColor = "";
      player.style.left = "10%";
    }, 1600);
  }
}


// Move player each round
function movePlayer() {
  const player = document.getElementById("player");
  if (!player) return;
  const completed = 6 - currentRoundWords.length;
  const newLeft = 10 + completed * 12; // 10%, 22%, 34%, ...
  player.style.left = `${newLeft}%`;
}


// -------------------------
// Ticker
// -------------------------
function updateTicker(message) {
  if (!ticker) return;
  const p = document.createElement("p");
  p.className = "px-6 inline-block whitespace-nowrap";
  p.textContent = message;
  ticker.appendChild(p);
  // auto-scroll to end
  ticker.scrollLeft = ticker.scrollWidth;
}

// Welcome
updateTicker("Welcome to RinkRumble!");
