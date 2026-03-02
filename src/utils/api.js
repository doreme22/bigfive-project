import { buildDeepReportPrompt, buildJobRecommendationPrompt, buildGrowthPrompt } from './scoring';

const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.openai.com/v1',
  apiKey: import.meta.env.VITE_API_KEY || '',
  model: import.meta.env.VITE_MODEL || 'gpt-4o-mini',
};

/**
 * 调用大模型生成深度报告（流式）
 */
export async function generateReport(scores, jungScores, mbtiType, resume, onStream) {
  const prompt = buildDeepReportPrompt(scores, jungScores, mbtiType, resume);

  if (!API_CONFIG.apiKey) {
    return generateMockReport(scores, resume, onStream);
  }

  const response = await fetch(`${API_CONFIG.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_CONFIG.apiKey}`,
    },
    body: JSON.stringify({
      model: API_CONFIG.model,
      messages: [
        {
          role: 'system',
          content: '你是一位精通心理学和职业规划的顶级专家。请用中文回答，使用 Markdown 格式。',
        },
        { role: 'user', content: prompt },
      ],
      stream: true,
      temperature: 0.8,
      max_tokens: 3000,
    }),
  });

  if (!response.ok) {
    throw new Error(`API 请求失败: ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullText = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n').filter((line) => line.startsWith('data: '));

    for (const line of lines) {
      const data = line.slice(6);
      if (data === '[DONE]') break;

      try {
        const parsed = JSON.parse(data);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) {
          fullText += content;
          onStream?.(fullText);
        }
      } catch {
        // skip malformed chunks
      }
    }
  }

  return fullText;
}

/**
 * 生成岗位类型推荐（结构化 JSON）
 */
export async function generateJobTypeRecommendations(scores, jungScores, resume) {
  if (!API_CONFIG.apiKey) {
    return generateMockJobTypeRecs(scores);
  }

  const prompt = buildJobRecommendationPrompt(scores, jungScores, resume);

  try {
    const response = await fetch(`${API_CONFIG.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_CONFIG.apiKey}`,
      },
      body: JSON.stringify({
        model: API_CONFIG.model,
        messages: [
          { role: 'system', content: '你是职业规划专家。请严格按JSON格式返回。' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const json = await response.json();
    const text = json.choices?.[0]?.message?.content || '';
    const match = text.match(/\[[\s\S]*\]/);
    return match ? JSON.parse(match[0]) : generateMockJobTypeRecs(scores);
  } catch {
    return generateMockJobTypeRecs(scores);
  }
}

/**
 * 生成成长建议（结构化 JSON）
 */
export async function generateGrowthSuggestions(scores, jungScores, resume) {
  if (!API_CONFIG.apiKey) {
    return generateMockGrowthSuggestions(scores);
  }

  const prompt = buildGrowthPrompt(scores, jungScores, resume);

  try {
    const response = await fetch(`${API_CONFIG.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_CONFIG.apiKey}`,
      },
      body: JSON.stringify({
        model: API_CONFIG.model,
        messages: [
          { role: 'system', content: '你是职业规划专家。请严格按JSON格式返回。' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const json = await response.json();
    const text = json.choices?.[0]?.message?.content || '';
    const match = text.match(/\[[\s\S]*\]/);
    return match ? JSON.parse(match[0]) : generateMockGrowthSuggestions(scores);
  } catch {
    return generateMockGrowthSuggestions(scores);
  }
}

// --- Mock generators ---

function generateMockJobTypeRecs(scores) {
  const { E, A, C, N, O } = scores;
  const recs = [];

  if (O > 3.69 && E > 3.10) {
    recs.push({ type: '产品管理/战略咨询', reason: '高开放性与外向性的组合适合需要创新与沟通的角色', tags: ['创新', '沟通', '策略'] });
  } else if (O > 3.69) {
    recs.push({ type: '研究分析/UX设计', reason: '高开放性适合需要深度思考和创造力的工作', tags: ['研究', '创新', '设计'] });
  } else {
    recs.push({ type: '项目管理/运营管理', reason: '务实稳健的特质适合结构化的管理岗位', tags: ['管理', '执行', '流程'] });
  }

  if (C > 3.36) {
    recs.push({ type: '技术架构/数据分析', reason: '高尽责性确保能胜任需要持续精进的技术岗位', tags: ['技术', '精确', '系统'] });
  } else {
    recs.push({ type: '业务拓展/活动策划', reason: '灵活适应的特质适合多变的业务环境', tags: ['灵活', '社交', '创意'] });
  }

  if (A > 3.75 && E > 3.10) {
    recs.push({ type: '人力资源/客户成功', reason: '高宜人性和外向性组合适合人际关系密集型工作', tags: ['人际', '协作', '服务'] });
  }

  return recs.slice(0, 3);
}

function generateMockGrowthSuggestions(scores) {
  const { E, A, C, N, O } = scores;
  const suggestions = [];

  if (N > 3.05) {
    suggestions.push({
      title: '情绪转化训练',
      description: '建立"焦虑→行动"转化机制，每次焦虑时写下担忧和最小可执行步骤，打断内耗循环。',
      tags: ['情绪管理', '焦虑', '情绪稳定'],
    });
  }

  if (E < 3.10) {
    suggestions.push({
      title: '弱关系经营',
      description: '每周花15分钟给一位欣赏但不太熟的人发一条有价值的消息，维护职场"存在感"。',
      tags: ['社交', '人际关系', '外向性提升'],
    });
  }

  if (C < 3.36) {
    suggestions.push({
      title: '两分钟启动法',
      description: '任何任务，先做两分钟再决定是否继续。行动本身就是创造状态的最佳方式。',
      tags: ['执行力', '习惯养成', '尽责性提升'],
    });
  }

  if (O < 3.69) {
    suggestions.push({
      title: '舒适区挑战',
      description: '每月刻意尝试一件新事物——新技能、新社交圈或新思考框架，保持认知弹性。',
      tags: ['开放性提升', '创新', '认知升级'],
    });
  }

  if (A > 3.75 && N > 3.05) {
    suggestions.push({
      title: '健康拒绝术',
      description: '练习不含歉意的拒绝：直接说"这个我做不了"，而非"不好意思可能没时间"。',
      tags: ['边界', '宜人性', '自我保护'],
    });
  }

  // Ensure at least 3
  while (suggestions.length < 3) {
    suggestions.push({
      title: '反直觉挑战',
      description: '定期做一件不在舒适区内的事，保持一点摩擦感是对抗性格"舒适陷阱"的最佳方式。',
      tags: ['成长', '自我认知', '挑战'],
    });
  }

  return suggestions.slice(0, 3);
}

/**
 * Mock 深度报告生成（结构化四大块）
 */
async function generateMockReport(scores, resume, onStream) {
  const { E, A, C, N, O } = scores;
  const highE = E > 3.10, highA = A > 3.75, highC = C > 3.36, highN = N > 3.05, highO = O > 3.69;

  // Core profile
  let strengths = [];
  let weaknesses = [];
  let tension = '';

  if (highO) strengths.push('**创造力与好奇心**：你拥有超出常人的想象力和对新事物的渴望，能在别人看到障碍的地方看到可能性');
  if (highC) strengths.push('**执行力与自律**：你有强烈的完成驱动力，设定目标后会坚持不懈地推进');
  if (highE) strengths.push('**社交能量与感染力**：你天然具备影响他人的能力，在群体中是能量的发射器');
  if (highA) strengths.push('**共情与协作**：你能敏锐感知他人的情绪和需求，这让你成为团队中的"粘合剂"');
  if (!highN) strengths.push('**情绪锚定**：你的情绪像压舱石，在风浪中也能稳住自己和团队');

  if (highN) weaknesses.push('**过度敏感的内在噪音**：你的高情绪灵敏度是把双刃剑，容易陷入反刍思维和不必要的自我怀疑');
  if (!highC) weaknesses.push('**启动容易坚持难**：你可能不缺想法但缺乏系统性地执行到底的耐力');
  if (!highE) weaknesses.push('**低能见度陷阱**：你的贡献可能远大于你的"存在感"，在强调曝光的职场文化中吃亏');
  if (!highA) weaknesses.push('**人际摩擦风险**：你的高标准和直接表达方式可能在非竞争性文化中引发冲突');
  if (!highO) weaknesses.push('**舒适区惯性**：对新事物的审慎态度可能让你在快速变化的行业中反应偏慢');

  if (highE && highN) {
    tension = '你性格中最引人注目的张力在于：外向性与神经质同时偏高。你渴望被看见、被认可，但内心又容易被他人的反应所撼动。你不是天生的"社牛"，而是一个用力表达的敏感者——这让你既有感染力，又比多数人更容易情绪透支。';
  } else if (!highE && highO) {
    tension = '你有一组有趣的对照：内向沉稳与高度开放并存。你的内心世界异常丰富，但你并不急于在社交场合中展示。你更像一个安静的探索者，在独处中完成最深刻的思考和创造。';
  } else if (highC && !highA) {
    tension = '高尽责性与较低的宜人性构成了你最锐利的棱角：你对结果有极高的标准，但不会因为照顾别人的感受而降低要求。这让你在需要突破的场景中极具价值，但也需要注意人际成本。';
  } else {
    tension = '你的五维特质较为均衡，适应力强。硬币的另一面是：缺少鲜明的性格标签也可能让你在竞争中不够"被记住"。找到并放大你最突出的一个维度，是打造个人品牌的关键。';
  }

  // Best battlefield
  const companyType = highN
    ? '文化宽松、心理安全感高的组织——氛围好的成长型团队，或成熟企业中重视员工关怀的部门'
    : (highE ? '快节奏、强互动的环境——互联网公司、咨询公司、或任何鼓励开放沟通的团队' : '允许独立工作、看重交付质量的环境——远程友好的公司，或技术驱动型团队');

  const teamRole = highE
    ? (highC ? '项目负责人或团队 Lead——你既有推动力又有执行力' : '对外沟通和资源整合者——你负责打开局面和建立连接')
    : (highA ? '导师、协调者或二号位——在后方稳住阵地' : '深度技术专家或独立顾问——在专业领域建立不可替代性');

  const partner = highE
    ? '你需要一个**高尽责性的执行搭档**帮你落地想法，以及一个**不微观管理的上级**给你空间发挥'
    : '你需要一个**高外向性的搭档**帮你处理社交和对外沟通，以及一个**高宜人性的上级**理解你的工作方式';

  const careerTypes = highO
    ? (highE ? '战略咨询、产品管理、创业、市场营销策划' : '研究分析、UX 设计、内容策略、数据科学')
    : (highC ? '项目管理、运营管理、财务分析、质量管控' : '客户成功、活动运营、业务拓展');

  // Growth engine
  const growthItems = [];
  if (highN) growthItems.push('### 建立"焦虑转化"机制\n每次感到焦虑时，用 2 分钟写下"我在担心什么"和"我现在能做的最小一步是什么"。把模糊的恐惧转化为具体的行动，打断焦虑的自我循环。长期坚持，你会发现焦虑从"敌人"变成了"早期预警系统"。');
  if (!highE) growthItems.push('### 刻意经营"弱关系"\n每周花 15 分钟给一位不太熟但你欣赏的人发一条有内容的消息。不需要社交，只需要"存在感维护"。职业发展中 70% 的机会来自弱关系网络。');
  if (!highC) growthItems.push('### 采用"两分钟规则"\n任何能在两分钟内启动的任务，立刻开始。对你来说，行动本身就是创造状态的最佳方式。配合一个简单的 TODO 清单工具，把大目标拆成小到不可能失败的步骤。');
  if (highA && highN) growthItems.push('### 练习"不含歉意的拒绝"\n下次想说"不"的时候，直接说"这个我做不了"，而不是"不好意思啊我可能没时间"。你的宜人性会让你想道歉，但你的情绪敏感性会因为道歉而更焦虑。健康的边界是最好的情绪防护墙。');
  if (growthItems.length < 3) growthItems.push('### 定期做"反直觉挑战"\n每月刻意做一件不在你舒适区内的事——参加一场社交活动、学一个完全陌生的技能、或者主动向别人征求负面反馈。保持一点摩擦感，是对抗性格"舒适陷阱"的最佳方式。');

  // Summary quote
  const quote = highO
    ? '你手中的牌比你以为的好得多。别让敏感成为犹豫的借口，让它成为你洞察世界的超能力。'
    : '性格不是命运，但它是你手中最熟悉的牌。高手不是换一副牌，而是用已有的牌打出最好的组合。';

  const report = `## 核心画像

**核心优势**

${strengths.slice(0, 3).join('\n\n')}

**潜在短板**

${weaknesses.slice(0, 3).join('\n\n')}

**内在张力**

${tension}

## 最佳战场

**适合的公司类型**：${companyType}

**适合的团队角色**：${teamRole}

**理想搭档画像**：${partner}

**最适合的岗位类型**：${careerTypes}

## 成长引擎

${growthItems.slice(0, 3).join('\n\n')}

## 寄语

> *「${quote}」*`;

  // Simulate streaming
  const chars = report.split('');
  let current = '';
  for (let i = 0; i < chars.length; i++) {
    current += chars[i];
    if (i % 3 === 0) {
      onStream?.(current);
      await new Promise((r) => setTimeout(r, 5));
    }
  }
  onStream?.(report);
  return report;
}
