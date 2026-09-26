import React, { useState, useCallback, useEffect } from 'react';
import { GameState, EchoRecord, FrameData, LevelConfig, FeedbackToast } from './types/game';
import { LEVELS, ECHO_COLORS } from './levels/levelData';
import { GameCanvas } from './components/GameCanvas';
import { HUD } from './components/HUD';
import { TimelineEditor } from './components/TimelineEditor';
import { MainMenu } from './components/MainMenu';
import { HowToPlayModal } from './components/HowToPlayModal';
import { LevelSelectModal } from './components/LevelSelectModal';
import { WinModal } from './components/WinModal';
import { FinalVictoryModal } from './components/FinalVictoryModal';
import { LoopFailedModal } from './components/LoopFailedModal';
import { CreditsModal } from './components/CreditsModal';
import { MobileControls } from './components/MobileControls';
import { FeedbackToaster } from './components/FeedbackToaster';
import { sound } from './utils/audio';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('TITLE_MENU');
  const [currentLevelId, setCurrentLevelId] = useState<number>(1);
  const [loopNumber, setLoopNumber] = useState<number>(1);
  const [echoes, setEchoes] = useState<EchoRecord[]>([]);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(30.0);

  // Discrete action triggers for canvas
  const [manualResetTrigger, setManualResetTrigger] = useState<number>(0);
  const [fullRestartTrigger, setFullRestartTrigger] = useState<number>(0);

  // Sound state
  const [isMuted, setIsMuted] = useState<boolean>(() => sound.getMuted());

  // Toast feedback queue & story transmission
  const [toasts, setToasts] = useState<FeedbackToast[]>([]);
  const [currentStoryMessage, setCurrentStoryMessage] = useState<string | null>("TIMELOOP PROTOCOL INITIALIZED.");

  // Modals
  const [howToPlayOpen, setHowToPlayOpen] = useState<boolean>(false);
  const [levelSelectOpen, setLevelSelectOpen] = useState<boolean>(false);
  const [creditsOpen, setCreditsOpen] = useState<boolean>(false);
  const [winModalOpen, setWinModalOpen] = useState<boolean>(false);
  const [finalVictoryOpen, setFinalVictoryOpen] = useState<boolean>(false);
  const [loopFailedOpen, setLoopFailedOpen] = useState<boolean>(false);
  const [loopFailedReason, setLoopFailedReason] = useState<'timeout' | 'hazard'>('timeout');

  // Statistics
  const [lastWinStats, setLastWinStats] = useState<{
    loops: number;
    timeElapsed: number;
    echoesCreated: number;
    paradoxActions: number;
  }>({ loops: 1, timeElapsed: 0, echoesCreated: 0, paradoxActions: 0 });

  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [campaignTotalLoops, setCampaignTotalLoops] = useState<number>(0);
  const [campaignTotalTime, setCampaignTotalTime] = useState<number>(0);
  const [campaignTotalEchoes, setCampaignTotalEchoes] = useState<number>(0);
  const [campaignParadoxActions, setCampaignParadoxActions] = useState<number>(0);

  // Level 6 Paradox Twist States
  const [paradoxErasedEchoId, setParadoxErasedEchoId] = useState<string | null>(null);
  const [erasedActionEchoIds, setErasedActionEchoIds] = useState<string[]>([]);
  const [timelineOffsets, setTimelineOffsets] = useState<{ [echoId: string]: number }>({});

  // Current level definition
  const currentLevel: LevelConfig = LEVELS.find(l => l.id === currentLevelId) || LEVELS[0];

  // Helper to trigger toasts
  const addToast = useCallback((toast: FeedbackToast) => {
    setToasts(prev => [...prev.slice(-3), toast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== toast.id));
    }, 3200);
  }, []);

  // Update story message based on milestones
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    if (currentLevelId === 1 && loopNumber === 1) {
      setCurrentStoryMessage("TIMELOOP PROTOCOL INITIALIZED.");
    } else if (currentLevelId === 1 && loopNumber === 2) {
      setCurrentStoryMessage("ANOMALY DETECTED.");
      sound.playStoryTransmission();
    } else if ((currentLevelId === 3 || currentLevelId === 4) && loopNumber >= 2) {
      setCurrentStoryMessage("YOU ARE NOT ALONE.");
      sound.playStoryTransmission();
    } else if (currentLevelId === 5) {
      setCurrentStoryMessage("THE LOOP REMEMBERS EVERYTHING.");
    } else if (currentLevelId === 6) {
      setCurrentStoryMessage("EXCEPT THE THING YOU CHANGE.");
      sound.playStoryTransmission();
    }
  }, [currentLevelId, loopNumber, gameState]);

  // Sound mute toggle
  const handleToggleMute = useCallback(() => {
    const nextMuted = sound.toggleMute();
    setIsMuted(nextMuted);
  }, []);

  // Start game from title menu (Requirement 1: immediately start Chamber 1)
  const handleStartGame = useCallback(() => {
    setCurrentLevelId(1);
    setLoopNumber(1);
    setEchoes([]);
    setRemainingSeconds(30.0);
    setWinModalOpen(false);
    setLoopFailedOpen(false);
    setHowToPlayOpen(false);
    setLevelSelectOpen(false);
    setGameState('PLAYING');
    sound.startAmbient();
  }, []);

  // When loop resets and commits a run
  const handleLoopReset = useCallback((completedRun: FrameData[]) => {
    const echoLabel = `ECHO ${loopNumber.toString().padStart(2, '0')}`;
    if (completedRun.length > 5) {
      const newEcho: EchoRecord = {
        id: `echo-${currentLevelId}-${loopNumber}-${Date.now()}`,
        loopNumber: loopNumber,
        color: ECHO_COLORS[(loopNumber - 1) % ECHO_COLORS.length],
        frames: completedRun,
        isActive: true,
        timelineDelayOffset: 0,
      };

      setEchoes(prev => [...prev, newEcho]);
      setCampaignTotalEchoes(prev => prev + 1);

      addToast({
        id: `timeline-rec-${Date.now()}`,
        type: 'timeline',
        title: 'TIMELINE RECORDED',
        detail: 'Run preserved across causality',
      });

      addToast({
        id: `echo-create-${Date.now()}`,
        type: 'echo',
        title: `${echoLabel} CREATED`,
        detail: 'Past self is now your teammate',
      });
    }

    setLoopNumber(prev => prev + 1);
    setCampaignTotalLoops(prev => prev + 1);
    setRemainingSeconds(30.0);
  }, [currentLevelId, loopNumber, addToast]);

  // Player clicks "RESET LOOP (R)" button
  const handleManualRestartLoop = useCallback(() => {
    setManualResetTrigger(prev => prev + 1);
  }, []);

  // Player resets level completely
  const handleRestartLevel = useCallback(() => {
    sound.playLoopReset();
    setEchoes([]);
    setLoopNumber(1);
    setRemainingSeconds(30.0);
    setParadoxErasedEchoId(null);
    setErasedActionEchoIds([]);
    setTimelineOffsets({});
    setLoopFailedOpen(false);
    setFullRestartTrigger(prev => prev + 1);
  }, []);

  // Loop failed handler (Requirement 6: timeout or hazard)
  const handleLoopFailed = useCallback((reason: 'timeout' | 'hazard') => {
    setLoopFailedReason(reason);
    setLoopFailedOpen(true);
  }, []);

  // From LoopFailedModal: Retry Loop (commits current run & starts next loop)
  const handleRetryFromFailed = useCallback(() => {
    setLoopFailedOpen(false);
    handleManualRestartLoop();
  }, [handleManualRestartLoop]);

  // When player reaches Exit Chrono Rift
  const handleLevelComplete = useCallback((stats: {
    loops: number;
    timeElapsed: number;
    echoesCreated: number;
    paradoxActions: number;
  }) => {
    setLastWinStats(stats);
    setCompletedLevels(prev => (prev.includes(currentLevelId) ? prev : [...prev, currentLevelId]));
    setCampaignTotalTime(prev => prev + stats.timeElapsed);

    if (currentLevelId === 6) {
      setFinalVictoryOpen(true);
    } else {
      setWinModalOpen(true);
    }
  }, [currentLevelId]);

  // Next level navigation
  const handleNextLevel = useCallback(() => {
    setWinModalOpen(false);
    if (currentLevelId < LEVELS.length) {
      const nextId = currentLevelId + 1;
      setCurrentLevelId(nextId);
      setEchoes([]);
      setLoopNumber(1);
      setRemainingSeconds(30.0);
      setParadoxErasedEchoId(null);
      setErasedActionEchoIds([]);
      setTimelineOffsets({});
      setFullRestartTrigger(prev => prev + 1);
    } else {
      setFinalVictoryOpen(true);
    }
  }, [currentLevelId]);

  // Select specific level from modal
  const handleSelectLevel = useCallback((lvlId: number) => {
    setCurrentLevelId(lvlId);
    setEchoes([]);
    setLoopNumber(1);
    setRemainingSeconds(30.0);
    setParadoxErasedEchoId(null);
    setErasedActionEchoIds([]);
    setTimelineOffsets({});
    setWinModalOpen(false);
    setLoopFailedOpen(false);
    setFinalVictoryOpen(false);
    setFullRestartTrigger(prev => prev + 1);
    setGameState('PLAYING');
  }, []);

  // Tick update for HUD countdown
  const handleTickUpdate = useCallback((remSecs: number) => {
    setRemainingSeconds(remSecs);
  }, []);

  // Chamber 6 Paradox Twist Scrubber Handlers
  const handleToggleEraseEcho = useCallback((echoId: string) => {
    setParadoxErasedEchoId(prev => {
      const next = prev === echoId ? null : echoId;
      addToast({
        id: `erase-${echoId}-${Date.now()}`,
        type: 'paradox',
        title: next ? 'Paradox Purge: Echo Erased' : 'Timeline Restored',
        detail: next ? 'Past echo removed from causality' : 'Echo presence reconstituted',
      });
      return next;
    });
  }, [addToast]);

  const handleEraseAction = useCallback((echoId: string) => {
    setErasedActionEchoIds(prev => {
      const exists = prev.includes(echoId);
      const updated = exists ? prev.filter(id => id !== echoId) : [...prev, echoId];

      setCampaignParadoxActions(p => p + 1);
      addToast({
        id: `action-${echoId}-${Date.now()}`,
        type: 'paradox',
        title: exists ? 'Trap Action Restored' : 'Paradox Action: Tripwire Erased!',
        detail: exists ? 'Lockdown barrier armed' : 'Causality rewritten: Lockdown Barrier Disarmed!',
      });

      return updated;
    });
  }, [addToast]);

  const handleAdjustTimingOffset = useCallback((echoId: string, deltaSeconds: number) => {
    setTimelineOffsets(prev => {
      const current = prev[echoId] || 0;
      const next = Math.max(-3.0, Math.min(3.0, current + deltaSeconds));

      setEchoes(prevEchoes =>
        prevEchoes.map(e => (e.id === echoId ? { ...e, timelineDelayOffset: next } : e))
      );

      addToast({
        id: `offset-${echoId}-${Date.now()}`,
        type: 'paradox',
        title: `Timing Shift: ${next > 0 ? `+${next.toFixed(1)}s` : `${next.toFixed(1)}s`}`,
        detail: 'Echo execution timeline re-synchronized',
      });

      return { ...prev, [echoId]: next };
    });
  }, [addToast]);

  // Keyboard shortcut listener for 'R' (Reset Loop)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'PLAYING' || winModalOpen || finalVictoryOpen || loopFailedOpen) return;
      if (e.code === 'KeyR' || e.key.toLowerCase() === 'r') {
        handleManualRestartLoop();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, winModalOpen, finalVictoryOpen, loopFailedOpen, handleManualRestartLoop]);

  // Mobile virtual controls
  const handleMobileDirectionPress = useCallback((dir: 'up' | 'down' | 'left' | 'right', active: boolean) => {
    const keyMap: { [key: string]: string } = {
      up: 'KeyW',
      down: 'KeyS',
      left: 'KeyA',
      right: 'KeyD',
    };
    const code = keyMap[dir];
    const event = new KeyboardEvent(active ? 'keydown' : 'keyup', { code, bubbles: true });
    window.dispatchEvent(event);
  }, []);

  const handleMobileInteract = useCallback(() => {
    const down = new KeyboardEvent('keydown', { code: 'Space', bubbles: true });
    window.dispatchEvent(down);
    setTimeout(() => {
      const up = new KeyboardEvent('keyup', { code: 'Space', bubbles: true });
      window.dispatchEvent(up);
    }, 150);
  }, []);

  // Title Screen
  if (gameState === 'TITLE_MENU') {
    return (
      <>
        <MainMenu
          onStartGame={handleStartGame}
          onOpenHowToPlay={() => setHowToPlayOpen(true)}
          onOpenLevelSelect={() => setLevelSelectOpen(true)}
          onOpenCredits={() => setCreditsOpen(true)}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
        <HowToPlayModal
          isOpen={howToPlayOpen}
          onClose={() => setHowToPlayOpen(false)}
        />
        <LevelSelectModal
          isOpen={levelSelectOpen}
          currentLevelId={currentLevelId}
          completedLevelIds={completedLevels}
          onSelectLevel={handleSelectLevel}
          onClose={() => setLevelSelectOpen(false)}
        />
        <CreditsModal
          isOpen={creditsOpen}
          onClose={() => setCreditsOpen(false)}
        />
      </>
    );
  }

  // Active Playing View
  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-[#080a0f] chrono-grid overflow-hidden">
      {/* Toast & Story Transmission HUD Overlay */}
      <FeedbackToaster
        toasts={toasts}
        currentStoryMessage={currentStoryMessage}
      />

      {/* Top HUD Header */}
      <HUD
        level={currentLevel}
        loopNumber={loopNumber}
        remainingSeconds={remainingSeconds}
        activeEchoCount={echoes.filter(e => e.isActive && e.id !== paradoxErasedEchoId).length}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onRestartLoop={handleManualRestartLoop}
        onRestartLevel={handleRestartLevel}
        onOpenHowToPlay={() => setHowToPlayOpen(true)}
        onLevelSelect={() => setLevelSelectOpen(true)}
      />

      {/* Level Objective HUD Bar */}
      <div className="w-full max-w-4xl mx-auto px-4 pt-1.5 pb-0.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-sky-950/90 border border-sky-500/50 shadow-sm shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
            <span className="text-sky-300 font-extrabold font-mono text-[10px] tracking-widest uppercase">
              OBJECTIVE
            </span>
          </div>
          <span className="text-slate-100 font-medium text-xs sm:text-sm tracking-wide truncate">
            {currentLevel.briefing}
          </span>
        </div>
        <button
          onClick={() => setGameState('TITLE_MENU')}
          className="text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-900/60 hover:bg-slate-800 transition-colors shrink-0 ml-3 cursor-pointer border border-slate-800"
        >
          Exit to Menu
        </button>
      </div>

      {/* Primary Game Canvas View */}
      <main className="flex-1 flex flex-col items-center justify-center w-full px-2 py-1">
        <GameCanvas
          level={currentLevel}
          loopNumber={loopNumber}
          echoes={echoes}
          isPaused={winModalOpen || finalVictoryOpen || howToPlayOpen || levelSelectOpen || loopFailedOpen}
          onLoopReset={handleLoopReset}
          onLevelComplete={handleLevelComplete}
          onHazardHit={() => {}}
          onLoopFailed={handleLoopFailed}
          onTickUpdate={handleTickUpdate}
          onFeedbackToast={addToast}
          paradoxErasedEchoId={paradoxErasedEchoId}
          erasedActionEchoIds={erasedActionEchoIds}
          manualResetTrigger={manualResetTrigger}
          fullRestartTrigger={fullRestartTrigger}
        />

        {/* Level 6 Twist: Timeline Paradox Scrubber */}
        {currentLevel.isParadoxLevel && (
          <TimelineEditor
            echoes={echoes}
            paradoxErasedEchoId={paradoxErasedEchoId}
            onToggleEraseEcho={handleToggleEraseEcho}
            onEraseAction={handleEraseAction}
            erasedActionEchoIds={erasedActionEchoIds}
            timelineOffsets={timelineOffsets}
            onAdjustTimingOffset={handleAdjustTimingOffset}
          />
        )}
      </main>

      {/* Mobile Touch Controls */}
      <MobileControls
        onDirectionPress={handleMobileDirectionPress}
        onResetLoop={handleManualRestartLoop}
        onInteract={handleMobileInteract}
      />

      {/* Modals */}
      <HowToPlayModal
        isOpen={howToPlayOpen}
        onClose={() => setHowToPlayOpen(false)}
      />

      <LevelSelectModal
        isOpen={levelSelectOpen}
        currentLevelId={currentLevelId}
        completedLevelIds={completedLevels}
        onSelectLevel={handleSelectLevel}
        onClose={() => setLevelSelectOpen(false)}
      />

      {/* Win Modal with CHAMBER COMPLETE and NEXT CHAMBER */}
      <WinModal
        isOpen={winModalOpen}
        level={currentLevel}
        stats={lastWinStats}
        onNextLevel={handleNextLevel}
        onReplayLevel={handleRestartLevel}
      />

      {/* Loop Failed Modal (Requirement 6) */}
      <LoopFailedModal
        isOpen={loopFailedOpen}
        reason={loopFailedReason}
        currentLoop={loopNumber}
        onRetryLoop={handleRetryFromFailed}
        onRestartChamber={handleRestartLevel}
      />

      {/* Final Victory Modal */}
      <FinalVictoryModal
        isOpen={finalVictoryOpen}
        totalLoops={campaignTotalLoops}
        totalTime={campaignTotalTime}
        totalEchoes={campaignTotalEchoes}
        completedLevelsCount={completedLevels.length}
        paradoxCount={campaignParadoxActions}
        onPlayAgain={() => {
          setFinalVictoryOpen(false);
          handleSelectLevel(1);
        }}
        onReturnHome={() => {
          setFinalVictoryOpen(false);
          setGameState('TITLE_MENU');
        }}
      />

      <CreditsModal
        isOpen={creditsOpen}
        onClose={() => setCreditsOpen(false)}
      />
    </div>
  );
}
