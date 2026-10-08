import React, { useRef } from 'react';
import { Question, UserAnswerRecord } from '../types';
import { Bookmark, Flag, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { SymbolToolbar } from './SymbolToolbar';

interface QuestionCardProps {
  question: Question;
  userRecord: UserAnswerRecord;
  onUpdateAnswer: (answer: string) => void;
  onToggleFlag: () => void;
  onToggleBookmark: () => void;
  isBookmarked: boolean;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  fontSize: 'sm' | 'base' | 'lg';
  onChangeFontSize: (size: 'sm' | 'base' | 'lg') => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  userRecord,
  onUpdateAnswer,
  onToggleFlag,
  onToggleBookmark,
  isBookmarked,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  fontSize,
  onChangeFontSize,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Symbol insert at current cursor position
  const handleInsertSymbol = (symbol: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentValue = textarea.value;

    const newValue = currentValue.substring(0, start) + symbol + currentValue.substring(end);
    onUpdateAnswer(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + symbol.length, start + symbol.length);
    }, 0);
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'sm': return 'text-sm sm:text-base leading-relaxed';
      case 'lg': return 'text-base sm:text-xl leading-relaxed sm:leading-loose';
      default: return 'text-sm sm:text-lg leading-relaxed';
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col">
      {/* Question Header: Two tiers on mobile, single row on desktop */}
      <div className="bg-slate-50 border-b border-slate-200 px-3.5 sm:px-5 py-3 space-y-2 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
        {/* Badges */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 bg-slate-900 text-white font-mono font-bold text-[11px] sm:text-xs rounded-md shrink-0">
            문 {question.number}
          </span>

          <span className={`px-2 py-0.5 rounded-full text-[11px] sm:text-xs font-bold border shrink-0 ${
            question.category === '화재예방과 소화방법'
              ? 'bg-orange-50 border-orange-200 text-orange-700'
              : 'bg-blue-50 border-blue-200 text-blue-700'
          }`}>
            {question.category}
          </span>

          <span className="px-2 py-0.5 bg-slate-200/80 text-slate-700 text-[11px] sm:text-xs font-medium rounded-md shrink-0">
            {question.type}
          </span>
        </div>

        {/* Action Controls: font size, bookmark, review flag */}
        <div className="flex items-center justify-between sm:justify-end gap-1.5 pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-200/60">
          {/* Font size controller */}
          <div className="flex items-center border border-slate-200 rounded-md bg-white text-xs text-slate-600 overflow-hidden">
            <button
              type="button"
              onClick={() => onChangeFontSize('sm')}
              className={`px-2 py-1 cursor-pointer ${fontSize === 'sm' ? 'bg-slate-200 font-bold text-slate-900' : 'hover:bg-slate-100'}`}
              title="작은 글자"
            >
              가-
            </button>
            <button
              type="button"
              onClick={() => onChangeFontSize('base')}
              className={`px-2 py-1 border-x border-slate-200 cursor-pointer ${fontSize === 'base' ? 'bg-slate-200 font-bold text-slate-900' : 'hover:bg-slate-100'}`}
              title="보통 글자"
            >
              가
            </button>
            <button
              type="button"
              onClick={() => onChangeFontSize('lg')}
              className={`px-2 py-1 cursor-pointer ${fontSize === 'lg' ? 'bg-slate-200 font-bold text-slate-900' : 'hover:bg-slate-100'}`}
              title="큰 글자"
            >
              가+
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Bookmark Button */}
            <button
              type="button"
              onClick={onToggleBookmark}
              title={isBookmarked ? '북마크 해제' : '문제 북마크 추가'}
              className={`p-1.5 sm:px-2 sm:py-1 rounded-md border transition flex items-center gap-1 text-xs font-bold cursor-pointer ${
                isBookmarked
                  ? 'bg-amber-50 border-amber-300 text-amber-600'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline">북마크</span>
            </button>

            {/* Review Flag Button */}
            <button
              type="button"
              onClick={onToggleFlag}
              title={userRecord.isMarkedForReview ? '검토 표시 해제' : '나중에 다시 검토'}
              className={`p-1.5 sm:px-2 sm:py-1 rounded-md border transition flex items-center gap-1 text-xs font-bold cursor-pointer ${
                userRecord.isMarkedForReview
                  ? 'bg-blue-50 border-blue-300 text-blue-600'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Flag className={`w-3.5 h-3.5 ${userRecord.isMarkedForReview ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline">검토</span>
            </button>
          </div>
        </div>
      </div>

      {/* Question Body */}
      <div className="p-4 sm:p-6 border-b border-slate-100">
        <h2 className={`font-semibold text-slate-900 whitespace-pre-wrap break-words ${getFontSizeClass()}`}>
          {question.question}
        </h2>
      </div>

      {/* Answer Input Section */}
      <div className="p-3.5 sm:p-6 bg-slate-50/50 flex-1 flex flex-col gap-2.5 sm:gap-3">
        {/* Symbol Quick Insert Toolbar */}
        <SymbolToolbar onInsertSymbol={handleInsertSymbol} />

        <div className="flex items-center justify-between text-xs text-slate-600">
          <label htmlFor="user-answer-input" className="font-bold text-slate-700 flex items-center gap-1">
            <span>주관식 답안 입력란</span>
          </label>
          <div className="flex items-center gap-2 text-[11px] sm:text-xs">
            <span className="flex items-center gap-0.5 text-emerald-600">
              <Check className="w-3 h-3" /> 자동저장
            </span>
            <span className="font-mono text-slate-500">
              {(userRecord.userAnswer || '').length}자
            </span>
          </div>
        </div>

        <textarea
          id="user-answer-input"
          ref={textareaRef}
          value={userRecord.userAnswer || ''}
          onChange={(e) => onUpdateAnswer(e.target.value)}
          placeholder="이곳에 답안을 입력하세요.&#10;예)&#10;(1) B급 화재 / 황색&#10;(2) K급 화재"
          className="w-full h-36 sm:h-44 p-3 sm:p-4 text-xs sm:text-sm font-mono text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-hidden transition leading-relaxed resize-y placeholder:text-slate-400"
        />

        {/* Footer Navigation Buttons: Full width flex on mobile */}
        <div className="flex items-center justify-between gap-2 pt-2 sm:pt-3 border-t border-slate-200 mt-1">
          <button
            type="button"
            onClick={onPrev}
            disabled={!hasPrev}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 sm:px-4 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" /> 이전
          </button>

          <span className="text-xs font-bold font-mono text-slate-500 px-2 shrink-0">
            {question.number} / 20
          </span>

          <button
            type="button"
            onClick={onNext}
            disabled={!hasNext}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 sm:px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
          >
            다음 <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
