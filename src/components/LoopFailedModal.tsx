import React from 'react';
import { RotateCcw, FastForward, AlertTriangle, ArrowRight } from 'lucide-react';

interface LoopFailedModalProps {
  isOpen: boolean;
  reason: 'timeout' | 'hazard';
  currentLoop: number;
  onRetryLoop: () => void;
  onRestartChamber: () => void;
}

export const LoopFailedModal: React.FC<LoopFailedModalProps> = ({
  isOpen,
  reason,
  currentLoop,
  onRetryLoop,
  onRestartChamber,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md p-6 bg-slate-900 border border-amber-500/60 rounded-2xl shadow-2xl text-center">
        {/* Warning Icon */}
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-amber-950/80 border border-amber-500/80 flex items-center justify-center shadow-lg shadow-amber-900/30">
          <AlertTriangle className="w-8 h-8 text-amber-400" />
        </div>

        {/* Title */}
        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-400">
          Temporal Desynchronization
        </span>
        <h2 className="text-2xl font-extrabold text-white mt-1 tracking-tight font-mono">
          LOOP FAILED
        </h2>

        {/* Short Fun Narrative */}
        <p className="text-sm font-medium text-slate-300 mt-2 italic">
          "Your past is not quite ready."
        </p>
        <p className="text-xs text-slate-400 mt-1">
          {reason === 'timeout'
            ? 'The 30-second loop collapsed before reaching the Chrono Rift.'
            : 'A hazard collision fractured your timeline.'}
        </p>

        {/* Explanatory helper */}
        <div className="my-5 p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-left text-xs text-slate-400 space-y-1">
          <p>
            <strong className="text-sky-300">Next Loop:</strong> Keeps previous actions as Echoes so your progress carries forward.
          </p>
          <p>
            <strong className="text-slate-300">Restart Chamber:</strong> Clears all echoes and restarts Chamber from Loop 01.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onRestartChamber}
            className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESTART CHAMBER</span>
          </button>

          <button
            onClick={onRetryLoop}
            className="flex-1 py-2.5 px-4 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-xl transition-all shadow-lg shadow-sky-900/30 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>RETRY LOOP</span>
          </button>
        </div>
      </div>
    </div>
  );
};
