import questionsData from '../data/questions.json';
import { Category, ExamMode, ExamSession, Question, UserAnswerRecord } from '../types';

export const ALL_QUESTIONS: Question[] = questionsData as Question[];

export const FIRE_PREV_QUESTIONS = ALL_QUESTIONS.filter(q => q.category === '화재예방과 소화방법');
export const HAZMAT_LAW_QUESTIONS = ALL_QUESTIONS.filter(q => q.category === '위험물안전관리법');

// Fisher-Yates shuffle
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * 7:13 비율 실전 랜덤 모의고사 생성
 * 화재예방과 소화방법 7문항 + 위험물안전관리법 13문항 = 총 20문항
 */
export function generateRandomMockExam(): Question[] {
  const selectedFire = shuffleArray(FIRE_PREV_QUESTIONS).slice(0, 7);
  const selectedHazmat = shuffleArray(HAZMAT_LAW_QUESTIONS).slice(0, 13);

  // 번호 부여: 1~7번 화재예방, 8~20번 위험물안전관리법 (실제 시험 번호 체계와 완벽 일치)
  const combined = [
    ...selectedFire.map((q, idx) => ({ ...q, number: idx + 1 })),
    ...selectedHazmat.map((q, idx) => ({ ...q, number: idx + 8 }))
  ];

  return combined;
}

/**
 * 지정된 회차(1~10회)의 문제 20문항 로드
 */
export function getRoundExam(roundNumber: number): Question[] {
  return ALL_QUESTIONS.filter(q => q.round === roundNumber).sort((a, b) => a.number - b.number);
}

/**
 * 특정 질문 ID 목록으로 시험지 구성 (오답노트, 북마크 등)
 */
export function getQuestionsByIds(ids: string[]): Question[] {
  const idSet = new Set(ids);
  return ALL_QUESTIONS.filter(q => idSet.has(q.id)).map((q, idx) => ({
    ...q,
    number: idx + 1
  }));
}

/**
 * 과목별 문제 목록 구성
 */
export function getCategoryQuestions(category: Category, count: number = 20): Question[] {
  const pool = category === '화재예방과 소화방법' ? FIRE_PREV_QUESTIONS : HAZMAT_LAW_QUESTIONS;
  return shuffleArray(pool).slice(0, count).map((q, idx) => ({
    ...q,
    number: idx + 1
  }));
}

/**
 * 신규 시험 세션 생성 팩토리
 */
export function createNewSession(options: {
  mode: ExamMode;
  roundNumber?: number;
  categoryFilter?: Category;
  customQuestionIds?: string[];
  customTimeMinutes?: number;
}): ExamSession {
  let questions: Question[] = [];
  let title = '실전 모의고사';

  if (options.mode === 'round' && options.roundNumber) {
    questions = getRoundExam(options.roundNumber);
    title = `제${options.roundNumber}회 정규 모의고사`;
  } else if (options.mode === 'random_mock') {
    questions = generateRandomMockExam();
    title = '실전 랜덤 모의고사 (7:13 비율)';
  } else if (options.mode === 'category' && options.categoryFilter) {
    questions = getCategoryQuestions(options.categoryFilter, 20);
    title = `${options.categoryFilter} 집중 트레이닝`;
  } else if (options.mode === 'incorrect_only' && options.customQuestionIds) {
    questions = getQuestionsByIds(options.customQuestionIds);
    title = `오답 집중 클리닉 (${questions.length}문항)`;
  } else if (options.mode === 'bookmarked_only' && options.customQuestionIds) {
    questions = getQuestionsByIds(options.customQuestionIds);
    title = `북마크 점검 테스트 (${questions.length}문항)`;
  } else {
    questions = getRoundExam(1);
    title = '제1회 정규 모의고사';
  }

  const initialUserAnswers: Record<string, UserAnswerRecord> = {};
  questions.forEach(q => {
    initialUserAnswers[q.id] = {
      questionId: q.id,
      userAnswer: '',
      gradeStatus: 'ungraded',
      isMarkedForReview: false,
    };
  });

  const totalMinutes = options.customTimeMinutes || (questions.length <= 10 ? 45 : 90);
  const totalSeconds = totalMinutes * 60;

  return {
    id: `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    title,
    mode: options.mode,
    roundNumber: options.roundNumber,
    categoryFilter: options.categoryFilter,
    questions,
    userAnswers: initialUserAnswers,
    timeRemainingSeconds: totalSeconds,
    totalTimeSeconds: totalSeconds,
    isCompleted: false,
    isGraded: false,
    startedAt: Date.now(),
  };
}
