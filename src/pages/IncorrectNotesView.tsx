import React, { useState } from 'react';
import { Question } from '../types';
import { ALL_QUESTIONS } from '../utils/generator';
import { getStoredMemos, saveStoredMemo } from '../utils/storage';
import { RotateCcw, BookOpen, Search, Filter, Play, CheckCircle2, Bookmark, Edit3, Check } from 'lucide-react';

interface IncorrectNotesViewProps {
  incorrectIds: string[];
  bookmarkedIds: string[];
  onRemoveIncorrect: (id: string) => void;
  onToggleBookmark: (id: string) => void;
  onStartRetest: (ids: string[]) => void;
  onBackToHome: () => void;
}

export const IncorrectNotesView: React.FC<IncorrectNotesViewProps> = ({
  incorrectIds,
  bookmarkedIds,
  onRemoveIncorrect,
  onToggleBookmark,
  onStartRetest,
  onBackToHome,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [editingMemoId, setEditingMemoId] = useState<string | null>(null);
  const [memoTexts, setMemoTexts] = useState<Record<string, string>>(() => getStoredMemos());
  const [savedNotifyId, setSavedNotifyId] = useState<string | null>(null);

  const incorrectQuestions: Question[] = ALL_QUESTIONS.filter(q => incorrectIds.includes(q.id));

  const filteredQuestions = incorrectQuestions.filter(q => {
    if (categoryFilter !== 'all' && q.category !== categoryFilter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const inQ = q.question.toLowerCase().includes(term);
      const inA = q.modelAnswer.toLowerCase().includes(term);
      const memo = (memoTexts[q.id] || '').toLowerCase();
      return inQ || inA || memo.includes(term);
    }
    return true;
  });

  const handleSaveMemo = (qId: string) => {
    const text = memoTexts[qId] || '';
    saveStoredMemo(qId, text);
    setEditingMemoId(null);
    setSavedNotifyId(qId);
    setTimeout(() => setSavedNotifyId(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-8 space-y-4 sm:space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-rose-100 text-rose-600 rounded-lg">
              <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
            </span>
            <h1 className="font-extrabold text-base sm:text-xl text-slate-900">오답노트 클리닉</h1>
          </div>
          <p className="text-xs text-slate-500 break-keep">
            틀렸던 문항 {incorrectQuestions.length}개가 보관되어 있습니다. 마스터한 문제는 제외하세요.
          </p>
        </div>

        {incorrectQuestions.length > 0 && (
          <button
            type="button"
            onClick={() => onStartRetest(filteredQuestions.map(q => q.id))}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition active:scale-95 cursor-pointer shrink-0"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>오답 재시험 ({filteredQuestions.length}문항)</span>
          </button>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-2xs">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 px-3 py-1.5 focus:ring-2 focus:ring-orange-500 outline-hidden cursor-pointer"
          >
            <option value="all">전체 과목 ({incorrectQuestions.length})</option>
            <option value="화재예방과 소화방법">화재예방과 소화방법</option>
            <option value="위험물안전관리법">위험물안전관리법</option>
          </select>
        </div>

        <div className="relative w-full sm:max-w-xs">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="오답 키워드 및 메모 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-orange-500 outline-hidden"
          />
        </div>
      </div>

      {/* List of Incorrect Questions */}
      {filteredQuestions.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 text-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2.5" />
          <h3 className="font-bold text-sm sm:text-base text-slate-800 mb-1">
            {incorrectQuestions.length === 0 ? '등록된 오답이 없습니다!' : '검색 결과가 없습니다.'}
          </h3>
          <p className="text-xs text-slate-500 mb-4 break-keep">
            모의고사를 풀고 틀린 문제를 오답노트로 복습하여 취약점을 완벽하게 보완해보세요.
          </p>
          <button
            type="button"
            onClick={onBackToHome}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
          >
            모의고사 풀러 가기
          </button>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {filteredQuestions.map((q) => {
            const currentMemo = memoTexts[q.id] || '';
            const isEditing = editingMemoId === q.id;
            const isBookmarked = bookmarkedIds.includes(q.id);

            return (
              <div key={q.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs hover:border-slate-300 transition">
                {/* Header */}
                <div className="bg-slate-50 border-b border-slate-200 px-3.5 py-2.5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap truncate">
                    <span className="px-2 py-0.5 bg-slate-800 text-white font-mono font-bold text-[10px] sm:text-xs rounded shrink-0">
                      제{q.round}회 문{q.number}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold border shrink-0 ${
                      q.category === '화재예방과 소화방법'
                        ? 'bg-orange-50 border-orange-200 text-orange-700'
                        : 'bg-blue-50 border-blue-200 text-blue-700'
                    }`}>
                      {q.category}
                    </span>
                    <span className="text-[10px] sm:text-xs text-slate-500 shrink-0">{q.type}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => onToggleBookmark(q.id)}
                      className={`p-1.5 rounded border text-xs font-medium transition cursor-pointer ${
                        isBookmarked
                          ? 'bg-amber-50 border-amber-300 text-amber-600'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                      title="북마크"
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
                    </button>

                    <button
                      type="button"
                      onClick={() => onRemoveIncorrect(q.id)}
                      className="flex items-center gap-1 px-2 py-1 text-[11px] sm:text-xs font-semibold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded border border-slate-200 hover:border-emerald-300 transition cursor-pointer"
                      title="오답노트에서 제외"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>마스터</span>
                    </button>
                  </div>
                </div>

                {/* Question */}
                <div className="p-3.5 sm:p-4 border-b border-slate-100">
                  <p className="font-semibold text-slate-900 text-xs sm:text-sm whitespace-pre-wrap leading-relaxed break-keep">
                    {q.question}
                  </p>
                </div>

                {/* Model Answer */}
                <div className="p-3.5 sm:p-4 bg-emerald-50/40 border-b border-slate-100">
                  <span className="text-[11px] font-bold text-emerald-800 block mb-1">
                    정답 및 모범 해답
                  </span>
                  <div className="text-xs font-mono text-emerald-950 whitespace-pre-wrap break-keep bg-white/80 p-2.5 sm:p-3 rounded-lg border border-emerald-200">
                    {q.modelAnswer}
                  </div>
                </div>

                {/* Explanation */}
                {q.explanation && (
                  <div className="p-3.5 sm:p-4 bg-blue-50/30 border-b border-slate-100">
                    <span className="text-[11px] font-bold text-blue-800 flex items-center gap-1 mb-1">
                      <BookOpen className="w-3.5 h-3.5" /> 관련 해설
                    </span>
                    <p className="text-xs text-blue-950 whitespace-pre-wrap leading-relaxed break-keep bg-white/80 p-2.5 sm:p-3 rounded-lg border border-blue-200">
                      {q.explanation}
                    </p>
                  </div>
                )}

                {/* Memo section */}
                <div className="p-2.5 sm:p-3 bg-amber-50/30 flex items-center justify-between text-xs">
                  {isEditing ? (
                    <div className="w-full flex gap-1.5">
                      <input
                        type="text"
                        value={memoTexts[q.id] || ''}
                        onChange={(e) => setMemoTexts(prev => ({ ...prev, [q.id]: e.target.value }))}
                        placeholder="이 문제의 핵심 암기 포인트..."
                        className="flex-1 px-2.5 py-1 bg-white border border-amber-300 rounded text-xs text-slate-800 outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveMemo(q.id)}
                        className="px-2.5 py-1 bg-amber-600 text-white rounded text-xs font-bold hover:bg-amber-700 cursor-pointer shrink-0"
                      >
                        저장
                      </button>
                    </div>
                  ) : (
                    <div className="w-full flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 truncate">
                        <Edit3 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="text-slate-600 font-mono text-xs truncate">
                          {currentMemo ? `메모: ${currentMemo}` : '작성된 메모가 없습니다.'}
                        </span>
                        {savedNotifyId === q.id && (
                          <span className="text-emerald-600 text-[10px] font-bold shrink-0">저장됨!</span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditingMemoId(q.id)}
                        className="text-[11px] text-amber-700 hover:underline font-bold shrink-0 cursor-pointer"
                      >
                        {currentMemo ? '수정' : '+ 메모'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
