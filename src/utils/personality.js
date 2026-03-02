/**
 * MBTI / 荣格八维 → BFI 近似转换
 */

// MBTI 四字母 → BFI 五维度近似分
// 基于心理学文献中 MBTI-Big Five 对应关系
const MBTI_MAPPING = {
  // E/I → Extraversion
  E: { E: 3.8 },
  I: { E: 2.4 },
  // S/N → Openness
  S: { O: 2.8 },
  N: { O: 4.0 },
  // T/F → Agreeableness
  T: { A: 3.0 },
  F: { A: 4.2 },
  // J/P → Conscientiousness
  J: { C: 3.9 },
  P: { C: 2.7 },
};

export function mbtiToBfiApproximation(mbtiType) {
  if (!mbtiType || mbtiType.length !== 4) return null;
  const letters = mbtiType.toUpperCase().split('');

  const scores = { E: 3.1, A: 3.75, C: 3.36, N: 3.05, O: 3.69 }; // start from norms

  for (const letter of letters) {
    const mapping = MBTI_MAPPING[letter];
    if (mapping) {
      Object.assign(scores, mapping);
    }
  }

  // Neuroticism approximation: F + P types tend higher N
  if (letters.includes('F') && letters.includes('P')) {
    scores.N = 3.5;
  } else if (letters.includes('T') && letters.includes('J')) {
    scores.N = 2.5;
  }

  return scores;
}

// 荣格八维百分制 → BFI 近似分 (0-100 → 1.0-5.0)
export function jungToBfiApproximation(jungScores) {
  if (!jungScores) return null;
  const { Ti = 50, Te = 50, Fi = 50, Fe = 50, Ni = 50, Ne = 50, Si = 50, Se = 50 } = jungScores;

  const toScale = (v) => 1 + (v / 100) * 4; // 0-100 → 1.0-5.0

  // E: Se + Fe + Te + Ne (extraverted functions) vs Si + Fi + Ti + Ni
  const extravertedSum = Se + Fe + Te + Ne;
  const introvertedSum = Si + Fi + Ti + Ni;
  const eRatio = extravertedSum / (extravertedSum + introvertedSum || 1);
  const E = 1 + eRatio * 4;

  // A: Fe + Fi (feeling functions) weighted
  const A = toScale((Fe * 0.6 + Fi * 0.4));

  // C: Te + Si (structured functions)
  const C = toScale((Te * 0.5 + Si * 0.5));

  // N (neuroticism): inverse of Te+Si stability, weighted by Fi sensitivity
  const stability = (Te * 0.3 + Si * 0.3 + Ti * 0.2 + Se * 0.2);
  const N = toScale(100 - stability * 0.6 + Fi * 0.4);

  // O: Ne + Ni (intuitive functions)
  const O = toScale((Ne * 0.5 + Ni * 0.5));

  return {
    E: Math.round(Math.min(5, Math.max(1, E)) * 100) / 100,
    A: Math.round(Math.min(5, Math.max(1, A)) * 100) / 100,
    C: Math.round(Math.min(5, Math.max(1, C)) * 100) / 100,
    N: Math.round(Math.min(5, Math.max(1, N)) * 100) / 100,
    O: Math.round(Math.min(5, Math.max(1, O)) * 100) / 100,
  };
}

// 多来源合并，BFI 实测优先
export function mergePersonalityData(bfiScores, jungScores, mbtiType) {
  // If we have BFI actual test scores, use them as base
  if (bfiScores) return bfiScores;

  // Otherwise derive from manual input
  const jungDerived = jungToBfiApproximation(jungScores);
  const mbtiDerived = mbtiToBfiApproximation(mbtiType);

  if (jungDerived && mbtiDerived) {
    // Average both sources
    const merged = {};
    for (const dim of ['E', 'A', 'C', 'N', 'O']) {
      merged[dim] = Math.round(((jungDerived[dim] + mbtiDerived[dim]) / 2) * 100) / 100;
    }
    return merged;
  }

  return jungDerived || mbtiDerived || null;
}

// 生成简短性格标签
export function generatePersonalityTag(bfiScores, mbtiType) {
  const parts = [];
  if (mbtiType) parts.push(mbtiType.toUpperCase());

  if (bfiScores) {
    // Find highest dimension above norm
    const norms = { E: 3.10, A: 3.75, C: 3.36, N: 3.05, O: 3.69 };
    const labels = { E: '高外向性', A: '高宜人性', C: '高尽责性', N: '高情绪性', O: '高开放性' };
    const lowLabels = { E: '内向型', A: '独立型', C: '灵活型', N: '情绪稳定', O: '务实型' };

    let maxDiff = 0;
    let maxDim = null;
    for (const dim of ['E', 'A', 'C', 'N', 'O']) {
      const diff = Math.abs(bfiScores[dim] - norms[dim]);
      if (diff > maxDiff) {
        maxDiff = diff;
        maxDim = dim;
      }
    }
    if (maxDim && maxDiff > 0.2) {
      parts.push(bfiScores[maxDim] > norms[maxDim] ? labels[maxDim] : lowLabels[maxDim]);
    }
  }

  return parts.join(' · ') || '未知类型';
}
