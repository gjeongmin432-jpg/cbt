import React, { useState } from 'react';
import { ExamSession } from '../types';
import { QuestionCard } from '../components/QuestionCard';
import { QuestionPalette } from '../components/QuestionPalette';
import { CheckSquare, AlertCircle, ArrowLeft, LayoutGrid, ChevronDown, ChevronUp } from 'lucide-react';

interface ExamViewProps {
  session: ExamSession;
  onUpdateAnswer: (questionId: string, answer: string) => void;
  onToggleFlag: (questionId: string) => void;
  onToggleBookmark: (questionId: string) => void;
  bookmarkedIds: string[];
  onSubmitExam: () => void;
  onExitExam: () => void;
}

export const ExamView: React.FC<ExamViewProps> = ({
  session,
  onUpdateAnswer,
  onToggleFlag,
  onToggleBookmark,
  bookmarkedIds,
  onSubmitExam,
  onExitExam,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [showSubmitConfirm, setShowSubmitConfirm] = useState<boolean>(false);
  const [showMobileOmr, setShowMobileOmr] = useState<boolean>(false);

  const currentQuestion = session.questions[currentIndex];
  if (!currentQuestion) return null;

  const currentRecord = session.userAnswers[currentQuestion.id] || {
    questionId: currentQuestion.id,
    userAnswer: '',
    gradeStatus: 'ungraded',
  };

  const answeredCount = session.questions.filter(
    q => (session.userAnswers[q.id]?.userAnswer || '').trim().length > 0
  ).length;
  const unansweredCount = session.questions.length - answeredCount;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6">
      {/* Top Banner Info */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 sm:p-3.5 mb-4 sm:mb-6 flex items-center justify-between gap-2 shadow-2xs">
        <div className="flex items-center gap-2 sm:gap-3 truncate">
          <button
            type="button"
            onClick={onExitExam}
            className="p-1 sm:p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition shrink-0 cursor-pointer"
            title="목록으로 나가기"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="truncate">
            <h1 className="font-extrabold text-xs sm:text-base text-slate-900 flex items-center gap-1.5 truncate">
              <span className="truncate">{session.title}</span>
              <span className="text-xs font-mono text-orange-600 font-bold shrink-0">
                ({currentIndex + 1}/20번)
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Mobile OMR Toggle Button */}
          <button
            type="button"
            onClick={() => setShowMobileOmr(!showMobileOmr)}
            className="lg:hidden flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition cursor-pointer"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-orange-600" />
            <span>OMR</span>
            {showMobileOmr ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          <button
            type="button"
            onClick={() => setShowSubmitConfirm(true)}
            className="flex items-center gap-1 px-3 sm:px-4 py-1.5 sm:py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold transition shadow-xs active:scale-95 cursor-pointer"
          >
            <CheckSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>제출</span>
          </button>
        </div>
      </div>

      {/* Mobile Collapsible OMR Sheet */}
      {showMobileOmr && (
        <div className="lg:hidden mb-4 animate-in slide-in-from-top-2 duration-150">
          <QuestionPalette
            questions={session.questions}
            currentIndex={currentIndex}
            userAnswers={session.userAnswers}
            onSelectIndex={(idx) => {
              setCurrentIndex(idx);
              setShowMobileOmr(false);
            }}
          />
        </div>
      )}

      {/* Main Grid: Left Question, Right OMR */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 items-start">
        {/* Left: Question Card (3 cols) */}
        <div className="lg:col-span-3">
          <QuestionCard
            question={currentQuestion}
            userRecord={currentRecord}
            onUpdateAnswer={(ans) => onUpdateAnswer(currentQuestion.id, ans)}
            onToggleFlag={() => onToggleFlag(currentQuestion.id)}
            onToggleBookmark={() => onToggleBookmark(currentQuestion.id)}
            isBookmarked={bookmarkedIds.includes(currentQuestion.id)}
            onPrev={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
            onNext={() => setCurrentIndex(prev => Math.min(session.questions.length - 1, prev + 1))}
            hasPrev={currentIndex > 0}
            hasNext={currentIndex < session.questions.length - 1}
            fontSize={fontSize}
            onChangeFontSize={setFontSize}
          />
        </div>

        {/* Right: Question Palette / OMR (1 col, visible on lg) */}
        <div className="hidden lg:block lg:col-span-1 space-y-4">
          <QuestionPalette
            questions={session.questions}
            currentIndex={currentIndex}
            userAnswers={session.userAnswers}
            onSelectIndex={(idx) => setCurrentIndex(idx)}
          />

          <button
            type="button"
            onClick={() => setShowSubmitConfirm(true)}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <CheckSquare className="w-4 h-4 text-orange-400" />
            <span>답안 제출 및 자가 채점</span>
          </button>
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-5 sm:p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mb-3 sm:mb-4">
              <CheckSquare className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>

            <h3 className="font-extrabold text-base sm:text-lg text-slate-900 mb-1">
              시험을 종료하고 제출하시겠습니까?
            </h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed break-keep">
              제출 후에는 공식 모범 답안 및 상세 해설과 함께 <strong className="text-slate-800">주관식 단어 단위 자가 채점</strong> 화면으로 이동합니다.
            </p>

            {unansweredCount > 0 ? (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5 flex items-start gap-2.5 text-xs text-amber-800">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">미입력된 문제가 {unansweredCount}개 있습니다.</span>
                  <p className="text-[11px] text-amber-700 mt-0.5">
                    ({session.questions.length}문항 중 {answeredCount}개 작성 완료)
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 mb-5 text-xs text-emerald-800 font-medium">
                모든 문제({session.questions.length}문항)의 답안 작성이 완료되었습니다!
              </div>
            )}

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowSubmitConfirm(false)}
                className="px-3.5 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                계속 풀기
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSubmitConfirm(false);
                  onSubmitExam();
                }}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
              >
                지금 제출하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
