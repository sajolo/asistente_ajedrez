function toggleMode(){
  document.body.classList.toggle("light-mode");
  var btn = document.getElementById("toggleModeBtn");
  var icon = btn.querySelector("i");
  if(document.body.classList.contains("light-mode")){
    icon.classList.remove("bi-moon-fill");
    icon.classList.add("bi-sun-fill");
  } else {
    icon.classList.remove("bi-sun-fill");
    icon.classList.add("bi-moon-fill");
  }
}

let playerColor = null;
let currentFen = null;

function setMessage(msg) {
  const messageEl = document.getElementById("message");
  messageEl.innerText = msg;
  messageEl.style.opacity = "0";
  setTimeout(() => messageEl.style.opacity = "1", 10);
}

function updateBoardDisplay(boardText) {
  const boardEl = document.getElementById("boardDisplay");
  boardEl.innerText = boardText;
  boardEl.style.opacity = "0";
  setTimeout(() => boardEl.style.opacity = "1", 10);
}

function setColor(color) {
  playerColor = color;
  document.getElementById("colorSelection").style.display = "none";
  const gameSection = document.getElementById("gameSection");
  gameSection.style.display = "block";
  gameSection.style.opacity = "0";
  setTimeout(() => gameSection.style.opacity = "1", 10);
  
  fetch("/init")
    .then(response => response.json())
    .then(data => {
      currentFen = data.fen;
      updateBoardDisplay(data.board_text);
    });
}

function sendMove() {
  let moveInput = document.getElementById("moveInput");
  let move = moveInput.value;
  if (!move) {
    setMessage("Por favor ingresa un movimiento.");
    return;
  }
  
  fetch("/move", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fen: currentFen, move: move })
  })
  .then(response => response.json())
  .then(data => {
    if (data.error) {
      setMessage(data.error);
    } else {
      currentFen = data.fen;
      updateBoardDisplay(data.board_text);
      setMessage("Movimiento aplicado.");
      moveInput.value = "";
    }
  })
  .catch(err => { setMessage("Error en la comunicación."); });
}

function suggestMove() {
  const suggestBtn = document.querySelector('.secondary-button');
  suggestBtn.disabled = true;
  suggestBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Pensando...';
  
  fetch("/suggest", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fen: currentFen, depth: 15 })
  })
  .then(response => response.json())
  .then(data => {
    if (data.error) {
      setMessage(data.error);
    } else {
      setMessage("Sugerencia: " + data.suggestion + " (UCI: " + data.uci + ")");
    }
  })
  .catch(err => { setMessage("Error en la comunicación."); })
  .finally(() => {
    suggestBtn.disabled = false;
    suggestBtn.innerHTML = '<i class="bi bi-lightbulb"></i> Sugerir movimiento';
  });
}

function loadPGN() {
  let pgnInput = document.getElementById("pgnInput");
  let pgn = pgnInput.value;
  if (!pgn) {
    setMessage("Por favor ingresa el PGN.");
    return;
  }
  
  fetch("/load_pgn", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pgn: pgn })
  })
  .then(response => response.json())
  .then(data => {
    currentFen = data.fen;
    updateBoardDisplay(data.board_text);
    setMessage("Partida cargada desde PGN.");
    pgnInput.value = "";
  })
  .catch(err => { setMessage("Error en la comunicación."); });
}