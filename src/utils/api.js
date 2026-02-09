import { buildPrompt } from './scoring';

const API_CONFIG = {
  // 默认使用 OpenAI 兼容接口，用户可在 .env 中配置
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.openai.com/v1',
  apiKey: import.meta.env.VITE_API_KEY || '',
  model: import.meta.env.VITE_MODEL || 'gpt-4o-mini',
};

/**
 * 调用大模型生成分析报告
 */
export async function generateReport(scores, resume, onStream) {
  const prompt = buildPrompt(scores, resume);

  if (!API_CONFIG.apiKey) {
    // 无 API Key 时返回模拟报告
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
 * 无 API Key 时的模拟报告生成
 */
async function generateMockReport(scores, resume, onStream) {
  const { E, A, C, N, O } = scores;

  // 找出最突出的冲突点/互补点
  const highE = E > 3.10, highA = A > 3.75, highC = C > 3.36, highN = N > 3.05, highO = O > 3.69;

  let conflict = '';
  if (highE && highN) {
    conflict = '你性格中最引人注目的张力在于：外向性与神经质同时偏高。你渴望走向人群、被看见、被认可，但内心深处又容易被他人的反应所撼动。你在社交中游刃有余的表象之下，可能藏着一颗高度警觉的心。这意味着你不是天生的"社牛"，而是一个用力表达的敏感者。';
  } else if (!highE && highO) {
    conflict = '你性格中有一组有趣的对照：内向沉稳与高度开放并存。你的内心世界异常丰富——充满了好奇、想象和对新事物的渴望，但你并不急于在社交场合中展示这一切。你更像一个安静的探索者，在独处中完成最深刻的思考。';
  } else if (highA && !highN) {
    conflict = '你的宜人性与情绪稳定性构成了一组强大的互补：你既有温和待人的善意，又有稳住自己不被他人情绪裹挟的能力。这让你成为团队中那种"温柔而坚定"的存在——别人会觉得你好相处，却也不好糊弄。';
  } else if (highC && !highA) {
    conflict = '高尽责性与较低的宜人性构成了你性格中最锐利的棱角：你对结果有极高的标准，但不会因为照顾别人的感受而降低要求。你可能会被认为"不近人情"，但事实上你只是把做事的标准放在了讨好别人前面。';
  } else if (highN && !highC) {
    conflict = '情绪敏感与较低的尽责性之间存在潜在的冲突回路：你容易因焦虑而启动行动，却又难以靠自律把事情推到终点。结果往往是——开了很多头、担了很多心，但完成率却不匹配你付出的情绪成本。';
  } else {
    conflict = '你五个维度的分数较为均衡，没有特别极端的撕裂感。这意味着你是一个适应力较强的人，在不同场景下都能找到合理的应对方式。但硬币的另一面是：缺少鲜明的性格标签也可能让你在竞争中不够"被记住"。';
  }

  // 经历复盘
  let experienceSection = '';
  if (resume) {
    experienceSection = `从你的简历来看，你的职业轨迹与性格之间存在着值得深思的关系。

${highC ? '你的高尽责性是推动你一路走来的核心引擎。简历中那些需要持续投入、长期打磨的经历，大概率是你主动选择并坚持下来的——因为你天生就有把事情做完的驱动力。' : '以你的尽责性水平，那些要求高度自律和长期坚持的经历，可能并非你做得最舒服的部分。如果你在这些经历中感到过挣扎，那不是能力问题，而是天性使然。'}

${highE ? '你简历中涉及人际互动、团队协作或对外展示的经历，应该是你做得最自然、最有成就感的部分。你的外向性让你在这类场景中获得能量，而非消耗能量。' : '你简历中那些需要大量社交或曝光的经历，可能是你用意志力在"逆风飞行"。你完成了，但代价可能比别人更大——因为你的能量回路更偏向独处和深度工作。'}

${highN ? '值得注意的是，你的情绪敏感度偏高。这意味着在简历上看起来光鲜的经历背后，你可能承受了比常人更大的心理负荷。你的"做成了"背后，也许有别人看不见的内耗。' : '你的情绪稳定性是你职业生涯中一笔隐性资产。那些压力山大的时刻，你比多数人更能稳住阵脚，这在简历上看不出来，但在真实的工作场景中，它是决定成败的底层能力。'}`;
  } else {
    experienceSection = '（未提供简历内容，此部分分析基于性格推演）\n\n根据你的性格画像，你更容易在以下类型的经历中获得成就感：' + (highE ? '需要频繁协作和展示的项目' : '需要深度专注和独立思考的任务') + '、' + (highC ? '目标明确、执行路径清晰的工作' : '灵活多变、允许试错的探索型任务') + '。而' + (highN ? '高压且缺乏支持的环境可能会显著消耗你的心理能量。' : '你在大多数环境中都能保持稳定发挥。');
  }

  // 职场推演
  const pressureDesc = highN
    ? (highC ? '面对压力时，你会经历明显的内在焦虑感，但你的高尽责性会迫使你把焦虑转化为行动。你不是不紧张，而是紧张的同时还能把事做完——这让你在高压环境中既能存活，也会疲惫。长期来看，这种"带伤作战"的模式有倦怠风险。' : '你在压力下的第一反应是内在的情绪风暴——焦虑、担忧、反复推演最坏情况。如果此时没有外部结构（如明确的流程或可靠的搭档）来托住你，你可能会陷入"越焦虑越拖延、越拖延越焦虑"的循环。')
    : (highC ? '你在压力下是团队中最让人安心的存在。情绪稳定加上高执行力，意味着你能在混乱中保持冷静、持续产出。你的危险不在于崩溃，而在于长期承担过多却不自知——因为你"扛得住"，别人就会不断加码。' : '你在压力下保持情绪平稳，但执行力可能不会随压力自动提升。你不会慌，但也不会因此加速。你需要的是明确的优先级排序和外部推力，而不是情绪管理。');

  const teamRole = highE
    ? (highA ? '你在团队中天然扮演"黏合剂 + 推动者"的角色。你既有推动事情向前的能量，又有维系团队关系的能力。风险是你可能会过度关注氛围而忽视效率。' : '你在团队中更像"先锋 + 挑战者"。你有能量主导讨论和推进决策，但你不会为了维持表面和谐而回避分歧。这在需要创新突破的团队中是稀缺能力，在强调和谐的文化中可能招致阻力。')
    : (highA ? '你在团队中是那个"静水深流"的角色——不抢风头，但别人遇到困难时第一个想到的就是你。你的价值更多体现在一对一的协作和支持中，而非大群体的领导场景。' : '你是典型的"深度专家"型团队成员。你不需要太多互动来维持生产力，独立作战是你的舒适区。但你也需要警惕被边缘化——在强调协作的组织中，"存在感"是一种需要经营的资源。');

  const ceiling = [];
  if (!highE && highC) ceiling.push('你的执行力远超你的"能见度"。你可能是团队中做事最多的人，却不是最被看见的人。如果不主动争取曝光，你的职业天花板可能卡在"高级执行者"而非"决策者"。');
  if (highA && highN) ceiling.push('你对他人感受的高度在意，加上自身的情绪敏感，可能让你在需要做出"不讨人喜欢的决定"时犹豫不决。这在管理岗位上是致命的瓶颈。');
  if (highO && !highC) ceiling.push('你不缺好想法，但缺乏把想法落地的系统性能力。你的天花板可能不在"想不到"，而在"做不完"。');
  if (!highO) ceiling.push('对新事物的审慎态度可能让你在行业变革期慢半拍。你不是缺乏学习能力，而是缺乏主动走出舒适区的冲动。');
  if (ceiling.length === 0) ceiling.push('以你目前的特质组合，最大的天花板可能是"不够极致"——每个维度都过得去，但缺少一个让人印象深刻的突出点。');

  // 发展建议
  const careerType = highO
    ? (highE ? '战略咨询、产品管理、创业、市场营销策划——这些需要创造力和对外沟通能力的领域能同时激活你的两大优势。' : '研究分析、UX 设计、内容策略、数据科学——需要深度思考和创新的岗位能让你在独处中发挥创造力。')
    : (highC ? '项目管理、运营管理、财务分析、质量管控——结构化强、注重执行和产出的领域是你的主场。' : '需要灵活应变的角色，如客户成功、活动运营、业务拓展——既不过度约束你，又给你明确的目标。');

  const companyType = highN
    ? '建议选择文化宽松、心理安全感高的组织——初创公司中氛围好的团队，或者成熟企业中重视员工关怀的部门。避免"狼性文化"。'
    : (highE ? '快节奏、强互动的环境适合你——互联网公司、咨询公司、或任何鼓励开放沟通的团队。' : '允许独立工作、看重交付质量的环境——远程友好的公司，或技术驱动型团队。');

  const teamCombo = highE
    ? (highC ? '你适合承担**项目负责人或团队 lead**的角色。你最需要配一个**高开放性 + 中等尽责性的下属**——能接住你的节奏，同时带来你可能忽略的创新视角。你最适合的老板是**高宜人性 + 高尽责性型**——既认可你的主动性，又能帮你把控方向。' : '你适合担任**对外沟通和资源整合**的角色。你需要的下属是**高尽责性的执行者**——你负责打开局面，他负责落地。最适合你的老板是**目标导向、不微观管理型**——给你空间，只看结果。')
    : (highA ? '你适合做**导师、协调者或二把手**的角色。你最需要配一个**高外向性的搭档或老板**——让他去前面冲锋，你在后方稳住阵地。你最需要的下属是**高自驱力的人**——因为你不擅长强势push。' : '你最适合**深度技术专家或独立顾问**的角色。你需要一个**高宜人性的老板**——能理解你的工作方式，不要求你"表演性社交"。你最适合的下属是**同样偏独立但尽责性高的人**——彼此不需要太多互动，各自把事做好。');

  const behaviorAdvice = [];
  if (highN) behaviorAdvice.push('**建立"焦虑转化"机制**：每次感到焦虑时，用 2 分钟写下"我在担心什么"和"我现在能做的最小一步是什么"。把模糊的恐惧转化为具体的行动，打断焦虑的自我循环。');
  if (!highE) behaviorAdvice.push('**刻意经营"弱关系"**：每周花 15 分钟给一位不太熟但你欣赏的人发一条有内容的消息（分享一篇文章、一个想法）。不需要社交，只需要"存在感维护"。');
  if (!highC) behaviorAdvice.push('**采用"两分钟规则"**：任何能在两分钟内启动的任务，立刻开始。不要等"状态好"再做——对你来说，行动本身就是创造状态的最佳方式。');
  if (highA && highN) behaviorAdvice.push('**练习"不含歉意的拒绝"**：下次想说"不"的时候，直接说"这个我做不了"，而不是"不好意思啊我可能没时间"。你的宜人性会让你想道歉，但你的神经质会因为道歉而更焦虑。');
  if (behaviorAdvice.length === 0) behaviorAdvice.push('**定期做"反直觉挑战"**：每月刻意做一件不在你舒适区内的事——参加一场社交活动、学一个完全陌生的技能、或者主动向别人征求负面反馈。保持一点摩擦感，是对抗性格"舒适陷阱"的最佳方式。');

  const report = `# 你的职场性格画像

## 1. 性格底色

${conflict}

从你的五维数据来看，${E > 3.10 ? '你比多数人更愿意走向人群' : '你更倾向于在安静中积蓄力量'}；${A > 3.75 ? '你在关系中给予多于索取' : '你在关系中保持着清醒的边界感'}；${C > 3.36 ? '你有强烈的完成驱动力' : '你更看重灵活和可能性'}；${N > 3.05 ? '你的内心感受像高灵敏度的天线，时刻在接收信号' : '你的情绪像锚，在风浪中也能稳住自己'}；${O > 3.69 ? '你对未知的世界充满好奇' : '你更信赖已被验证的路径'}。

## 2. 经历复盘

${experienceSection}

## 3. 职场推演

**压力下的你**

${pressureDesc}

**团队中的你**

${teamRole}

**潜在天花板**

${ceiling.join('\n\n')}

## 4. 发展指南

### 职业方向

**职业类型**：${careerType}

**公司类型**：${companyType}

### 合作伙伴

${teamCombo}

### 发展建议

${behaviorAdvice.join('\n\n')}

---

> *「性格不是命运，但它是你手中最熟悉的牌。高手不是换一副牌，而是用已有的牌打出最好的组合。」*

---
*报告基于 BFI-44 量表得分与中国青年样本常模对比生成*
*常模参考值: 外向性 3.10 | 宜人性 3.75 | 尽责性 3.36 | 神经质 3.05 | 开放性 3.69*`;

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
