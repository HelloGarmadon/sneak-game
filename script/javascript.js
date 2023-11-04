const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const size = 30;

const snake = [
  { x: 270, y: 240 },
  { x: 240, y: 210 },
];

const randomNumber = (min, max) => {
  return Math.round(Math.random() * (max - min) + min);
};

const randomPosition = (min, max) => {
  const number = randomNumber(0, canvas.width - size);
  return Math.round(number / 30) * 30;
};

const randomColor = () => {
  const red = randomNumber(0, 255);
  const green = randomNumber(0, 255);
  const blue = randomNumber(0, 255);

  return `rgb(${red}, ${green}, ${blue})`;
};
const food = {
  x: randomPosition(),
  y: randomPosition(),
  color: randomColor(),
};

let direction;
let LoopId;

const drawSnake = () => {
  ctx.fillStyle = "red"; // Corrigido de ctx.fillstyle para ctx.fillStyle (usando chatgpt)
  snake.forEach((position, index) => {
    if (index == snake.length - 1) {
      ctx.fillStyle = "red";
    }
    ctx.fillRect(position.x, position.y, size, size);
  });
};

const drawFood = () => {
  const { x, y, color } = food;
  ctx.shadowColor = color;
  ctx.shadowBlur = 6;
  ctx.fillStyle = color;
  ctx.fillRect(food.x, food.y, size, size);
  ctx.shadowBlur = 0;
};

const moveSnake = () => {
  if (!direction) return;
  const head = snake[snake.length - 1];

  let newHeadX = head.x;
  let newHeadY = head.y;

  if (direction == "right") {
    newHeadX = (head.x + size) % canvas.width;
  }

  if (direction == "left") {
    newHeadX = (head.x - size + canvas.width) % canvas.width;
  }

  if (direction == "down") {
    newHeadY = (head.y + size) % canvas.height;
  }

  if (direction == "up") {
    newHeadY = (head.y - size + canvas.height) % canvas.height;
  }

  snake.push({ x: newHeadX, y: newHeadY });

  // Remove a cauda da cobra apenas se não tiver comido a comida
  if (!(newHeadX === food.x && newHeadY === food.y)) {
    snake.shift();
  }
};
const gameLoop = () => {
  clearInterval(LoopId);

  ctx.clearRect(0, 0, 600, 600);
  moveSnake();
  checkSelfCollision(); // Verificar colisão com o próprio corpo
  checkCollision(); // Verificar colisão com a borda do canvas
  checkEat(); // Verificar se a cobra comeu a comida
  drawGrid();
  drawFood();
  drawSnake();

  LoopId = setTimeout(() => {
    gameLoop();
  }, 200);
};
const checkCollision = () => {
  const head = snake[snake.length - 1];

  // Verificar se a cabeça da cobra colidiu com a borda do canvas
  if (
    head.x < 0 ||
    head.x >= canvas.width ||
    head.y < 0 ||
    head.y >= canvas.height
  ) {
    restartGame();
  }
};

const restartGame = () => {
  // Código para reiniciar o jogo
  snake.length = 2; // Reduzir o comprimento da cobra para o tamanho inicial
  direction = null; // Limpar a direção
  food.x = randomPosition();
  food.y = randomPosition();
  food.color = randomColor();
};

const checkEat = () => {
  const head = snake[snake.length - 1];
  if (head.x === food.x && head.y === food.y) {
    snake.push({ x: food.x, y: food.y }); // Adicione a comida à cobra
    food.x = randomPosition();
    food.y = randomPosition();
    food.color = randomColor();
  }
};

const drawGrid = () => {
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#white";

  for (let i = 30; i < canvas.width; i += 30) {
    ctx.beginPath(i, 0);
    ctx.lineTo(i, 0);
    ctx.lineTo(i, 600);
    ctx.stroke();

    ctx.beginPath(i, 0);
    ctx.lineTo(0, i);
    ctx.lineTo(600, i);
    ctx.stroke();
  }
};
const checkSelfCollision = () => {
  const head = snake[snake.length - 1];
  for (let i = 0; i < snake.length - 1; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      restartGame();
      break;
    }
  }
};

gameLoop();

document.addEventListener("keydown", ({ key }) => {
  if (key == "ArrowRight" && direction != "left") {
    direction = "right";
  }

  if (key == "ArrowLeft" && direction != "right") {
    direction = "left";
  }

  if (key == "ArrowUp" && direction != "down") {
    direction = "up";
  }

  if (key == "ArrowDown" && direction != "up") {
    direction = "down";
  }
});

//-------------------------------//
let touchStartX, touchStartY;

canvas.addEventListener("touchstart", event => {
  const touch = event.touches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
});

canvas.addEventListener("touchmove", event => {
  const touch = event.touches[0];
  const touchEndX = touch.clientX;
  const touchEndY = touch.clientY;

  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX > 0 && direction !== "left") {
      direction = "right";
    } else if (deltaX < 0 && direction !== "right") {
      direction = "left";
    }
  } else {
    if (deltaY > 0 && direction !== "up") {
      direction = "down";
    } else if (deltaY < 0 && direction !== "down") {
      direction = "up";
    }
  }

  touchStartX = touchEndX;
  touchStartY = touchEndY;
});

// Evite o comportamento padrão de scroll da página em dispositivos móveis
document.body.addEventListener("touchmove", event => {
  event.preventDefault();
});
