import React, { useRef } from 'react';
import { Question, UserAnswerRecord } from '../types';
import { Bookmark, Flag, Sparkles, ChevronLeft, ChevronRight, Check } from 'lucide-react';
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

    // restore cursor
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + symbol.length, start + symbol.length);
    }, 0);
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'sm': return 'text-sm leading-relaxed';
      case 'lg': return 'text-lg leading-loose';
      default: return 'text-base leading-relaxed';
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col">
      {/* Question Header */}
      <div className="bg-slate-50 border-b border-slate-200 px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="px-2.5 py-1 bg-slate-800 text-white font-mono font-bold text-xs rounded-md">
            문 {question.number}
          </span>

          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
            question.category === '화재예방과 소화방법'
              ? 'bg-orange-50 border-orange-200 text-orange-700'
              : 'bg-blue-50 border-blue-200 text-blue-700'
          }`}>
            {question.category}
          </span>

          <span className="px-2 py-0.5 bg-slate-200/80 text-slate-700 text-xs font-medium rounded-md">
            {question.type}
          </span>

          <span className="text-xs text-slate-400 font-mono hidden sm:inline">
            (제{question.round}회 기출유형)
          </span>
        </div>

        {/* Action Controls: font size, bookmark, review flag */}
        <div className="flex items-center gap-2">
          {/* Font size controller */}
          <div className="flex items-center border border-slate-200 rounded-md bg-white text-xs text-slate-600 overflow-hidden mr-1">
            <button
              type="button"
              onClick={() => onChangeFontSize('sm')}
              className={`px-2 py-1 ${fontSize === 'sm' ? 'bg-slate-200 font-bold text-slate-900' : 'hover:bg-slate-100'}`}
              title="작은 글자"
            >
              가-
            </button>
            <button
              type="button"
              onClick={() => onChangeFontSize('base')}
              className={`px-2 py-1 border-x border-slate-200 ${fontSize === 'base' ? 'bg-slate-200 font-bold text-slate-900' : 'hover:bg-slate-100'}`}
              title="보통 글자"
            >
              가
            </button>
            <button
              type="button"
              onClick={() => onChangeFontSize('lg')}
              className={`px-2 py-1 ${fontSize === 'lg' ? 'bg-slate-200 font-bold text-slate-900' : 'hover:bg-slate-100'}`}
              title="큰 글자"
            >
              가+
            </button>
          </div>

          {/* Bookmark Button */}
          <button
            type="button"
            onClick={onToggleBookmark}
            title={isBookmarked ? '북마크 해제' : '문제 북마크 추가'}
            className={`p-1.5 rounded-md border transition flex items-center gap-1 text-xs font-medium ${
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
            className={`p-1.5 rounded-md border transition flex items-center gap-1 text-xs font-medium ${
              userRecord.isMarkedForReview
                ? 'bg-blue-50 border-blue-300 text-blue-600'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Flag className={`w-3.5 h-3.5 ${userRecord.isMarkedForReview ? 'fill-current' : ''}`} />
            <span className="hidden sm:inline">검토필요</span>
          </button>
        </div>
      </div>

      {/* Question Body */}
      <div className="p-6 border-b border-slate-100">
        <h2 className={`font-semibold text-slate-900 whitespace-pre-wrap break-words ${getFontSizeClass()}`}>
          {question.question}
        </h2>
      </div>

      {/* Answer Input Section */}
      <div className="p-6 bg-slate-50/50 flex-1 flex flex-col gap-3">
        {/* Symbol Quick Insert Toolbar */}
        <SymbolToolbar onInsertSymbol={handleInsertSymbol} />

        <div className="flex items-center justify-between text-xs text-slate-600">
          <label htmlFor="user-answer-input" className="font-semibold text-slate-700 flex items-center gap-1.5">
            <span>주관식 답안 작성란</span>
            <span className="text-[11px] text-slate-400 font-normal">
              (실제 시험과 동일하게 풀이과정 및 최종 답안을 기재하세요)
            </span>
          </label>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-emerald-600">
              <Check className="w-3 h-3" /> 자동저장됨
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
          placeholder="이곳에 답안을 입력하세요.&#10;예)&#10;(1) B급 화재 / 황색&#10;(2) K급 화재&#10;&#10;* 계산 문제의 경우 [풀이과정]과 [답]을 나누어 상세히 작성하세요."
          className="w-full h-44 p-4 text-sm font-mono text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-hidden transition leading-relaxed resize-y placeholder:text-slate-400"
        />

        {/* Footer Navigation Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200 mt-2">
          <button
            type="button"
            onClick={onPrev}
            disabled={!hasPrev}
            className="flex items-center gap-1.5 px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft className="w-4 h-4" /> 이전 문제
          </button>

          <span className="text-xs font-medium text-slate-500">
            문제 {question.number} / 20
          </span>

          <button
            type="button"
            onClick={onNext}
            disabled={!hasNext}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            다음 문제 <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
