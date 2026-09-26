import React from 'react';
import { X, CheckCircle, ChevronRight, Lock } from 'lucide-react';
import { LEVELS } from '../levels/levelData';

interface LevelSelectModalProps {
  isOpen: boolean;
  currentLevelId: number;
  completedLevelIds: number[];
  onSelectLevel: (levelId: number) => void;
  onClose: () => void;
}

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  isOpen,
  currentLevelId,
  completedLevelIds,
  onSelectLevel,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl p-6 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-sky-400">
            Chamber Navigation
          </span>
          <h2 className="text-2xl font-bold text-white mt-1">Select Chamber</h2>
          <p className="text-xs text-slate-400 mt-1">
            Explore and test all 6 temporal puzzle chambers and their mechanics.
          </p>
        </div>

        {/* Level List Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {LEVELS.map((lvl) => {
            const isCompleted = completedLevelIds.includes(lvl.id);
            const isCurrent = currentLevelId === lvl.id;
            const isParadox = lvl.isParadoxLevel;

            return (
              <button
                key={lvl.id}
                onClick={() => {
                  onSelectLevel(lvl.id);
                  onClose();
                }}
                className={`flex flex-col text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-sky-950/60 border-sky-500 shadow-md ring-1 ring-sky-500/50'
                    : isParadox
                    ? 'bg-purple-950/20 border-purple-800/60 hover:bg-purple-950/40 hover:border-purple-600'
                    : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-sky-400">
                      CHAMBER 0{lvl.id}
                    </span>
                    {isParadox && (
                      <span className="text-[10px] font-mono text-purple-400 font-semibold uppercase">
                        · Paradox Twist
                      </span>
                    )}
                  </div>
                  {isCompleted && (
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  )}
                </div>

                <div className="text-sm font-semibold text-slate-100">
                  {lvl.title.replace(/^\d+\.\s*/, '')}
                </div>
                <div className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                  {lvl.subtitle}
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>Target: ~{lvl.idealLoops} Loops</span>
                  <span className="flex items-center gap-0.5 text-sky-400 hover:underline">
                    Deploy <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
