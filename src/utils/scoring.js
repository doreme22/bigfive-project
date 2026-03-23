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

请严格按以下四个板块输出报告。直接从第一个板块开始，不要写任何开场白、引言或总结性前言。

【格式硬性要求】
- 四个板块标题分别为：## 核心画像、## 最佳战场、## 成长引擎、## 寄语（两个 # 号 + 空格 + 标题，不要添加额外的 # 号或序号）
- 全文禁止使用列表符号（* - 1. 等），所有内容用连续段落表达
- 加粗格式统一使用 **文字** 语法

【板块一：核心画像】

包含三个子项：**核心优势**、**潜在短板**、**内在张力**，每个子项标题独占一行。

核心优势写 2-3 条，潜在短板写 2-3 条。每一条的格式严格如下（标题和描述在同一段，用中文冒号连接）：

**加粗短语标题**：描述内容描述内容描述内容。

示例：
**数据驱动的决策者**：你的 STATA/R 技能不只是简历上的标签，四段科研经历说明你已经形成了"用数据说话"的思维习惯，这种将模糊问题转化为可量化变量的能力在职场中极为稀缺。

内在张力写一整段话，不拆分条目。

不要泛泛说"你很有创造力"，要结合简历经历说明优势如何具体体现。短板要指出真实风险，不要敷衍。内在张力要找到此人性格中最有趣的矛盾组合，这是整份报告最体现洞察力的部分。

【板块二：最佳战场】

包含四个子项，每个子项格式为 **标题**：内容（标题和内容在同一段落，禁止展开成多行或嵌套）：

**适合的公司类型**：文化氛围、公司阶段、团队规模，要具体到可执行（如"B轮到D轮的科技公司"而非"创新型公司"）
**适合的团队角色**：在团队中应扮演什么位置，为什么
**理想搭档画像**：需要什么性格特质的上级和同事来互补，说明原因
**最适合的岗位类型**：结合简历背景给出 2-3 个具体岗位方向，每个附一句理由

【板块三：成长引擎】

严格包含三个子模块，每个用 ### 作标题（三个 # 号 + 空格 + 标题，不要添加额外的 # 号）。禁止空泛鸡汤。每个子模块内部可以自由使用多段落描述，但不要再添加 ### 或 ## 级别的标题。

三个子模块：
### AI 时代突围 — 结合性格特征和简历背景，说清楚 AI 替代不了此人的什么能力，以及该如何利用 AI 放大自身优势
### 习惯养成 — 针对最突出的性格短板，给出 1-2 个"每周做 X"级别的可操作行为处方
### 技能训练 — 结合简历背景和推荐的岗位方向，列出 1-2 个最该补的具体技能，说明为什么以及从哪里开始

【板块四：寄语】

用 > 引用格式写 1-2 句话收尾。要求真诚、有力量感、与此人的性格特征呼应，避免万能金句。`;
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

