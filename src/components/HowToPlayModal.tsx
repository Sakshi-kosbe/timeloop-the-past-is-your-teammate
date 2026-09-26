import React from 'react';
import { X, Play, Clock, Users, ShieldAlert, Cpu } from 'lucide-react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl p-6 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          aria-label="Close rules"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-sky-400">
            Temporal Operations Manual
          </span>
          <h2 className="text-2xl font-bold text-white mt-1">
            How To Play TIMELOOP
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            The fundamental law of this facility: <strong className="text-slate-200">The past is your teammate.</strong>
          </p>
        </div>

        {/* 3 Core Rules */}
        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-3 p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl">
            <Clock className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-slate-200">1. Every Loop Records Your Actions</h3>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                You have a 30-second loop. Every step and action you take is accurately logged. When the timer reaches zero—or when you press <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-sky-300 font-mono text-[10px]">R</kbd>—the loop resets.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl">
            <Users className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-slate-200">2. Past Selves Become Holographic Echoes</h3>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                A ghost echo appears and replays your previous movements with pinpoint precision. Each subsequent loop introduces another previous self alongside you.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl">
            <Cpu className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-slate-200">3. Cooperate Across Time to Solve Puzzles</h3>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                Pressure plates only remain open while someone is standing on them. Stand on a plate in Loop 1, let your Echo hold it in Loop 2, and sprint through the open blast doors!
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 bg-slate-950/70 border border-purple-900/40 rounded-xl">
            <ShieldAlert className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-slate-200">4. The Paradox Modifier (Level 6 Twist)</h3>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                In advanced paradox chambers, you can inspect previous echo timelines and erase or rewrite a single critical action to bypass fatal timeline locks.
              </p>
            </div>
          </div>
        </div>

        {/* Keyboard Controls Summary */}
        <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/60 mb-6">
          <h4 className="text-xs font-mono font-semibold uppercase text-slate-300 mb-2">Controls</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span>Move:</span>
              <span className="font-mono text-slate-200 font-semibold">WASD / Arrow Keys</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Fast Loop Reset:</span>
              <span className="font-mono text-sky-400 font-semibold">R Key</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Interact / Flip:</span>
              <span className="font-mono text-slate-200 font-semibold">Space / E / Step-on</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Touch Controls:</span>
              <span className="font-mono text-slate-200 font-semibold">On-Screen D-Pad</span>
            </div>
          </div>
        </div>

        {/* Close CTA */}
        <button
          onClick={onClose}
          className="w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-500 text-white font-medium text-sm rounded-xl transition-all shadow-lg shadow-sky-900/30 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Understood · Enter Chamber</span>
        </button>
      </div>
    </div>
  );
};
