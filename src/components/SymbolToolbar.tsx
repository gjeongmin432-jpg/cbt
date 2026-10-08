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
      <div className="flex items-center justify-between gap-1 mb-1.5 pb-1 border-b border-slate-200">
        <div className="flex items-center gap-1 text-slate-700 font-bold shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-orange-500 shrink-0" />
          <span className="text-[11px] sm:text-xs">기호 퀵 인서트</span>
        </div>

        <div className="flex items-center gap-1.5 overflow-hidden">
          {/* Scrollable Group Tabs on small mobile screens */}
          <div className="flex gap-1 overflow-x-auto py-0.5 no-scrollbar">
            {SYMBOL_GROUPS.map((g, idx) => (
              <button
                key={g.name}
                type="button"
                onClick={() => {
                  setActiveGroupIndex(idx);
                  setIsExpanded(true);
                }}
                className={`px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-semibold whitespace-nowrap transition cursor-pointer shrink-0 ${
                  activeGroupIndex === idx && isExpanded
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'text-slate-600 bg-white border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {g.name}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-200 shrink-0 cursor-pointer"
            title={isExpanded ? '접기' : '펼치기'}
          >
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="flex flex-wrap gap-1 sm:gap-1.5 pt-0.5 max-h-24 overflow-y-auto">
          {SYMBOL_GROUPS[activeGroupIndex].items.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => onInsertSymbol(item.value)}
              title={item.tooltip || item.label}
              className="px-2 sm:px-2.5 py-1 bg-white hover:bg-orange-50 hover:border-orange-300 border border-slate-200 rounded text-slate-700 hover:text-orange-600 font-mono text-xs transition active:scale-95 flex items-center gap-1 cursor-pointer shrink-0"
            >
              <span className="font-medium text-[11px] sm:text-xs">{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
