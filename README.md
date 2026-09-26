# ⏳ TIMELOOP — The Past Is Your Teammate

> **Your past is your teammate. Master the loop. Escape the impossible.**

TIMELOOP is a futuristic browser-based puzzle game built around a unique time-loop mechanic: **every action you perform can become an echo of your past self, allowing you to cooperate with previous versions of yourself to solve puzzles.**

Created as a submission for **EVOX 1.0 — Prompt-Based Game Building Challenge**.

---

## 🎮 Game Overview

In TIMELOOP, you are trapped inside a series of temporal chambers.

You have a limited amount of time to act.

When the loop resets, your previous actions are recorded and replayed by a **holographic echo** of your past self.

Instead of simply restarting the level, every failed or completed attempt can become part of the solution.

### The core idea is simple:

**Your past actions become your teammates.**

---

## 🧠 How It Works

The game revolves around a deterministic time-loop system.

### Loop 1

You explore the chamber and perform actions.

For example:

1. Move toward a pressure plate.
2. Stand on the plate.
3. The gate opens.
4. You discover that leaving the plate closes the gate.
5. Reset the loop.

### Loop 2

Your previous actions are replayed by **Echo 01**.

While Echo 01 holds the pressure plate:

- The gate remains open.
- You control the present player.
- You move through the gate.
- You reach the exit.

### Later Loops

More echoes can be created.

You can coordinate:

```text
Present Player
      +
Echo 01
      +
Echo 02
      +
Echo 03
      ↓
Solve the puzzle
```

The challenge becomes a combination of:

- Timing
- Planning
- Spatial reasoning
- Memory
- Coordination
- Experimentation

---

## ✨ Key Features

### ⏱️ Deterministic Time Loops

Each loop records the player's movement and interactions.

When the loop resets, the recorded actions are replayed by a temporal echo.

---

### 👤 Holographic Echoes

Previous versions of the player appear as holographic entities.

Echoes have:

- Transparent appearance
- Temporal glow
- Motion trails
- Particle effects
- Echo identification (e.g. `ECHO 01`)
- Synchronized interactions

---

### 🧩 Multi-Step Puzzle Design

The game gradually introduces new mechanics across 6 distinct chambers:

- **Chamber 1**: Learn the fundamental time-loop mechanic.
- **Chamber 2**: Pressure plates and gates.
- **Chamber 3**: Sequential synchronization between past and present.
- **Chamber 4**: Multiple echoes working simultaneously.
- **Chamber 5**: Moving hazards and timing-based challenges.
- **Chamber 6**: The Paradox Chamber and timeline manipulation.

---

### 🌀 The Paradox Chamber

The final chamber introduces the game's major twist.

Instead of simply replaying the past, the player can interact with their recorded timeline.

The player can modify a previous action to change what an echo does.

This creates a new puzzle concept:

> *If your past determines the present, what happens when you change the past?*

The final challenge requires the player to understand the entire time-loop system and use it deliberately.

---

## 🎯 Game Objective

The primary objective is to escape each temporal chamber.

To do this, players must:

1. Explore the environment.
2. Understand the puzzle.
3. Record useful actions.
4. Reset the loop.
5. Use past echoes.
6. Coordinate past and present actions.
7. Reach the Chrono Rift.
8. Progress to the next chamber.

---

## 🎮 Controls

### Desktop

| Key | Action |
| :--- | :--- |
| **W** / **Up** | Move Up |
| **A** / **Left** | Move Left |
| **S** / **Down** | Move Down |
| **D** / **Right** | Move Right |
| **Arrow Keys** | Movement |
| **R** | Reset / Record Loop |
| **T** | Open Timeline Editor |
| **Space** / **E** | Interact with objects |

### Mobile

The game provides responsive on-screen touch controls for:

- Movement (virtual d-pad)
- Loop reset button
- Interaction button

The interface is dynamically optimized to remain fully playable on mobile and touch devices.

---

## 🌌 Visual Design

TIMELOOP uses a futuristic sci-fi visual language inspired by temporal technology.

Visual elements include:

- Dark atmospheric environments
- Neon/cyan interface elements
- Holographic echoes
- Temporal particle effects
- Glowing mechanisms and energy conduits
- Animated sliding blast gates
- Chrono Rifts with celestial rotating rings
- Grid-based tactical environments
- Minimal futuristic HUD

The visual design intentionally separates the:

```text
Present (High-contrast solid chrononaut)
      vs
Past (Translucent cyan holographic apparition with motion trails)
```

so that players can immediately understand which character they control.

---

## 🔊 Audio & Feedback

The game uses interactive Web Audio synthesis and feedback to make important events intuitive:

- Loop reset & rewind sweeps
- Timer countdown heartbeat & warnings
- Pressure plate depression sounds
- Gate sliding & electrical conduit hums
- Echo creation chords
- Puzzle completion jingles
- Temporal portal transitions

Visual notifications reinforce important events such as:

- `+ TIMELINE RECORDED`
- `+ ECHO CREATED`
- `+ RELAY PLATE ACTIVE`
- `+ GATE OPEN`
- `+ TIMELINE SYNCHRONIZED`
- `+ CHAMBER COMPLETE`

---

## 🏗️ Game Architecture

The game is organized around several modular systems:

```text
TIMELOOP
│
├── Game State
│   ├── Current Chamber
│   ├── Current Loop
│   ├── Timer
│   └── Progress
│
├── Player System
│   ├── Movement
│   ├── Collision
│   └── Interaction
│
├── Timeline System
│   ├── Action Recording
│   ├── Loop Reset
│   └── Timeline Storage
│
├── Echo System
│   ├── Echo Creation
│   ├── Movement Replay
│   ├── Interactions
│   └── Visual Effects
│
├── Puzzle System
│   ├── Pressure Plates
│   ├── Gates
│   ├── Switches
│   └── Hazards
│
├── Chamber System
│   ├── Chamber 1: Temporal Initiation
│   ├── Chamber 2: Dual Relay
│   ├── Chamber 3: Temporal Relay
│   ├── Chamber 4: Triad Convergence
│   ├── Chamber 5: Hazard Corridor
│   └── Chamber 6: The Grand Paradox
│
└── UI System
    ├── Main Menu
    ├── HUD & Objectives
    ├── Timeline Editor
    ├── How To Play Modal
    ├── Chamber Select
    ├── Completion Screens
    └── Final Victory Modal
```

---

## 🤖 AI-Powered Development

TIMELOOP was developed using AI prompting as a core part of the development process.

Instead of treating AI as only a coding assistant, prompts were used throughout the development workflow to help:

- Design the game concept
- Develop the core mechanic
- Structure the gameplay
- Create puzzle progression
- Implement game systems
- Improve UI/UX
- Develop visual effects
- Add responsive controls
- Debug gameplay
- Improve player feedback
- Polish the final experience

The development process followed an iterative approach:

```text
IDEA
 ↓
GAME DESIGN
 ↓
AI PROMPT
 ↓
IMPLEMENTATION
 ↓
TESTING
 ↓
BUG FIXING
 ↓
GAMEPLAY REFINEMENT
 ↓
VISUAL POLISH
 ↓
FINAL BUILD
```

---

## 💡 Why TIMELOOP?

Many puzzle games allow players to restart after making a mistake.

TIMELOOP turns that idea into the central mechanic.

Instead of:

```text
Mistake → Restart → Try Again
```

TIMELOOP uses:

```text
Action
   ↓
Record
   ↓
Reset
   ↓
Past Action Becomes Echo
   ↓
Cooperate With Your Past
   ↓
Solve New Problem
```

A previous attempt is therefore not wasted. It becomes part of the solution.

---

## 🏆 EVOX 1.0

TIMELOOP was created for:

**EVOX 1.0**

### Challenge
> *Build a Game — Any Concept, Any Type*

### Focus Areas
The project was designed around the competition's published evaluation areas:

- **Innovation**
- **Game Creativity**
- **Approach**
- **Prompting**
- **Engaging Uniqueness**

TIMELOOP specifically explores how prompt-driven development can be used to create an interactive game mechanic rather than a conventional chatbot experience.

---

## 🚀 Getting Started

### Play Online

- **Live Deployed App**: [https://ais-pre-r6egtkk7u7th5wvpfl724o-540831525299.asia-southeast1.run.app](https://ais-pre-r6egtkk7u7th5wvpfl724o-540831525299.asia-southeast1.run.app)
- **Development App**: [https://ais-dev-r6egtkk7u7th5wvpfl724o-540831525299.asia-southeast1.run.app](https://ais-dev-r6egtkk7u7th5wvpfl724o-540831525299.asia-southeast1.run.app)

---

### Run Locally

Clone the repository:

```bash
git clone https://github.com/sakshikosbe/timeloop-the-past-is-your-teammate.git
```

Enter the project directory:

```bash
cd timeloop-the-past-is-your-teammate
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL provided by the development server (default: `http://localhost:3000`).

---

## 📱 Responsive Design

TIMELOOP is designed for both desktop and mobile environments.

- **Desktop**: Keyboard controls (`WASD` / `Arrow Keys` / `R` / `T`), wide tactical puzzle view, comprehensive HUD.
- **Mobile**: Touch-responsive movement controls, reset trigger, touch interaction, auto-scaling canvas viewport.

---

## 🧪 Testing

The core gameplay flow was tested around the following sequence:

```text
Launch Game
     ↓
Enter the Loop
     ↓
Start Chamber
     ↓
Explore
     ↓
Record Actions
     ↓
Reset Loop
     ↓
Create Echo
     ↓
Echo Replays Actions
     ↓
Cooperate With Echo
     ↓
Solve Puzzle
     ↓
Reach Chrono Rift
     ↓
Complete Chamber
     ↓
Next Chamber
```

Important systems tested and verified:

- Player movement & grid collision
- Loop reset & timer mechanics
- Action recording & deterministic replay
- Multi-echo simultaneous execution
- Pressure plates & energetic conduits
- Retracting blast doors & hazards
- Puzzle completion & Chamber progression
- Mobile touch controls
- Audio synthesizer & visual feedback

---

## 🔮 Future Improvements

Potential future expansions include:

- More temporal mechanics (rewind scrubbing, localized stasis fields)
- Additional chambers & user level editor
- Branching timelines
- Advanced timeline editing
- Competitive time trials & speedrun timer
- Global leaderboards
- Procedurally generated temporal puzzles

---

## 👥 Team

- **Project**: TIMELOOP — The Past Is Your Teammate
- **Team**: Believer
- **Developer**: Sakshi Kosbe
- **Competition**: EVOX 1.0

---

## 📜 License

This project was created as a competition project.

Please contact the project author before reusing substantial portions of the game's code, assets, or original game design.

---

## ⭐ Final Thought

> *Every action leaves an echo.*  
> *Every echo can change the future.*  
> *Your past is your teammate.*  

**Welcome to TIMELOOP.**
