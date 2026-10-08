import React, { useState, useEffect } from 'react';
import { ExamSession, GradeStatus, ExamResultSummary } from '../types';
import { SelfGradingCard } from '../components/SelfGradingCard';
import { suggestGrade } from '../utils/diffHelper';
import { Award, CheckCircle2, XCircle, AlertTriangle, RotateCcw, Bookmark, ArrowLeft, Wand2, Download, Check } from 'lucide-react';
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

  // Confetti effect on mount if passed
  useEffect(() => {
    if (isPassed) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore
      }
    }
  }, [isPassed]);

  // Quick auto-grade preset based on similarity
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
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBackToHome}
          className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-2 rounded-lg shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>모의고사 목록으로</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAutoGradePreset}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition"
            title="답안 유사도 분석을 바탕으로 O/△/X를 추천값으로 1초만에 채점합니다"
          >
            <Wand2 className="w-3.5 h-3.5 text-orange-600" />
            <span>AI 유사도 추천 채점 적용</span>
          </button>

          <button
            type="button"
            onClick={handleFinishAndSave}
            disabled={isSaved}
            className="flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold transition shadow-xs disabled:bg-emerald-600"
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4" />
                <span>성적표 저장 완료</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>성적표 및 오답 저장</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Score Summary Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Main Score */}
          <div className="text-center md:text-left border-b md:border-b-0 md:border-r border-slate-200 pb-6 md:pb-0 md:pr-6">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {session.title}
            </span>
            <div className="flex items-baseline justify-center md:justify-start gap-2 mt-2">
              <span className={`text-5xl font-black font-mono ${isPassed ? 'text-emerald-600' : 'text-rose-600'}`}>
                {totalScore}
              </span>
              <span className="text-xl font-bold text-slate-400">/ 100점</span>
            </div>

            <div className="mt-3">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                isPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {isPassed ? <Award className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                {isPassed ? '합격 기준(60점) 통과!' : '합격 기준 미달 (재도전 필요)'}
              </span>
            </div>
          </div>

          {/* Detailed Counts */}
          <div className="grid grid-cols-3 gap-3 text-center border-b md:border-b-0 md:border-r border-slate-200 pb-6 md:pb-0 md:pr-6">
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
              <span className="text-[11px] font-semibold text-emerald-700 block">정답 (5점)</span>
              <span className="text-2xl font-black font-mono text-emerald-800">{correctCount}</span>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
              <span className="text-[11px] font-semibold text-amber-700 block">부분 (3점)</span>
              <span className="text-2xl font-black font-mono text-amber-800">{partialCount}</span>
            </div>
            <div className="p-3 bg-rose-50 rounded-xl border border-rose-100">
              <span className="text-[11px] font-semibold text-rose-700 block">오답 (0점)</span>
              <span className="text-2xl font-black font-mono text-rose-800">{incorrectCount}</span>
            </div>
          </div>

          {/* Category Breakdown & Action */}
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>화재예방과 소화방법</span>
                <span className="font-mono">{fireCorrect} / {fireTotal}문항</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-orange-500 h-full rounded-full"
                  style={{ width: `${fireTotal ? (fireCorrect / fireTotal) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>위험물안전관리법령</span>
                <span className="font-mono">{hazmatCorrect} / {hazmatTotal}문항</span>
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
                className="w-full mt-2 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>틀린 문제({incorrectIds.length}개)만 바로 다시 풀기</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <h3 className="font-bold text-slate-800 text-base">문항별 상세 채점 & 해설 (20문항)</h3>
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg text-xs font-medium">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-md transition ${filter === 'all' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'text-slate-600'}`}
          >
            전체 ({session.questions.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('incorrect')}
            className={`px-3 py-1 rounded-md transition ${filter === 'incorrect' ? 'bg-white text-rose-700 font-bold shadow-2xs' : 'text-slate-600'}`}
          >
            오답 ({incorrectCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('partial')}
            className={`px-3 py-1 rounded-md transition ${filter === 'partial' ? 'bg-white text-amber-700 font-bold shadow-2xs' : 'text-slate-600'}`}
          >
            부분점수 ({partialCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('correct')}
            className={`px-3 py-1 rounded-md transition ${filter === 'correct' ? 'bg-white text-emerald-700 font-bold shadow-2xs' : 'text-slate-600'}`}
          >
            정답 ({correctCount})
          </button>
        </div>
      </div>

      {/* Question Review Cards */}
      <div className="space-y-4">
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
