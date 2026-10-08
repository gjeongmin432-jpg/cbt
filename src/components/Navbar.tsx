import React from 'react';
import { ExamSession } from '../types';
import { ExamTimer } from './ExamTimer';
import { Flame, RotateCcw, BarChart3, CheckSquare, Home, Sparkles, LogOut } from 'lucide-react';

interface NavbarProps {
  currentView: 'home' | 'exam' | 'review' | 'incorrect' | 'stats';
  onNavigate: (view: 'home' | 'incorrect' | 'stats') => void;
  activeSession: ExamSession | null;
  onTimeUp?: () => void;
  onSubmitExam?: () => void;
  onExitExam?: () => void;
  onOpenReference: () => void;
  incorrectCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  activeSession,
  onTimeUp,
  onSubmitExam,
  onExitExam,
  onOpenReference,
  incorrectCount,
}) => {
  const isExamInProgress = currentView === 'exam' && activeSession && !activeSession.isCompleted;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-0 sm:h-16 flex items-center justify-between gap-2">
        {/* Brand Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              if (isExamInProgress) {
                if (window.confirm('시험 진행 중입니다. 홈으로 이동하시겠습니까? (작성 중인 답안은 유지됩니다)')) {
                  onNavigate('home');
                }
              } else {
                onNavigate('home');
              }
            }}
            className="flex items-center gap-1.5 sm:gap-2 group text-left cursor-pointer"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform shrink-0">
              <Flame className="w-4.5 h-4.5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-black text-sm sm:text-base tracking-tight text-slate-900 group-hover:text-orange-600 transition truncate">
                  위험물산업기사 실기
                </span>
                <span className="bg-orange-100 text-orange-700 text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded uppercase">
                  CBT
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 hidden sm:block">
                국가기술자격 실전 필답형 모의고사
              </p>
            </div>
          </button>
        </div>

        {/* Center / Session Info during Exam */}
        {isExamInProgress ? (
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Exam Timer */}
            {onTimeUp && (
              <ExamTimer
                initialSeconds={activeSession.timeRemainingSeconds}
                onTimeUp={onTimeUp}
              />
            )}

            {/* Submit Button */}
            {onSubmitExam && (
              <button
                type="button"
                onClick={onSubmitExam}
                className="flex items-center gap-1 px-2.5 sm:px-3.5 py-1.5 sm:py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold shadow-xs transition active:scale-95 cursor-pointer"
              >
                <CheckSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>제출</span>
              </button>
            )}

            {/* Exit Button */}
            {onExitExam && (
              <button
                type="button"
                onClick={onExitExam}
                className="p-1.5 sm:px-2.5 sm:py-2 text-slate-500 hover:text-slate-800 text-xs font-medium rounded-lg hover:bg-slate-100 transition cursor-pointer"
                title="시험 나가기"
              >
                <LogOut className="w-4 h-4 sm:hidden" />
                <span className="hidden sm:inline">나가기</span>
              </button>
            )}
          </div>
        ) : (
          /* Normal Navigation Links */
          <div className="flex items-center gap-1 sm:gap-2">
            <nav className="flex items-center gap-0.5 sm:gap-1">
              <button
                type="button"
                onClick={() => onNavigate('home')}
                className={`flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  currentView === 'home'
                    ? 'bg-slate-100 text-orange-600'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
                title="모의고사 목록"
              >
                <Home className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">모의고사</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('incorrect')}
                className={`flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition relative cursor-pointer ${
                  currentView === 'incorrect'
                    ? 'bg-slate-100 text-orange-600'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
                title="오답노트"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">오답노트</span>
                {incorrectCount > 0 && (
                  <span className="px-1.5 py-0.2 bg-rose-500 text-white text-[9px] sm:text-[10px] font-bold rounded-full">
                    {incorrectCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => onNavigate('stats')}
                className={`flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  currentView === 'stats'
                    ? 'bg-slate-100 text-orange-600'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
                title="학습 리포트"
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">리포트</span>
              </button>
            </nav>

            {/* Reference Cheat Sheet Button */}
            <button
              type="button"
              onClick={onOpenReference}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition shrink-0 cursor-pointer"
              title="위험물 품명 & 지정수량 & 주요 공식 치트시트 열기"
            >
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              <span className="hidden md:inline">요약집/공식</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
