import React, { useEffect, useState } from 'react';
import { Clock, Pause, Play, AlertCircle } from 'lucide-react';

interface ExamTimerProps {
  initialSeconds: number;
  onTimeUp: () => void;
  onTick?: (remaining: number) => void;
  isPaused?: boolean;
}

export const ExamTimer: React.FC<ExamTimerProps> = ({
  initialSeconds,
  onTimeUp,
  onTick,
  isPaused = false,
}) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [localPaused, setLocalPaused] = useState(isPaused);

  useEffect(() => {
    setSeconds(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (localPaused || seconds <= 0) return;

    const timer = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        const next = prev - 1;
        if (onTick) onTick(next);
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [localPaused, seconds, onTimeUp, onTick]);

  const minutes = Math.floor(seconds / 60);
  const remainingSecs = seconds % 60;
  const isUrgent = seconds < 300; // < 5 mins
  const isWarning = seconds < 600 && !isUrgent; // < 10 mins

  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(remainingSecs).padStart(2, '0')}`;

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono font-bold text-sm transition-colors ${
      isUrgent
        ? 'bg-red-50 border-red-300 text-red-600 animate-pulse'
        : isWarning
        ? 'bg-amber-50 border-amber-300 text-amber-700'
        : 'bg-slate-50 border-slate-200 text-slate-700'
    }`}>
      <Clock className={`w-4 h-4 ${isUrgent ? 'text-red-500' : 'text-slate-500'}`} />
      <span className="tracking-wider text-base">{formattedTime}</span>
      
      <button
        type="button"
        onClick={() => setLocalPaused(!localPaused)}
        title={localPaused ? '타이머 재개' : '타이머 일시정지'}
        className="p-1 hover:bg-slate-200 rounded text-slate-500 transition ml-1"
      >
        {localPaused ? <Play className="w-3.5 h-3.5 text-emerald-600" /> : <Pause className="w-3.5 h-3.5" />}
      </button>

      {isUrgent && (
        <span className="text-xs text-red-600 font-sans hidden sm:inline flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> 마감 임박
        </span>
      )}
    </div>
  );
};
