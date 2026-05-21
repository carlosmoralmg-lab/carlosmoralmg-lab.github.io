const params = new URLSearchParams(window.location.search);
const levelParam = (params.get("level") || params.get("category") || "a1").toLowerCase();
const levelMap = {
  a1: "a1",
  a2: "a2",
  a3: "a3",
  colors: "a1",
  animals: "a1",
  numbers: "a1",
  objects: "a2",
  words: "a2"
};

const levelKey = levelMap[levelParam] || "a1";
const storageKey = `fasterlearn-${levelKey}`;
let questions = [];
let current = 0;
let score = 0;
const successSound = new Audio("sonidos/exito.mp3");
successSound.preload = "auto";

function playSuccessSound() {
  successSound.currentTime = 0;
  successSound.play().catch(() => {});
}

function getLevelTitle(key) {
  return {
    a1: "Nivel A1",
    a2: "Nivel A2",
    a3: "Nivel A3"
  }[key] || "Nivel A1";
}

function getLevelDescription(key) {
  return {
    a1: "Vocabulario basico para empezar",
    a2: "Palabras frecuentes para situaciones diarias",
    a3: "Vocabulario puente para expresarte mejor"
  }[key] || "Vocabulario basico para empezar";
}

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function loadState() {
  const raw = localStorage.getItem(storageKey);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveState() {
  localStorage.setItem(
    storageKey,
    JSON.stringify({
      questions,
      current,
      score
    })
  );
}

function clearState() {
  localStorage.removeItem(storageKey);
}

function getQuestionsForLevel() {
  const data = window.quizData?.[levelKey] || [];
  return data.map((item) => ({
    ...item,
    options: [...item.options]
  }));
}

function renderHeader(total) {
  document.getElementById("categoryLabel").textContent = getLevelTitle(levelKey);
  const step = total ? Math.min(current + 1, total) : 0;
  document.getElementById("progressLabel").textContent = `${score} aciertos | ${step}/${total}`;
}

function renderQuestion() {
  const wordEl = document.getElementById("palabra");
  const optionsEl = document.getElementById("opciones");
  const answerLabel = document.getElementById("answerLabel");

  if (current >= questions.length) {
    wordEl.textContent = "Nivel completado";
    answerLabel.textContent = `${score} palabras practicadas`;
    optionsEl.innerHTML = "";

    const done = document.createElement("div");
    done.className = "game-finish";
    done.innerHTML = `
      <p>Terminaste ${getLevelTitle(levelKey)}.</p>
      <a class="finish-link" href="index.html">Elegir otro nivel</a>
    `;
    optionsEl.appendChild(done);

    clearState();
    renderHeader(questions.length || 0);
    return;
  }

  const item = questions[current];
  wordEl.textContent = item.word;
  answerLabel.textContent = getLevelDescription(levelKey);
  optionsEl.innerHTML = "";

  item.options.forEach((option, index) => {
    const btn = document.createElement("button");
    btn.className = "option-button";
    btn.type = "button";
    btn.textContent = option;
    btn.onclick = () => checkAnswer(index, item.correct, btn);
    optionsEl.appendChild(btn);
  });

  renderHeader(questions.length);
  saveState();
}

function checkAnswer(selected, correct, button) {
  const buttons = Array.from(document.querySelectorAll(".option-button"));
  buttons.forEach((btn) => {
    btn.disabled = true;
  });

  if (selected === correct) {
    button.classList.add("correct");
    score += 1;
    current += 1;
    saveState();
    playSuccessSound();

    setTimeout(() => {
      renderQuestion();
    }, 450);
    return;
  }

  button.classList.add("wrong");
  buttons[correct]?.classList.add("correct");

  setTimeout(() => {
    buttons.forEach((btn) => {
      btn.disabled = false;
      btn.classList.remove("wrong");
      btn.classList.remove("correct");
    });
  }, 800);
}

function startGame() {
  const sourceQuestions = getQuestionsForLevel();
  const existing = loadState();
  const savedQuestionsMatch = existing?.questions?.length === sourceQuestions.length;

  questions = savedQuestionsMatch ? existing.questions : shuffle(sourceQuestions);
  current = savedQuestionsMatch ? existing.current ?? 0 : 0;
  score = savedQuestionsMatch ? existing.score ?? 0 : 0;
  document.title = `FasterLearn - ${getLevelTitle(levelKey)}`;

  if (!questions.length) {
    document.getElementById("palabra").textContent = "No hay palabras";
    document.getElementById("opciones").innerHTML = "";
    renderHeader(0);
    return;
  }

  renderQuestion();
}

document.addEventListener("DOMContentLoaded", startGame);
