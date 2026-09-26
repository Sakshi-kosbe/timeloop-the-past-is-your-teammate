import React from 'react';
import { X, Award, Code2, Sparkles } from 'lucide-react';

interface CreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreditsModal: React.FC<CreditsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md p-6 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-4">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-sky-400">
            Development Record
          </span>
          <h2 className="text-xl font-bold text-white mt-1">TIMELOOP</h2>
          <p className="text-xs text-slate-400">The Past Is Your Teammate</p>
        </div>

        <div className="space-y-3 text-xs text-slate-300 leading-relaxed mb-6">
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
            <h4 className="font-semibold text-slate-200 mb-1">Game Innovation</h4>
            <p className="text-slate-400">
              Each 30-second loop captures full positional and interaction telemetry, manifesting prior runs as interactive holographic echoes that trigger physical pressure plates, switches, and timing gates.
            </p>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
            <h4 className="font-semibold text-slate-200 mb-1">Procedural Web Audio Engine</h4>
            <p className="text-slate-400">
              Real-time polyphonic audio synthesis for mechanical plate locks, door servos, rewind sub-sweeps, and harmonic chord victories using native Web Audio API oscillators.
            </p>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
            <h4 className="font-semibold text-slate-200 mb-1">Causality Paradox Scrubber</h4>
            <p className="text-slate-400">
              The Level 6 paradox mechanic enables timeline scrubbing and selective action erasure, introducing time modification into deterministic replay.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
};
