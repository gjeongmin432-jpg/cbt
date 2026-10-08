import React, { useState } from 'react';
import { GradeStatus, Question, UserAnswerRecord } from '../types';
import { DiffViewer } from './DiffViewer';
import { Check, X, AlertTriangle, Bookmark, BookOpen, Edit3, Save } from 'lucide-react';
import { saveStoredMemo } from '../utils/storage';

interface SelfGradingCardProps {
  question: Question;
  userRecord: UserAnswerRecord;
  onGradeChange: (status: GradeStatus, score: number) => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}

export const SelfGradingCard: React.FC<SelfGradingCardProps> = ({
  question,
  userRecord,
  onGradeChange,
  isBookmarked,
  onToggleBookmark,
}) => {
  const [memo, setMemo] = useState<string>(userRecord.userMemo || '');
  const [isMemoOpen, setIsMemoOpen] = useState<boolean>(!!userRecord.userMemo);
  const [memoSaved, setMemoSaved] = useState<boolean>(false);

  const handleSaveMemo = () => {
    saveStoredMemo(question.id, memo);
    setMemoSaved(true);
    setTimeout(() => setMemoSaved(false), 2000);
  };

  const currentScore = userRecord.score ?? (
    userRecord.gradeStatus === 'correct' ? 5 :
    userRecord.gradeStatus === 'partial' ? 3 : 0
  );

  return (
    <div className={`bg-white border rounded-xl shadow-xs overflow-hidden transition-all mb-4 sm:mb-6 ${
      userRecord.gradeStatus === 'correct'
        ? 'border-emerald-300 ring-1 ring-emerald-200'
        : userRecord.gradeStatus === 'incorrect'
        ? 'border-rose-300 ring-1 ring-rose-200'
        : userRecord.gradeStatus === 'partial'
        ? 'border-amber-300 ring-1 ring-amber-200'
        : 'border-slate-200'
    }`}>
      {/* Header */}
      <div className="bg-slate-50 border-b border-slate-200 px-3.5 sm:px-5 py-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap truncate">
          <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 bg-slate-900 text-white font-mono font-bold text-[11px] sm:text-xs rounded-md shrink-0">
            문 {question.number}
          </span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold border shrink-0 ${
            question.category === '화재예방과 소화방법'
              ? 'bg-orange-50 border-orange-200 text-orange-700'
              : 'bg-blue-50 border-blue-200 text-blue-700'
          }`}>
            {question.category}
          </span>
          <span className="px-1.5 py-0.5 bg-slate-200/80 text-slate-700 text-[10px] sm:text-xs font-medium rounded shrink-0">
            {question.type}
          </span>
        </div>

        {/* Current Grade Badge & Bookmark */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="font-mono text-[11px] sm:text-xs font-bold px-2 sm:px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-700 shrink-0">
            <span className="text-orange-600 font-bold">{currentScore}</span>/5점
          </div>

          <button
            type="button"
            onClick={onToggleBookmark}
            className={`p-1 sm:p-1.5 rounded border text-xs font-medium flex items-center transition cursor-pointer ${
              isBookmarked
                ? 'bg-amber-50 border-amber-300 text-amber-600'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
            title="북마크"
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Question Text */}
      <div className="p-4 sm:p-5 border-b border-slate-100 bg-white">
        <h3 className="font-semibold text-slate-900 whitespace-pre-wrap leading-relaxed text-xs sm:text-base break-keep">
          {question.question}
        </h3>
      </div>

      {/* Diff Viewer */}
      <div className="p-3 sm:p-5 border-b border-slate-100 bg-slate-50/30">
        <DiffViewer
          userAnswer={userRecord.userAnswer || ''}
          modelAnswer={question.modelAnswer}
        />
      </div>

      {/* Official Explanation (if exists) */}
      {question.explanation && (
        <div className="p-3.5 sm:p-5 border-b border-slate-100 bg-blue-50/40">
          <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900 mb-1.5">
            <BookOpen className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>핵심 해설 및 관련 법령</span>
          </div>
          <div className="text-xs text-blue-950 font-sans leading-relaxed whitespace-pre-wrap break-keep bg-white/80 p-3 rounded-lg border border-blue-200">
            {question.explanation}
          </div>
        </div>
      )}

      {/* User Memo Note */}
      {isMemoOpen && (
        <div className="p-3 sm:p-4 border-b border-slate-100 bg-amber-50/30">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] sm:text-xs font-bold text-amber-900 flex items-center gap-1">
              <Edit3 className="w-3.5 h-3.5" /> 나만의 오답 노트 / 암기 메모
            </span>
            {memoSaved && (
              <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                <Check className="w-3 h-3" /> 저장됨
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="틀린 이유나 암기 포인트를 적어두세요..."
              className="w-full h-16 p-2 text-xs font-mono bg-white border border-amber-200 rounded-md focus:ring-2 focus:ring-amber-500 outline-hidden"
            />
            <button
              type="button"
              onClick={handleSaveMemo}
              className="px-3 bg-amber-600 text-white rounded-md text-xs font-bold hover:bg-amber-700 flex flex-col items-center justify-center gap-1 shrink-0 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>저장</span>
            </button>
          </div>
        </div>
      )}

      {/* Grading Controls: Responsive Layout */}
      <div className="p-3 sm:p-4 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <button
          type="button"
          onClick={() => setIsMemoOpen(!isMemoOpen)}
          className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1 self-start cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>{isMemoOpen ? '메모 접기' : '+ 오답 메모'}</span>
        </button>

        {/* 3-State Grading Buttons (3-column grid on mobile) */}
        <div className="grid grid-cols-3 gap-1.5 sm:flex sm:items-center sm:gap-2">
          {/* Correct */}
          <button
            type="button"
            onClick={() => onGradeChange('correct', 5)}
            className={`flex items-center justify-center gap-1 py-2 sm:px-3 rounded-lg text-[11px] sm:text-xs font-bold transition shadow-2xs cursor-pointer ${
              userRecord.gradeStatus === 'correct'
                ? 'bg-emerald-600 text-white ring-2 ring-emerald-600 ring-offset-1'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
            }`}
          >
            <Check className="w-3.5 h-3.5 shrink-0" />
            <span>정답 (5)</span>
          </button>

          {/* Partial */}
          <button
            type="button"
            onClick={() => onGradeChange('partial', 3)}
            className={`flex items-center justify-center gap-1 py-2 sm:px-3 rounded-lg text-[11px] sm:text-xs font-bold transition shadow-2xs cursor-pointer ${
              userRecord.gradeStatus === 'partial'
                ? 'bg-amber-600 text-white ring-2 ring-amber-600 ring-offset-1'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-amber-50 hover:text-amber-700'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>부분 (3)</span>
          </button>

          {/* Incorrect */}
          <button
            type="button"
            onClick={() => onGradeChange('incorrect', 0)}
            className={`flex items-center justify-center gap-1 py-2 sm:px-3 rounded-lg text-[11px] sm:text-xs font-bold transition shadow-2xs cursor-pointer ${
              userRecord.gradeStatus === 'incorrect'
                ? 'bg-rose-600 text-white ring-2 ring-rose-600 ring-offset-1'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-rose-50 hover:text-rose-700'
            }`}
          >
            <X className="w-3.5 h-3.5 shrink-0" />
            <span>오답 (0)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
