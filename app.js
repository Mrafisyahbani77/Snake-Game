document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("grid");
  const scoreDisplay = document.getElementById("scoreDisplay");
  const startBtn = document.getElementById("startBtn");
  const winNotification = document.querySelector(".win");
  const gameOverNotification = document.querySelector(".game-over");

  // Create grid
  const width = 10;
  const gridSize = width * width;
  const squares = [];

  for (let i = 0; i < gridSize; i++) {
    const square = document.createElement("div");
    grid.appendChild(square);
    squares.push(square);
  }

  let currentSnake = [2, 1, 0];
  let direction = 1;
  let score = 0;
  let speed = 0.9;
  let intervalTime = 0;
  let interval = 0;
  let appleIndex = 0;

  function startGame() {
    // Reset game
    currentSnake.forEach((index) => squares[index].classList.remove("snake"));
    squares[appleIndex].classList.remove("apple");
    clearInterval(interval);

    // Hide notifications
    winNotification.style.display = "none";
    gameOverNotification.style.display = "none";

    // Initialize game state
    score = 0;
    direction = 1;
    scoreDisplay.textContent = score;
    intervalTime = 300;
    currentSnake = [2, 1, 0];

    // Draw initial snake
    currentSnake.forEach((index) => squares[index].classList.add("snake"));

    // Place first apple
    randomApple();

    // Start game loop
    interval = setInterval(moveOutcomes, intervalTime);
  }

  function moveOutcomes() {
    // Check for wall collision or self collision
    if (
      (currentSnake[0] + width >= gridSize && direction === width) ||
      (currentSnake[0] % width === width - 1 && direction === 1) ||
      (currentSnake[0] % width === 0 && direction === -1) ||
      (currentSnake[0] - width < 0 && direction === -width) ||
      squares[currentSnake[0] + direction].classList.contains("snake")
    ) {
      clearInterval(interval);
      gameOverNotification.style.display = "block";
      setTimeout(() => {
        gameOverNotification.style.display = "none";
      }, 2000);
      return;
    }

    // Remove tail
    const tail = currentSnake.pop();
    squares[tail].classList.remove("snake");

    // Add new head
    currentSnake.unshift(currentSnake[0] + direction);

    // Check if apple is eaten
    if (squares[currentSnake[0]].classList.contains("apple")) {
      squares[currentSnake[0]].classList.remove("apple");
      squares[tail].classList.add("snake");
      currentSnake.push(tail);
      randomApple();
      score++;
      scoreDisplay.textContent = score;

      // Speed up game
      clearInterval(interval);
      intervalTime = intervalTime * speed;
      interval = setInterval(moveOutcomes, intervalTime);
    }

    squares[currentSnake[0]].classList.add("snake");
    checkWin();
  }

  function checkWin() {
    if (score === 5) {
      clearInterval(interval);
      winNotification.style.display = "block";
      setTimeout(() => {
        winNotification.style.display = "none";
      }, 3000);
    }
  }

  function randomApple() {
    do {
      appleIndex = Math.floor(Math.random() * squares.length);
    } while (squares[appleIndex].classList.contains("snake"));
    squares[appleIndex].classList.add("apple");
  }

  function control(e) {
    if (e.keyCode === 39 && direction !== -1) {
      direction = 1; // right
    } else if (e.keyCode === 38 && direction !== width) {
      direction = -width; // up
    } else if (e.keyCode === 37 && direction !== 1) {
      direction = -1; // left
    } else if (e.keyCode === 40 && direction !== -width) {
      direction = width; // down
    }
  }

  // Joystick controls
  document.querySelectorAll(".joystick-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const dir = e.target.dataset.direction;
      if (!dir) return;

      if (dir === "right" && direction !== -1) {
        direction = 1;
      } else if (dir === "up" && direction !== width) {
        direction = -width;
      } else if (dir === "left" && direction !== 1) {
        direction = -1;
      } else if (dir === "down" && direction !== -width) {
        direction = width;
      }
    });
  });

  // Touch controls for mobile swipe
  let touchStartX = 0;
  let touchStartY = 0;

  grid.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  });

  grid.addEventListener("touchend", (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      // Horizontal swipe
      if (diffX > 0 && direction !== -1) {
        direction = 1; // right
      } else if (diffX < 0 && direction !== 1) {
        direction = -1; // left
      }
    } else {
      // Vertical swipe
      if (diffY > 0 && direction !== width) {
        direction = width; // down
      } else if (diffY < 0 && direction !== -width) {
        direction = -width; // up
      }
    }
  });

  document.addEventListener("keyup", control);
  startBtn.addEventListener("click", startGame);
});
