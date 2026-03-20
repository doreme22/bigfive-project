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
 * 构建深度报告 prompt — 结构化四大块
 *
 * 三种输入路径互斥：
 *   1. BFI-44 实测（scores 非空）
 *   2. MBTI 手动输入（mbtiType 非空）
 *   3. 荣格八维手动输入（jungScores 非空）
 * resume 始终存在。
 */
export function buildDeepReportPrompt(scores, jungScores, mbtiType, resume) {
  // --- 拼接人格数据 & 分析指引 ---
  let personalityBlock = '';
  let analysisGuide = '';

  if (scores) {
    const scoresStr = Object.entries(scores)
      .map(([dim, val]) => `${dimensionNames[dim]}(${dim}): ${val}`)
      .join(', ');
    const normsStr = Object.entries(norms)
      .map(([dim, val]) => `${dimensionNames[dim]}: ${val}`)
      .join(', ');
    personalityBlock = `【BFI-44 实测均分】${scoresStr}\n【中国青年样本常模】${normsStr}`;
    analysisGuide = `分析要点：
- 将每个维度得分与常模对比，关注偏离最大的维度（>0.5 为显著偏离）
- 维度间的组合效应比单一维度更重要（如高开放性+低尽责性 = 创意丰富但执行力不足）
- 重点挖掘分数中的"矛盾组合"（如高外向性+高神经质 = 热情但情绪波动大）作为内在张力
- 不要逐一复述五个维度的分数，聚焦最有洞察价值的 2-3 个发现`;
  } else if (mbtiType) {
    personalityBlock = `【MBTI 类型】${mbtiType.toUpperCase()}`;
    analysisGuide = `分析要点：
- 基于该 MBTI 类型的四个维度偏好（E/I, S/N, T/F, J/P）进行深层解读
- 不要停留在类型标签的通用描述，要结合简历中的实际经历推断该类型在此人身上的具体表现
- 关注该类型常见的盲区和成长方向
- 分析该类型在简历所属行业/岗位中的独特优势和潜在挑战`;
  } else if (jungScores) {
    const sorted = Object.entries(jungScores)
      .sort(([, a], [, b]) => b - a);
    const stackStr = sorted.map(([fn, val]) => `${fn}: ${val}`).join(', ');
    personalityBlock = `【荣格八维认知功能强度】${stackStr}（满分 100）`;
    analysisGuide = `分析要点：
- 识别主导功能（最高分）和辅助功能（第二高分），这两者构成核心认知模式
- 关注第三/第四功能的发展程度，它们代表成长空间
- 分析功能对的平衡（Ti-Te, Fi-Fe, Ni-Ne, Si-Se），失衡暗示认知盲区
- 将认知功能特征与简历中的职业选择和行为模式对应，找到一致性和矛盾点`;
  }

  return `你是一位精通心理学（大五人格、MBTI、荣格认知功能理论）和职业规划的资深专家。你的风格是：洞察犀利但表达温暖，像一位阅人无数的导师在跟年轻人促膝长谈。

---

【用户人格数据】
${personalityBlock}

【用户简历】
${resume}

${analysisGuide}

---

请严格按以下四个板块输出报告，使用 Markdown 格式，每个板块用 ## 作标题。

## 核心画像

**核心优势**（2-3 条）
用加粗短语开头，后接一段深入解读。不要泛泛说"你很有创造力"，要结合简历经历说明这个优势如何在此人身上具体体现。

**潜在短板**（2-3 条）
同上格式。指出真实的风险而非敷衍的"有时候可能会…"。

**内在张力**
找到此人性格中最有趣的矛盾点或独特组合，用一段话深入剖析。这是整份报告最体现洞察力的部分。

## 最佳战场

- **适合的公司类型**：文化氛围、公司阶段、团队规模，要具体到可执行（如"B 轮到 D 轮的科技公司"而非"创新型公司"）
- **适合的团队角色**：在团队中应扮演什么位置，为什么
- **理想搭档画像**：需要什么性格特质的上级和同事来互补，说明原因
- **最适合的岗位类型**：结合简历背景给出 2-3 个具体岗位方向，每个附一句理由

## 成长引擎

给出 3 条最关键的成长建议。每条用 ### 小标题，后接一段具体说明：
- 为什么这对此人特别重要（连接到性格特征）
- 具体怎么做（可操作的行动步骤，不要空泛的鸡汤）

## 寄语

> 用 1-2 句话收尾。要求：真诚、有力量感、与此人的性格特征呼应，避免万能金句。`;
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

请给出 3 条最关键的个人成长建议。其中至少 1 条需围绕"AI 时代下，该性格与背景的人应如何发展"展开，给出具体可操作的方向。

严格按以下 JSON 格式返回，不要包含其他文字：
[{"title": "建议标题(5字以内)", "description": "80字以内的具体建议"}]`;
}
