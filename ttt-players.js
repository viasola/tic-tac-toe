var movesTaken = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

const modal = document.querySelector(".modal");
const blocks = document.querySelectorAll(".block");
const turn = document.querySelector(".turn");
const chosenAvatar = document.querySelector(".chosen-avatar");
const currentPlay = document.querySelector(".current-player");
const playerX = "Tiny Rick";
const playerO = "Pickle Rick";
const xCount = document.querySelector(".x-count");
const oCount = document.querySelector(".o-count");
const drawCount = document.querySelector(".draw-count");

var avatar = document.getElementById("avatar");

let xWins = 0;
let oWins = 0;
let draws = 0;

function startGame() {
  turn.innerText = chosenAvatar.innerText;
  currentPlay.innerText = `Current Player: ${turn.innerText}`;

  if (turn.innerText === "Tiny Rick") {
    avatar.src = "./img/tinyrick avatar.jpeg";
  } else if (turn.innerText === "Pickle Rick") {
    avatar.src = "./img/picklerick avatar.jpeg";
  }

  movesTaken = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

  for (var i = 0; i < blocks.length; i++) {
    blocks[i].innerText = "";
    blocks[i].classList.remove("tiny-rick", "pickle-rick");
    blocks[i].classList.add("empty-block");
    blocks[i].addEventListener("click", handleClick, false);
  }
}

function handleClick(e, index) {
  const cellValue = e.target;
  index = e.target.id;

  if (turn.innerText === "Tiny Rick") {
    cellValue.classList.add("tiny-rick");
    avatar.src = "./img/picklerick avatar.jpeg";
    currentPlay.innerText = "Current Player: Pickle Rick";
    turn.innerText = "Pickle Rick";
    movesTaken[Math.floor(index / 3)][index % 3] = playerX;
  } else {
    cellValue.classList.add("pickle-rick");
    avatar.src = "./img/tinyrick avatar.jpeg";
    currentPlay.innerText = "Current Player: Tiny Rick";
    turn.innerText = "Tiny Rick";
    movesTaken[Math.floor(index / 3)][index % 3] = playerO;
  }

  cellValue.removeEventListener("click", handleClick);
  cellValue.classList.remove("empty-block");
  checkWin();
}

function checkWin() {
  for (let rows = 0; rows < 3; rows++) {
    if (
      movesTaken[rows][0] === movesTaken[rows][1] &&
      movesTaken[rows][0] === movesTaken[rows][2] &&
      movesTaken[rows][0] !== ""
    ) {
      disableClick();
      return resultWin(movesTaken[rows][0]);
    }
  }

  for (let columns = 0; columns < 3; columns++) {
    if (
      movesTaken[0][columns] === movesTaken[1][columns] &&
      movesTaken[0][columns] === movesTaken[2][columns] &&
      movesTaken[0][columns] !== ""
    ) {
      disableClick();
      return resultWin(movesTaken[0][columns]);
    }
  }

  if (
    movesTaken[0][0] === movesTaken[1][1] &&
    movesTaken[0][0] === movesTaken[2][2] &&
    movesTaken[0][0] !== ""
  ) {
    disableClick();
    return resultWin(movesTaken[0][0]);
  }

  if (
    movesTaken[0][2] === movesTaken[1][1] &&
    movesTaken[0][2] === movesTaken[2][0] &&
    movesTaken[0][2] !== ""
  ) {
    disableClick();
    return resultWin(movesTaken[0][2]);
  }

  checkDraw();
}

function checkDraw() {
  var count = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (movesTaken[i][j] !== "") {
        count++;
      }
    }
  }

  if (count === 9) {
    resultWin("Draw");
  }
}

function resultWin(player) {
  if (player === playerX) {
    // currentPlay.classList.add("hide");
    xWins += 1;
    currentPlay.innerText = "Tiny Rick Victorious!";
    xCount.innerText = xWins;
    avatar.src = "./img/tinyrick avatar.jpeg";
  } else if (player === playerO) {
    oWins += 1;
    currentPlay.innerText = "Pickle Rick Victorious!";
    oCount.innerText = oWins;
    avatar.src = "./img/picklerick avatar.jpeg";
  } else {
    // turn.innerText = "";
    draws += 1;
    currentPlay.innerText = "It's a Draw!";
    drawCount.innerText = draws;
    avatar.src = "./img/morty-look.png";
  }
}

function disableClick() {
  blocks.forEach(blocks => {
    blocks.removeEventListener("click", handleClick);
    blocks.classList.remove("empty-block");
  });
}

function resetScore() {
  xWins = 0;
  oWins = 0;
  draws = 0;

  xCount.innerText = xWins;
  oCount.innerText = oWins;
  drawCount.innerText = draws;
  // startGame();
}

function selectAvatar() {
  var radioPlayerX = document.getElementById("player-x").checked;
  var radioPlayerO = document.getElementById("player-o").checked;

  if (radioPlayerX === true) {
    modal.style.display = "none";
    startGame();
    currentPlay.innerText = "Current Player: Tiny Rick";
    turn.innerText = "Tiny Rick";
    chosenAvatar.innerText = "Tiny Rick";
    avatar.src = "./img/tinyrick avatar.jpeg";
  } else if (radioPlayerO === true) {
    modal.style.display = "none";
    startGame();
    currentPlay.innerText = "Current Player: Pickle Rick";
    turn.innerText = "Pickle Rick";
    chosenAvatar.innerText = "Pickle Rick";
    avatar.src = "./img/picklerick avatar.jpeg";
  } else {
    alert("Please pick an avatar to start game.");
  }
}

function changeAvatar() {
  modal.style.display = "block";
}

// function restartGame() {
//   turn.innerText = "";
//   currentPlay.innerText = "Current Player: Player X";
//   movesTaken = [
//     ["", "", ""],
//     ["", "", ""],
//     ["", "", ""],
//   ];

//   startGame();
// }
