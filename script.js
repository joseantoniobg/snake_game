// Define HTML elements
const board = document.getElementById('game-board');
const instructionText = document.getElementById('instruction-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScore = document.getElementById('high-score');

// Define game variables
const boardSize = 20;
let snake = [{ x: boardSize / 2, y: boardSize / 2 }];
let food = generateFood();
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;

// Draw game map / snake / food
function draw() {
  board.innerHTML = '';
  drawSnake();
  drawFood();
  updateScore();
}

// Draw Snake
function drawSnake() {
  snake.forEach(snakeCell => {
    const snakeElement = createGameElement('div', 'snake');
    setPosition(snakeElement, snakeCell);
    board.appendChild(snakeElement);
  })
}

// Draw food
function drawFood() {
  if (gameStarted) {
    const foodElement = createGameElement('div', 'food');
    setPosition(foodElement, food);
    board.appendChild(foodElement);
  }
}

// Create Snake or food cube/div
function createGameElement(elementType, elementClass) {
  const element = document.createElement(elementType);
  element.className = elementClass;
  return element;
}

// Set the position of th snake or fruit
function setPosition(element, position) {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
}

//Get random position
function getRandomPosition() {
  return Math.floor(Math.random() * boardSize) + 1;
}

// Generate food
function generateFood() {
  const position = { x: getRandomPosition(), y: getRandomPosition() };
  if (snake.some(snakeCell => snakeCell.x === position.x && snakeCell.y === position.y)) {
    return generateFood();
  }
  return position;
}

function redrawScreen() {
  clearInterval(gameInterval);
  gameInterval = setInterval(() => {
    moveSnake();
    checkColision();
    draw();
  }, gameSpeedDelay);
}

function moveSnake() {
  const head = { ...snake[0] };

  switch (direction) {
    case 'up':
      head.y--;
      if (head.y === 0) head.y = boardSize;
      break;
    case 'down':
      head.y++;
      if (head.y === boardSize + 1) head.y = 1;
      break;
    case 'left':
      head.x--;
      if (head.x === 0) head.x = boardSize;
      break;
    case 'right':
      head.x++;
      if (head.x === boardSize + 1) head.x = 1;
      break;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    food = generateFood();
    increaseSpeed();
    redrawScreen();
    return;
  }

  snake.pop();
}

function increaseSpeed() {
  gameSpeedDelay -= gameSpeedDelay >= 150 ? 5 : 3;
}

// Start game function
function startGame() {
  gameStarted = true;
  instructionText.style.display = 'none';
  logo.style.display = 'none';
  redrawScreen();
}

function checkColision() {
  const head = snake[0];
  const body = snake.slice(1);

  if (body.some(snakeCell => snakeCell.x === head.x && snakeCell.y === head.y)) {
    resetGame();
  }
}

function resetGame() {
  clearInterval(gameInterval);
  gameStarted = false;
  updateScore();
  snake = [{ x: boardSize / 2, y: boardSize / 2 }];
  food = generateFood();
  direction = 'right';
  gameSpeedDelay = 200;
  instructionText.style.display = 'block';
  logo.style.display = 'block';
  draw();
}

function updateScore() {
  const currentScore = snake.length - 1;
  score.innerHTML = currentScore.toString().padStart(3, '0');
  if (gameStarted === false && currentScore > highScore.innerHTML) {
    highScore.innerHTML = currentScore.toString().padStart(3, '0');
  }
}

// Keypress event listener
function handleKeyPress(event) {
  if (event.code === 'Space' || event.key === ' ') {
    if (!gameStarted) startGame();
    return;
  }

  switch (event.key) {
    case 'ArrowUp':
      if (direction !== 'down') direction = 'up';
      break;
    case 'ArrowDown':
      if (direction !== 'up') direction = 'down';
      break;
    case 'ArrowLeft':
      if (direction !== 'right') direction = 'left';
      break;
    case 'ArrowRight':
      if (direction !== 'left') direction = 'right';
      break;
  }
}

document.addEventListener('keydown', handleKeyPress);