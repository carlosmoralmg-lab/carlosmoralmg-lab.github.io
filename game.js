const params = new URLSearchParams(window.location.search);
const categoryParam = params.get("category") || "words";
const categoryMap = {
  colors: "colors",
  animals: "animals",
  numbers: "numbers",
  objects: "objects",
  words: "words"
};

const categoryKey = categoryMap[categoryParam] || "words";
const storageKey = `fasterlearn-${categoryKey}`;
let questions = [];
let current = 0;
let score = 0;
const successSound = new Audio("sonidos/exito.mp3");
successSound.preload = "auto";

function playSuccessSound() {
  successSound.currentTime = 0;
  successSound.play().catch(() => {});
}

function getCategoryTitle(key) {
  return {
    colors: "Colores",
    animals: "Animales",
    numbers: "Numeros",
    objects: "Objetos",
    words: "Palabras"
  }[key] || "Palabras";
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
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

function getQuestionsForCategory() {
  const data = window.quizData?.[categoryKey] || [];
  return data.map((item) => ({
    ...item,
    options: [...item.options]
  }));
}

function renderHeader(total) {
  document.getElementById("categoryLabel").textContent = getCategoryTitle(categoryKey);
  const step = total ? Math.min(current + 1, total) : 0;
  document.getElementById("progressLabel").textContent = `Nivel: ${score} | ${step}/${total}`;
}

function renderQuestion() {
  const wordEl = document.getElementById("palabra");
  const optionsEl = document.getElementById("opciones");

  if (current >= questions.length) {
    wordEl.textContent = "Completed!";
    optionsEl.innerHTML = "";

    const done = document.createElement("p");
    done.className = "game-finish";
    done.textContent = "You finished this category. Tap any category to play again.";
    optionsEl.appendChild(done);

    clearState();
    renderHeader(questions.length || 0);
    return;
  }

  const item = questions[current];
  wordEl.textContent = item.word;
  optionsEl.innerHTML = "";

  item.options.forEach((option, index) => {
    const btn = document.createElement("button");
    btn.className = "option-button";
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
  }, 700);
}

function startGame() {
  const existing = loadState();
  questions = existing?.questions?.length ? existing.questions : shuffle(getQuestionsForCategory());
  current = existing?.current ?? 0;
  score = existing?.score ?? 0;
  document.title = `FasterLearn - ${getCategoryTitle(categoryKey)}`;

  if (!questions.length) {
    document.getElementById("palabra").textContent = "No questions found";
    document.getElementById("opciones").innerHTML = "";
    renderHeader(0);
    return;
  }

  renderQuestion();
}

document.addEventListener("DOMContentLoaded", startGame);
