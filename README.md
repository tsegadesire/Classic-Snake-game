# 🐍 Classic Snake Game

A modern, responsive, and lightweight HTML5 Canvas implementation of the classic Snake Game built using pure Vanilla JavaScript (ES6+), CSS3 custom properties, and semantic HTML5.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![JavaScript](https://img.shields.io/badge/javascript-ES6%2B-yellow.svg)
![Dependencies](https://img.shields.io/badge/dependencies-zero-brightgreen.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)

---

## 🚀 Project Overview

The **Classic Snake Game** provides a polished, modern arcade experience right in the browser. Built completely framework-free, it features dynamic acceleration, synthesized audio effects using the Web Audio API, dark/light theme switching, and local storage persistence for high scores.

---

## 🌟 Key Features

- **Zero External Dependencies**: Built 100% with native Web API standards (HTML5 Canvas, Web Audio API, CSS Variables, Local Storage).
- **Procedural Audio**: Synthesized sound effects generated dynamically via Web Audio API oscillators — zero external `.wav` asset dependency.
- **Theme Engine**: Seamless Light and Dark mode switching with user selection stored in `localStorage`.
- **Adaptive Difficulty**: Choose between Easy, Medium, and Hard movement rates with incremental speed boosts as you eat more apples.
- **Responsive & Accessible**: Mobile-friendly layout with accessible focus states, high contrast controls, and keyboard navigation.

---

## 🎮 How to Play

1. Control the snake to eat red apples and grow your tail.
2. Each apple increases your score by **+10 points**.
3. Avoid running into walls or biting your own tail.

### Keyboard Shortcuts

| Key / Control | Action |
| :--- | :--- |
| <kbd>↑</kbd> or <kbd>W</kbd> | Move Up |
| <kbd>↓</kbd> or <kbd>S</kbd> | Move Down |
| <kbd>←</kbd> or <kbd>A</kbd> | Move Left |
| <kbd>→</kbd> or <kbd>D</kbd> | Move Right |
| <kbd>Space</kbd> | Pause / Resume Game |
| <kbd>R</kbd> | Restart Game |
| <kbd>M</kbd> | Mute / Unmute Audio |

---

## 📁 Project Structure

```text
Classic-Snake-game/
│
├── index.html          # Page Structure & Accessibility
├── style.css           # Custom Properties, Dark Mode & Responsive Layout
├── script.js           # ES6 Game Loop, Web Audio Engine & Collision Logic
├── README.md           # Project Documentation
├── LICENSE             # MIT Open Source License
├── favicon.ico         # App Icon
│
├── assets/             # Media and Static Resources
│   └── (Screenshots & Visuals)
│
└── docs/
    └── game-design.md  # Technical Architecture & System Specs