let data = [];
let current = 0;
let nivel = 1;

async function loadData() {
  const res = await fetch("opciones.json");
  data = await res.json();

  shuffle(data);
  showQuestion();
}

function showQuestion() {
  if (current >= data.length) {
    alert("Terminaste 🎉 Nivel final: " + nivel);
    return;
  }

  const item = data[current];

  document.getElementById("palabra").textContent = item.word;

  const opcionesDiv = document.getElementById("opciones");
  opcionesDiv.innerHTML = "";

  item.options.forEach((op, index) => {
    const btn = document.createElement("button");
    btn.textContent = op;

    btn.onclick = () => checkAnswer(index, item.correct, btn);
    opcionesDiv.appendChild(btn);
  });
}

function checkAnswer(selected, correct, btn) {
  if (selected === correct) {
    btn.style.background = "green";

    nivel++;
    document.getElementById("nivel").textContent = "Nivel: " + nivel;

    setTimeout(() => {
      current++;
      showQuestion();
    }, 500);

  } else {
    btn.style.background = "red";
  }
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

loadData();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}