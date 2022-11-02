var oriBoard;
let xCount = document.querySelector(".x-count");
let oCount = document.querySelector(".o-count");
let drawCount = document.querySelector(".draw-count");
const humanPlayer = "X";
const aiPlayer = "O";
const currentPlayer = document.querySelector(".current-player");
const playerTurn = document.querySelector(".player-turn");
const blocks = document.querySelectorAll(".block");
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

let xWins = 0;
let oWins = 0;
let draws = 0;

startGame();

function startGame() {
  document.querySelector(".endgame").style.display = "none";
  currentPlayer.innerText = "Current Player: X";
  oriBoard = Array.from(Array(9).keys());
  for (var i = 0; i < blocks.length; i++) {
    blocks[i].innerText = "";
    blocks[i].style.removeProperty("background-color");
    blocks[i].addEventListener("click", turnClick, false);
    blocks[i].classList.remove("flip-blue", "flip-red", "flip-card-inner");
    blocks[i].classList.add("empty-block");
  }
}

function turnClick(cell) {
  // if cell not played
  if (typeof oriBoard[cell.target.id] == "number") {
    currentPlayer.innerText = `Current Player: ${aiPlayer}`;
    turn(cell.target.id, humanPlayer);
    // if there's no win or tie, AI will take a turn
    if (!checkWin(oriBoard, humanPlayer) && !checkTie()) disableClick();
    delay(500).then(() => {
      currentPlayer.innerText = `Current Player: ${humanPlayer}`;
      turn(bestSpot(), aiPlayer);
    });
  }
}

function turn(cellId, player) {
  enableClick();
  oriBoard[cellId] = player;
  document.getElementById(cellId).innerText = player;

  if (player == humanPlayer) {
    document
      .getElementById(cellId)
      .classList.add("flip-card-inner", "flip-blue");
    document.getElementById(cellId).classList.remove("empty-block");
  } else {
    document
      .getElementById(cellId)
      .classList.add("flip-card-inner", "flip-red");
    document.getElementById(cellId).classList.remove("empty-block");
  }

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
      gameWon.player == humanPlayer ? "rgb(0, 162, 255)" : "rgb(255, 0, 38)";
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
  document.querySelector(".endgame").style.display = "block";
  document.querySelector(".endgame .text").innerText = winner;
  currentPlayer.style.display = "none";
  for (var i = 0; i < blocks.length; i++) {
    blocks[i].classList.remove("empty-block");
  }
}

function emptyCells() {
  return oriBoard.filter(element => typeof element == "number");
}

// best place for AI to play
function bestSpot() {
  return minimax(oriBoard, aiPlayer).index;
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

function minimax(newBoard, player) {
  var availSpots = emptyCells(newBoard);

  if (checkWin(newBoard, player)) {
    return { score: -10 };
  } else if (checkWin(newBoard, aiPlayer)) {
    return { score: 20 };
  } else if (availSpots.length === 0) {
    return { score: 0 };
  }
  var moves = [];
  for (var i = 0; i < availSpots.length; i++) {
    var move = {};
    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = player;

    if (player == aiPlayer) {
      var result = minimax(newBoard, humanPlayer);
      move.score = result.score;
    } else {
      var result = minimax(newBoard, aiPlayer);
      move.score = result.score;
    }
    newBoard[availSpots[i]] = move.index;
    moves.push(move);
  }
  var bestMove;
  if (player === aiPlayer) {
    var bestScore = -10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    var bestScore = 10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }
  return moves[bestMove];
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
