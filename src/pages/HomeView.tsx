import React from 'react';
import { Category, ExamResultSummary } from '../types';
import { Flame, Play, ShieldAlert, Award, RotateCcw, Bookmark, ChevronRight, Clock, Sparkles, CheckCircle2, FileText, Target } from 'lucide-react';

interface HomeViewProps {
  onStartRound: (round: number) => void;
  onStartRandomMock: () => void;
  onStartCategory: (category: Category) => void;
  onStartIncorrectClinic: () => void;
  onStartBookmarkTest: () => void;
  incorrectCount: number;
  bookmarkCount: number;
  history: ExamResultSummary[];
}

export const HomeView: React.FC<HomeViewProps> = ({
  onStartRound,
  onStartRandomMock,
  onStartCategory,
  onStartIncorrectClinic,
  onStartBookmarkTest,
  incorrectCount,
  bookmarkCount,
  history,
}) => {
  const latestExam = history[0];
  const passedCount = history.filter(h => h.isPassed).length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-9">
      {/* Hero Banner: Premium Dark Indigo/Slate with High-Contrast Accents */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-zinc-900 border border-slate-700/80 text-white p-6 sm:p-9 shadow-xl shadow-slate-900/10">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Headline & Action Buttons */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/15 border border-orange-400/30 text-orange-400 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <span>한국산업인력공단 출제기준 100% 반영</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
              위험물산업기사 실기<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400">
                실전 필답형 CBT 플랫폼
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl font-normal">
              실제 시험과 완벽히 동일한 <strong className="text-orange-300 font-bold">화재예방 7문항 : 위험물안전관리법 13문항</strong> 실전 출제 비율과 단어 단위 <strong className="text-amber-300 font-bold">주관식 자동 Diff 비교 채점</strong>을 제공합니다.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                type="button"
                onClick={onStartRandomMock}
                className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-orange-500/25 transition-all duration-200 active:scale-95 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current text-slate-950" />
                <span>실전 랜덤 모의고사 시작 (7:13 비율)</span>
              </button>

              {incorrectCount > 0 && (
                <button
                  type="button"
                  onClick={onStartIncorrectClinic}
                  className="flex items-center gap-2 px-4 py-3.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-bold text-sm rounded-xl transition duration-200 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>오답 클리닉 ({incorrectCount}문항)</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Visual Spec Card */}
          <div className="lg:col-span-5">
            <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-xl p-5 shadow-inner space-y-3.5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-700/80">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-orange-400" />
                  실전 시험 기준 가이드
                </span>
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30">
                  총 20문항 / 90분
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                {/* Subject 1 */}
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-700/50">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                    <span className="text-slate-200 font-medium">화재예방과 소화방법</span>
                  </div>
                  <span className="font-mono font-bold text-orange-300">7문항 (35점)</span>
                </div>

                {/* Subject 2 */}
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-700/50">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                    <span className="text-slate-200 font-medium">위험물안전관리법령</span>
                  </div>
                  <span className="font-mono font-bold text-blue-300">13문항 (65점)</span>
                </div>

                {/* Pass criteria */}
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-700/50">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-400" />
                    <span className="text-slate-200 font-medium">합격 기준선</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-400">60점 이상 합격</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Subtle Background Glow */}
        <div className="absolute -right-12 -top-12 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1.5 font-medium">
            <span>응시한 모의고사</span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {history.length} <span className="text-xs font-normal text-slate-500">회</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1.5 font-medium">
            <span>합격 기준(60점+) 달성</span>
            <Award className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 font-mono">
            {passedCount} <span className="text-xs font-normal text-slate-500">회</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1.5 font-medium">
            <span>등록된 오답노트</span>
            <RotateCcw className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600 font-mono">
            {incorrectCount} <span className="text-xs font-normal text-slate-500">문항</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-slate-300 transition">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1.5 font-medium">
            <span>북마크한 문항</span>
            <Bookmark className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 font-mono">
            {bookmarkCount} <span className="text-xs font-normal text-slate-500">문항</span>
          </div>
        </div>
      </div>

      {/* Section 1: Standard Mock Exams (1회 ~ 10회) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-600" />
              <span>회차별 정규 모의고사 (1회 ~ 10회)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              총 200문항의 기출 및 출제예상 문제를 회차별 20문항 단위로 학습하고 실전처럼 풀이합니다.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((round) => {
            const historyForRound = history.find(h => h.title.includes(`제${round}회`));
            return (
              <div
                key={round}
                className="bg-white border border-slate-200 hover:border-orange-500 rounded-xl p-4 shadow-xs hover:shadow-md transition-all duration-200 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 bg-slate-100 group-hover:bg-orange-100 group-hover:text-orange-800 text-slate-700 font-mono text-xs font-bold rounded-md transition-colors">
                      제 {round} 회
                    </span>
                    {historyForRound && (
                      <span className={`text-[11px] font-bold font-mono px-1.5 py-0.5 rounded ${
                        historyForRound.isPassed
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {historyForRound.estimatedScore}점 {historyForRound.isPassed && '합격'}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm mb-1 group-hover:text-orange-600 transition-colors">
                    제{round}회 실기 모의고사
                  </h3>
                  <p className="text-[11px] text-slate-500 mb-4">
                    20문항 주관식 (소화 7 / 법령 13)
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onStartRound(round)}
                  className="w-full py-2 bg-slate-900 group-hover:bg-orange-600 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>응시하기</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Subject-Focused Training */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-600" />
            <span>과목별 집중 트레이닝</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            취약한 과목만 선택하여 집중적으로 문제를 풀이할 수 있습니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Fire Prevention */}
          <div className="bg-white border border-slate-200 hover:border-orange-300 rounded-xl p-5 shadow-xs transition flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2.5">
                <div className="p-2.5 bg-orange-100 text-orange-700 rounded-xl">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">과목 1: 화재예방과 소화방법</h3>
                  <span className="text-[11px] text-slate-500">소화약제 반응식, 이상연소현상(보일오버 등), 저장량 계산</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 my-2 leading-relaxed">
                제1류~제6류 소화 적응성, 분말소화약제 분해 반응식, CO₂/할론 소화약제 저장량 계산 등 단답형과 계산형 문제를 집중 훈련합니다.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onStartCategory('화재예방과 소화방법')}
              className="mt-3 w-full py-2.5 bg-orange-50 hover:bg-orange-600 hover:text-white text-orange-700 font-bold text-xs rounded-lg border border-orange-200 hover:border-orange-600 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>화재예방 20문항 집중 풀기</span>
            </button>
          </div>

          {/* Hazmat Law */}
          <div className="bg-white border border-slate-200 hover:border-blue-300 rounded-xl p-5 shadow-xs transition flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2.5">
                <div className="p-2.5 bg-blue-100 text-blue-700 rounded-xl">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">과목 2: 위험물안전관리법령</h3>
                  <span className="text-[11px] text-slate-500">지정수량, 제조소등의 시설기준, 안전거리, 과태료 및 벌칙</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 my-2 leading-relaxed">
                보유공지, 방유제 용량 기준, 안전관리자 선임 규정, 과태료 및 행정처분, 지정수량 배수 계산 등 법령 암기 필수 문제를 훈련합니다.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onStartCategory('위험물안전관리법')}
              className="mt-3 w-full py-2.5 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 font-bold text-xs rounded-lg border border-blue-200 hover:border-blue-600 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>위험물안전관리법 20문항 집중 풀기</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
