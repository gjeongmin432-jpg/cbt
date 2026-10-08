import React from 'react';
import { Question, UserAnswerRecord } from '../types';
import { Flag, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

interface QuestionPaletteProps {
  questions: Question[];
  currentIndex: number;
  userAnswers: Record<string, UserAnswerRecord>;
  onSelectIndex: (index: number) => void;
  isGradedView?: boolean;
}

export const QuestionPalette: React.FC<QuestionPaletteProps> = ({
  questions,
  currentIndex,
  userAnswers,
  onSelectIndex,
  isGradedView = false,
}) => {
  // Stats
  const answeredCount = questions.filter(q => (userAnswers[q.id]?.userAnswer || '').trim().length > 0).length;
  const flaggedCount = questions.filter(q => userAnswers[q.id]?.isMarkedForReview).length;
  const totalCount = questions.length;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs sticky top-20">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
        <div>
          <h3 className="font-bold text-slate-800 text-sm">OMR 답안 현황</h3>
          <p className="text-[11px] text-slate-500">
            {isGradedView ? '채점 결과 확인' : `${totalCount}문항 중 ${answeredCount}개 입력 완료`}
          </p>
        </div>
        {!isGradedView && (
          <div className="text-right">
            <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-md border border-orange-200">
              {Math.round((answeredCount / totalCount) * 100)}%
            </span>
          </div>
        )}
      </div>

      {/* Grid of question buttons */}
      <div className="grid grid-cols-5 gap-2 mb-4">
        {questions.map((q, idx) => {
          const record = userAnswers[q.id];
          const hasAnswer = (record?.userAnswer || '').trim().length > 0;
          const isFlagged = record?.isMarkedForReview;
          const isCurrent = idx === currentIndex;

          let btnClass = 'border-slate-200 text-slate-700 hover:bg-slate-100 bg-slate-50';

          if (isGradedView) {
            if (record?.gradeStatus === 'correct') {
              btnClass = 'bg-emerald-500 text-white border-emerald-600 font-bold';
            } else if (record?.gradeStatus === 'partial') {
              btnClass = 'bg-amber-500 text-white border-amber-600 font-bold';
            } else if (record?.gradeStatus === 'incorrect') {
              btnClass = 'bg-rose-500 text-white border-rose-600 font-bold';
            } else {
              btnClass = 'bg-slate-200 text-slate-600 border-slate-300';
            }
          } else {
            if (hasAnswer) {
              btnClass = 'bg-blue-600 text-white border-blue-700 font-semibold shadow-2xs';
            }
          }

          if (isCurrent) {
            btnClass += ' ring-2 ring-orange-500 ring-offset-2';
          }

          return (
            <button
              key={q.id}
              type="button"
              onClick={() => onSelectIndex(idx)}
              className={`relative h-10 rounded-lg text-xs font-mono font-medium border flex items-center justify-center transition-all ${btnClass}`}
            >
              <span>{q.number}</span>

              {/* 검토 플래그 배지 */}
              {isFlagged && !isGradedView && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white rounded-full p-0.5 shadow-2xs">
                  <Flag className="w-2.5 h-2.5 fill-current" />
                </span>
              )}

              {/* 채점 아이콘 미니 배지 */}
              {isGradedView && (
                <span className="absolute -top-1 -right-1">
                  {record?.gradeStatus === 'correct' && <CheckCircle2 className="w-3.5 h-3.5 text-white bg-emerald-600 rounded-full" />}
                  {record?.gradeStatus === 'partial' && <AlertTriangle className="w-3.5 h-3.5 text-white bg-amber-600 rounded-full" />}
                  {record?.gradeStatus === 'incorrect' && <XCircle className="w-3.5 h-3.5 text-white bg-rose-600 rounded-full" />}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="pt-3 border-t border-slate-100 flex flex-col gap-1.5 text-[11px] text-slate-500">
        {!isGradedView ? (
          <>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-blue-600"></span>
                답안 작성 완료
              </span>
              <span className="font-semibold text-slate-700">{answeredCount}개</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-slate-200 border border-slate-300"></span>
                미작성
              </span>
              <span className="font-semibold text-slate-700">{totalCount - answeredCount}개</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                검토 필요 표시
              </span>
              <span className="font-semibold text-slate-700">{flaggedCount}개</span>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-around py-1">
            <span className="flex items-center gap-1 text-emerald-700 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> 정답
            </span>
            <span className="flex items-center gap-1 text-amber-700 font-medium">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> 부분점수
            </span>
            <span className="flex items-center gap-1 text-rose-700 font-medium">
              <XCircle className="w-3.5 h-3.5 text-rose-500" /> 오답
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
