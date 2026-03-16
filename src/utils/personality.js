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

// 荣格功能 → 通俗特质标签
const jungTraitLabels = {
  Ni: '洞察型', Ne: '发散型',
  Ti: '分析型', Te: '效率型',
  Fi: '理想型', Fe: '共情型',
  Si: '稳健型', Se: '行动型',
};

// 生成简短性格标签
export function generatePersonalityTag(bfiScores, mbtiType, jungScores) {
  const parts = [];

  // MBTI 类型
  if (mbtiType) parts.push(mbtiType.toUpperCase());

  // BFI 最突出维度
  if (bfiScores) {
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
    } else {
      parts.push('均衡型');
    }
  }

  // 荣格八维主导功能（仅在无 MBTI 且无 BFI 时使用）
  if (!mbtiType && !bfiScores && jungScores) {
    const sorted = Object.entries(jungScores)
      .filter(([, v]) => v > 0)
      .sort(([, a], [, b]) => b - a);
    if (sorted.length >= 2) {
      parts.push(jungLabels[sorted[0][0]] + '-' + jungLabels[sorted[1][0]]);
    } else if (sorted.length === 1) {
      parts.push(jungLabels[sorted[0][0]] + '主导');
    }
  }

  return parts.join(' · ') || '未知类型';
}
