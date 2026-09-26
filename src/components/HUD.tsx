import React from 'react';
import { RotateCcw, Volume2, VolumeX, HelpCircle, FastForward, Clock } from 'lucide-react';
import { LevelConfig } from '../types/game';

interface HUDProps {
  level: LevelConfig;
  loopNumber: number;
  remainingSeconds: number;
  activeEchoCount: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onRestartLoop: () => void;
  onRestartLevel: () => void;
  onOpenHowToPlay: () => void;
  onLevelSelect: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  level,
  loopNumber,
  remainingSeconds,
  activeEchoCount,
  isMuted,
  onToggleMute,
  onRestartLoop,
  onRestartLevel,
  onOpenHowToPlay,
  onLevelSelect,
}) => {
  // Format seconds countdown as 00:SS
  const wholeSeconds = Math.max(0, Math.floor(remainingSeconds));
  const fractionalPart = Math.floor((remainingSeconds % 1) * 10);
  const isUrgent = remainingSeconds <= 5;
  const progressRatio = Math.max(0, Math.min(1, remainingSeconds / 30));

  const formattedLoop = `LOOP ${loopNumber.toString().padStart(2, '0')}`;
  const formattedTimer = `00:${wholeSeconds.toString().padStart(2, '0')}`;

  return (
    <header className="w-full max-w-4xl mx-auto px-4 py-2.5 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left Zone: Chamber & Loop Info */}
        <div className="flex items-center gap-3">
          <button
            onClick={onLevelSelect}
            className="text-xs uppercase tracking-wider font-bold text-sky-400 hover:text-sky-300 transition-colors font-mono cursor-pointer"
            title="Chamber Select"
          >
            CHAMBER 0{level.id}
          </button>
          <span className="text-slate-700" aria-hidden="true">/</span>
          {/* Prominent LOOP 01 display */}
          <div className="px-2.5 py-1 bg-sky-950/80 border border-sky-600/40 rounded-lg text-xs font-mono font-extrabold text-sky-300">
            {formattedLoop}
          </div>
          <span className="text-slate-700 hidden sm:inline" aria-hidden="true">·</span>
          {/* Prominent ECHOES: X display */}
          <div className="px-2.5 py-1 bg-amber-950/60 border border-amber-500/40 rounded-lg text-xs font-mono font-bold text-amber-300">
            ECHOES: {activeEchoCount}
          </div>
        </div>

        {/* Center Zone: 30-Second Countdown (00:30) */}
        <div className="flex items-center gap-2.5 bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-1.5 shadow-inner">
          <Clock className={`w-4 h-4 ${isUrgent ? 'text-rose-500 animate-spin' : 'text-sky-400'}`} />
          <div className="flex items-baseline gap-1 font-mono text-xl font-black">
            <span className={`tabular-nums ${isUrgent ? 'text-rose-500 animate-pulse' : 'text-white'}`}>
              {formattedTimer}
            </span>
            <span className="text-xs text-slate-400 font-bold tabular-nums">
              .{fractionalPart}
            </span>
          </div>
          {/* Progress bar line */}
          <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden ml-1">
            <div
              className={`h-full transition-all duration-75 ${isUrgent ? 'bg-rose-500' : 'bg-sky-400'}`}
              style={{ width: `${progressRatio * 100}%` }}
            />
          </div>
        </div>

        {/* Right Zone: Primary Loop Controls */}
        <div className="flex items-center gap-2">
          {/* Prominent RESET LOOP Button */}
          <button
            onClick={onRestartLoop}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-lg transition-all active:scale-95 shadow-md shadow-sky-500/20 whitespace-nowrap cursor-pointer"
            title="Reset Loop: Commit recording and spawn next Echo [Key: R]"
          >
            <FastForward className="w-3.5 h-3.5 fill-current" />
            <span>RESET LOOP (R)</span>
          </button>

          {/* Full Level Reset */}
          <button
            onClick={onRestartLevel}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-all active:scale-95 whitespace-nowrap cursor-pointer"
            title="Clear all echoes and restart Chamber 01 from beginning"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Restart</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleMute}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title={isMuted ? "Unmute Audio" : "Mute Audio"}
            aria-label={isMuted ? "Unmute Audio" : "Mute Audio"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* How to Play Help */}
          <button
            onClick={onOpenHowToPlay}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title="How To Play"
            aria-label="How To Play"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
