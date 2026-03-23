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
export function generatePersonalityTag(bfiScores, mbtiType, jungScores) {
  const parts = [];

  // MBTI 类型
  if (mbtiType) parts.push(mbtiType.toUpperCase());

  // BFI 高+低突出维度
  if (bfiScores) {
    const norms = { E: 3.10, A: 3.75, C: 3.36, N: 3.05, O: 3.69 };
    const dimNames = { E: '外向性', A: '宜人性', C: '尽责性', N: '神经质', O: '开放性' };

    let bestHigh = null, bestHighDiff = 0;
    let bestLow = null, bestLowDiff = 0;
    for (const dim of ['E', 'A', 'C', 'N', 'O']) {
      const diff = bfiScores[dim] - norms[dim];
      if (diff > 0.2 && diff > bestHighDiff) {
        bestHighDiff = diff;
        bestHigh = dim;
      }
      if (diff < -0.2 && Math.abs(diff) > bestLowDiff) {
        bestLowDiff = Math.abs(diff);
        bestLow = dim;
      }
    }

    if (bestHigh && bestLow) {
      parts.push('高' + dimNames[bestHigh] + ' · ' + '低' + dimNames[bestLow]);
    } else if (bestHigh) {
      parts.push('高' + dimNames[bestHigh]);
    } else if (bestLow) {
      parts.push('低' + dimNames[bestLow]);
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
      parts.push(sorted[0][0] + '-' + sorted[1][0]);
    } else if (sorted.length === 1) {
      parts.push(sorted[0][0]);
    }
  }

  return parts.join(' · ') || '未知类型';
}
