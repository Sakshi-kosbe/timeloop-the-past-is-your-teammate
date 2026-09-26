import React from 'react';
import { FeedbackToast } from '../types/game';
import { Sparkles, Users, LockOpen, Clock, AlertTriangle, ShieldCheck, Terminal } from 'lucide-react';

interface FeedbackToasterProps {
  toasts: FeedbackToast[];
  currentStoryMessage: string | null;
}

export const FeedbackToaster: React.FC<FeedbackToasterProps> = ({ toasts, currentStoryMessage }) => {
  return (
    <div className="fixed top-14 right-4 z-40 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      {/* Cinematic Story Transmission Banner */}
      {currentStoryMessage && (
        <div className="animate-fade-in bg-slate-950/95 border-l-4 border-sky-400 border-y border-r border-slate-800 rounded-r-xl p-3 shadow-2xl backdrop-blur-md pointer-events-auto">
          <div className="flex items-center gap-2 mb-1">
            <Terminal className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-sky-400 font-bold">
              SYSTEM TRANSMISSION // LOG
            </span>
          </div>
          <p className="text-xs font-mono text-white font-semibold tracking-wide">
            "{currentStoryMessage}"
          </p>
        </div>
      )}

      {/* Action Event Toasts */}
      {toasts.map((toast) => {
        let icon = <Clock className="w-4 h-4 text-sky-400" />;
        let borderColor = 'border-sky-500/50';
        let bgGradient = 'bg-sky-950/90';

        if (toast.type === 'echo') {
          icon = <Users className="w-4 h-4 text-amber-400" />;
          borderColor = 'border-amber-500/50';
          bgGradient = 'bg-amber-950/90';
        } else if (toast.type === 'door') {
          icon = <LockOpen className="w-4 h-4 text-emerald-400" />;
          borderColor = 'border-emerald-500/50';
          bgGradient = 'bg-emerald-950/90';
        } else if (toast.type === 'sync') {
          icon = <Sparkles className="w-4 h-4 text-cyan-300" />;
          borderColor = 'border-cyan-400/60';
          bgGradient = 'bg-cyan-950/90';
        } else if (toast.type === 'paradox') {
          icon = <ShieldCheck className="w-4 h-4 text-purple-400" />;
          borderColor = 'border-purple-500/60';
          bgGradient = 'bg-purple-950/90';
        }

        return (
          <div
            key={toast.id}
            className={`flex items-start gap-2.5 p-2.5 rounded-xl border ${borderColor} ${bgGradient} text-white shadow-xl backdrop-blur-md animate-slide-left pointer-events-auto transition-all`}
          >
            <div className="mt-0.5 shrink-0">{icon}</div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold font-mono tracking-wide">
                {toast.title}
              </div>
              {toast.detail && (
                <div className="text-[11px] text-slate-300 truncate mt-0.5 font-sans">
                  {toast.detail}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
