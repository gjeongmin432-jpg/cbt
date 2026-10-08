import React, { useState, useEffect } from 'react';
import { ExamSession, GradeStatus, ExamResultSummary } from '../types';
import { SelfGradingCard } from '../components/SelfGradingCard';
import { suggestGrade } from '../utils/diffHelper';
import { Award, AlertTriangle, RotateCcw, ArrowLeft, Wand2, Download, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ReviewViewProps {
  session: ExamSession;
  onGradeChange: (questionId: string, status: GradeStatus, score: number) => void;
  onToggleBookmark: (questionId: string) => void;
  bookmarkedIds: string[];
  onSaveAndFinish: (summary: ExamResultSummary) => void;
  onStartIncorrectClinic: (incorrectIds: string[]) => void;
  onBackToHome: () => void;
}

export const ReviewView: React.FC<ReviewViewProps> = ({
  session,
  onGradeChange,
  onToggleBookmark,
  bookmarkedIds,
  onSaveAndFinish,
  onStartIncorrectClinic,
  onBackToHome,
}) => {
  const [filter, setFilter] = useState<'all' | 'incorrect' | 'partial' | 'correct'>('all');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Calculate scores
  let totalScore = 0;
  let correctCount = 0;
  let partialCount = 0;
  let incorrectCount = 0;

  let fireTotal = 0;
  let fireCorrect = 0;
  let hazmatTotal = 0;
  let hazmatCorrect = 0;

  const incorrectIds: string[] = [];

  session.questions.forEach((q) => {
    const record = session.userAnswers[q.id];
    const score = record?.score ?? (
      record?.gradeStatus === 'correct' ? 5 :
      record?.gradeStatus === 'partial' ? 3 : 0
    );
    totalScore += score;

    if (record?.gradeStatus === 'correct') {
      correctCount++;
      if (q.category === '화재예방과 소화방법') fireCorrect++;
      else hazmatCorrect++;
    } else if (record?.gradeStatus === 'partial') {
      partialCount++;
    } else {
      incorrectCount++;
      incorrectIds.push(q.id);
    }

    if (q.category === '화재예방과 소화방법') fireTotal++;
    else hazmatTotal++;
  });

  const isPassed = totalScore >= 60;

  useEffect(() => {
    if (isPassed) {
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore
      }
    }
  }, [isPassed]);

  const handleAutoGradePreset = () => {
    session.questions.forEach(q => {
      const uAns = session.userAnswers[q.id]?.userAnswer || '';
      const suggestion = suggestGrade(uAns, q.modelAnswer);
      const score = suggestion === 'correct' ? 5 : suggestion === 'partial' ? 3 : 0;
      onGradeChange(q.id, suggestion, score);
    });
  };

  const handleFinishAndSave = () => {
    const summary: ExamResultSummary = {
      sessionId: session.id,
      title: session.title,
      date: Date.now(),
      totalQuestions: session.questions.length,
      correctCount,
      partialCount,
      incorrectCount,
      estimatedScore: totalScore,
      isPassed,
      categoryStats: {
        firePrev: { total: fireTotal, correct: fireCorrect },
        hazmatLaw: { total: hazmatTotal, correct: hazmatCorrect },
      }
    };
    onSaveAndFinish(summary);
    setIsSaved(true);
  };

  const filteredQuestions = session.questions.filter(q => {
    const status = session.userAnswers[q.id]?.gradeStatus || 'ungraded';
    if (filter === 'all') return true;
    if (filter === 'incorrect') return status === 'incorrect' || status === 'ungraded';
    if (filter === 'partial') return status === 'partial';
    if (filter === 'correct') return status === 'correct';
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-8 space-y-4 sm:space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <button
          type="button"
          onClick={onBackToHome}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-2 rounded-lg shadow-2xs self-start cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>모의고사 목록으로</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAutoGradePreset}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition cursor-pointer"
            title="유사도 기반 자동 채점 프리셋"
          >
            <Wand2 className="w-3.5 h-3.5 text-orange-600" />
            <span>AI 추천 채점 적용</span>
          </button>

          <button
            type="button"
            onClick={handleFinishAndSave}
            disabled={isSaved}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3.5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold transition shadow-xs disabled:bg-emerald-600 cursor-pointer"
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4" />
                <span>저장 완료</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>성적 저장</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Score Summary Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-7 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 items-center">
          {/* Main Score */}
          <div className="text-center md:text-left border-b md:border-b-0 md:border-r border-slate-200 pb-4 md:pb-0 md:pr-6">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              {session.title}
            </span>
            <div className="flex items-baseline justify-center md:justify-start gap-1.5 mt-1">
              <span className={`text-4xl sm:text-5xl font-black font-mono ${isPassed ? 'text-emerald-600' : 'text-rose-600'}`}>
                {totalScore}
              </span>
              <span className="text-lg font-bold text-slate-400">/ 100점</span>
            </div>

            <div className="mt-2.5">
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                isPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {isPassed ? <Award className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                {isPassed ? '합격 기준(60점) 달성!' : '합격 기준 미달'}
              </span>
            </div>
          </div>

          {/* Detailed Counts */}
          <div className="grid grid-cols-3 gap-2 text-center border-b md:border-b-0 md:border-r border-slate-200 pb-4 md:pb-0 md:pr-6">
            <div className="p-2 sm:p-3 bg-emerald-50 rounded-xl border border-emerald-100">
              <span className="text-[10px] sm:text-[11px] font-bold text-emerald-700 block">정답 (5)</span>
              <span className="text-xl sm:text-2xl font-black font-mono text-emerald-800">{correctCount}</span>
            </div>
            <div className="p-2 sm:p-3 bg-amber-50 rounded-xl border border-amber-100">
              <span className="text-[10px] sm:text-[11px] font-bold text-amber-700 block">부분 (3)</span>
              <span className="text-xl sm:text-2xl font-black font-mono text-amber-800">{partialCount}</span>
            </div>
            <div className="p-2 sm:p-3 bg-rose-50 rounded-xl border border-rose-100">
              <span className="text-[10px] sm:text-[11px] font-bold text-rose-700 block">오답 (0)</span>
              <span className="text-xl sm:text-2xl font-black font-mono text-rose-800">{incorrectCount}</span>
            </div>
          </div>

          {/* Category Breakdown & Action */}
          <div className="space-y-2.5">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>화재예방과 소화방법</span>
                <span className="font-mono text-slate-500">{fireCorrect}/{fireTotal}</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-orange-500 h-full rounded-full"
                  style={{ width: `${fireTotal ? (fireCorrect / fireTotal) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>위험물안전관리법령</span>
                <span className="font-mono text-slate-500">{hazmatCorrect}/{hazmatTotal}</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500 h-full rounded-full"
                  style={{ width: `${hazmatTotal ? (hazmatCorrect / hazmatTotal) * 100 : 0}%` }}
                />
              </div>
            </div>

            {incorrectIds.length > 0 && (
              <button
                type="button"
                onClick={() => onStartIncorrectClinic(incorrectIds)}
                className="w-full mt-1.5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>틀린 문제({incorrectIds.length}개)만 바로 다시 풀기</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
        <h3 className="font-bold text-slate-800 text-sm sm:text-base">문항별 상세 채점 & 해설 ({session.questions.length}문항)</h3>
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[11px] sm:text-xs font-medium overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded transition whitespace-nowrap cursor-pointer ${filter === 'all' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'text-slate-600'}`}
          >
            전체 ({session.questions.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('incorrect')}
            className={`px-2.5 py-1 rounded transition whitespace-nowrap cursor-pointer ${filter === 'incorrect' ? 'bg-white text-rose-700 font-bold shadow-2xs' : 'text-slate-600'}`}
          >
            오답 ({incorrectCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('partial')}
            className={`px-2.5 py-1 rounded transition whitespace-nowrap cursor-pointer ${filter === 'partial' ? 'bg-white text-amber-700 font-bold shadow-2xs' : 'text-slate-600'}`}
          >
            부분 ({partialCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('correct')}
            className={`px-2.5 py-1 rounded transition whitespace-nowrap cursor-pointer ${filter === 'correct' ? 'bg-white text-emerald-700 font-bold shadow-2xs' : 'text-slate-600'}`}
          >
            정답 ({correctCount})
          </button>
        </div>
      </div>

      {/* Question Review Cards */}
      <div className="space-y-3 sm:space-y-4">
        {filteredQuestions.map((q) => (
          <SelfGradingCard
            key={q.id}
            question={q}
            userRecord={session.userAnswers[q.id] || { questionId: q.id, userAnswer: '', gradeStatus: 'ungraded' }}
            onGradeChange={(status, score) => onGradeChange(q.id, status, score)}
            isBookmarked={bookmarkedIds.includes(q.id)}
            onToggleBookmark={() => onToggleBookmark(q.id)}
          />
        ))}
      </div>
    </div>
  );
};
