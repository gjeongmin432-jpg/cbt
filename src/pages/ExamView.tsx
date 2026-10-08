import React, { useState } from 'react';
import { ExamSession } from '../types';
import { QuestionCard } from '../components/QuestionCard';
import { QuestionPalette } from '../components/QuestionPalette';
import { CheckSquare, AlertCircle, ArrowLeft } from 'lucide-react';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Banner Info */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 mb-6 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onExitExam}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition"
            title="목록으로 나가기"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
              <span>{session.title}</span>
              <span className="text-xs font-normal text-slate-400">|</span>
              <span className="text-xs font-mono text-orange-600 font-bold">
                {currentIndex + 1} / {session.questions.length}번
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowSubmitConfirm(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold transition shadow-xs active:scale-95"
          >
            <CheckSquare className="w-4 h-4" />
            <span>최종 답안 제출</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Question, Right OMR */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
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

        {/* Right: Question Palette / OMR (1 col) */}
        <div className="lg:col-span-1 space-y-4">
          <QuestionPalette
            questions={session.questions}
            currentIndex={currentIndex}
            userAnswers={session.userAnswers}
            onSelectIndex={(idx) => setCurrentIndex(idx)}
          />

          <button
            type="button"
            onClick={() => setShowSubmitConfirm(true)}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs"
          >
            <CheckSquare className="w-4 h-4 text-orange-400" />
            <span>답안 제출 및 자가 채점</span>
          </button>
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mb-4">
              <CheckSquare className="w-6 h-6" />
            </div>

            <h3 className="font-extrabold text-lg text-slate-900 mb-1">
              시험을 종료하고 제출하시겠습니까?
            </h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              제출 후에는 공식 모범 답안 및 상세 해설과 함께 <strong className="text-slate-800">단어 단위 주관식 자가 채점</strong> 화면으로 이동합니다.
            </p>

            {unansweredCount > 0 ? (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 mb-6 flex items-start gap-2.5 text-xs text-amber-800">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">주의: 아직 미입력된 문제가 {unansweredCount}개 있습니다.</span>
                  <p className="text-[11px] text-amber-700 mt-0.5">
                    ({session.questions.length}문항 중 {answeredCount}개 작성 완료)
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 mb-6 text-xs text-emerald-800 font-medium">
                모든 문제({session.questions.length}문항)의 답안 작성이 완료되었습니다!
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowSubmitConfirm(false)}
                className="px-4 py-2.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                계속 풀기
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSubmitConfirm(false);
                  onSubmitExam();
                }}
                className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold transition shadow-xs"
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
