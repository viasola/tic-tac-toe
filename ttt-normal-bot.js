var oriBoard;
const humanPlayer = "X";
const aiPlayer = "O";
const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2],
];

const item = document.querySelector(".item");

const blocks = document.querySelectorAll(".block");
const xCount = document.querySelector(".x-count");
const oCount = document.querySelector(".o-count");
const drawCount = document.querySelector(".draw-count");
const currentTurn = document.querySelector(".turn");
var modal = document.getElementById("myModal");
var closeModal = document.getElementsByClassName("close")[0];

let xWins = 0;
let oWins = 0;
let draws = 0;

startGame();

function startGame() {
  currentTurn.innerText = humanPlayer;
  oriBoard = Array.from(Array(9).keys());
  for (var i = 0; i < blocks.length; i++) {
    blocks[i].innerText = "";
    blocks[i].style.removeProperty("background-color");
    blocks[i].addEventListener("click", turnClick, false);
    blocks[i].addEventListener("dragenter", dragEnter);
    blocks[i].addEventListener("dragover", dragOver);
    blocks[i].addEventListener("dragleave", dragLeave);
    blocks[i].addEventListener("drop", drop);
  }
}

function turnClick(cell) {
  // if cell not played
  if (typeof oriBoard[cell.target.id] == "number") {
    turn(cell.target.id, humanPlayer);
    currentTurn.innerText = aiPlayer;
    // if there's no win or tie, AI will take a turn
    if (!checkWin(oriBoard, humanPlayer) && !checkTie()) {
      disableClick();
      delay(500).then(() => {
        currentTurn.innerText = humanPlayer;
        turn(bestSpot(), aiPlayer);
      });
    }
  }
}

function turn(cellId, player) {
  enableClick();
  oriBoard[cellId] = player;
  document.getElementById(cellId).innerText = player;
  let gameWon = checkWin(oriBoard, player);
  if (gameWon) gameOver(gameWon);
}

function checkWin(board, player) {
  let plays = board.reduce(
    (accumulator, element, i) =>
      element === player ? accumulator.concat(i) : accumulator,
    []
  );
  let gameWon = null;
  for (let [index, win] of winCombos.entries()) {
    if (win.every(elem => plays.indexOf(elem) > -1)) {
      gameWon = { index: index, player: player };
      break;
    }
  }
  return gameWon;
}

function gameOver(gameWon) {
  for (let index of winCombos[gameWon.index]) {
    document.getElementById(index).style.backgroundColor =
      gameWon.player == humanPlayer ? "blue" : "red";
  }
  for (var i = 0; i < blocks.length; i++) {
    blocks[i].removeEventListener("click", turnClick, false);
  }
  if (gameWon.player === humanPlayer) {
    xWins += 1;
    xCount.innerText = xWins;
  } else if (gameWon.player === aiPlayer) {
    oWins += 1;
    oCount.innerText = oWins;
  }

  declareWinner(gameWon.player == humanPlayer ? "You Win!" : "You Lose.");
}

function declareWinner(winner) {
  document.querySelector(".modal").innerText = winner;
}

function emptyCells() {
  return oriBoard.filter(element => typeof element == "number");
}

// best place for AI to play
function bestSpot() {
  return emptyCells()[0];
}

function checkTie() {
  if (emptyCells().length == 0) {
    for (var i = 0; i < blocks.length; i++) {
      blocks[i].removeEventListener("click", turnClick, false);
    }
    draws += 1;
    drawCount.innerText = draws;
    declareWinner("It's a Tie!");
    return true;
  }
  return false;
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function disableClick() {
  blocks.forEach(blocks => {
    blocks.removeEventListener("click", turnClick);
  });
}

function enableClick() {
  blocks.forEach(blocks => {
    blocks.addEventListener("click", turnClick);
  });
}

closeModal.onclick = function () {
  modal.style.display = "none";
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

item.addEventListener("dragstart", dragStart);

function dragStart(e) {
  e.dataTransfer.setData("text/plain", e.target.id);
  setTimeout(() => {
    e.target.classList.add("hide");
  }, 0);
}

function dragEnter(e) {
  e.preventDefault();
  e.target.classList.add("drag-over");
}

function dragOver(e) {
  e.preventDefault();
  e.target.classList.add("drag-over");
}

function dragLeave(e) {
  e.target.classList.remove("drag-over");
}

function drop(e) {
  e.target.classList.remove("drag-over");
  // get the draggable element
  const id = e.dataTransfer.getData("text/plain");
  const draggable = document.getElementById(id);

  // add it to the drop target
  e.target.appendChild(draggable);

  // display the draggable element
  draggable.classList.remove("hide");
}
