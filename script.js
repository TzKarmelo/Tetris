const tetris = document.querySelector(".game-board");
const nextPieceDisplay = document.getElementById("nextPiece");
const scoreDisplay = document.getElementById("score");
const levelDisplay = document.getElementById("level");
const startButton = document.getElementById("startButton");
const pauseButton = document.getElementById("pauseButton");
const restartButton = document.getElementById("restartButton");

const ROWS = 20;
const COLUMNS = 10;
const NEXT_PIECE_ROWS = 4;
const NEXT_PIECE_COLUMNS = 4;
const CELL_SIZE = 30;
const EMPTY_CELL = "white";

const pieces = [
  // I-Piece
  {
    shape: [[1, 1, 1, 1]],
    color: "cyan",
  },

  // O-Piece
  {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: "yellow",
  },

  // T-Piece
  {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
    ],
    color: "purple",
  },

  // L-Piece
  {
    shape: [
      [1, 0],
      [1, 0],
      [1, 1],
    ],
    color: "orange",
  },

  // J-Piece
  {
    shape: [
      [0, 1],
      [0, 1],
      [1, 1],
    ],
    color: "blue",
  },

  // S-Piece
  {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
    ],
    color: "green",
  },

  // Z-Piece
  {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
    ],
    color: "red",
  },
];

let board = [];
let currentPiece = null;
let nextPiece = createRandomPiece(); // Nuevo: Variable para la pieza siguiente
let currentPosition = { x: 0, y: 0 };
let score = 0;
let level = 1;
let gameInterval = null;
let gameIsRunning = false;

function initializeBoard() {
  for (let row = 0; row < ROWS; row++) {
    const newRow = [];
    for (let col = 0; col < COLUMNS; col++) {
      newRow.push(EMPTY_CELL);
    }
    board.push(newRow);
  }
}

function initializeNextPieceBoard() {
  const nextPieceBoard = [];
  for (let row = 0; row < NEXT_PIECE_ROWS; row++) {
    const newRow = [];
    for (let col = 0; col < NEXT_PIECE_COLUMNS; col++) {
      newRow.push(EMPTY_CELL);
    }
    nextPieceBoard.push(newRow);
  }
  return nextPieceBoard;
}

let nextPieceBoard = initializeNextPieceBoard(); // Nuevo: Inicializar la cuadrícula de la pieza siguiente

function drawBoard() {
  tetris.innerHTML = "";
  board.forEach((row) => {
    row.forEach((cell) => {
      const cellElement = document.createElement("div");
      cellElement.style.width = CELL_SIZE + "px";
      cellElement.style.height = CELL_SIZE + "px";
      cellElement.style.backgroundColor = cell;
      tetris.appendChild(cellElement);
    });
  });
}

function drawNextPiece() {
  const nextPieceBoard = document.getElementById("nextPiece");
  nextPieceBoard.innerHTML = ''; // Limpia el contenido anterior

  const pieceSize = 30;

  nextPiece.shape.forEach((row, y) => {
    row.forEach((cell, x) => {
      const cellElement = document.createElement("div");
      cellElement.style.width = pieceSize + "px";
      cellElement.style.height = pieceSize + "px";
      cellElement.style.backgroundColor = cell ? nextPiece.color : 'transparent';
      nextPieceBoard.appendChild(cellElement);
    });
  });
}

function createRandomPiece() {
  const randomIndex = Math.floor(Math.random() * pieces.length);
  return pieces[randomIndex];
}



function drawPiece() {
  currentPiece.shape.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell) {
        const boardX = currentPosition.x + x;
        const boardY = currentPosition.y + y;
        if (boardY >= 0) {
          board[boardY][boardX] = currentPiece.color;
        }
      }
    });
  });
}

function clearPiece() {
  currentPiece.shape.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell) {
        const boardX = currentPosition.x + x;
        const boardY = currentPosition.y + y;
        if (boardY >= 0) {
          board[boardY][boardX] = EMPTY_CELL;
        }
      }
    });
  });
}

function moveDown() {
  clearPiece();
  currentPosition.y++;
  if (isCollision()) {
    currentPosition.y--;
    drawPiece();
    addToBoard();
    clearRows();
    currentPiece = createRandomPiece();
    currentPosition.x =
      Math.floor(COLUMNS / 2) - Math.floor(currentPiece.shape[0].length / 2);
    currentPosition.y = 0;
    if (isCollision()) {
      endGame();
    }

    // Llama a drawNextPiece para mostrar la nueva pieza siguiente
    nextPiece = createRandomPiece();
    drawNextPiece();
  }
  drawPiece();
  drawBoard();
}

function isCollision() {
  for (let y = 0; y < currentPiece.shape.length; y++) {
    for (let x = 0; x < currentPiece.shape[y].length; x++) {
      if (currentPiece.shape[y][x]) {
        const boardX = currentPosition.x + x;
        const boardY = currentPosition.y + y;

        if (boardX < 0 || boardX >= COLUMNS || boardY >= ROWS) {
          return true;
        }

        if (
          boardY >= 0 &&
          boardY < ROWS &&
          board[boardY][boardX] !== EMPTY_CELL
        ) {
          return true;
        }
      }
    }
  }
  return false;
}

function addToBoard() {
  currentPiece.shape.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell) {
        const boardX = currentPosition.x + x;
        const boardY = currentPosition.y + y;
        if (boardY >= 0) {
          board[boardY][boardX] = currentPiece.color;
        }
      }
    });
  });
}

function clearRows() {
  let rowsToClear = [];

  for (let row = 0; row < ROWS; row++) {
    if (board[row].every((cell) => cell !== EMPTY_CELL)) {
      rowsToClear.push(row);
    }
  }

  if (rowsToClear.length > 0) {
    for (const rowIndex of rowsToClear) {
      board.splice(rowIndex, 1);
      const newRow = Array(COLUMNS).fill(EMPTY_CELL);
      board.unshift(newRow);
    }

    score += rowsToClear.length * 100;
    scoreDisplay.textContent = score;
  }
}

document.addEventListener("keydown", (event) => {
  if (!gameIsRunning) return;

  if (event.key === "ArrowLeft") {
    moveLeft();
  } else if (event.key === "ArrowRight") {
    moveRight();
  } else if (event.key === "ArrowDown") {
    moveDown();
  } else if (event.key === "ArrowUp") {
    rotate();
  }
});

function moveLeft() {
  clearPiece();
  currentPosition.x--;

  if (isCollision()) {
    currentPosition.x++;
  }

  drawPiece();
  drawBoard();
}

function moveRight() {
  clearPiece();
  currentPosition.x++;

  if (isCollision()) {
    currentPosition.x--;
  }

  drawPiece();
  drawBoard();
}

function rotate() {
  clearPiece();
  const rotatedPiece = rotateMatrix(currentPiece.shape);

  if (!isCollisionWithRotated(rotatedPiece)) {
    currentPiece.shape = rotatedPiece;
  }

  drawPiece();
  drawBoard();
}

function rotateMatrix(matrix) {
  const numRows = matrix.length;
  const numCols = matrix[0].length;
  const rotatedMatrix = [];

  for (let col = 0; col < numCols; col++) {
    const newRow = [];
    for (let row = numRows - 1; row >= 0; row--) {
      newRow.push(matrix[row][col]);
    }
    rotatedMatrix.push(newRow);
  }

  return rotatedMatrix;
}

function isCollisionWithRotated(rotatedPiece) {
  for (let y = 0; y < rotatedPiece.length; y++) {
    for (let x = 0; x < rotatedPiece[y].length; x++) {
      if (rotatedPiece[y][x]) {
        const boardX = currentPosition.x + x;
        const boardY = currentPosition.y + y;

        if (boardX < 0 || boardX >= COLUMNS || boardY >= ROWS) {
          return true;
        }

        if (
          boardY >= 0 &&
          boardY < ROWS &&
          board[boardY][boardX] !== EMPTY_CELL
        ) {
          return true;
        }
      }
    }
  }
  return false;
}

function startGame() {
  currentPiece = createRandomPiece();
  currentPosition.x =
    Math.floor(COLUMNS / 2) - Math.floor(currentPiece.shape[0].length / 2);
  currentPosition.y = 0;
  score = 0;
  level = 1;
  scoreDisplay.textContent = score;
  levelDisplay.textContent = level;
  gameIsRunning = true;
  drawBoard();  

  gameInterval = setInterval(() => {
    moveDown();
  }, 1000);

  startButton.disabled = true;
  pauseButton.disabled = false;
  restartButton.disabled = false;

  // Usar la nueva función para obtener una pieza diferente para nextPiece
  nextPiece = createRandomNextPiece();
  drawNextPiece();
}

function pauseGame() {
  if (!gameIsRunning) return;

  clearInterval(gameInterval);
  gameIsRunning = false;
  pauseButton.textContent = "Resume";
}

function resumeGame() {
  if (gameIsRunning) return;

  gameInterval = setInterval(() => {
    moveDown();
  }, 1000);
  gameIsRunning = true;
  pauseButton.textContent = "Pause";
}

function endGame() {
  clearInterval(gameInterval);
  gameIsRunning = false;
  startButton.disabled = false;
  pauseButton.disabled = true;
  restartButton.disabled = true;
  alert("Game Over");
}

function restartGame() {
  clearInterval(gameInterval);
  board = [];
  initializeBoard();
  nextPieceDisplay.innerHTML = "";
  drawNextPiece();

  currentPiece = createRandomPiece();
  currentPosition.x =
    Math.floor(COLUMNS / 2) - Math.floor(currentPiece.shape[0].length / 2);
  currentPosition.y = 0;
  score = 0;
  level = 1;
  scoreDisplay.textContent = score;
  levelDisplay.textContent = level;
  gameIsRunning = true;

  drawBoard();
  drawPiece();

  gameInterval = setInterval(() => {
    moveDown();
  }, 1000);

  startButton.disabled = true;
  pauseButton.disabled = false;
  restartButton.disabled = false;
  pauseButton.textContent = "Pause";
}

initializeBoard();
drawBoard();
drawNextPiece();

startButton.addEventListener("click", startGame);
pauseButton.addEventListener("click", () => {
  if (gameIsRunning) {
    pauseGame();
  } else {
    resumeGame();
  }
});

restartButton.addEventListener("click", () => {
  restartGame();
});