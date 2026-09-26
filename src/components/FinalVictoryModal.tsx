import React, { useEffect, useState } from 'react';
import { RotateCcw, Sparkles, Home, Layers, Clock, Users, Zap, CheckCircle2 } from 'lucide-react';
import { sound } from '../utils/audio';

interface FinalVictoryModalProps {
  isOpen: boolean;
  totalLoops: number;
  totalTime: number;
  totalEchoes: number;
  completedLevelsCount: number;
  paradoxCount: number;
  onPlayAgain: () => void;
  onReturnHome: () => void;
}

export const FinalVictoryModal: React.FC<FinalVictoryModalProps> = ({
  isOpen,
  totalLoops,
  totalTime,
  totalEchoes,
  completedLevelsCount,
  paradoxCount,
  onPlayAgain,
  onReturnHome,
}) => {
  const [showDoubt, setShowDoubt] = useState(false);

  useEffect(() => {
    if (isOpen) {
      sound.playFinalVictory();
      const timer = setTimeout(() => {
        setShowDoubt(true);
      }, 1800);
      return () => clearTimeout(timer);
    } else {
      setShowDoubt(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const minutes = Math.floor(totalTime / 60);
  const seconds = totalTime % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg animate-fade-in">
      <div className="relative w-full max-w-lg p-8 bg-slate-900 border border-sky-400/50 rounded-2xl shadow-2xl text-center">
        {/* Floating Chrono Icon */}
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-sky-950 border border-sky-400 flex items-center justify-center shadow-lg shadow-sky-500/25">
          <Sparkles className="w-8 h-8 text-sky-300 animate-pulse" />
        </div>

        {/* Major Victory Header */}
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-sky-400">
          Causality Continuum Stabilized
        </span>
        <h2 className="text-3xl font-extrabold text-white mt-1 tracking-tight font-mono">
          TIMELOOP COMPLETE
        </h2>

        {/* The Two-Stage Narrative Line from User Prompt */}
        <div className="my-4 py-3 px-4 bg-slate-950/80 border border-slate-800 rounded-xl">
          <div className="text-base font-bold text-sky-300 font-mono tracking-wide">
            YOU ESCAPED THE LOOP.
          </div>
          <div
            className={`text-sm font-semibold text-rose-400/90 font-mono italic mt-1.5 transition-all duration-1000 ${
              showDoubt ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          >
            ...OR DID YOU?
          </div>
          <p className="text-xs text-slate-400 mt-2 italic leading-relaxed">
            "Every echo you left behind still repeats its movements inside the facility. Some say they are waiting for you to loop back."
          </p>
        </div>

        {/* Required Final Statistics */}
        <div className="my-5 p-4 bg-slate-950 border border-slate-800 rounded-xl grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
          {/* Total Loops */}
          <div className="p-2 bg-slate-900/60 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 block mb-0.5">Total Loops</span>
            <span className="text-lg font-bold font-mono text-white tabular-nums">
              {totalLoops}
            </span>
          </div>

          {/* Total Time */}
          <div className="p-2 bg-slate-900/60 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 block mb-0.5">Total Time</span>
            <span className="text-lg font-bold font-mono text-amber-300 tabular-nums">
              {formattedTime}
            </span>
          </div>

          {/* Echoes Created */}
          <div className="p-2 bg-slate-900/60 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 block mb-0.5">Echoes Created</span>
            <span className="text-lg font-bold font-mono text-emerald-300 tabular-nums">
              {totalEchoes}
            </span>
          </div>

          {/* Levels Completed */}
          <div className="p-2 bg-slate-900/60 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 block mb-0.5">Levels Completed</span>
            <span className="text-lg font-bold font-mono text-purple-300 tabular-nums">
              {completedLevelsCount} / 6
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onReturnHome}
            className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Main Menu</span>
          </button>

          <button
            onClick={onPlayAgain}
            className="flex-1 py-3 px-4 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-xl transition-all shadow-lg shadow-sky-900/30 flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Again</span>
          </button>
        </div>
      </div>
    </div>
  );
};
