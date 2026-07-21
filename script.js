/**
 * Classic Snake Game Engine
 * Pure ES6 Vanilla JavaScript implementation.
 */

class SoundEffects {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  }

  playEat() {
    if (this.muted || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  playGameOver() {
    if (this.muted || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.4);
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.4);
  }

  playClick() {
    if (this.muted || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }
}

class SnakeGame {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');

    // UI Elements
    this.scoreEl = document.getElementById('current-score');
    this.highScoreEl = document.getElementById('high-score');
    this.difficultySelect = document.getElementById('difficulty-select');
    this.btnPause = document.getElementById('btn-pause');
    this.btnRestart = document.getElementById('btn-restart');
    this.btnMute = document.getElementById('btn-mute');
    this.btnTheme = document.getElementById('btn-theme');
    this.overlay = document.getElementById('overlay');
    this.overlayTitle = document.getElementById('overlay-title');
    this.overlayMsg = document.getElementById('overlay-message');
    this.overlayBtn = document.getElementById('overlay-btn');

    // Config & Audio
    this.gridSize = 20; // 20x20 grid
    this.tileSize = this.canvas.width / this.gridSize;
    this.audio = new SoundEffects();

    // Game States
    this.speeds = { easy: 140, medium: 90, hard: 50 };
    this.baseSpeed = this.speeds.medium;
    this.currentSpeed = this.baseSpeed;
    this.score = 0;
    this.highScore = parseInt(localStorage.getItem('snake_high_score') || '0', 10);
    this.isPaused = false;
    this.isGameOver = false;
    this.foodEaten = 0;

    // Movement Vectors
    this.dir = { x: 0, y: -1 }; // Start moving UP
    this.nextDir = { x: 0, y: -1 };
    
    // Game Entities
    this.snake = [];
    this.food = { x: 0, y: 0, pulse: 0 };

    // Loop Control
    this.lastRenderTime = 0;
    this.animationFrameId = null;

    this.init();
  }

  init() {
    this.highScoreEl.textContent = this.highScore;
    this.setupTheme();
    this.bindEvents();
    this.resetGame();
    this.gameLoop(0);
  }

  setupTheme() {
    const savedTheme = localStorage.getItem('snake_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    this.btnTheme.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('snake_theme', newTheme);
    this.btnTheme.textContent = newTheme === 'dark' ? '☀️' : '🌙';
  }

  resetGame() {
    this.snake = [
      { x: 10, y: 12 },
      { x: 10, y: 13 },
      { x: 10, y: 14 }
    ];
    this.dir = { x: 0, y: -1 };
    this.nextDir = { x: 0, y: -1 };
    this.score = 0;
    this.foodEaten = 0;
    this.scoreEl.textContent = '0';
    this.baseSpeed = this.speeds[this.difficultySelect.value] || this.speeds.medium;
    this.currentSpeed = this.baseSpeed;
    this.isGameOver = false;
    this.isPaused = false;
    this.hideOverlay();
    this.spawnFood();
    this.btnPause.textContent = 'Pause';
  }

  spawnFood() {
    let valid = false;
    while (!valid) {
      this.food.x = Math.floor(Math.random() * this.gridSize);
      this.food.y = Math.floor(Math.random() * this.gridSize);
      valid = !this.snake.some(segment => segment.x === this.food.x && segment.y === this.food.y);
    }
  }

  bindEvents() {
    // Keyboard controls
    window.addEventListener('keydown', (e) => {
      this.audio.init(); // Initialize audio context on first user action

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (this.dir.y === 0) this.nextDir = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (this.dir.y === 0) this.nextDir = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (this.dir.x === 0) this.nextDir = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (this.dir.x === 0) this.nextDir = { x: 1, y: 0 };
          break;
        case ' ':
          e.preventDefault();
          this.togglePause();
          break;
        case 'r':
        case 'R':
          this.resetGame();
          break;
        case 'm':
        case 'M':
          this.toggleMute();
          break;
      }
    });

    // Button controls
    this.btnPause.addEventListener('click', () => {
      this.audio.playClick();
      this.togglePause();
    });

    this.btnRestart.addEventListener('click', () => {
      this.audio.playClick();
      this.resetGame();
    });

    this.btnMute.addEventListener('click', () => {
      this.toggleMute();
    });

    this.btnTheme.addEventListener('click', () => {
      this.audio.playClick();
      this.toggleTheme();
    });

    this.difficultySelect.addEventListener('change', () => {
      this.audio.playClick();
      this.resetGame();
    });

    this.overlayBtn.addEventListener('click', () => {
      this.audio.playClick();
      if (this.isGameOver) {
        this.resetGame();
      } else {
        this.togglePause();
      }
    });
  }

  togglePause() {
    if (this.isGameOver) return;
    this.isPaused = !this.isPaused;
    if (this.isPaused) {
      this.showOverlay('Paused', 'Press Space or Resume to continue', 'Resume');
      this.btnPause.textContent = 'Resume';
    } else {
      this.hideOverlay();
      this.btnPause.textContent = 'Pause';
    }
  }

  toggleMute() {
    this.audio.muted = !this.audio.muted;
    this.btnMute.textContent = this.audio.muted ? '🔇' : '🔊';
  }

  showOverlay(title, msg, btnText) {
    this.overlayTitle.textContent = title;
    this.overlayMsg.textContent = msg;
    this.overlayBtn.textContent = btnText;
    this.overlay.classList.remove('hidden');
  }

  hideOverlay() {
    this.overlay.classList.add('hidden');
  }

  update() {
    if (this.isPaused || this.isGameOver) return;

    // Apply smooth directional change without instant backtracking
    this.dir = { ...this.nextDir };

    // Next head position
    const head = { x: this.snake[0].x + this.dir.x, y: this.snake[0].y + this.dir.y };

    // Wall Collision Check
    if (head.x < 0 || head.x >= this.gridSize || head.y < 0 || head.y >= this.gridSize) {
      this.triggerGameOver();
      return;
    }

    // Self Collision Check
    if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
      this.triggerGameOver();
      return;
    }

    // Move Head Forward
    this.snake.unshift(head);

    // Food Collision Check
    if (head.x === this.food.x && head.y === this.food.y) {
      this.audio.playEat();
      this.score += 10;
      this.foodEaten += 1;
      this.scoreEl.textContent = this.score;

      if (this.score > this.highScore) {
        this.highScore = this.score;
        this.highScoreEl.textContent = this.highScore;
        localStorage.setItem('snake_high_score', this.highScore.toString());
      }

      // Slightly increase speed every 5 foods eaten
      if (this.foodEaten % 5 === 0 && this.currentSpeed > 30) {
        this.currentSpeed -= 5;
      }

      this.spawnFood();
    } else {
      // Remove Tail Segment if no food eaten
      this.snake.pop();
    }
  }

  triggerGameOver() {
    this.isGameOver = true;
    this.audio.playGameOver();
    this.showOverlay('Game Over', `Final Score: ${this.score}`, 'Play Again');
  }

  draw() {
    // Clear Screen
    this.ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--canvas-bg').trim();
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw Subtle Grid Lines
    this.ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--grid-line').trim();
    this.ctx.lineWidth = 1;
    for (let i = 0; i <= this.gridSize; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(i * this.tileSize, 0);
      this.ctx.lineTo(i * this.tileSize, this.canvas.height);
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.moveTo(0, i * this.tileSize);
      this.ctx.lineTo(this.canvas.width, i * this.tileSize);
      this.ctx.stroke();
    }

    // Draw Food with pulsing animation effect
    this.food.pulse += 0.1;
    const pulseScale = Math.sin(this.food.pulse) * 1.5;
    const foodRadius = (this.tileSize / 2) - 2 + pulseScale;

    this.ctx.fillStyle = '#ef4444'; // Red Apple
    this.ctx.beginPath();
    this.ctx.arc(
      this.food.x * this.tileSize + this.tileSize / 2,
      this.food.y * this.tileSize + this.tileSize / 2,
      Math.max(foodRadius, 2),
      0,
      Math.PI * 2
    );
    this.ctx.fill();

    // Draw Snake
    const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim();

    this.snake.forEach((segment, index) => {
      // Color gradient for body segment
      this.ctx.fillStyle = index === 0 ? accentColor : '#059669';

      const x = segment.x * this.tileSize;
      const y = segment.y * this.tileSize;
      const r = 4; // Corner radius

      // Rounded rectangle segment
      this.ctx.beginPath();
      this.ctx.roundRect(x + 1, y + 1, this.tileSize - 2, this.tileSize - 2, r);
      this.ctx.fill();

      // Snake Eye indicators on Head
      if (index === 0) {
        this.ctx.fillStyle = '#ffffff';
        const eyeOffset = this.tileSize / 4;
        let eyeX1 = x + eyeOffset, eyeY1 = y + eyeOffset;
        let eyeX2 = x + eyeOffset, eyeY2 = y + eyeOffset;

        if (this.dir.x === 1) { // Right
          eyeX1 = eyeX2 = x + this.tileSize - eyeOffset;
          eyeY1 = y + eyeOffset;
          eyeY2 = y + this.tileSize - eyeOffset;
        } else if (this.dir.x === -1) { // Left
          eyeX1 = eyeX2 = x + eyeOffset;
          eyeY1 = y + eyeOffset;
          eyeY2 = y + this.tileSize - eyeOffset;
        } else if (this.dir.y === -1) { // Up
          eyeX1 = x + eyeOffset;
          eyeX2 = x + this.tileSize - eyeOffset;
          eyeY1 = eyeY2 = y + eyeOffset;
        } else if (this.dir.y === 1) { // Down
          eyeX1 = x + eyeOffset;
          eyeX2 = x + this.tileSize - eyeOffset;
          eyeY1 = eyeY2 = y + this.tileSize - eyeOffset;
        }

        this.ctx.beginPath();
        this.ctx.arc(eyeX1, eyeY1, 2, 0, Math.PI * 2);
        this.ctx.arc(eyeX2, eyeY2, 2, 0, Math.PI * 2);
        this.ctx.fill();
      }
    });
  }

  gameLoop(currentTime) {
    this.animationFrameId = requestAnimationFrame((time) => this.gameLoop(time));

    const deltaTime = currentTime - this.lastRenderTime;
    if (deltaTime > this.currentSpeed) {
      this.lastRenderTime = currentTime;
      this.update();
      this.draw();
    }
  }
}

// Start Game Engine on DOM Load
document.addEventListener('DOMContentLoaded', () => {
  new SnakeGame();
});