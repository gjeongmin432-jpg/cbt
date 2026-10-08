import React, { useState } from 'react';
import { computeWordDiff, calculateSimilarity, suggestGrade } from '../utils/diffHelper';
import { CheckCircle2, AlertTriangle, XCircle, SplitSquareVertical, Columns } from 'lucide-react';

interface DiffViewerProps {
  userAnswer: string;
  modelAnswer: string;
}

export const DiffViewer: React.FC<DiffViewerProps> = ({ userAnswer, modelAnswer }) => {
  const [viewMode, setViewMode] = useState<'diff' | 'side-by-side'>('diff');

  const similarity = calculateSimilarity(userAnswer, modelAnswer);
  const suggestion = suggestGrade(userAnswer, modelAnswer);
  const diffParts = computeWordDiff(userAnswer, modelAnswer);

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
      {/* Top Bar: Similarity & Recommendation */}
      <div className="bg-slate-50 border-b border-slate-200 p-3 sm:px-4 sm:py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0">채점 분석</span>
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="w-16 sm:w-20 bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  similarity >= 70
                    ? 'bg-emerald-500'
                    : similarity >= 35
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${similarity}%` }}
              />
            </div>
            <span className="text-[11px] font-bold font-mono text-slate-700">{similarity}%</span>
          </div>

          {/* AI 추천 뱃지 */}
          <div className="inline-flex items-center text-[10px] sm:text-xs font-semibold">
            {suggestion === 'correct' ? (
              <span className="bg-emerald-100 text-emerald-800 flex items-center gap-1 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                정답 추천
              </span>
            ) : suggestion === 'partial' ? (
              <span className="bg-amber-100 text-amber-800 flex items-center gap-1 px-2 py-0.5 rounded-full">
                <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                부분점수 검토
              </span>
            ) : (
              <span className="bg-rose-100 text-rose-800 flex items-center gap-1 px-2 py-0.5 rounded-full">
                <XCircle className="w-3 h-3 text-rose-600 shrink-0" />
                오답 검토
              </span>
            )}
          </div>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center bg-slate-200 p-0.5 rounded-lg text-[11px] font-semibold self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setViewMode('diff')}
            className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded transition cursor-pointer ${
              viewMode === 'diff' ? 'bg-white text-slate-800 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <SplitSquareVertical className="w-3 h-3" />
            Diff 분석
          </button>
          <button
            type="button"
            onClick={() => setViewMode('side-by-side')}
            className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded transition cursor-pointer ${
              viewMode === 'side-by-side' ? 'bg-white text-slate-800 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Columns className="w-3 h-3" />
            나란히 비교
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-3 sm:p-4">
        {viewMode === 'diff' ? (
          <div>
            <div className="mb-2 flex items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] text-slate-500 flex-wrap">
              <span className="flex items-center gap-1">
                <span className="inline-block w-2.5 h-2.5 bg-emerald-100 border border-emerald-400 rounded-xs"></span>
                모범답안 보충 키워드
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block w-2.5 h-2.5 bg-rose-100 border border-rose-400 rounded-xs"></span>
                내 답안 불일치 어구
              </span>
            </div>
            
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 sm:p-3.5 font-mono text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words min-h-[70px]">
              {diffParts.length === 0 ? (
                <span className="text-slate-400 italic">답안이 입력되지 않았습니다.</span>
              ) : (
                diffParts.map((part, index) => {
                  if (part.added) {
                    return (
                      <span
                        key={index}
                        className="bg-emerald-100 text-emerald-900 font-semibold px-1 py-0.5 rounded border border-emerald-300 mx-0.5 shadow-2xs"
                        title="모범 답안에 포함된 내용"
                      >
                        {part.value}
                      </span>
                    );
                  }
                  if (part.removed) {
                    return (
                      <span
                        key={index}
                        className="bg-rose-100 text-rose-800 line-through px-1 py-0.5 rounded border border-rose-300 mx-0.5 opacity-75"
                        title="모범 답안과 불일치하는 내 답안"
                      >
                        {part.value}
                      </span>
                    );
                  }
                  return <span key={index} className="text-slate-800">{part.value}</span>;
                })
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1">
                <span>내가 작성한 답안</span>
                <span className="text-[10px] text-slate-400">({userAnswer.trim().length}자)</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 font-mono text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words min-h-[90px] text-slate-800">
                {userAnswer.trim() ? userAnswer : <span className="text-slate-400 italic">미입력 답안</span>}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-emerald-700 mb-1">
                <span>공식 모범 답안</span>
                <span className="text-[10px] text-emerald-600">기준</span>
              </div>
              <div className="bg-emerald-50/50 border border-emerald-200 rounded-lg p-3 font-mono text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words min-h-[90px] text-emerald-950 font-medium">
                {modelAnswer}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
