function toggleMode(){
  document.body.classList.toggle("light-mode");
  var btn = document.getElementById("toggleModeBtn");
  if(document.body.classList.contains("light-mode")){
    btn.innerText = "Dark Mode";
  } else {
    btn.innerText = "Light Mode";
  }
}

let playerColor = null;
let currentFen = null;

function setMessage(msg) {
  document.getElementById("message").innerText = msg;
}

function updateBoardDisplay(boardText) {
  document.getElementById("boardDisplay").innerText = boardText;
}

function setColor(color) {
  playerColor = color;
  document.getElementById("colorSelection").style.display = "none";
  document.getElementById("gameSection").style.display = "block";
  fetch("/init")
    .then(response => response.json())
    .then(data => {
      currentFen = data.fen;
      updateBoardDisplay(data.board_text);
    });
}

function sendMove() {
  let move = document.getElementById("moveInput").value;
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
    }
  })
  .catch(err => { setMessage("Error en la comunicación."); });
}

function suggestMove() {
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
  .catch(err => { setMessage("Error en la comunicación."); });
}

function loadPGN() {
  let pgn = document.getElementById("pgnInput").value;
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
  })
  .catch(err => { setMessage("Error en la comunicación."); });
}