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

  return `你是一位精通心理学和职业规划的顶级专家。基于用户的 BFI-44 测评均分 {${scoresStr}}（常模参考：{${normsStr}}）和用户简历内容 {${resume}}。请写出一份极具洞察力的分析：
1. 性格底色：别复述分数，而是描述他是一个怎样的人；关注维度的交叉，尤其是其间最突出的冲突点或互补点；
2. 经历复盘：观察用户简历中的经历，对比他的性格：这份经历是顺着他的天性，还是逆着他的天性，解释他为什么能做成，或为什么会痛苦；
3. 职场推演：分析他在压力下的表现、团队合作中的角色、以及潜在的职业天花板。
4. 发展建议：
适合的职业方向：职业类型、公司类型；
适合的团队组合：适合承担什么角色，最需要配一个什么样性格的下属/老板？
行为改变建议。`;
}
