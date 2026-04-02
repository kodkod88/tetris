# Tetris

A fully-featured Tetris game built with TypeScript + React + Vite.

![Tetris](https://img.shields.io/badge/TypeScript-5-blue) ![React](https://img.shields.io/badge/React-18-61dafb) ![Vite](https://img.shields.io/badge/Vite-5-646cff)

## Features

- 7 tetrominoes with guideline colors
- Super Rotation System (SRS) with wall kicks
- 7-bag randomizer (no piece droughts)
- Ghost piece — shows where the piece will land
- Hold piece — swap current piece for later
- Next piece preview — see the next 3 upcoming pieces
- Lock delay with extended placement (15-move limit)
- Level progression with increasing gravity
- Tetris guideline scoring (100 / 300 / 500 / 800 × level)
- DAS / ARR keyboard repeat for smooth movement

## Controls

| Key | Action |
|---|---|
| `← →` | Move |
| `↑` / `X` | Rotate clockwise |
| `Z` | Rotate counter-clockwise |
| `Space` | Hard drop |
| `↓` | Soft drop |
| `C` / `Shift` | Hold |
| `P` / `Esc` | Pause |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── game/               # Pure TypeScript game logic (no React)
│   ├── types.ts        # Shared type definitions
│   ├── constants.ts    # Board size, gravity, scoring tables
│   ├── tetrominoes.ts  # Shape data, colors, spawn logic
│   ├── board.ts        # Board operations (lock, clear, collision)
│   ├── rotation.ts     # SRS wall-kick engine
│   ├── scoring.ts      # Score & level calculations
│   ├── bag.ts          # 7-bag randomizer
│   └── gameEngine.ts   # Pure reducer (game state machine)
├── hooks/
│   ├── useGameState.ts # useReducer wrapper
│   ├── useGameLoop.ts  # requestAnimationFrame loop
│   └── useKeyboard.ts  # DAS/ARR keyboard input
└── components/
    ├── TetrisGame.tsx      # Root layout
    ├── GameBoard.tsx       # Canvas renderer
    ├── MiniPieceCanvas.tsx # Shared mini-piece renderer
    ├── NextPiecesPanel.tsx # Next piece preview
    ├── HoldPiecePanel.tsx  # Hold piece display
    ├── ScorePanel.tsx      # Score / level / lines
    └── GameOverlay.tsx     # Start / pause / game-over screens
```
