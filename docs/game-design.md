# 🐍 Classic Snake Game - Game Design Document

## 1. Overview
A zero-dependency HTML5 Canvas rendering of the retro Arcade Snake Game. Features include synthesized Web Audio sound generation, persistent `localStorage` theme state, adaptive rendering speeds, and modern design principles suitable for engineering showcase portfolios.

## 2. Core Architecture
- **Rendering Model**: Fixed-rate gameloop governed by `requestAnimationFrame` and timestamp delta throttling.
- **State Management**: Encapsulated inside `SnakeGame` class; sound effects isolated inside `SoundEffects` class utilizing Web Audio Oscillators (`OscillatorNode`).
- **Collision Logic**: Grid cell index verification against boundary limits (`0` to `gridSize - 1`) and array evaluation (`Array.prototype.some`) for snake body segment intersections.

## 3. Game Systems
- **Food Spawning**: Re-rolls coordinates until a cell index does not overlap with any snake segment.
- **Adaptive Velocity**: Base movement tick rates:
  - Easy: 140ms
  - Medium: 90ms
  - Hard: 50ms
  - Dynamic acceleration: Drops tick time by `-5ms` every 5 food items consumed.
- **Theme Persistence**: Dark/Light modes saved in browser Local Storage as `snake_theme`. High score saved as `snake_high_score`.