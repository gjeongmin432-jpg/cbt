export type Category = '화재예방과 소화방법' | '위험물안전관리법';

export type QuestionType = '단답형' | '서술형' | '계산형' | '단답·반응식' | string;

export interface Question {
  id: string; // e.g. "1-1"
  round: number; // 1 ~ 10
  number: number; // 1 ~ 20
  category: Category;
  type: QuestionType;
  question: string;
  modelAnswer: string;
  explanation: string;
}

export type GradeStatus = 'correct' | 'partial' | 'incorrect' | 'ungraded';

export interface UserAnswerRecord {
  questionId: string;
  userAnswer: string;
  gradeStatus: GradeStatus;
  score?: number; // e.g., out of 5
  isMarkedForReview?: boolean; // 검토 필요 마킹
  userMemo?: string;
  timestamp?: number;
}

export type ExamMode = 'round' | 'random_mock' | 'category' | 'incorrect_only' | 'bookmarked_only';

export interface ExamSession {
  id: string;
  title: string;
  mode: ExamMode;
  roundNumber?: number;
  categoryFilter?: Category;
  questions: Question[];
  userAnswers: Record<string, UserAnswerRecord>;
  timeRemainingSeconds: number; // default 90 min (5400)
  totalTimeSeconds: number;
  isCompleted: boolean;
  isGraded: boolean;
  startedAt: number;
  completedAt?: number;
}

export interface ExamResultSummary {
  sessionId: string;
  title: string;
  date: number;
  totalQuestions: number;
  correctCount: number;
  partialCount: number;
  incorrectCount: number;
  estimatedScore: number; // 100점 만점 환산 (기본 문항당 5점)
  isPassed: boolean; // 60점 이상
  categoryStats: {
    firePrev: { total: number; correct: number };
    hazmatLaw: { total: number; correct: number };
  };
}

export interface AppStats {
  totalSolved: number;
  totalCorrect: number;
  incorrectIds: string[];
  bookmarkedIds: string[];
  history: ExamResultSummary[];
}
