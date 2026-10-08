import React, { useState, useEffect } from 'react';
import { Category, ExamResultSummary, ExamSession, GradeStatus } from './types';
import { createNewSession, generateRandomMockExam } from './utils/generator';
import {
  getStoredActiveSession,
  saveActiveSession,
  getStoredBookmarks,
  toggleBookmark as storageToggleBookmark,
  getStoredIncorrectIds,
  addIncorrectIds,
  removeIncorrectId,
  getStoredHistory,
  saveExamResult,
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { FormulaReferenceModal } from './components/FormulaReferenceModal';
import { HomeView } from './pages/HomeView';
import { ExamView } from './pages/ExamView';
import { ReviewView } from './pages/ReviewView';
import { IncorrectNotesView } from './pages/IncorrectNotesView';
import { StatsView } from './pages/StatsView';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'exam' | 'review' | 'incorrect' | 'stats'>('home');
  const [activeSession, setActiveSession] = useState<ExamSession | null>(() => getStoredActiveSession());
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => getStoredBookmarks());
  const [incorrectIds, setIncorrectIds] = useState<string[]>(() => getStoredIncorrectIds());
  const [history, setHistory] = useState<ExamResultSummary[]>(() => getStoredHistory());
  const [isReferenceOpen, setIsReferenceOpen] = useState<boolean>(false);

  // Sync activeSession to storage
  useEffect(() => {
    saveActiveSession(activeSession);
  }, [activeSession]);

  // Start round exam (1~10)
  const handleStartRound = (roundNumber: number) => {
    const session = createNewSession({ mode: 'round', roundNumber });
    setActiveSession(session);
    setCurrentView('exam');
  };

  // Start 7:13 random mock exam
  const handleStartRandomMock = () => {
    const session = createNewSession({ mode: 'random_mock' });
    setActiveSession(session);
    setCurrentView('exam');
  };

  // Start category focused exam
  const handleStartCategory = (category: Category) => {
    const session = createNewSession({ mode: 'category', categoryFilter: category });
    setActiveSession(session);
    setCurrentView('exam');
  };

  // Start incorrect clinic
  const handleStartIncorrectClinic = (targetIds?: string[]) => {
    const ids = targetIds || incorrectIds;
    if (ids.length === 0) {
      alert('등록된 오답이 없습니다. 모의고사를 먼저 응시해주세요!');
      return;
    }
    const session = createNewSession({
      mode: 'incorrect_only',
      customQuestionIds: ids,
      customTimeMinutes: Math.max(20, ids.length * 4),
    });
    setActiveSession(session);
    setCurrentView('exam');
  };

  // Start bookmark test
  const handleStartBookmarkTest = () => {
    if (bookmarkedIds.length === 0) {
      alert('북마크한 문항이 없습니다.');
      return;
    }
    const session = createNewSession({
      mode: 'bookmarked_only',
      customQuestionIds: bookmarkedIds,
      customTimeMinutes: Math.max(20, bookmarkedIds.length * 4),
    });
    setActiveSession(session);
    setCurrentView('exam');
  };

  // Update typing answer
  const handleUpdateAnswer = (questionId: string, answer: string) => {
    if (!activeSession) return;
    setActiveSession(prev => {
      if (!prev) return null;
      const prevRecord = prev.userAnswers[questionId] || {
        questionId,
        userAnswer: '',
        gradeStatus: 'ungraded',
      };
      return {
        ...prev,
        userAnswers: {
          ...prev.userAnswers,
          [questionId]: {
            ...prevRecord,
            userAnswer: answer,
          },
        },
      };
    });
  };

  // Toggle review flag
  const handleToggleFlag = (questionId: string) => {
    if (!activeSession) return;
    setActiveSession(prev => {
      if (!prev) return null;
      const prevRecord = prev.userAnswers[questionId] || {
        questionId,
        userAnswer: '',
        gradeStatus: 'ungraded',
      };
      return {
        ...prev,
        userAnswers: {
          ...prev.userAnswers,
          [questionId]: {
            ...prevRecord,
            isMarkedForReview: !prevRecord.isMarkedForReview,
          },
        },
      };
    });
  };

  // Toggle bookmark
  const handleToggleBookmark = (questionId: string) => {
    const updated = storageToggleBookmark(questionId);
    setBookmarkedIds(updated);
  };

  // Submit exam -> move to Review view
  const handleSubmitExam = () => {
    if (!activeSession) return;
    const completedSession: ExamSession = {
      ...activeSession,
      isCompleted: true,
      completedAt: Date.now(),
    };
    setActiveSession(completedSession);
    setCurrentView('review');
  };

  // Grade change in review view
  const handleGradeChange = (questionId: string, status: GradeStatus, score: number) => {
    if (!activeSession) return;
    setActiveSession(prev => {
      if (!prev) return null;
      const prevRecord = prev.userAnswers[questionId] || {
        questionId,
        userAnswer: '',
        gradeStatus: 'ungraded',
      };
      return {
        ...prev,
        userAnswers: {
          ...prev.userAnswers,
          [questionId]: {
            ...prevRecord,
            gradeStatus: status,
            score,
          },
        },
      };
    });
  };

  // Save exam results and update incorrect notes
  const handleSaveAndFinish = (summary: ExamResultSummary) => {
    saveExamResult(summary);
    setHistory(getStoredHistory());

    // Extract incorrect question IDs and store them
    if (activeSession) {
      const wrongIds = activeSession.questions
        .filter(q => {
          const rec = activeSession.userAnswers[q.id];
          return rec?.gradeStatus === 'incorrect' || rec?.gradeStatus === 'ungraded';
        })
        .map(q => q.id);

      if (wrongIds.length > 0) {
        const updatedWrong = addIncorrectIds(wrongIds);
        setIncorrectIds(updatedWrong);
      }
    }
  };

  // Remove incorrect from notes
  const handleRemoveIncorrect = (id: string) => {
    const updated = removeIncorrectId(id);
    setIncorrectIds(updated);
  };

  // Clear exam history
  const handleClearHistory = () => {
    localStorage.removeItem('hazmat_cbt_history');
    setHistory([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-800">
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        activeSession={activeSession}
        onTimeUp={handleSubmitExam}
        onSubmitExam={handleSubmitExam}
        onExitExam={() => {
          if (window.confirm('시험 화면을 나가시겠습니까? 진행 내용은 저장됩니다.')) {
            setCurrentView('home');
          }
        }}
        onOpenReference={() => setIsReferenceOpen(true)}
        incorrectCount={incorrectIds.length}
      />

      {/* Main View Router */}
      <main className="flex-1 pb-16">
        {currentView === 'home' && (
          <HomeView
            onStartRound={handleStartRound}
            onStartRandomMock={handleStartRandomMock}
            onStartCategory={handleStartCategory}
            onStartIncorrectClinic={() => handleStartIncorrectClinic()}
            onStartBookmarkTest={handleStartBookmarkTest}
            incorrectCount={incorrectIds.length}
            bookmarkCount={bookmarkedIds.length}
            history={history}
          />
        )}

        {currentView === 'exam' && activeSession && (
          <ExamView
            session={activeSession}
            onUpdateAnswer={handleUpdateAnswer}
            onToggleFlag={handleToggleFlag}
            onToggleBookmark={handleToggleBookmark}
            bookmarkedIds={bookmarkedIds}
            onSubmitExam={handleSubmitExam}
            onExitExam={() => setCurrentView('home')}
          />
        )}

        {currentView === 'review' && activeSession && (
          <ReviewView
            session={activeSession}
            onGradeChange={handleGradeChange}
            onToggleBookmark={handleToggleBookmark}
            bookmarkedIds={bookmarkedIds}
            onSaveAndFinish={handleSaveAndFinish}
            onStartIncorrectClinic={(ids) => handleStartIncorrectClinic(ids)}
            onBackToHome={() => setCurrentView('home')}
          />
        )}

        {currentView === 'incorrect' && (
          <IncorrectNotesView
            incorrectIds={incorrectIds}
            bookmarkedIds={bookmarkedIds}
            onRemoveIncorrect={handleRemoveIncorrect}
            onToggleBookmark={handleToggleBookmark}
            onStartRetest={(ids) => handleStartIncorrectClinic(ids)}
            onBackToHome={() => setCurrentView('home')}
          />
        )}

        {currentView === 'stats' && (
          <StatsView
            history={history}
            onClearHistory={handleClearHistory}
            onBackToHome={() => setCurrentView('home')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>위험물산업기사 실기(필답형) 전문 CBT 수험 플랫폼 | 200문항 기출 모의고사 완비</span>
          <span className="text-[11px] text-slate-400">화재예방과 소화방법 (문1~7) · 위험물안전관리법 (문8~20)</span>
        </div>
      </footer>

      {/* Reference Cheat Sheet Modal */}
      <FormulaReferenceModal
        isOpen={isReferenceOpen}
        onClose={() => setIsReferenceOpen(false)}
      />
    </div>
  );
};

export default App;
