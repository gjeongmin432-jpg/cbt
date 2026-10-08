import * as Diff from 'diff';

export interface DiffPart {
  value: string;
  added?: boolean;
  removed?: boolean;
}

/**
 * 모범답안(기준)과 사용자 답안을 비교하는 Diff 계산
 * 사용자가 빠뜨린 모범답안 단어: missing (diff상 제거로 표현되거나 추가로 표현)
 */
export function computeWordDiff(userAnswer: string, modelAnswer: string): DiffPart[] {
  const normUser = userAnswer.trim();
  const normModel = modelAnswer.trim();

  if (!normUser && !normModel) return [];
  if (!normUser) {
    return [{ value: normModel, added: true }];
  }
  if (!normModel) {
    return [{ value: normUser, removed: true }];
  }

  // standard word diff
  const changes = Diff.diffWordsWithSpace(normUser, normModel);
  return changes.map(change => ({
    value: change.value,
    added: change.added,
    removed: change.removed,
  }));
}

/**
 * 키워드 및 레벤슈타인/자카드 유사도 기반 채점 보조 도우미
 */
export function calculateSimilarity(userAnswer: string, modelAnswer: string): number {
  const u = userAnswer.toLowerCase().replace(/[\s\r\n.,\-·()[\]{}:;'"\/]/g, '');
  const m = modelAnswer.toLowerCase().replace(/[\s\r\n.,\-·()[\]{}:;'"\/]/g, '');

  if (!u || !m) return 0;
  if (u === m) return 100;

  // 2-gram jaccard similarity
  const getBigrams = (str: string) => {
    const s = new Set<string>();
    for (let i = 0; i < str.length - 1; i++) {
      s.add(str.slice(i, i + 2));
    }
    return s;
  };

  const bgU = getBigrams(u);
  const bgM = getBigrams(m);

  if (bgU.size === 0 || bgM.size === 0) {
    return u === m ? 100 : 0;
  }

  let intersection = 0;
  bgU.forEach(bg => {
    if (bgM.has(bg)) intersection++;
  });

  const union = new Set([...bgU, ...bgM]).size;
  const ratio = (intersection / union) * 100;
  return Math.min(100, Math.round(ratio));
}

/**
 * 채점 제안 상태 계산
 */
export function suggestGrade(userAnswer: string, modelAnswer: string): 'correct' | 'partial' | 'incorrect' {
  if (!userAnswer.trim()) return 'incorrect';
  const sim = calculateSimilarity(userAnswer, modelAnswer);
  if (sim >= 75) return 'correct';
  if (sim >= 35) return 'partial';
  return 'incorrect';
}
