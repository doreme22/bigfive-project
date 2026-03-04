/**
 * 人格数据工具函数
 *
 * 注意：MBTI / 荣格八维与大五人格属于不同理论框架，
 * 不做跨框架的近似映射。手动输入 MBTI/荣格数据时，
 * 不生成 BFI 近似分，结果页仅展示 AI 深度报告。
 */

// 多来源合并 — 仅返回真实 BFI 实测分数
export function mergePersonalityData(bfiScores, jungScores, mbtiType) {
  return bfiScores || null;
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
