import React from 'react';
import { ExamResultSummary } from '../types';
import { BarChart3, Trash2, ArrowLeft } from 'lucide-react';

interface StatsViewProps {
  history: ExamResultSummary[];
  onClearHistory: () => void;
  onBackToHome: () => void;
}

export const StatsView: React.FC<StatsViewProps> = ({
  history,
  onClearHistory,
  onBackToHome,
}) => {
  const totalExams = history.length;
  const passedExams = history.filter(h => h.isPassed).length;
  const passRate = totalExams > 0 ? Math.round((passedExams / totalExams) * 100) : 0;
  
  const avgScore = totalExams > 0
    ? Math.round(history.reduce((acc, cur) => acc + cur.estimatedScore, 0) / totalExams)
    : 0;

  const maxScore = totalExams > 0
    ? Math.max(...history.map(h => h.estimatedScore))
    : 0;

  let totalFireQuestions = 0;
  let correctFireQuestions = 0;
  let totalHazmatQuestions = 0;
  let correctHazmatQuestions = 0;

  history.forEach(h => {
    if (h.categoryStats) {
      totalFireQuestions += h.categoryStats.firePrev.total;
      correctFireQuestions += h.categoryStats.firePrev.correct;
      totalHazmatQuestions += h.categoryStats.hazmatLaw.total;
      correctHazmatQuestions += h.categoryStats.hazmatLaw.correct;
    }
  });

  const fireAccuracy = totalFireQuestions > 0 ? Math.round((correctFireQuestions / totalFireQuestions) * 100) : 0;
  const hazmatAccuracy = totalHazmatQuestions > 0 ? Math.round((correctHazmatQuestions / totalHazmatQuestions) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-8 space-y-4 sm:space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onBackToHome}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-2 rounded-lg shadow-2xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>모의고사 목록으로</span>
        </button>

        {totalExams > 0 && (
          <button
            type="button"
            onClick={() => {
              if (window.confirm('모든 모의고사 응시 기록을 초기화하시겠습니까? (오답노트는 유지됩니다)')) {
                onClearHistory();
              }
            }}
            className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>기록 초기화</span>
          </button>
        )}
      </div>

      {/* Title Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-orange-100 text-orange-600 rounded-xl shrink-0">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-base sm:text-xl text-slate-900">실기 학습 분석 리포트</h1>
            <p className="text-xs text-slate-500 break-keep">
              응시한 모의고사 성적 추이와 과목별 취약 영역을 정밀하게 진단합니다.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4 shadow-xs">
          <span className="text-[11px] sm:text-xs font-semibold text-slate-500 block mb-1">총 응시</span>
          <div className="text-xl sm:text-2xl font-black font-mono text-slate-800">{totalExams}회</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4 shadow-xs">
          <span className="text-[11px] sm:text-xs font-semibold text-slate-500 block mb-1">합격률 (60+)</span>
          <div className="text-xl sm:text-2xl font-black font-mono text-emerald-600">{passRate}%</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4 shadow-xs">
          <span className="text-[11px] sm:text-xs font-semibold text-slate-500 block mb-1">평균 점수</span>
          <div className="text-xl sm:text-2xl font-black font-mono text-orange-600">{avgScore}점</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4 shadow-xs">
          <span className="text-[11px] sm:text-xs font-semibold text-slate-500 block mb-1">최고 점수</span>
          <div className="text-xl sm:text-2xl font-black font-mono text-blue-600">{maxScore}점</div>
        </div>
      </div>

      {/* Subject Accuracy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-slate-800 text-xs sm:text-sm">과목 1: 화재예방과 소화방법</h3>
            <span className="text-xs font-bold text-orange-600 font-mono">{fireAccuracy}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-1.5">
            <div className="bg-orange-500 h-full rounded-full transition-all" style={{ width: `${fireAccuracy}%` }} />
          </div>
          <div className="text-[11px] text-slate-500 flex justify-between">
            <span>정답 {correctFireQuestions} / {totalFireQuestions}문항</span>
            <span>{fireAccuracy >= 60 ? '안정권' : '보완 필요'}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-slate-800 text-xs sm:text-sm">과목 2: 위험물안전관리법</h3>
            <span className="text-xs font-bold text-blue-600 font-mono">{hazmatAccuracy}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-1.5">
            <div className="bg-blue-500 h-full rounded-full transition-all" style={{ width: `${hazmatAccuracy}%` }} />
          </div>
          <div className="text-[11px] text-slate-500 flex justify-between">
            <span>정답 {correctHazmatQuestions} / {totalHazmatQuestions}문항</span>
            <span>{hazmatAccuracy >= 60 ? '안정권' : '보완 필요'}</span>
          </div>
        </div>
      </div>

      {/* History Table with horizontal scroll on mobile */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
          <h3 className="font-bold text-slate-800 text-xs sm:text-sm">최근 응시 내역</h3>
        </div>

        {totalExams === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            아직 응시한 모의고사 기록이 없습니다.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 sm:px-4">시험 제목</th>
                  <th className="py-2.5 px-3 sm:px-4">일시</th>
                  <th className="py-2.5 px-3 sm:px-4">정/부/오</th>
                  <th className="py-2.5 px-3 sm:px-4">점수</th>
                  <th className="py-2.5 px-3 sm:px-4 text-center">결과</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.map((item) => (
                  <tr key={item.sessionId} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 sm:px-4 font-semibold text-slate-800">{item.title}</td>
                    <td className="py-2.5 px-3 sm:px-4 text-slate-500 font-mono text-[11px]">
                      {new Date(item.date).toLocaleDateString()}
                    </td>
                    <td className="py-2.5 px-3 sm:px-4 font-mono text-slate-600">
                      <span className="text-emerald-600 font-bold">{item.correctCount}</span>/
                      <span className="text-amber-600">{item.partialCount}</span>/
                      <span className="text-rose-600">{item.incorrectCount}</span>
                    </td>
                    <td className="py-2.5 px-3 sm:px-4 font-mono font-bold text-slate-900">
                      {item.estimatedScore}점
                    </td>
                    <td className="py-2.5 px-3 sm:px-4 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.isPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {item.isPassed ? '합격' : '불합격'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
