import { norms, dimensionNames } from '../data/questions';

/**
 * 计算 BFI-44 各维度均分
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
 * 构建发送给 AI 的基础 prompt
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

/**
 * 构建深度报告 prompt — 结构化四大块
 */
export function buildDeepReportPrompt(scores, jungScores, mbtiType, resume) {
  let personalityContext = '';

  if (scores) {
    const scoresStr = Object.entries(scores)
      .map(([dim, val]) => `${dimensionNames[dim]}(${dim}): ${val}`)
      .join(', ');
    const normsStr = Object.entries(norms)
      .map(([dim, val]) => `${dimensionNames[dim]}: ${val}`)
      .join(', ');
    personalityContext += `BFI-44 测评均分: {${scoresStr}}（常模参考：{${normsStr}}）`;
  }

  if (mbtiType) {
    if (personalityContext) personalityContext += '\n';
    personalityContext += `MBTI 类型: ${mbtiType}`;
  }
  if (jungScores) {
    if (personalityContext) personalityContext += '\n';
    personalityContext += `荣格八维认知功能: ${JSON.stringify(jungScores)}`;
  }

  return `角色定位：你是一位精通心理学和职业规划的顶级专家。

用户数据：
${personalityContext}
简历内容：${resume || '（未提供简历）'}

请严格按以下四大板块输出深度报告，使用 Markdown 格式。每个板块用 ## 作为标题。内容要深刻、具体、有洞察力，不要泛泛而谈。

## 核心画像
分析用户的核心优势（2-3条）、潜在短板（2-3条）、以及性格中最引人注目的内在张力或和谐点。不要复述分数，要像描述一个真实的人一样写。

## 最佳战场
- **适合的公司类型**：什么文化、规模、阶段的公司最能发挥其优势
- **适合的团队角色**：在团队中应扮演什么角色
- **理想搭档画像**：需要什么样的上级和同事互补
- **最适合的岗位类型**：2-3 个具体的岗位方向及原因

## 成长引擎
给出 3 条最关键的成长建议，每条包含：
- 建议标题（简短有力）
- 具体描述：为什么这对该用户重要，以及具体怎么做

## 寄语
用 1-2 句话给用户一个激励性但真诚的总结寄语。`;
}

/**
 * 构建岗位类型推荐 prompt
 */
export function buildJobRecommendationPrompt(scores, jungScores, resume) {
  let dataStr = '';
  if (scores) {
    const scoresStr = Object.entries(scores)
      .map(([dim, val]) => `${dimensionNames[dim]}(${dim}): ${val}`)
      .join(', ');
    dataStr += `BFI 性格数据: {${scoresStr}}`;
  }
  if (jungScores) {
    if (dataStr) dataStr += '，';
    dataStr += `荣格八维: ${JSON.stringify(jungScores)}`;
  }
  if (resume) {
    if (dataStr) dataStr += '，';
    dataStr += `简历摘要: ${resume.slice(0, 500)}`;
  }

  return `基于用户的${dataStr}

请推荐 2-3 个最适合的岗位类型方向。严格按以下 JSON 格式返回，不要包含其他文字：
[{"type": "岗位类型名称", "reason": "30字以内的推荐理由", "tags": ["标签1", "标签2"]}]`;
}

/**
 * 构建成长建议 prompt
 */
export function buildGrowthPrompt(scores, jungScores, resume) {
  let dataStr = '';
  if (scores) {
    const scoresStr = Object.entries(scores)
      .map(([dim, val]) => `${dimensionNames[dim]}(${dim}): ${val}`)
      .join(', ');
    dataStr += `BFI 性格数据: {${scoresStr}}`;
  }
  if (jungScores) {
    if (dataStr) dataStr += '，';
    dataStr += `荣格八维: ${JSON.stringify(jungScores)}`;
  }
  if (resume) {
    if (dataStr) dataStr += '，';
    dataStr += `简历摘要: ${resume.slice(0, 500)}`;
  }

  return `基于用户的${dataStr}

请给出 3 条最关键的个人成长建议。严格按以下 JSON 格式返回，不要包含其他文字：
[{"title": "建议标题(5字以内)", "description": "50字以内的具体建议", "tags": ["相关标签1", "相关标签2"]}]`;
}
