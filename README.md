# MathQuest Gamified MVP

MathQuest is an interactive, challenge-driven math learning experience tailored for college students and senior professionals. The app transforms core math concepts into bite-sized adventures, mini-games, and real-world simulations designed for 5–15 minute sessions.

## Features

- **Interactive Onboarding** – Solve a short puzzle sequence to unlock a personalized track (College Challenger or Professional Strategist).
- **Lesson-as-a-Game** – Each topic is delivered as a dedicated mini-game (drag-and-drop balancing, probability sliders, boss battles).
- **Daily Challenge Loop** – Short, timed missions with streak tracking and reward animations.
- **Adventure Progress Map** – Visual board-style progression that unlocks new checkpoints as you clear modules.
- **Rewards Vault** – Points, badges, streak feedback, and celebratory pulses for habit building.
- **Real-World Scenarios** – Track-specific simulations like exam planners and portfolio stress tests.

## Tech Stack

- **Frontend**: React + TypeScript (Vite)
- **Styling**: Tailwind CSS + custom gradients
- **Animations**: Framer Motion micro-interactions
- **State**: React hooks with localStorage persistence

## Getting Started

```bash
npm install
npm run dev
```

The development server runs on [http://localhost:5173](http://localhost:5173). Complete onboarding to access the full adventure map, mini-games, and rewards.

### Type Checking & Production Build

```bash
npm run lint
npm run build
```

`npm run lint` runs TypeScript for static analysis. `npm run build` type-checks and compiles a production-ready bundle.

## Content Structure

Structured data for modules, challenges, and rewards lives in `src/data`. Mini-games read from JSON payloads, so adding new puzzles is as simple as updating those files.

## Notes

- Progress, streaks, and badge states are saved locally via `localStorage`.
- The UI is tuned for short bursts (5–15 minutes) and celebrates progress with subtle haptics, animations, and streak nudges.

Enjoy the adventure! 🚀
