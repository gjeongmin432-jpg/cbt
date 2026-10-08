import { ExamResultSummary, ExamSession, UserAnswerRecord } from '../types';

const STORAGE_KEYS = {
  HISTORY: 'hazmat_cbt_history',
  BOOKMARKS: 'hazmat_cbt_bookmarks',
  INCORRECT_IDS: 'hazmat_cbt_incorrect_ids',
  ACTIVE_SESSION: 'hazmat_cbt_active_session',
  USER_MEMOS: 'hazmat_cbt_user_memos',
};

export const getStoredHistory = (): ExamResultSummary[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to parse history from storage', e);
    return [];
  }
};

export const saveExamResult = (result: ExamResultSummary) => {
  try {
    const history = getStoredHistory();
    const updated = [result, ...history.filter(h => h.sessionId !== result.sessionId)].slice(0, 50);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save exam result', e);
  }
};

export const getStoredBookmarks = (): string[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const toggleBookmark = (questionId: string): string[] => {
  const current = getStoredBookmarks();
  let updated: string[];
  if (current.includes(questionId)) {
    updated = current.filter(id => id !== questionId);
  } else {
    updated = [...current, questionId];
  }
  localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(updated));
  return updated;
};

export const getStoredIncorrectIds = (): string[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.INCORRECT_IDS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const addIncorrectIds = (ids: string[]): string[] => {
  const current = new Set(getStoredIncorrectIds());
  ids.forEach(id => current.add(id));
  const arr = Array.from(current);
  localStorage.setItem(STORAGE_KEYS.INCORRECT_IDS, JSON.stringify(arr));
  return arr;
};

export const removeIncorrectId = (id: string): string[] => {
  const current = getStoredIncorrectIds().filter(x => x !== id);
  localStorage.setItem(STORAGE_KEYS.INCORRECT_IDS, JSON.stringify(current));
  return current;
};

export const getStoredActiveSession = (): ExamSession | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const saveActiveSession = (session: ExamSession | null) => {
  if (!session) {
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
  } else {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION, JSON.stringify(session));
  }
};

export const getStoredMemos = (): Record<string, string> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_MEMOS);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

export const saveStoredMemo = (questionId: string, memo: string) => {
  const memos = getStoredMemos();
  if (!memo.trim()) {
    delete memos[questionId];
  } else {
    memos[questionId] = memo;
  }
  localStorage.setItem(STORAGE_KEYS.USER_MEMOS, JSON.stringify(memos));
};
