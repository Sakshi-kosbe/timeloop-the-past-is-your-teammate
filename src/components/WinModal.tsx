import React from 'react';
import { ArrowRight, RotateCcw, CheckCircle2, Clock, Users, Zap } from 'lucide-react';
import { LevelConfig } from '../types/game';

interface WinModalProps {
  isOpen: boolean;
  level: LevelConfig;
  stats: {
    loops: number;
    timeElapsed: number;
    echoesCreated: number;
    paradoxActions: number;
  };
  onNextLevel: () => void;
  onReplayLevel: () => void;
}

export const WinModal: React.FC<WinModalProps> = ({
  isOpen,
  level,
  stats,
  onNextLevel,
  onReplayLevel,
}) => {
  if (!isOpen) return null;

  const minutes = Math.floor(stats.timeElapsed / 60);
  const seconds = stats.timeElapsed % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md p-6 bg-slate-900 border border-emerald-500/50 rounded-2xl shadow-2xl text-center">
        {/* Glowing Badge */}
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-emerald-950/80 border border-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-900/30">
          <CheckCircle2 className="w-8 h-8 text-emerald-400" />
        </div>

        {/* Title */}
        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-400">
          Temporal Anomaly Resolved
        </span>
        <h2 className="text-2xl font-extrabold text-white mt-1 tracking-tight font-mono">
          CHAMBER COMPLETE
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Chamber 0{level.id}: {level.title.replace(/^\d+\.\s*/, '')}
        </p>

        {/* Required Statistics Grid */}
        <div className="my-6 p-4 bg-slate-950 border border-slate-800 rounded-xl grid grid-cols-2 gap-3 text-left">
          {/* Loops Used */}
          <div className="p-2 bg-slate-900/60 rounded-lg border border-slate-800">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-0.5">
              <Users className="w-3.5 h-3.5 text-sky-400" />
              <span>Loops Used</span>
            </div>
            <div className="text-lg font-bold font-mono text-white tabular-nums">
              {stats.loops}
            </div>
          </div>

          {/* Time */}
          <div className="p-2 bg-slate-900/60 rounded-lg border border-slate-800">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-0.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Time</span>
            </div>
            <div className="text-lg font-bold font-mono text-amber-300 tabular-nums">
              {formattedTime}
            </div>
          </div>

          {/* Echoes Created */}
          <div className="p-2 bg-slate-900/60 rounded-lg border border-slate-800">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-0.5">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>Echoes Created</span>
            </div>
            <div className="text-lg font-bold font-mono text-white tabular-nums">
              {stats.echoesCreated}
            </div>
          </div>

          {/* Paradox Actions */}
          <div className="p-2 bg-slate-900/60 rounded-lg border border-slate-800">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-0.5">
              <Zap className="w-3.5 h-3.5 text-purple-400" />
              <span>Paradox Actions</span>
            </div>
            <div className="text-lg font-bold font-mono text-purple-300 tabular-nums">
              {stats.paradoxActions}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onReplayLevel}
            className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Replay Loop</span>
          </button>

          <button
            onClick={onNextLevel}
            className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition-all shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>NEXT CHAMBER</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
