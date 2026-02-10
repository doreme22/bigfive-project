import { norms, dimensionNames } from '../data/questions';

/**
 * 计算 BFI-44 各维度均分
 * @param {Object} answers - { questionId: selectedValue }
 * @param {Array} questions - 题目数组
 * @returns {Object} - { E: 3.5, A: 4.0, ... }
 */
export function calculateScores(answers, questions) {
  const dimensionSums = { E: 0, A: 0, C: 0, N: 0, O: 0 };
  const dimensionCounts = { E: 0, A: 0, C: 0, N: 0, O: 0 };

  questions.forEach((q) => {
    const raw = answers[q.id];
    if (raw === undefined) return;

    const score = q.reverse ? 6 - raw : raw;
    dimensionSums[q.dimension] += score;
    dimensionCounts[q.dimension] += 1;
  });

  const scores = {};
  for (const dim of Object.keys(dimensionSums)) {
    scores[dim] = dimensionCounts[dim] > 0
      ? Math.round((dimensionSums[dim] / dimensionCounts[dim]) * 100) / 100
      : 0;
  }

  return scores;
}

/**
 * 与常模对比
 */
export function compareWithNorms(scores) {
  const comparison = {};
  for (const dim of Object.keys(scores)) {
    const diff = scores[dim] - norms[dim];
    comparison[dim] = {
      score: scores[dim],
      norm: norms[dim],
      diff: Math.round(diff * 100) / 100,
      label: dimensionNames[dim],
      level: diff > 0.5 ? '显著偏高' : diff > 0.2 ? '偏高' : diff < -0.5 ? '显著偏低' : diff < -0.2 ? '偏低' : '接近常模',
    };
  }
  return comparison;
}

/**
 * 构建发送给 AI 的 prompt
 */
export function buildPrompt(scores, resume) {
  const scoresStr = Object.entries(scores)
    .map(([dim, val]) => `${dimensionNames[dim]}(${dim}): ${val}`)
    .join(', ');

  const normsStr = Object.entries(norms)
    .map(([dim, val]) => `${dimensionNames[dim]}: ${val}`)
    .join(', ');

  return `角色定位：你是一位精通心理学和职业规划的顶级专家，擅长从干燥的分数和简历文字中，还原一个活生生的人。
基于用户的 BFI-44 测评均分 {${scoresStr}}（常模参考：{${normsStr}}）和简历内容 {${resume}}，请按以下结构，以第一人称请写出一份极具洞察力的深度报告。
1. 性格底色
别复述分数，而是结合简历描述用户是一个怎样的人，如认知模式、驱动力来源、分数中最不和谐或最和谐的张力点。
2. 职场推演
模拟高压场景、冲突解决模式、以及基于性格惯性的职业天花板预警。
3. 发展指南
必须结合简历专业背景给出赛道建议；设计理想的团队配对；针对其性格短板提供具体的行为代偿建议。`;
}
