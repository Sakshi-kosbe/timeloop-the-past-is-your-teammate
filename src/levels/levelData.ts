import { LevelConfig } from '../types/game';

export const LEVELS: LevelConfig[] = [
  // LEVEL 1: THE FIRST LOOP
  {
    id: 1,
    title: "1. Temporal Initiation",
    subtitle: "Movement & The Echo Loop",
    briefing: "Hold the Relay Plate with your past self → Reach the Chrono Rift",
    gridWidth: 16,
    gridHeight: 10,
    tileSize: 48,
    playerStart: { x: 2, y: 5 },
    exitPortal: { x: 13, y: 5 },
    walls: [
      // Outer boundaries
      { x: 0, y: 0, w: 16, h: 1 },
      { x: 0, y: 9, w: 16, h: 1 },
      { x: 0, y: 0, w: 1, h: 10 },
      { x: 15, y: 0, w: 1, h: 10 },
      // Internal barrier dividing chamber into left and right halves
      { x: 7, y: 1, w: 1, h: 4 },
      { x: 7, y: 6, w: 1, h: 3 },
    ],
    plates: [
      {
        id: "p1-1",
        x: 4,
        y: 5,
        isPressed: false,
        doorTargetIds: ["d1-1"],
        label: "RELAY PLATE",
        colorTheme: "#38bdf8"
      }
    ],
    switches: [],
    doors: [
      {
        id: "d1-1",
        x: 7,
        y: 5,
        isOpen: false,
        plateSourceIds: ["p1-1"],
        orientation: "vertical"
      }
    ],
    hazards: [],
    idealLoops: 2
  },

  // LEVEL 2: THE WEIGHT OF MEMORY
  {
    id: 2,
    title: "2. The Weight of Memory",
    subtitle: "Pressure Plates & Past Selves",
    briefing: "Pressure Plate Alpha holds open Security Gate Alpha only while occupied. Stand on the plate, let the loop reset (or press R), and your Echo will hold it for you in the next loop!",
    gridWidth: 16,
    gridHeight: 10,
    tileSize: 48,
    playerStart: { x: 2, y: 2 },
    exitPortal: { x: 13, y: 2 },
    walls: [
      // Boundaries
      { x: 0, y: 0, w: 16, h: 1 },
      { x: 0, y: 9, w: 16, h: 1 },
      { x: 0, y: 0, w: 1, h: 10 },
      { x: 15, y: 0, w: 1, h: 10 },
      // Central dividing wall
      { x: 8, y: 1, w: 1, h: 4 },
      { x: 8, y: 6, w: 1, h: 3 },
    ],
    plates: [
      {
        id: "p2-1",
        x: 3,
        y: 7,
        isPressed: false,
        doorTargetIds: ["d2-1"],
        label: "ALPHA",
        colorTheme: "#38bdf8"
      }
    ],
    switches: [],
    doors: [
      {
        id: "d2-1",
        x: 8,
        y: 5,
        isOpen: false,
        plateSourceIds: ["p2-1"],
        orientation: "vertical"
      }
    ],
    hazards: [],
    idealLoops: 2
  },

  // LEVEL 3: DUAL SYNCHRONICITY
  {
    id: 3,
    title: "3. Dual Synchronicity",
    subtitle: "Sequential Air-Lock Coordination",
    briefing: "Two air-locks block the exit. Gate 1 requires Plate 1; Gate 2 requires Plate 2. Work in sequence: use Loop 1 to hold Plate 1, then cooperate with your Echo to enter the lock and unlock Gate 2.",
    gridWidth: 16,
    gridHeight: 10,
    tileSize: 48,
    playerStart: { x: 2, y: 5 },
    exitPortal: { x: 13, y: 5 },
    walls: [
      // Outer
      { x: 0, y: 0, w: 16, h: 1 },
      { x: 0, y: 9, w: 16, h: 1 },
      { x: 0, y: 0, w: 1, h: 10 },
      { x: 15, y: 0, w: 1, h: 10 },
      // First partition
      { x: 6, y: 1, w: 1, h: 3 },
      { x: 6, y: 6, w: 1, h: 3 },
      // Second partition
      { x: 10, y: 1, w: 1, h: 3 },
      { x: 10, y: 6, w: 1, h: 3 },
    ],
    plates: [
      {
        id: "p3-1",
        x: 3,
        y: 2,
        isPressed: false,
        doorTargetIds: ["d3-1"],
        label: "GATE 1",
        colorTheme: "#38bdf8"
      },
      {
        id: "p3-2",
        x: 8,
        y: 7,
        isPressed: false,
        doorTargetIds: ["d3-2"],
        label: "GATE 2",
        colorTheme: "#f59e0b"
      }
    ],
    switches: [],
    doors: [
      {
        id: "d3-1",
        x: 6,
        y: 4,
        isOpen: false,
        plateSourceIds: ["p3-1"],
        orientation: "vertical"
      },
      {
        id: "d3-2",
        x: 10,
        y: 4,
        isOpen: false,
        plateSourceIds: ["p3-2"],
        orientation: "vertical"
      }
    ],
    hazards: [],
    idealLoops: 2
  },

  // LEVEL 4: TRIAD CONVERGENCE
  {
    id: 4,
    title: "4. Triad Convergence",
    subtitle: "Multiple Simultaneous Echoes",
    briefing: "The Master Vault Door requires THREE resonance plates to be depressed simultaneously. One player alone cannot do this—you will need two past echoes and your current self.",
    gridWidth: 16,
    gridHeight: 10,
    tileSize: 48,
    playerStart: { x: 2, y: 5 },
    exitPortal: { x: 14, y: 5 },
    walls: [
      // Outer
      { x: 0, y: 0, w: 16, h: 1 },
      { x: 0, y: 9, w: 16, h: 1 },
      { x: 0, y: 0, w: 1, h: 10 },
      { x: 15, y: 0, w: 1, h: 10 },
      // Chamber dividers
      { x: 5, y: 1, w: 1, h: 3 },
      { x: 5, y: 6, w: 1, h: 3 },
      { x: 11, y: 1, w: 1, h: 3 },
      { x: 11, y: 6, w: 1, h: 3 },
    ],
    plates: [
      {
        id: "p4-1",
        x: 3,
        y: 2,
        isPressed: false,
        doorTargetIds: ["d4-master"],
        label: "CORE I",
        colorTheme: "#38bdf8"
      },
      {
        id: "p4-2",
        x: 3,
        y: 7,
        isPressed: false,
        doorTargetIds: ["d4-master"],
        label: "CORE II",
        colorTheme: "#f59e0b"
      },
      {
        id: "p4-3",
        x: 8,
        y: 5,
        isPressed: false,
        doorTargetIds: ["d4-master"],
        label: "CORE III",
        colorTheme: "#ec4899"
      }
    ],
    switches: [],
    doors: [
      {
        id: "d4-master",
        x: 11,
        y: 4,
        isOpen: false,
        requiresAllPlates: true,
        plateSourceIds: ["p4-1", "p4-2", "p4-3"],
        orientation: "vertical"
      }
    ],
    hazards: [],
    idealLoops: 3
  },

  // LEVEL 5: CHRONO-DRIFT HAZARDS
  {
    id: 5,
    title: "5. Chrono-Drift Hazards",
    subtitle: "Moving Lasers & Temporal Timing",
    briefing: "Autonomous laser sentries patrol the corridor. Stepping onto an interactive bypass switch temporarily halts the corresponding sentry. Synchronize with past echoes to forge a safe passage.",
    gridWidth: 16,
    gridHeight: 10,
    tileSize: 48,
    playerStart: { x: 1, y: 5 },
    exitPortal: { x: 14, y: 5 },
    walls: [
      // Outer
      { x: 0, y: 0, w: 16, h: 1 },
      { x: 0, y: 9, w: 16, h: 1 },
      { x: 0, y: 0, w: 1, h: 10 },
      { x: 15, y: 0, w: 1, h: 10 },
      // Hazards barrier guides
      { x: 5, y: 1, w: 1, h: 3 },
      { x: 5, y: 6, w: 1, h: 3 },
      { x: 10, y: 1, w: 1, h: 3 },
      { x: 10, y: 6, w: 1, h: 3 },
    ],
    plates: [
      {
        id: "p5-1",
        x: 3,
        y: 2,
        isPressed: false,
        doorTargetIds: ["d5-gate"],
        label: "BYPASS",
        colorTheme: "#10b981"
      }
    ],
    switches: [
      {
        id: "s5-1",
        x: 8,
        y: 2,
        isActive: false,
        doorTargetIds: ["d5-laser"],
        label: "LASER SHIELD",
        colorTheme: "#38bdf8"
      }
    ],
    doors: [
      {
        id: "d5-gate",
        x: 5,
        y: 4,
        isOpen: false,
        plateSourceIds: ["p5-1"],
        orientation: "vertical"
      },
      {
        id: "d5-laser",
        x: 10,
        y: 4,
        isOpen: false,
        plateSourceIds: [],
        switchSourceIds: ["s5-1"],
        orientation: "vertical"
      }
    ],
    hazards: [
      {
        id: "h5-1",
        startX: 7,
        startY: 2,
        endX: 7,
        endY: 8,
        speed: 1.6,
        currentX: 7,
        currentY: 2,
        radius: 14,
        direction: 1
      },
      {
        id: "h5-2",
        startX: 12,
        startY: 8,
        endX: 12,
        endY: 2,
        speed: 2.0,
        currentX: 12,
        currentY: 8,
        radius: 14,
        direction: -1
      }
    ],
    idealLoops: 2
  },

  // LEVEL 6: THE PARADOX CHAMBER (The Major Twist)
  {
    id: 6,
    title: "6. The Paradox Chamber",
    subtitle: "Twist: Rewrite Past Timelines",
    briefing: "THE PARADOX PROTOCOL IS ACTIVE. In this final chamber, a temporal lock prevents the portal from opening if both relays are tripped. You can inspect previous timelines and ERASE an action or trigger paradox rewind to escape!",
    gridWidth: 16,
    gridHeight: 10,
    tileSize: 48,
    isParadoxLevel: true,
    paradoxDescription: "Paradox Modifier: Click on an echo in the Timeline Scrubber below to toggle its action or erase a timeline collision!",
    playerStart: { x: 2, y: 2 },
    exitPortal: { x: 13, y: 7 },
    walls: [
      // Outer
      { x: 0, y: 0, w: 16, h: 1 },
      { x: 0, y: 9, w: 16, h: 1 },
      { x: 0, y: 0, w: 1, h: 10 },
      { x: 15, y: 0, w: 1, h: 10 },
      // Maze structure
      { x: 5, y: 1, w: 1, h: 6 },
      { x: 10, y: 3, w: 1, h: 6 },
      { x: 7, y: 4, w: 2, h: 1 },
    ],
    plates: [
      {
        id: "p6-1",
        x: 3,
        y: 7,
        isPressed: false,
        doorTargetIds: ["d6-main"],
        label: "RELAY A",
        colorTheme: "#38bdf8"
      },
      {
        id: "p6-trap",
        x: 3,
        y: 4,
        isPressed: false,
        doorTargetIds: ["d6-lockdown"],
        label: "TRIPWIRE SENSOR",
        colorTheme: "#ef4444",
        isTrap: true
      }
    ],
    switches: [
      {
        id: "s6-exit",
        x: 13,
        y: 2,
        isActive: false,
        doorTargetIds: ["d6-exit-gate"],
        label: "RIFT EMITTER",
        colorTheme: "#a855f7"
      }
    ],
    doors: [
      {
        id: "d6-main",
        x: 5,
        y: 7,
        isOpen: false,
        plateSourceIds: ["p6-1"],
        orientation: "vertical"
      },
      {
        id: "d6-lockdown",
        x: 10,
        y: 2,
        isOpen: true, // starts OPEN, but if plate 6-trap is triggered, it closes into an impassable barrier!
        plateSourceIds: ["p6-trap"],
        orientation: "vertical",
        isHazard: true
      },
      {
        id: "d6-exit-gate",
        x: 12,
        y: 7,
        isOpen: false,
        plateSourceIds: [],
        switchSourceIds: ["s6-exit"],
        orientation: "vertical"
      }
    ],
    hazards: [
      {
        id: "h6-1",
        startX: 7,
        startY: 6,
        endX: 7,
        endY: 8,
        speed: 1.4,
        currentX: 7,
        currentY: 6,
        radius: 12,
        direction: 1
      }
    ],
    idealLoops: 3
  }
];

// Color palette for player and echoes
export const ECHO_COLORS = [
  "#38bdf8", // Echo 1: Cyan
  "#f59e0b", // Echo 2: Amber
  "#ec4899", // Echo 3: Pink/Magenta
  "#10b981", // Echo 4: Emerald
  "#a855f7", // Echo 5: Purple
  "#06b6d4", // Echo 6: Teal
];
