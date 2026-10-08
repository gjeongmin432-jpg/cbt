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
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">채점 분석</span>
          <div className="flex items-center gap-2">
            <div className="w-24 bg-slate-200 rounded-full h-2.5 overflow-hidden">
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
            <span className="text-xs font-bold font-mono text-slate-700">{similarity}% 일치</span>
          </div>

          {/* AI 추천 뱃지 */}
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium">
            {suggestion === 'correct' ? (
              <span className="bg-emerald-100 text-emerald-800 flex items-center gap-1 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                모범 답안과 높은 일치도 (정답 추천)
              </span>
            ) : suggestion === 'partial' ? (
              <span className="bg-amber-100 text-amber-800 flex items-center gap-1 px-2 py-0.5 rounded-full">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                핵심 키워드 포함 (부분 점수 검토)
              </span>
            ) : (
              <span className="bg-rose-100 text-rose-800 flex items-center gap-1 px-2 py-0.5 rounded-full">
                <XCircle className="w-3.5 h-3.5 text-rose-600" />
                일치도 낮음 (오답 검토)
              </span>
            )}
          </div>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center bg-slate-200 p-0.5 rounded-lg text-xs font-medium">
          <button
            type="button"
            onClick={() => setViewMode('diff')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition ${
              viewMode === 'diff' ? 'bg-white text-slate-800 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <SplitSquareVertical className="w-3.5 h-3.5" />
            Diff 정밀 분석
          </button>
          <button
            type="button"
            onClick={() => setViewMode('side-by-side')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition ${
              viewMode === 'side-by-side' ? 'bg-white text-slate-800 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            나란히 비교
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4">
        {viewMode === 'diff' ? (
          <div>
            <div className="mb-2 flex items-center gap-3 text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <span className="inline-block w-3 h-3 bg-emerald-100 border border-emerald-400 rounded-xs"></span>
                모범답안 보충/누락 키워드
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block w-3 h-3 bg-rose-100 border border-rose-400 rounded-xs"></span>
                내 답안의 불일치/추가 어구
              </span>
            </div>
            
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 font-mono text-sm leading-relaxed whitespace-pre-wrap break-words min-h-[80px]">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1.5">
                <span>내가 작성한 답안</span>
                <span className="text-[11px] text-slate-400">({userAnswer.trim().length}자)</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 font-mono text-sm leading-relaxed whitespace-pre-wrap break-words min-h-[120px] text-slate-800">
                {userAnswer.trim() ? userAnswer : <span className="text-slate-400 italic">미입력 답안</span>}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-emerald-700 mb-1.5">
                <span>공식 모범 답안</span>
                <span className="text-[11px] text-emerald-600">기준 답안</span>
              </div>
              <div className="bg-emerald-50/50 border border-emerald-200 rounded-lg p-3.5 font-mono text-sm leading-relaxed whitespace-pre-wrap break-words min-h-[120px] text-emerald-950 font-medium">
                {modelAnswer}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
