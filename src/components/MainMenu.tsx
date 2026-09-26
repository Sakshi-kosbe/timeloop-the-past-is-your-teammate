import React from 'react';
import { Play, HelpCircle, Award, Volume2, VolumeX, Grid, Sparkles, Layers } from 'lucide-react';
import { sound } from '../utils/audio';

interface MainMenuProps {
  onStartGame: () => void;
  onOpenHowToPlay: () => void;
  onOpenLevelSelect: () => void;
  onOpenCredits: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onStartGame,
  onOpenHowToPlay,
  onOpenLevelSelect,
  onOpenCredits,
  isMuted,
  onToggleMute,
}) => {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between p-6 bg-[#080a0f] chrono-grid overflow-hidden">
      {/* Top Bar Zone Contract */}
      <header className="w-full max-w-5xl flex items-center justify-between py-2 border-b border-slate-800/60 z-10">
        <div className="text-sm font-bold tracking-widest text-slate-300 font-mono">
          TIMELOOP // PROTOCOL
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMute}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors cursor-pointer"
            title={isMuted ? "Unmute Sound" : "Mute Sound"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            <span className="hidden sm:inline">{isMuted ? "Muted" : "Audio On"}</span>
          </button>
        </div>
      </header>

      {/* Center Hero Content */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-2xl text-center my-8 z-10">
        {/* Animated Temporal Core Art */}
        <div className="relative w-28 h-28 mb-8 flex items-center justify-center">
          {/* Concentric rotating rings */}
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-sky-500/30 animate-[spin_20s_linear_infinite]" />
          <div className="absolute inset-2 rounded-full border border-sky-400/50 animate-[spin_12s_linear_infinite_reverse]" />
          <div className="absolute inset-5 rounded-full border border-purple-500/40 animate-[spin_8s_linear_infinite]" />

          {/* Central chrononaut pulse */}
          <div className="w-12 h-12 rounded-full bg-sky-950 border border-sky-400 flex items-center justify-center shadow-lg shadow-sky-500/40">
            <Sparkles className="w-6 h-6 text-sky-300 animate-pulse" />
          </div>

          {/* Orbiting Echo indicator */}
          <div className="absolute top-0 right-2 w-3 h-3 rounded-full bg-amber-400 shadow-md shadow-amber-500/50 animate-bounce" />
        </div>

        {/* Title & Subtitle */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-2 font-mono">
          TIMELOOP
        </h1>
        <p className="text-base sm:text-lg font-medium text-sky-400 mb-2 tracking-wide">
          The Past Is Your Teammate
        </p>

        {/* Quiet unboxed metadata */}
        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mb-8">
          <span>30-Second Loop</span>
          <span aria-hidden="true">·</span>
          <span>Deterministic Echo Replay</span>
          <span aria-hidden="true">·</span>
          <span>6 Chambers</span>
        </div>

        {/* Primary Action Buttons */}
        <div className="w-full max-w-xs space-y-2.5">
          <button
            onClick={() => {
              sound.playSwitch();
              onStartGame();
            }}
            className="w-full py-3.5 px-6 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm tracking-wide rounded-xl shadow-lg shadow-sky-500/25 hover:shadow-sky-400/40 transition-all transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>ENTER THE LOOP</span>
          </button>

          <button
            onClick={onOpenHowToPlay}
            className="w-full py-2.5 px-4 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white font-medium text-xs rounded-xl border border-slate-800 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-sky-400" />
            <span>HOW TO PLAY</span>
          </button>

          <button
            onClick={onOpenLevelSelect}
            className="w-full py-2.5 px-4 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white font-medium text-xs rounded-xl border border-slate-800 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Grid className="w-4 h-4 text-amber-400" />
            <span>CHAMBER SELECT (1–6)</span>
          </button>

          <button
            onClick={onOpenCredits}
            className="w-full py-2 px-4 text-slate-400 hover:text-slate-300 text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Award className="w-3.5 h-3.5" />
            <span>CREDITS & SYSTEM DESIGN</span>
          </button>
        </div>
      </main>

      {/* Quiet Footer */}
      <footer className="w-full max-w-5xl flex items-center justify-between py-3 border-t border-slate-800/60 text-[11px] font-mono text-slate-500 z-10">
        <span>TIMELOOP · COMPETITION EDITION</span>
        <span className="text-slate-600">WASD / ARROWS TO MOVE · R TO RESET LOOP</span>
      </footer>

      {/* Atmospheric ambient glow backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-sky-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};
