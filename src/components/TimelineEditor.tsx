import React from 'react';
import { EchoRecord } from '../types/game';
import { Sparkles, Trash2, ShieldCheck, AlertTriangle, Clock, Zap, Undo2, FastForward } from 'lucide-react';
import { sound } from '../utils/audio';

interface TimelineEditorProps {
  echoes: EchoRecord[];
  paradoxErasedEchoId: string | null;
  onToggleEraseEcho: (echoId: string) => void;
  onEraseAction: (echoId: string) => void;
  erasedActionEchoIds: string[];
  timelineOffsets: { [echoId: string]: number };
  onAdjustTimingOffset: (echoId: string, deltaSeconds: number) => void;
}

export const TimelineEditor: React.FC<TimelineEditorProps> = ({
  echoes,
  paradoxErasedEchoId,
  onToggleEraseEcho,
  onEraseAction,
  erasedActionEchoIds,
  timelineOffsets,
  onAdjustTimingOffset,
}) => {
  if (echoes.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-2 px-4 py-3 bg-purple-950/20 border border-purple-800/40 rounded-xl text-center shadow-lg">
        <div className="flex items-center justify-center gap-2 text-xs font-mono text-purple-300">
          <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
          <span>PARADOX SCRUBBER ARMED: Run Loop 1 to record the baseline timeline, then inspect and rewrite causality below.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-2 px-4 py-3 bg-slate-950/95 border-2 border-purple-600/70 rounded-xl shadow-2xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between pb-2 mb-3 border-b border-purple-900/50 gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-purple-900/50 border border-purple-400/50">
            <Zap className="w-4 h-4 text-purple-300 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-purple-300 font-mono">
              TEMPORAL PARADOX SCRUBBER // CAUSALITY MODIFIER
            </h3>
            <p className="text-[11px] text-slate-400">
              Chamber 6 Signature Twist: Rewrite or erase recorded actions to breach the deadlock.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-purple-900/30 border border-purple-700/40 rounded-lg text-[11px] font-mono text-purple-300">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
          <span>PARADOX ENGINE ONLINE</span>
        </div>
      </div>

      {/* Echo Timeline Tracks */}
      <div className="space-y-3">
        {echoes.map((echo) => {
          const isErased = paradoxErasedEchoId === echo.id;
          const isTrapErased = erasedActionEchoIds.includes(echo.id);
          const currentOffset = timelineOffsets[echo.id] || 0; // in seconds

          return (
            <div
              key={echo.id}
              className={`p-3 rounded-xl border transition-all ${
                isErased
                  ? 'bg-rose-950/20 border-rose-800/40 opacity-50'
                  : isTrapErased
                  ? 'bg-purple-950/40 border-purple-500 shadow-lg shadow-purple-950/50'
                  : 'bg-slate-900/90 border-slate-800'
              }`}
            >
              {/* Track Info Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-3">
                  <div
                    className="w-3.5 h-3.5 rounded-full shadow-md"
                    style={{ backgroundColor: echo.color }}
                  />
                  <div className="flex items-baseline gap-2 font-mono">
                    <span className="text-xs font-bold text-white">
                      Echo #{echo.loopNumber}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Duration: {(echo.frames.length / 60).toFixed(1)}s
                    </span>
                    {currentOffset !== 0 && (
                      <span className="text-[11px] font-bold text-sky-400">
                        ({currentOffset > 0 ? `+${currentOffset.toFixed(1)}s` : `${currentOffset.toFixed(1)}s`} Shift)
                      </span>
                    )}
                  </div>
                </div>

                {/* Primary Twist Actions: 1) Erase Action, 2) Timing Shift, 3) Delete Echo */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Twist Feature A: Select & Erase Specific Recorded Action */}
                  <button
                    onClick={() => {
                      sound.playParadoxGlitch();
                      onEraseAction(echo.id);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shadow-md cursor-pointer ${
                      isTrapErased
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400'
                        : 'bg-purple-900 hover:bg-purple-800 text-purple-100 border border-purple-500'
                    }`}
                    title="Erase the recorded Tripwire Sensor trigger so the Lockdown Barrier remains disarmed"
                  >
                    {isTrapErased ? (
                      <>
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-200" />
                        <span>Action Erased: Tripwire Disarmed</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
                        <span>Erase Action: Tripwire Sensor</span>
                      </>
                    )}
                  </button>

                  {/* Twist Feature B: Timeline Timing Shift Controls */}
                  <div className="flex items-center bg-slate-800/80 border border-slate-700 rounded-lg p-0.5">
                    <button
                      onClick={() => {
                        sound.playSwitch();
                        onAdjustTimingOffset(echo.id, -1.0);
                      }}
                      className="px-2 py-1 text-[11px] font-mono font-medium text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors cursor-pointer"
                      title="Shift Echo replay 1.0s earlier"
                    >
                      -1.0s
                    </button>
                    <span className="px-1 text-[10px] font-mono text-purple-300">Shift</span>
                    <button
                      onClick={() => {
                        sound.playSwitch();
                        onAdjustTimingOffset(echo.id, +1.0);
                      }}
                      className="px-2 py-1 text-[11px] font-mono font-medium text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors cursor-pointer"
                      title="Shift Echo replay 1.0s later"
                    >
                      +1.0s
                    </button>
                  </div>

                  {/* Twist Feature C: Erase / Restore Entire Echo */}
                  <button
                    onClick={() => {
                      sound.playParadoxGlitch();
                      onToggleEraseEcho(echo.id);
                    }}
                    className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                      isErased
                        ? 'bg-rose-800 text-white'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                    title="Purge or restore this entire echo timeline"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                    <span>{isErased ? 'Restore Echo' : 'Purge Echo'}</span>
                  </button>
                </div>
              </div>

              {/* Visual Multi-Track Timeline Ribbon */}
              <div className="relative mt-2 h-4 bg-slate-950 rounded-lg overflow-hidden border border-slate-800 p-0.5 flex items-center">
                {/* Background Grid Ticks */}
                <div className="absolute inset-0 flex justify-between px-2 pointer-events-none opacity-20">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="w-px h-full bg-slate-400" />
                  ))}
                </div>

                {/* Main recorded trace */}
                <div
                  className="h-full rounded transition-all relative flex items-center"
                  style={{
                    width: `${Math.min(100, (echo.frames.length / 1800) * 100)}%`,
                    backgroundColor: isErased ? '#991b1b' : echo.color,
                    opacity: isErased ? 0.3 : 0.85,
                  }}
                >
                  {/* Event Marker: Tripwire Sensor at ~25% */}
                  <div
                    className={`absolute w-3.5 h-3.5 -top-0.5 rounded-full border flex items-center justify-center text-[8px] font-bold ${
                      isTrapErased
                        ? 'bg-emerald-500 border-emerald-300 text-black line-through'
                        : 'bg-rose-600 border-rose-300 text-white animate-pulse'
                    }`}
                    style={{ left: '26%' }}
                    title={isTrapErased ? "Tripwire Sensor (Erased)" : "Tripwire Sensor (Active Trap)"}
                  >
                    !
                  </div>

                  {/* Event Marker: Relay Plate A at ~50% */}
                  <div
                    className="absolute w-3.5 h-3.5 -top-0.5 rounded-full bg-sky-500 border border-sky-200 text-black flex items-center justify-center text-[8px] font-bold shadow-sm"
                    style={{ left: '52%' }}
                    title="Relay Plate A (Held by Echo)"
                  >
                    A
                  </div>
                </div>
              </div>

              {/* Status readout */}
              <div className="mt-1.5 flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400">
                  Event Nodes: 03.5s [Tripwire] · 06.2s [Relay Plate A]
                </span>
                <span className={isTrapErased ? "text-emerald-400 font-semibold" : "text-amber-400"}>
                  {isTrapErased ? "✓ CAUSAL ANOMALY DISARMED — BARRIER OPEN" : "⚠ LOCKDOWN BARRIER TRIPPED"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
