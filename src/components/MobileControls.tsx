import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, FastForward, Hand } from 'lucide-react';

interface MobileControlsProps {
  onDirectionPress: (dir: 'up' | 'down' | 'left' | 'right', active: boolean) => void;
  onResetLoop: () => void;
  onInteract: () => void;
}

export const MobileControls: React.FC<MobileControlsProps> = ({
  onDirectionPress,
  onResetLoop,
  onInteract,
}) => {
  return (
    <div className="md:hidden w-full max-w-md mx-auto px-4 py-2 flex items-center justify-between select-none">
      {/* Virtual D-Pad */}
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Up */}
        <button
          onTouchStart={() => onDirectionPress('up', true)}
          onTouchEnd={() => onDirectionPress('up', false)}
          onTouchCancel={() => onDirectionPress('up', false)}
          onMouseDown={() => onDirectionPress('up', true)}
          onMouseUp={() => onDirectionPress('up', false)}
          className="absolute top-0 left-10 w-11 h-11 bg-slate-800/90 active:bg-sky-600 border border-slate-700 active:border-sky-400 rounded-lg flex items-center justify-center text-slate-300 active:text-white transition-all shadow-md touch-manipulation"
          aria-label="Move Up"
        >
          <ArrowUp className="w-5 h-5" />
        </button>

        {/* Left */}
        <button
          onTouchStart={() => onDirectionPress('left', true)}
          onTouchEnd={() => onDirectionPress('left', false)}
          onTouchCancel={() => onDirectionPress('left', false)}
          onMouseDown={() => onDirectionPress('left', true)}
          onMouseUp={() => onDirectionPress('left', false)}
          className="absolute top-10 left-0 w-11 h-11 bg-slate-800/90 active:bg-sky-600 border border-slate-700 active:border-sky-400 rounded-lg flex items-center justify-center text-slate-300 active:text-white transition-all shadow-md touch-manipulation"
          aria-label="Move Left"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Right */}
        <button
          onTouchStart={() => onDirectionPress('right', true)}
          onTouchEnd={() => onDirectionPress('right', false)}
          onTouchCancel={() => onDirectionPress('right', false)}
          onMouseDown={() => onDirectionPress('right', true)}
          onMouseUp={() => onDirectionPress('right', false)}
          className="absolute top-10 right-0 w-11 h-11 bg-slate-800/90 active:bg-sky-600 border border-slate-700 active:border-sky-400 rounded-lg flex items-center justify-center text-slate-300 active:text-white transition-all shadow-md touch-manipulation"
          aria-label="Move Right"
        >
          <ArrowRight className="w-5 h-5" />
        </button>

        {/* Down */}
        <button
          onTouchStart={() => onDirectionPress('down', true)}
          onTouchEnd={() => onDirectionPress('down', false)}
          onTouchCancel={() => onDirectionPress('down', false)}
          onMouseDown={() => onDirectionPress('down', true)}
          onMouseUp={() => onDirectionPress('down', false)}
          className="absolute bottom-0 left-10 w-11 h-11 bg-slate-800/90 active:bg-sky-600 border border-slate-700 active:border-sky-400 rounded-lg flex items-center justify-center text-slate-300 active:text-white transition-all shadow-md touch-manipulation"
          aria-label="Move Down"
        >
          <ArrowDown className="w-5 h-5" />
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2.5">
        <button
          onClick={onResetLoop}
          className="px-4 py-2.5 bg-sky-950/90 active:bg-sky-800 border border-sky-600/50 rounded-xl flex items-center gap-2 text-sky-200 text-xs font-semibold shadow-md active:scale-95 touch-manipulation"
        >
          <FastForward className="w-4 h-4 text-sky-400" />
          <span>Next Loop (R)</span>
        </button>

        <button
          onClick={onInteract}
          className="px-4 py-2.5 bg-slate-800 active:bg-slate-700 border border-slate-700 rounded-xl flex items-center gap-2 text-slate-200 text-xs font-semibold shadow-md active:scale-95 touch-manipulation"
        >
          <Hand className="w-4 h-4 text-emerald-400" />
          <span>Interact</span>
        </button>
      </div>
    </div>
  );
};
