import React, { useEffect, useRef, useCallback } from 'react';
import { LevelConfig, EchoRecord, FrameData, Direction, FeedbackToast } from '../types/game';
import { ECHO_COLORS } from '../levels/levelData';
import { sound } from '../utils/audio';

interface GameCanvasProps {
  level: LevelConfig;
  loopNumber: number;
  echoes: EchoRecord[];
  isPaused: boolean;
  onLoopReset: (completedRun: FrameData[]) => void;
  onLevelComplete: (stats: { loops: number; timeElapsed: number; echoesCreated: number; paradoxActions: number }) => void;
  onHazardHit: () => void;
  onLoopFailed: (reason: 'timeout' | 'hazard') => void;
  onTickUpdate: (currentTime: number, currentTick: number) => void;
  onFeedbackToast?: (toast: FeedbackToast) => void;
  paradoxErasedEchoId: string | null;
  erasedActionEchoIds?: string[];
  manualResetTrigger: number;
  fullRestartTrigger: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  maxLife: number;
  life: number;
}

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  color: string;
  alpha: number;
}

interface TrailPoint {
  x: number;
  y: number;
  alpha: number;
}

interface DoorStateItem {
  id: string;
  x: number;
  y: number;
  isOpen: boolean;
  openProgress: number; // 0 (closed) to 1 (fully open) for smooth animation
  plateSourceIds: string[];
  switchSourceIds?: string[];
  requiresAllPlates?: boolean;
  isHazard?: boolean;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  level,
  loopNumber,
  echoes,
  isPaused,
  onLoopReset,
  onLevelComplete,
  onHazardHit,
  onLoopFailed,
  onTickUpdate,
  onFeedbackToast,
  paradoxErasedEchoId,
  erasedActionEchoIds = [],
  manualResetTrigger,
  fullRestartTrigger,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Player physics state
  const playerRef = useRef({
    x: level.playerStart.x * level.tileSize + level.tileSize / 2,
    y: level.playerStart.y * level.tileSize + level.tileSize / 2,
    vx: 0,
    vy: 0,
    facing: 'right' as Direction,
    radius: 14,
    speed: 3.5,
  });

  const keysRef = useRef<{ [key: string]: boolean }>({});
  const currentRunFramesRef = useRef<FrameData[]>([]);
  const currentTickRef = useRef<number>(0);
  const maxTicks = 30 * 60; // 30 seconds at 60fps
  const particlesRef = useRef<Particle[]>([]);
  const shockwavesRef = useRef<Shockwave[]>([]);
  const screenShakeRef = useRef<number>(0);
  const rewindFlashRef = useRef<number>(0);
  const timeElapsedInLevelRef = useRef<number>(0);

  // Ghost motion trails for echoes
  const echoTrailsRef = useRef<{ [echoId: string]: TrailPoint[] }>({});

  // Dynamic puzzle state
  const platesStateRef = useRef(level.plates.map(p => ({ ...p })));
  const switchesStateRef = useRef(level.switches.map(s => ({ ...s })));
  const doorsStateRef = useRef<DoorStateItem[]>(
    level.doors.map(d => ({
      ...d,
      openProgress: d.isOpen ? 1 : 0,
    }))
  );
  const hazardsStateRef = useRef(level.hazards.map(h => ({ ...h })));

  // Audio & Notification debounce flags
  const prevPlatesPressedRef = useRef<{ [id: string]: boolean }>({});
  const prevDoorsOpenRef = useRef<{ [id: string]: boolean }>({});
  const lastWarningSecondRef = useRef<number>(-1);
  const notifiedSyncRef = useRef<{ [plateId: string]: number }>({});

  // Chamber 1 Cinematic text timer (Requirement 2)
  const introMessageStageRef = useRef<number>(0); // 0: hidden, 1: "THE GATE REQUIRES TWO PRESENCES.", 2: "YOUR FIRST LOOP WILL BECOME YOUR ECHO."
  const introTimerRef = useRef<number>(0);

  // In-world reset notification banner
  const resetBannerTicksRef = useRef<number>(0);
  const resetBannerEchoNumRef = useRef<number>(1);

  // Reset player and mechanisms for a new loop
  const resetEntitiesForLoop = useCallback(() => {
    playerRef.current.x = level.playerStart.x * level.tileSize + level.tileSize / 2;
    playerRef.current.y = level.playerStart.y * level.tileSize + level.tileSize / 2;
    playerRef.current.vx = 0;
    playerRef.current.vy = 0;
    playerRef.current.facing = 'right';

    currentRunFramesRef.current = [];
    currentTickRef.current = 0;
    lastWarningSecondRef.current = -1;
    notifiedSyncRef.current = {};
    echoTrailsRef.current = {};

    platesStateRef.current = level.plates.map(p => ({ ...p, isPressed: false }));
    switchesStateRef.current = level.switches.map(s => ({ ...s, isActive: false }));
    doorsStateRef.current = level.doors.map(d => ({
      ...d,
      openProgress: d.isOpen ? 1 : 0,
    }));
    hazardsStateRef.current = level.hazards.map(h => ({
      ...h,
      currentX: h.startX,
      currentY: h.startY,
      direction: 1,
    }));

    rewindFlashRef.current = 1.0;
  }, [level]);

  // Full level restart signal (clears run and resets)
  useEffect(() => {
    if (fullRestartTrigger > 0) {
      timeElapsedInLevelRef.current = 0;
      resetEntitiesForLoop();
    }
  }, [fullRestartTrigger, resetEntitiesForLoop]);

  // Manual reset loop signal (player pressed R or clicked Reset Loop button)
  useEffect(() => {
    if (manualResetTrigger > 0) {
      sound.playLoopReset();
      timeElapsedInLevelRef.current += Math.round(currentTickRef.current / 60);

      resetBannerTicksRef.current = 110;
      resetBannerEchoNumRef.current = loopNumber;

      onLoopReset([...currentRunFramesRef.current]);
      resetEntitiesForLoop();
    }
  }, [manualResetTrigger]);

  // Reset when level changes
  useEffect(() => {
    timeElapsedInLevelRef.current = 0;
    if (level.id === 1) {
      introMessageStageRef.current = 1;
      introTimerRef.current = 0;
    } else {
      introMessageStageRef.current = 0;
    }
    resetEntitiesForLoop();
  }, [level.id, resetEntitiesForLoop]);

  // Keyboard input listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
      }
      keysRef.current[e.code] = true;
      keysRef.current[e.key.toLowerCase()] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.code] = false;
      keysRef.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Particles & Shockwaves helpers
  const addParticle = (x: number, y: number, color: string, count = 3, spread = 2) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * spread;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 3 + 1.5,
        color,
        alpha: 1,
        life: 0,
        maxLife: Math.random() * 20 + 20,
      });
    }
  };

  const addShockwave = (x: number, y: number, color: string, maxRadius = 38) => {
    shockwavesRef.current.push({
      x,
      y,
      radius: 4,
      maxRadius,
      color,
      alpha: 1,
    });
  };

  // Collision checks with tile walls and doors
  const checkWallCollision = (nx: number, ny: number, r: number): boolean => {
    const ts = level.tileSize;

    // Boundaries
    if (nx - r < 0 || nx + r > level.gridWidth * ts || ny - r < 0 || ny + r > level.gridHeight * ts) {
      return true;
    }

    // Static walls
    for (const w of level.walls) {
      const width = (w.w || 1) * ts;
      const height = (w.h || 1) * ts;
      const left = w.x * ts;
      const top = w.y * ts;
      const right = left + width;
      const bottom = top + height;

      const closestX = Math.max(left, Math.min(nx, right));
      const closestY = Math.max(top, Math.min(ny, bottom));
      const dx = nx - closestX;
      const dy = ny - closestY;

      if (dx * dx + dy * dy < r * r) {
        return true;
      }
    }

    // Closed doors acting as impassable barriers (collision active when openProgress < 0.8)
    for (const d of doorsStateRef.current) {
      if (d.openProgress < 0.75) {
        const left = d.x * ts;
        const top = d.y * ts;
        const width = ts;
        const height = ts;
        const right = left + width;
        const bottom = top + height;

        const closestX = Math.max(left, Math.min(nx, right));
        const closestY = Math.max(top, Math.min(ny, bottom));
        const dx = nx - closestX;
        const dy = ny - closestY;

        if (dx * dx + dy * dy < r * r) {
          return true;
        }
      }
    }

    return false;
  };

  // Main 60fps Game Loop
  useEffect(() => {
    let animId: number;
    let lastTimestamp = performance.now();
    let accumulatedTime = 0;
    const tickInterval = 1000 / 60;

    const updatePhysics = () => {
      if (isPaused) return;

      const player = playerRef.current;
      const ts = level.tileSize;
      const tick = currentTickRef.current;

      // Handle Chamber 1 cinematic message timer (Requirement 2)
      if (level.id === 1 && loopNumber === 1) {
        introTimerRef.current += 1;
        if (introTimerRef.current < 150) {
          introMessageStageRef.current = 1; // "THE GATE REQUIRES TWO PRESENCES."
        } else if (introTimerRef.current < 360) {
          introMessageStageRef.current = 2; // "YOUR FIRST LOOP WILL BECOME YOUR ECHO."
        } else {
          introMessageStageRef.current = 0; // finished
        }
      }

      // 1. Process Input
      let dx = 0;
      let dy = 0;
      const keys = keysRef.current;

      if (keys['KeyW'] || keys['ArrowUp'] || keys['w']) dy -= 1;
      if (keys['KeyS'] || keys['ArrowDown'] || keys['s']) dy += 1;
      if (keys['KeyA'] || keys['ArrowLeft'] || keys['a']) dx -= 1;
      if (keys['KeyD'] || keys['ArrowRight'] || keys['d']) dx += 1;

      if (dx !== 0 && dy !== 0) {
        dx *= 0.7071;
        dy *= 0.7071;
      }

      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) player.facing = 'right';
        else if (dx < 0) player.facing = 'left';
      } else if (dy !== 0) {
        if (dy > 0) player.facing = 'down';
        else if (dy < 0) player.facing = 'up';
      }

      // Responsive movement with corner sliding assistance
      const moveDistX = dx * player.speed;
      const moveDistY = dy * player.speed;

      let nextX = player.x + moveDistX;
      let nextY = player.y + moveDistY;

      if (!checkWallCollision(nextX, nextY, player.radius)) {
        player.x = nextX;
        player.y = nextY;
      } else {
        if (!checkWallCollision(nextX, player.y, player.radius)) {
          player.x = nextX;
        } else {
          // Check corner nudge along Y
          if (dy === 0 && dx !== 0) {
            const currentTileY = Math.floor(player.y / ts) * ts + ts / 2;
            const diffY = currentTileY - player.y;
            if (Math.abs(diffY) > 2) {
              const nudgeY = player.y + Math.sign(diffY) * 1.5;
              if (!checkWallCollision(nextX, nudgeY, player.radius)) {
                player.y = nudgeY;
                player.x = nextX;
              }
            }
          }
        }

        if (!checkWallCollision(player.x, nextY, player.radius)) {
          player.y = nextY;
        } else {
          // Check corner nudge along X
          if (dx === 0 && dy !== 0) {
            const currentTileX = Math.floor(player.x / ts) * ts + ts / 2;
            const diffX = currentTileX - player.x;
            if (Math.abs(diffX) > 2) {
              const nudgeX = player.x + Math.sign(diffX) * 1.5;
              if (!checkWallCollision(nudgeX, nextY, player.radius)) {
                player.x = nudgeX;
                player.y = nextY;
              }
            }
          }
        }
      }

      // Audio & Footstep particles
      if (dx !== 0 || dy !== 0) {
        if (tick % 16 === 0) {
          sound.playFootstep();
          addParticle(player.x, player.y + 10, '#38bdf8', 1, 0.8);
        }
      }

      // 2. Deterministic Recording of Current Run
      const interact = !!(keys['Space'] || keys['KeyE'] || keys['e']);
      currentRunFramesRef.current.push({
        x: player.x,
        y: player.y,
        vx: dx,
        vy: dy,
        interact,
        facing: player.facing,
      });

      // 3. Update Echo Positions from recorded frames
      const activeEchoPositions: {
        x: number;
        y: number;
        interact: boolean;
        echoId: string;
        loopNumber: number;
        color: string;
      }[] = [];

      echoes.forEach((echo) => {
        if (!echo.isActive) return;
        if (paradoxErasedEchoId === echo.id) return;

        if (echo.frames.length > 0) {
          const offsetTicks = Math.round((echo.timelineDelayOffset || 0) * 60);
          const effectiveTick = tick - offsetTicks;

          if (effectiveTick >= 0) {
            // Stay at final frame if loop continues past recording
            const frameIdx = Math.min(effectiveTick, echo.frames.length - 1);
            const frame = echo.frames[frameIdx];

            activeEchoPositions.push({
              x: frame.x,
              y: frame.y,
              interact: frame.interact,
              echoId: echo.id,
              loopNumber: echo.loopNumber,
              color: echo.color,
            });

            // Ghost trail points
            if (!echoTrailsRef.current[echo.id]) {
              echoTrailsRef.current[echo.id] = [];
            }
            if (tick % 3 === 0) {
              const trails = echoTrailsRef.current[echo.id];
              trails.push({ x: frame.x, y: frame.y, alpha: 0.45 });
              if (trails.length > 6) trails.shift();
            }

            if (tick % 8 === 0 && (frame.vx !== 0 || frame.vy !== 0)) {
              addParticle(frame.x, frame.y + 6, echo.color, 1, 0.5);
            }
          }
        }
      });

      // 4. Update Pressure Plates (Check Player + All Echoes)
      platesStateRef.current.forEach((plate) => {
        const plateCenterX = plate.x * ts + ts / 2;
        const plateCenterY = plate.y * ts + ts / 2;
        const triggerRadius = 24;

        const pdx = player.x - plateCenterX;
        const pdy = player.y - plateCenterY;
        let isOccupied = (pdx * pdx + pdy * pdy) <= triggerRadius * triggerRadius;
        let occupyingEcho: (typeof activeEchoPositions)[0] | null = null;

        if (!isOccupied) {
          for (const ep of activeEchoPositions) {
            if (level.id === 6 && plate.id === 'p6-trap' && erasedActionEchoIds.includes(ep.echoId)) {
              continue;
            }

            const edx = ep.x - plateCenterX;
            const edy = ep.y - plateCenterY;
            if (edx * edx + edy * edy <= triggerRadius * triggerRadius) {
              isOccupied = true;
              occupyingEcho = ep;
              break;
            }
          }
        }

        // Mechanical activation event
        if (isOccupied !== prevPlatesPressedRef.current[plate.id]) {
          sound.playPlate(isOccupied);
          prevPlatesPressedRef.current[plate.id] = isOccupied;

          if (isOccupied) {
            const theme = plate.colorTheme || '#38bdf8';
            addParticle(plateCenterX, plateCenterY, theme, 12, 2.5);
            addShockwave(plateCenterX, plateCenterY, theme, 42);

            onFeedbackToast?.({
              id: `plate-active-${plate.id}-${tick}`,
              type: 'sync',
              title: '+ PRESSURE PLATE ACTIVE',
              detail: `${plate.label || 'Plate'} depressed by ${occupyingEcho ? `Echo #${occupyingEcho.loopNumber}` : 'Player'}`,
            });
          }
        }

        plate.isPressed = isOccupied;
      });

      // 5. Update Interactive Switches
      switchesStateRef.current.forEach((sw) => {
        const swCenterX = sw.x * ts + ts / 2;
        const swCenterY = sw.y * ts + ts / 2;
        const triggerRadius = 26;

        const pdx = player.x - swCenterX;
        const pdy = player.y - swCenterY;
        if (pdx * pdx + pdy * pdy <= triggerRadius * triggerRadius) {
          if (!sw.isActive) {
            sw.isActive = true;
            sound.playSwitch();
            addParticle(swCenterX, swCenterY, sw.colorTheme || '#a855f7', 14, 3);
            addShockwave(swCenterX, swCenterY, sw.colorTheme || '#a855f7', 42);
            onFeedbackToast?.({
              id: `switch-${sw.id}-${tick}`,
              type: 'sync',
              title: '+ RELAY SWITCH ACTIVE',
              detail: `${sw.label || 'Switch'} engaged`,
            });
          }
        }

        for (const ep of activeEchoPositions) {
          const edx = ep.x - swCenterX;
          const edy = ep.y - swCenterY;
          if (edx * edx + edy * edy <= triggerRadius * triggerRadius) {
            if (!sw.isActive) {
              sw.isActive = true;
              sound.playSwitch();
              addParticle(swCenterX, swCenterY, sw.colorTheme || '#a855f7', 14, 3);
              addShockwave(swCenterX, swCenterY, sw.colorTheme || '#a855f7', 42);
              onFeedbackToast?.({
                id: `switch-echo-${sw.id}-${tick}`,
                type: 'sync',
                title: '+ ECHO SWITCH ACTIVE',
                detail: `Echo #${ep.loopNumber} engaged ${sw.label || 'Switch'}`,
              });
            }
          }
        }
      });

      // 6. Update Doors & Smooth Opening Animation
      doorsStateRef.current.forEach((door) => {
        let shouldBeOpen = false;

        if (door.id === 'd6-lockdown') {
          const trapPlate = platesStateRef.current.find(p => p.id === 'p6-trap');
          shouldBeOpen = !trapPlate?.isPressed;
        } else if (door.requiresAllPlates) {
          shouldBeOpen = door.plateSourceIds.every(pid => {
            const p = platesStateRef.current.find(item => item.id === pid);
            return p?.isPressed;
          });
        } else {
          const plateOpen = door.plateSourceIds.some(pid => {
            const p = platesStateRef.current.find(item => item.id === pid);
            return p?.isPressed;
          });
          const switchOpen = (door.switchSourceIds || []).some(sid => {
            const s = switchesStateRef.current.find(item => item.id === sid);
            return s?.isActive;
          });
          shouldBeOpen = plateOpen || switchOpen;
        }

        // Animate door opening/closing progress (0 -> 1)
        const targetProgress = shouldBeOpen ? 1 : 0;
        if (door.openProgress < targetProgress) {
          door.openProgress = Math.min(1, door.openProgress + 0.12);
        } else if (door.openProgress > targetProgress) {
          door.openProgress = Math.max(0, door.openProgress - 0.14);
        }

        if (shouldBeOpen !== prevDoorsOpenRef.current[door.id]) {
          sound.playDoor(shouldBeOpen);
          prevDoorsOpenRef.current[door.id] = shouldBeOpen;
          const doorCenterX = door.x * ts + ts / 2;
          const doorCenterY = door.y * ts + ts / 2;
          addParticle(doorCenterX, doorCenterY, shouldBeOpen ? '#10b981' : '#ef4444', 8, 2.5);
          addShockwave(doorCenterX, doorCenterY, shouldBeOpen ? '#10b981' : '#ef4444', 36);

          if (shouldBeOpen) {
            onFeedbackToast?.({
              id: `gate-open-${door.id}-${tick}`,
              type: 'door',
              title: '+ GATE OPEN',
              detail: 'Security barrier retracted',
            });
          }
        }

        door.isOpen = shouldBeOpen;
      });

      // 7. Update Moving Hazards
      hazardsStateRef.current.forEach((h) => {
        if (h.deactivated) return;

        const startPosX = h.startX * ts + ts / 2;
        const startPosY = h.startY * ts + ts / 2;
        const endPosX = h.endX * ts + ts / 2;
        const endPosY = h.endY * ts + ts / 2;

        const pathX = endPosX - startPosX;
        const pathY = endPosY - startPosY;
        const totalDist = Math.sqrt(pathX * pathX + pathY * pathY);

        if (totalDist > 0) {
          const currX = h.currentX * ts + ts / 2;
          const currY = h.currentY * ts + ts / 2;
          const currentDistFromStart = Math.sqrt((currX - startPosX) ** 2 + (currY - startPosY) ** 2);

          let newDist = currentDistFromStart + (h.direction || 1) * h.speed;
          if (newDist >= totalDist) {
            newDist = totalDist;
            h.direction = -1;
          } else if (newDist <= 0) {
            newDist = 0;
            h.direction = 1;
          }

          const ratio = newDist / totalDist;
          h.currentX = (startPosX + pathX * ratio - ts / 2) / ts;
          h.currentY = (startPosY + pathY * ratio - ts / 2) / ts;

          // Check collision with player
          const actualHazardX = h.currentX * ts + ts / 2;
          const actualHazardY = h.currentY * ts + ts / 2;
          const hdx = player.x - actualHazardX;
          const hdy = player.y - actualHazardY;
          const hitDist = player.radius + h.radius;

          if (hdx * hdx + hdy * hdy <= hitDist * hitDist) {
            sound.playHazardHit();
            screenShakeRef.current = 15;
            addParticle(player.x, player.y, '#ef4444', 25, 4.5);
            addShockwave(player.x, player.y, '#ef4444', 50);
            onHazardHit();
            onLoopFailed('hazard');
            return;
          }
        }
      });

      // 8. Exit Chrono Rift Check
      const portalCenterX = level.exitPortal.x * ts + ts / 2;
      const portalCenterY = level.exitPortal.y * ts + ts / 2;
      const exitDistX = player.x - portalCenterX;
      const exitDistY = player.y - portalCenterY;
      const distToExit = Math.sqrt(exitDistX * exitDistX + exitDistY * exitDistY);

      if (distToExit < 24) {
        sound.playLevelWin();
        onFeedbackToast?.({
          id: `chamber-complete-${Date.now()}`,
          type: 'sync',
          title: `+ CHAMBER ${level.id} COMPLETE`,
          detail: 'Temporal anomaly breached',
        });
        onLevelComplete({
          loops: loopNumber,
          timeElapsed: Math.round(timeElapsedInLevelRef.current + (tick / 60)),
          echoesCreated: echoes.length,
          paradoxActions: erasedActionEchoIds.length,
        });
        return;
      }

      // 9. Loop timer checks
      const remainingSeconds = Math.max(0, (maxTicks - tick) / 60);
      const remainingWholeSecond = Math.ceil(remainingSeconds);

      if (remainingWholeSecond <= 5 && remainingWholeSecond > 0 && remainingWholeSecond !== lastWarningSecondRef.current) {
        sound.playTimerWarning();
        lastWarningSecondRef.current = remainingWholeSecond;
      }

      onTickUpdate(remainingSeconds, tick);
      currentTickRef.current += 1;

      // 10. Check 30-Second Loop Expiry -> Show LOOP FAILED (Requirement 6)
      if (currentTickRef.current >= maxTicks) {
        onLoopFailed('timeout');
      }
    };

    // Render Canvas
    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const ts = level.tileSize;
      const width = level.gridWidth * ts;
      const height = level.gridHeight * ts;

      ctx.save();

      // Screen shake
      if (screenShakeRef.current > 0) {
        const shakeX = (Math.random() - 0.5) * screenShakeRef.current;
        const shakeY = (Math.random() - 0.5) * screenShakeRef.current;
        ctx.translate(shakeX, shakeY);
        screenShakeRef.current = Math.max(0, screenShakeRef.current - 1);
      }

      // Atmospheric dark floor
      ctx.fillStyle = '#080b11';
      ctx.fillRect(0, 0, width, height);

      // Floor grid tiles
      for (let x = 0; x < level.gridWidth; x++) {
        for (let y = 0; y < level.gridHeight; y++) {
          const px = x * ts;
          const py = y * ts;
          ctx.fillStyle = (x + y) % 2 === 0 ? '#0b0f19' : '#0e1422';
          ctx.fillRect(px, py, ts, ts);

          ctx.strokeStyle = 'rgba(56, 189, 248, 0.035)';
          ctx.strokeRect(px, py, ts, ts);
        }
      }

      // Walls
      level.walls.forEach((w) => {
        const wallW = (w.w || 1) * ts;
        const wallH = (w.h || 1) * ts;
        const wx = w.x * ts;
        const wy = w.y * ts;

        ctx.fillStyle = '#1e293b';
        ctx.fillRect(wx, wy, wallW, wallH);

        ctx.fillStyle = '#334155';
        ctx.fillRect(wx, wy, wallW, 2);
        ctx.fillRect(wx, wy, 2, wallH);

        ctx.fillStyle = '#0f172a';
        ctx.fillRect(wx, wy + wallH - 2, wallW, 2);
        ctx.fillRect(wx + wallW - 2, wy, 2, wallH);

        ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
        ctx.lineWidth = 1;
        ctx.strokeRect(wx + 3, wy + 3, wallW - 6, wallH - 6);
      });

      // Floor Energy Conduits (Links Plates to Doors)
      platesStateRef.current.forEach((plate) => {
        const pCenterX = plate.x * ts + ts / 2;
        const pCenterY = plate.y * ts + ts / 2;
        const theme = plate.colorTheme || '#38bdf8';

        (plate.doorTargetIds || []).forEach((doorId) => {
          const door = doorsStateRef.current.find((d) => d.id === doorId);
          if (!door) return;

          const dCenterX = door.x * ts + ts / 2;
          const dCenterY = door.y * ts + ts / 2;

          ctx.save();
          if (plate.isPressed) {
            // High-voltage active glowing conduit
            ctx.shadowColor = theme;
            ctx.shadowBlur = 12;
            ctx.strokeStyle = theme;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(pCenterX, pCenterY);
            ctx.lineTo(dCenterX, dCenterY);
            ctx.stroke();

            // Moving energy pulse packet traveling toward door
            const pulsePhase = (performance.now() / 140) % 1;
            const pulseX = pCenterX + (dCenterX - pCenterX) * pulsePhase;
            const pulseY = pCenterY + (dCenterY - pCenterY) * pulsePhase;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(pulseX, pulseY, 3.5, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Dormant dimmed power line
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.18)';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.moveTo(pCenterX, pCenterY);
            ctx.lineTo(dCenterX, dCenterY);
            ctx.stroke();
            ctx.setLineDash([]);
          }
          ctx.restore();
        });
      });

      // Pressure Plates (Requirement 1: Visible glowing mechanism, RELAY PLATE label)
      platesStateRef.current.forEach((plate) => {
        const px = plate.x * ts + 4;
        const py = plate.y * ts + 4;
        const pSize = ts - 8;
        const theme = plate.colorTheme || '#38bdf8';
        const labelText = plate.label || 'RELAY PLATE';

        ctx.save();
        if (plate.isPressed) {
          // Depressed active plate
          ctx.fillStyle = `${theme}33`;
          ctx.fillRect(px, py, pSize, pSize);
          ctx.strokeStyle = theme;
          ctx.lineWidth = 3;
          ctx.shadowColor = theme;
          ctx.shadowBlur = 18;
          ctx.strokeRect(px + 1, py + 1, pSize - 2, pSize - 2);

          // Deep glowing central button
          ctx.fillStyle = theme;
          ctx.beginPath();
          ctx.arc(px + pSize / 2, py + pSize / 2, 9, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(px + pSize / 2, py + pSize / 2, 4, 0, Math.PI * 2);
          ctx.fill();

          // Continuous gentle pulse ring while depressed
          const pRing = 12 + Math.sin(performance.now() / 120) * 3;
          ctx.strokeStyle = theme;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(px + pSize / 2, py + pSize / 2, pRing, 0, Math.PI * 2);
          ctx.stroke();

          // Active text label
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 9px "JetBrains Mono", monospace';
          ctx.textAlign = 'center';
          ctx.shadowColor = theme;
          ctx.shadowBlur = 8;
          ctx.fillText(`${labelText} [ACTIVE]`, px + pSize / 2, py - 6);
        } else {
          // Unpressed plate
          ctx.fillStyle = '#0b1322';
          ctx.fillRect(px, py, pSize, pSize);
          ctx.strokeStyle = `${theme}88`;
          ctx.lineWidth = 2;
          ctx.strokeRect(px, py, pSize, pSize);

          // Subtle concentric rings
          ctx.strokeStyle = `${theme}aa`;
          ctx.beginPath();
          ctx.arc(px + pSize / 2, py + pSize / 2, 8, 0, Math.PI * 2);
          ctx.stroke();

          // Subtle pulse hint for Chamber 1
          if (level.id === 1 && loopNumber === 1) {
            const hintPulse = 11 + Math.sin(performance.now() / 250) * 2;
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(px + pSize / 2, py + pSize / 2, hintPulse, 0, Math.PI * 2);
            ctx.stroke();
          }

          ctx.fillStyle = '#94a3b8';
          ctx.font = 'bold 9px "JetBrains Mono", monospace';
          ctx.textAlign = 'center';
          ctx.fillText(labelText, px + pSize / 2, py - 6);
        }
        ctx.restore();
      });

      // Switches
      switchesStateRef.current.forEach((sw) => {
        const sx = sw.x * ts + ts / 2;
        const sy = sw.y * ts + ts / 2;
        const theme = sw.colorTheme || '#a855f7';

        ctx.save();
        ctx.fillStyle = '#1e1b4b';
        ctx.beginPath();
        ctx.arc(sx, sy, 14, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = sw.isActive ? theme : `${theme}66`;
        ctx.lineWidth = 2;
        if (sw.isActive) {
          ctx.shadowColor = theme;
          ctx.shadowBlur = 14;
        }
        ctx.stroke();

        ctx.fillStyle = sw.isActive ? '#ffffff' : theme;
        ctx.beginPath();
        ctx.arc(sx, sy, 6, 0, Math.PI * 2);
        ctx.fill();

        if (sw.label) {
          ctx.fillStyle = sw.isActive ? '#ffffff' : '#a78bfa';
          ctx.font = '9px "JetBrains Mono", monospace';
          ctx.textAlign = 'center';
          ctx.fillText(sw.label, sx, sy - 18);
        }
        ctx.restore();
      });

      // Animated Security Gates / Doors (Requirement 1: Locked red/amber state & Animated Opening)
      doorsStateRef.current.forEach((door) => {
        const dx = door.x * ts;
        const dy = door.y * ts;
        const progress = door.openProgress; // 0 = closed, 1 = fully open
        const isHazard = door.isHazard;

        ctx.save();
        // Doorway threshold slot
        ctx.fillStyle = '#050b14';
        ctx.fillRect(dx + 2, dy + 2, ts - 4, ts - 4);

        // Frame bulkhead pillars on left/right edges
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(dx + 1, dy + 1, 4, ts - 2);
        ctx.fillRect(dx + ts - 5, dy + 1, 4, ts - 2);

        // Status LED on pillars: Amber/Red if locked, Emerald if open
        const isFullyClosed = progress < 0.1;
        const ledColor = isFullyClosed ? (isHazard ? '#ef4444' : '#f59e0b') : '#10b981';
        ctx.fillStyle = ledColor;
        ctx.shadowColor = ledColor;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(dx + 3, dy + 4, 2, 0, Math.PI * 2);
        ctx.arc(dx + ts - 3, dy + 4, 2, 0, Math.PI * 2);
        ctx.arc(dx + 3, dy + ts - 4, 2, 0, Math.PI * 2);
        ctx.arc(dx + ts - 3, dy + ts - 4, 2, 0, Math.PI * 2);
        ctx.fill();

        if (progress > 0.05) {
          // Open active safety runway with green arrows
          ctx.strokeStyle = `rgba(16, 185, 129, ${progress * 0.7})`;
          ctx.lineWidth = 1.5;
          ctx.strokeRect(dx + 5, dy + 5, ts - 10, ts - 10);

          ctx.fillStyle = `rgba(16, 185, 129, ${progress * 0.25})`;
          ctx.fillRect(dx + 5, dy + 5, ts - 10, ts - 10);

          // Green directional passway glyph
          ctx.fillStyle = '#34d399';
          ctx.font = 'bold 11px "JetBrains Mono", monospace';
          ctx.textAlign = 'center';
          ctx.fillText('►', dx + ts / 2, dy + ts / 2 + 4);
        }

        if (progress < 0.95) {
          // Sliding mechanical blast leaves
          const halfTs = ts / 2;
          const slideOffset = progress * (halfTs - 4); // retracts left and right
          const barrierColor = isHazard ? '#ef4444' : '#f59e0b'; // Subtle red/amber when locked!

          ctx.shadowColor = barrierColor;
          ctx.shadowBlur = 10 * (1 - progress);

          // Left panel
          ctx.fillStyle = isHazard ? '#3b0707' : '#271906';
          ctx.fillRect(dx + 3 - slideOffset, dy + 2, halfTs - 3, ts - 4);
          ctx.strokeStyle = barrierColor;
          ctx.lineWidth = 2;
          ctx.strokeRect(dx + 3 - slideOffset, dy + 2, halfTs - 3, ts - 4);

          // Right panel
          ctx.fillStyle = isHazard ? '#3b0707' : '#271906';
          ctx.fillRect(dx + halfTs + slideOffset, dy + 2, halfTs - 3, ts - 4);
          ctx.strokeStyle = barrierColor;
          ctx.strokeRect(dx + halfTs + slideOffset, dy + 2, halfTs - 3, ts - 4);

          // Red/amber laser barrier lattice between panels when locked
          if (progress < 0.6) {
            ctx.beginPath();
            ctx.strokeStyle = barrierColor;
            ctx.lineWidth = 2.5 * (1 - progress);
            ctx.moveTo(dx + halfTs - slideOffset, dy + ts / 3);
            ctx.lineTo(dx + halfTs + slideOffset, dy + ts / 3);
            ctx.moveTo(dx + halfTs - slideOffset, dy + (ts * 2) / 3);
            ctx.lineTo(dx + halfTs + slideOffset, dy + (ts * 2) / 3);
            ctx.stroke();

            // Vertical laser beam in the middle
            ctx.beginPath();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.5 * (1 - progress);
            ctx.moveTo(dx + ts / 2, dy + 4);
            ctx.lineTo(dx + ts / 2, dy + ts - 4);
            ctx.stroke();
          }
        }

        // Gate state label above gate
        ctx.font = 'bold 8px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        if (progress > 0.5) {
          ctx.fillStyle = '#10b981';
          ctx.shadowColor = '#10b981';
          ctx.shadowBlur = 6;
          ctx.fillText('[OPEN]', dx + ts / 2, dy - 5);
        } else {
          ctx.fillStyle = isHazard ? '#ef4444' : '#f59e0b';
          ctx.shadowColor = isHazard ? '#ef4444' : '#f59e0b';
          ctx.shadowBlur = 6;
          ctx.fillText('[LOCKED]', dx + ts / 2, dy - 5);
        }

        ctx.restore();
      });

      // Moving Hazards
      hazardsStateRef.current.forEach((h) => {
        if (h.deactivated) return;
        const hx = h.currentX * ts + ts / 2;
        const hy = h.currentY * ts + ts / 2;

        ctx.save();
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 16;
        ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
        ctx.beginPath();
        ctx.arc(hx, hy, h.radius + 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(hx, hy, h.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(hx, hy, h.radius * 0.45, 0, Math.PI * 2);
        ctx.fill();

        const rotTime = performance.now() / 250;
        ctx.strokeStyle = '#fca5a5';
        ctx.lineWidth = 2;
        for (let i = 0; i < 4; i++) {
          const angle = rotTime + (i * Math.PI) / 2;
          ctx.beginPath();
          ctx.moveTo(hx + Math.cos(angle) * (h.radius - 2), hy + Math.sin(angle) * (h.radius - 2));
          ctx.lineTo(hx + Math.cos(angle) * (h.radius + 6), hy + Math.sin(angle) * (h.radius + 6));
          ctx.stroke();
        }
        ctx.restore();
      });

      // Exit Chrono Rift (Requirement 1: Visually attractive & clearly recognizable destination)
      const exitX = level.exitPortal.x * ts + ts / 2;
      const exitY = level.exitPortal.y * ts + ts / 2;
      const portalTime = performance.now() / 400;

      ctx.save();
      // Outer temporal resonance aura
      const auraGrad = ctx.createRadialGradient(exitX, exitY, 6, exitX, exitY, 32);
      auraGrad.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
      auraGrad.addColorStop(0.6, 'rgba(14, 165, 233, 0.15)');
      auraGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(exitX, exitY, 32, 0, Math.PI * 2);
      ctx.fill();

      // Outer gyroscopic celestial ring with ticks
      ctx.save();
      ctx.translate(exitX, exitY);
      ctx.rotate(portalTime * 0.8);
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(0, 0, 20 + Math.sin(portalTime) * 1.5, 0, Math.PI * 2);
      ctx.stroke();

      // 4 orbital tick notches
      ctx.fillStyle = '#38bdf8';
      for (let i = 0; i < 4; i++) {
        const tickAngle = (i * Math.PI) / 2;
        ctx.fillRect(Math.cos(tickAngle) * 20 - 1.5, Math.sin(tickAngle) * 20 - 1.5, 3, 3);
      }
      ctx.restore();

      // Inner counter-rotating ring
      ctx.save();
      ctx.translate(exitX, exitY);
      ctx.rotate(-portalTime * 1.2);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 13 + Math.cos(portalTime * 1.5) * 1.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Core Singularity
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(exitX, exitY, 6.5, 0, Math.PI * 2);
      ctx.fill();

      // Destination Beacon Arrow & Label
      const arrowBob = Math.sin(portalTime * 2) * 2.5;
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 10px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 10;
      ctx.fillText('▼', exitX, exitY - 26 + arrowBob);
      ctx.fillText('CHRONO RIFT [EXIT]', exitX, exitY - 38);
      ctx.restore();

      // Holographic Past Echoes (Requirement 4: Echo feels alive, cyan outline, motion trail, particles, ECHO 01 label)
      echoes.forEach((echo, echoIndex) => {
        if (!echo.isActive) return;
        if (paradoxErasedEchoId === echo.id) return;

        const color = echo.color || ECHO_COLORS[echoIndex % ECHO_COLORS.length];
        const formattedEchoLabel = `ECHO ${echo.loopNumber.toString().padStart(2, '0')}`;

        // Motion Trail Afterimages
        const trails = echoTrailsRef.current[echo.id] || [];
        trails.forEach((pt, idx) => {
          ctx.save();
          ctx.globalAlpha = (idx / trails.length) * 0.28;
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 12, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });

        // Current Echo Frame
        if (echo.frames.length > 0) {
          const tick = currentTickRef.current;
          const offsetTicks = Math.round((echo.timelineDelayOffset || 0) * 60);
          const effectiveTick = tick - offsetTicks;

          if (effectiveTick >= 0) {
            const frameIdx = Math.min(effectiveTick, echo.frames.length - 1);
            const frame = echo.frames[frameIdx];

            ctx.save();
            ctx.shadowColor = color;
            ctx.shadowBlur = 16;
            ctx.globalAlpha = 0.68; // Transparent holographic ghost body

            // Pulsing holographic cyan outline ring
            const pulseSize = 14 + Math.sin(performance.now() / 180) * 2.5;
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(frame.x, frame.y, pulseSize, 0, Math.PI * 2);
            ctx.stroke();

            // Holographic translucent body
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(frame.x, frame.y, 14, 0, Math.PI * 2);
            ctx.fill();

            // Visor
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            let eyeX = frame.x;
            let eyeY = frame.y;
            if (frame.facing === 'right') eyeX += 6;
            if (frame.facing === 'left') eyeX -= 6;
            if (frame.facing === 'down') eyeY += 6;
            if (frame.facing === 'up') eyeY -= 6;
            ctx.arc(eyeX, eyeY, 4, 0, Math.PI * 2);
            ctx.fill();

            // Subtle scanlines
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(frame.x - 12, frame.y - 4);
            ctx.lineTo(frame.x + 12, frame.y - 4);
            ctx.moveTo(frame.x - 12, frame.y + 4);
            ctx.lineTo(frame.x + 12, frame.y + 4);
            ctx.stroke();

            // Check if Echo is currently on a plate to show HOLDING PLATE
            let isHoldingPlate = false;
            platesStateRef.current.forEach((pl) => {
              const plCenterX = pl.x * ts + ts / 2;
              const plCenterY = pl.y * ts + ts / 2;
              const distSq = (frame.x - plCenterX) ** 2 + (frame.y - plCenterY) ** 2;
              if (distSq <= 24 * 24) {
                isHoldingPlate = true;
              }
            });

            // Overhead label: Display ECHO 01 (zero padded)
            ctx.font = 'bold 9px "JetBrains Mono", monospace';
            ctx.textAlign = 'center';
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = color;
            ctx.shadowBlur = 8;
            ctx.fillText(
              isHoldingPlate ? `${formattedEchoLabel} [HOLDING PLATE]` : formattedEchoLabel,
              frame.x,
              frame.y - 18
            );
            ctx.restore();
          }
        }
      });

      // Current Present Player (Requirement 1 & 3: Bright white/cyan character with subtle glow)
      const player = playerRef.current;
      ctx.save();
      // Drop shadow under player
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.beginPath();
      ctx.ellipse(player.x, player.y + 13, 13, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Outer energetic cyan aura
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 18;
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(player.x, player.y, player.radius + 2, 0, Math.PI * 2);
      ctx.stroke();

      // Bright solid white suit
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
      ctx.fill();

      // Energetic blue chrononaut core
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.arc(player.x, player.y, 8, 0, Math.PI * 2);
      ctx.fill();

      // Visor
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      let pEyeX = player.x;
      let pEyeY = player.y;
      if (player.facing === 'right') pEyeX += 6;
      if (player.facing === 'left') pEyeX -= 6;
      if (player.facing === 'down') pEyeY += 6;
      if (player.facing === 'up') pEyeY -= 6;
      ctx.arc(pEyeX, pEyeY, 4, 0, Math.PI * 2);
      ctx.fill();

      // Player overhead label
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 9px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 6;
      ctx.fillText('YOU (PRESENT)', player.x, player.y - 18);
      ctx.restore();

      // Expanding Shockwaves
      for (let i = shockwavesRef.current.length - 1; i >= 0; i--) {
        const sw = shockwavesRef.current[i];
        sw.radius += 2.0;
        sw.alpha = 1 - sw.radius / sw.maxRadius;

        if (sw.radius >= sw.maxRadius) {
          shockwavesRef.current.splice(i, 1);
        } else {
          ctx.save();
          ctx.globalAlpha = Math.max(0, sw.alpha);
          ctx.strokeStyle = sw.color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
      }

      // Particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life += 1;
        p.alpha = 1 - p.life / p.maxLife;

        if (p.life >= p.maxLife) {
          particlesRef.current.splice(i, 1);
        } else {
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      // Chamber 1 Cinematic Instruction Banner (Requirement 2)
      if (level.id === 1 && loopNumber === 1 && introMessageStageRef.current > 0) {
        ctx.save();
        ctx.fillStyle = 'rgba(6, 10, 20, 0.9)';
        ctx.fillRect(width / 2 - 230, 22, 460, 40);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 10;
        ctx.strokeRect(width / 2 - 230, 22, 460, 40);

        ctx.font = 'bold 12px "JetBrains Mono", monospace';
        ctx.fillStyle = '#e0f2fe';
        ctx.textAlign = 'center';

        if (introMessageStageRef.current === 1) {
          ctx.fillText('THE GATE REQUIRES TWO PRESENCES.', width / 2, 47);
        } else if (introMessageStageRef.current === 2) {
          ctx.fillText('YOUR FIRST LOOP WILL BECOME YOUR ECHO.', width / 2, 47);
        }
        ctx.restore();
      }

      // Reset / Echo Created In-World Confirmation Overlay (Requirement 3 & 4)
      if (resetBannerTicksRef.current > 0) {
        resetBannerTicksRef.current -= 1;
        const bannerAlpha = Math.min(1, resetBannerTicksRef.current / 25);
        const echoNumPad = resetBannerEchoNumRef.current.toString().padStart(2, '0');

        ctx.save();
        ctx.globalAlpha = bannerAlpha;
        ctx.fillStyle = 'rgba(8, 12, 24, 0.92)';
        ctx.fillRect(width / 2 - 210, height / 2 - 32, 420, 64);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 16;
        ctx.strokeRect(width / 2 - 210, height / 2 - 32, 420, 64);

        ctx.font = 'bold 13px "JetBrains Mono", monospace';
        ctx.fillStyle = '#38bdf8';
        ctx.textAlign = 'center';
        ctx.fillText('TIMELINE RECORDED', width / 2, height / 2 - 6);

        ctx.font = 'bold 12px "JetBrains Mono", monospace';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`ECHO ${echoNumPad} CREATED`, width / 2, height / 2 + 18);
        ctx.restore();
      }

      // Rewind Flash Transition
      if (rewindFlashRef.current > 0) {
        ctx.save();
        ctx.fillStyle = `rgba(56, 189, 248, ${rewindFlashRef.current * 0.45})`;
        ctx.fillRect(0, 0, width, height);

        const grad = ctx.createRadialGradient(
          width / 2, height / 2, 10,
          width / 2, height / 2, width / 2
        );
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
        grad.addColorStop(0.5, 'rgba(56, 189, 248, 0.2)');
        grad.addColorStop(1, 'rgba(56, 189, 248, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        rewindFlashRef.current = Math.max(0, rewindFlashRef.current - 0.05);
        ctx.restore();
      }

      ctx.restore();
    };

    const loop = (timestamp: number) => {
      const dt = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      accumulatedTime += Math.min(dt, 100);

      while (accumulatedTime >= tickInterval) {
        updatePhysics();
        accumulatedTime -= tickInterval;
      }

      render();
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [
    level,
    loopNumber,
    echoes,
    isPaused,
    onLoopReset,
    onLevelComplete,
    onHazardHit,
    onLoopFailed,
    onTickUpdate,
    onFeedbackToast,
    paradoxErasedEchoId,
    erasedActionEchoIds,
    resetEntitiesForLoop,
  ]);

  return (
    <div className="relative w-full flex items-center justify-center p-2">
      <div className="relative border border-slate-700/60 rounded-xl overflow-hidden shadow-2xl bg-black">
        <canvas
          ref={canvasRef}
          width={level.gridWidth * level.tileSize}
          height={level.gridHeight * level.tileSize}
          className="w-full h-auto max-w-[840px] block cursor-crosshair touch-none"
        />
        <div className="absolute inset-0 pointer-events-none holo-scanline opacity-25" />
      </div>
    </div>
  );
};
