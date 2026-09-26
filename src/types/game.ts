export type Direction = 'up' | 'down' | 'left' | 'right';

export interface FrameData {
  x: number;
  y: number;
  vx: number;
  vy: number;
  interact: boolean;
  facing: Direction;
}

export interface TimelineAction {
  id: string;
  tick: number;
  type: 'plate' | 'switch' | 'trap';
  label: string;
  targetId: string;
  isErased?: boolean;
}

export interface EchoRecord {
  id: string;
  loopNumber: number;
  color: string;
  frames: FrameData[];
  isActive: boolean;
  timelineDelayOffset?: number; // Shift echo start time earlier or later in ticks
  erasedActionIds?: string[]; // Specific actions erased in Chamber 6 Paradox
  actionsTimeline?: TimelineAction[];
  hasTrappedAlarm?: boolean;
}

export interface Plate {
  id: string;
  x: number;
  y: number;
  isPressed: boolean;
  doorTargetIds: string[]; // which doors this plate opens or toggles
  colorTheme?: string;
  label?: string;
  isTrap?: boolean; // Chamber 6 lockdown sensor
}

export interface Switch {
  id: string;
  x: number;
  y: number;
  isActive: boolean;
  doorTargetIds: string[];
  label?: string;
  colorTheme?: string;
}

export interface Door {
  id: string;
  x: number;
  y: number;
  isOpen: boolean;
  requiresAllPlates?: boolean; // if true, all linked plates must be pressed
  plateSourceIds: string[];
  switchSourceIds?: string[];
  orientation: 'horizontal' | 'vertical';
  isHazard?: boolean;
}

export interface Hazard {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  speed: number;
  currentX: number;
  currentY: number;
  radius: number;
  deactivated?: boolean;
  direction?: number;
}

export interface LevelConfig {
  id: number;
  title: string;
  subtitle: string;
  briefing: string;
  gridWidth: number;
  gridHeight: number;
  tileSize: number;
  walls: { x: number; y: number; w?: number; h?: number }[];
  playerStart: { x: number; y: number };
  exitPortal: { x: number; y: number };
  plates: Plate[];
  switches: Switch[];
  doors: Door[];
  hazards: Hazard[];
  isParadoxLevel?: boolean; // Level 6
  paradoxDescription?: string;
  idealLoops: number;
}

export interface FeedbackToast {
  id: string;
  title: string;
  detail?: string;
  type: 'echo' | 'timeline' | 'door' | 'sync' | 'paradox' | 'story';
}

export type GameState = 
  | 'TITLE_MENU'
  | 'HOW_TO_PLAY'
  | 'LEVEL_SELECT'
  | 'PLAYING'
  | 'LOOP_COMPLETED'
  | 'GAME_WON'
  | 'CREDITS';

