import React, { useState } from 'react';
import { SYMBOL_GROUPS } from '../utils/symbols';
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

interface SymbolToolbarProps {
  onInsertSymbol: (symbol: string) => void;
}

export const SymbolToolbar: React.FC<SymbolToolbarProps> = ({ onInsertSymbol }) => {
  const [activeGroupIndex, setActiveGroupIndex] = useState<number>(0);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs select-none">
      <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-slate-200">
        <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-orange-500" />
          <span>특수기호 / 화학식 퀵 인서트</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {SYMBOL_GROUPS.map((g, idx) => (
              <button
                key={g.name}
                type="button"
                onClick={() => {
                  setActiveGroupIndex(idx);
                  setIsExpanded(true);
                }}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
                  activeGroupIndex === idx && isExpanded
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                {g.name}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-200"
            title={isExpanded ? '접기' : '펼치기'}
          >
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {SYMBOL_GROUPS[activeGroupIndex].items.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => onInsertSymbol(item.value)}
              title={item.tooltip || item.label}
              className="px-2.5 py-1 bg-white hover:bg-orange-50 hover:border-orange-300 border border-slate-200 rounded text-slate-700 hover:text-orange-600 font-mono text-xs transition shadow-2xs active:scale-95 flex items-center gap-1"
            >
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
