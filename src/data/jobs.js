export const mockJobs = [
  // --- 高开放性 + 高外向性 ---
  { id: 'j01', title: '产品经理', company: '字节跳动', department: '已上市', location: '北京', salary: '30-50K', description: '你的高开放性和外向型人格非常适合产品创新与跨团队协作', requirements: ['3年以上产品经验', '优秀的沟通能力', '数据驱动思维', '熟悉敏捷开发流程'], personalityFit: { highDimensions: ['O', 'E'], jungPreference: ['Ne', 'Te'], mbtiTypes: ['ENTP', 'ENTJ', 'ENFP'] } },
  { id: 'j02', title: '战略咨询顾问', company: '麦肯锡', department: '全球500强', location: '上海', salary: '40-70K', description: '你的逻辑分析与沟通能力是顶级咨询顾问的核心素质', requirements: ['顶尖院校背景', '出色的逻辑分析能力', '优秀的演讲和沟通能力', '适应高强度工作节奏'], personalityFit: { highDimensions: ['O', 'E', 'C'], jungPreference: ['Te', 'Ni'], mbtiTypes: ['ENTJ', 'INTJ', 'ENTP'] } },
  { id: 'j03', title: '市场营销总监', company: '欧莱雅', department: '已上市', location: '上海', salary: '35-60K', description: '你的创意思维和社交驱动力与品牌营销高度契合', requirements: ['5年以上市场营销经验', '品牌管理经验', '团队管理能力', '创意策划能力'], personalityFit: { highDimensions: ['E', 'O'], jungPreference: ['Ne', 'Fe'], mbtiTypes: ['ENFP', 'ENFJ', 'ENTP'] } },
  { id: 'j04', title: '创业公司 CEO', company: '早期创业公司', department: '天使轮', location: '深圳', salary: '期权为主', description: '你的冒险精神和全局视野非常适合从0到1的创业挑战', requirements: ['创业经验或连续创业背景', '强大的资源整合能力', '抗压能力强', '行业洞察力'], personalityFit: { highDimensions: ['E', 'O', 'C'], jungPreference: ['Ne', 'Te'], mbtiTypes: ['ENTP', 'ENTJ'] } },
  { id: 'j05', title: '品牌策划经理', company: '小红书', department: 'D轮', location: '上海', salary: '25-40K', description: '你的审美直觉和表达欲望与品牌策划完美匹配', requirements: ['3年以上品牌策划经验', '优秀的文案能力', '社交媒体运营经验', '创意思维'], personalityFit: { highDimensions: ['O', 'E'], jungPreference: ['Ne', 'Fi'], mbtiTypes: ['ENFP', 'INFP', 'ENTP'] } },

  // --- 高尽责性 + 高外向性 ---
  { id: 'j06', title: '项目管理总监', company: '华为', department: '已上市', location: '深圳', salary: '35-55K', description: '你的高责任心和执行力是大型项目管理的关键优势', requirements: ['PMP认证', '8年以上项目管理经验', '优秀的跨部门协调能力', '风险管控能力'], personalityFit: { highDimensions: ['C', 'E'], jungPreference: ['Te', 'Si'], mbtiTypes: ['ESTJ', 'ENTJ', 'ISTJ'] } },
  { id: 'j07', title: '销售总监', company: '阿里巴巴', department: '已上市', location: '杭州', salary: '30-60K+提成', description: '你的目标驱动力和人际影响力是销售管理的核心竞争力', requirements: ['5年以上B2B销售经验', '团队管理能力', '出色的谈判能力', '行业资源'], personalityFit: { highDimensions: ['E', 'C'], jungPreference: ['Te', 'Se'], mbtiTypes: ['ESTJ', 'ENTJ', 'ESTP'] } },
  { id: 'j08', title: '人力资源总监', company: '腾讯', department: '已上市', location: '深圳', salary: '35-55K', description: '你的共情能力和组织思维非常适合人才战略管理', requirements: ['8年以上HR经验', '组织发展专长', '出色的沟通能力', '战略思维'], personalityFit: { highDimensions: ['E', 'A', 'C'], jungPreference: ['Fe', 'Si'], mbtiTypes: ['ENFJ', 'ESFJ', 'ESTJ'] } },

  // --- 高开放性 + 低外向性 ---
  { id: 'j09', title: '深度学习研究员', company: '微软亚洲研究院', department: '全球500强', location: '北京', salary: '40-80K', description: '你的深度思考和探索欲望与前沿AI研究高度吻合', requirements: ['CS博士学位', '顶会论文发表记录', '扎实的数学基础', '独立研究能力'], personalityFit: { highDimensions: ['O', 'C'], jungPreference: ['Ni', 'Ti'], mbtiTypes: ['INTJ', 'INTP', 'INFJ'] } },
  { id: 'j10', title: 'UX 设计师', company: '蚂蚁集团', department: '已上市', location: '杭州', salary: '25-45K', description: '你的用户同理心和审美感知力是优秀UX设计师的天赋', requirements: ['3年以上UX设计经验', '用户研究方法论', '原型设计能力', '数据分析能力'], personalityFit: { highDimensions: ['O'], jungPreference: ['Fi', 'Ne'], mbtiTypes: ['INFP', 'INFJ', 'ENFP'] } },
  { id: 'j11', title: '数据科学家', company: '美团', department: '已上市', location: '北京', salary: '30-50K', description: '你的分析洞察力和好奇心驱动型思维与数据科学完美契合', requirements: ['统计学或CS硕士', 'Python/SQL精通', '机器学习经验', '业务理解能力'], personalityFit: { highDimensions: ['O', 'C'], jungPreference: ['Ti', 'Ne'], mbtiTypes: ['INTP', 'INTJ', 'ENTP'] } },
  { id: 'j12', title: '内容策略师', company: 'B站', department: '已上市', location: '上海', salary: '20-35K', description: '你对文化潮流的敏锐感知和创意表达非常适合内容策略', requirements: ['3年以上内容运营经验', '对Z世代文化敏感', '数据分析能力', '创意思维'], personalityFit: { highDimensions: ['O'], jungPreference: ['Ne', 'Fi'], mbtiTypes: ['INFP', 'ENFP', 'INFJ'] } },
  { id: 'j13', title: '独立游戏设计师', company: '叠纸游戏', department: 'B轮', location: '苏州', salary: '20-35K', description: '你的想象力和叙事天赋是游戏设计师的核心驱动力', requirements: ['游戏设计经验', '创意思维', '原型制作能力', '对游戏产业深度理解'], personalityFit: { highDimensions: ['O'], jungPreference: ['Ne', 'Fi'], mbtiTypes: ['INFP', 'INTP', 'ENFP'] } },

  // --- 高尽责性 + 低外向性 ---
  { id: 'j14', title: '后端架构师', company: '阿里云', department: '已上市', location: '杭州', salary: '40-70K', description: '你的系统性思维和技术深度是架构师岗位的理想匹配', requirements: ['8年以上后端经验', '分布式系统设计', '技术选型能力', '代码审查经验'], personalityFit: { highDimensions: ['C', 'O'], jungPreference: ['Ti', 'Ni'], mbtiTypes: ['INTJ', 'ISTJ', 'INTP'] } },
  { id: 'j15', title: '财务分析师', company: '高盛', department: '全球500强', location: '北京', salary: '30-50K', description: '你的严谨细致和数据敏感度非常适合金融建模与分析', requirements: ['CFA或CPA', '精通Excel建模', '金融市场知识', '细致严谨'], personalityFit: { highDimensions: ['C'], jungPreference: ['Te', 'Si'], mbtiTypes: ['ISTJ', 'INTJ', 'ESTJ'] } },
  { id: 'j16', title: '质量保证工程师', company: '大疆', department: '已上市', location: '深圳', salary: '20-35K', description: '你的耐心和高标准意识是保障产品质量的关键特质', requirements: ['自动化测试经验', '质量管理体系知识', '细致耐心', '编程能力'], personalityFit: { highDimensions: ['C'], jungPreference: ['Si', 'Ti'], mbtiTypes: ['ISTJ', 'ISTP', 'INTJ'] } },
  { id: 'j17', title: '审计经理', company: '普华永道', department: '全球四大', location: '上海', salary: '25-45K', description: '你的风险意识和条理性与审计工作的要求高度一致', requirements: ['CPA证书', '5年以上审计经验', '团队管理能力', '风险识别能力'], personalityFit: { highDimensions: ['C', 'E'], jungPreference: ['Te', 'Si'], mbtiTypes: ['ESTJ', 'ISTJ'] } },

  // --- 高宜人性 ---
  { id: 'j18', title: '用户成功经理', company: 'Salesforce', department: '已上市', location: '上海', salary: '25-40K', description: '你的服务意识和共情能力让你天然适合客户成功岗位', requirements: ['3年以上客户管理经验', '优秀的沟通能力', '问题解决能力', 'SaaS行业经验'], personalityFit: { highDimensions: ['A', 'E'], jungPreference: ['Fe', 'Si'], mbtiTypes: ['ESFJ', 'ENFJ', 'ISFJ'] } },
  { id: 'j19', title: '企业培训师', company: '得到', department: 'C轮', location: '北京', salary: '20-35K', description: '你的表达力和助人热情是优秀培训师的核心特质', requirements: ['培训经验', '课程设计能力', '表达能力强', '成人学习理论'], personalityFit: { highDimensions: ['A', 'E', 'O'], jungPreference: ['Fe', 'Ne'], mbtiTypes: ['ENFJ', 'ENFP', 'ESFJ'] } },
  { id: 'j20', title: '心理咨询师', company: '壹心理', department: 'B轮', location: '远程', salary: '按次计费', description: '你的深度共情和内省能力是心理咨询师的天赋优势', requirements: ['心理学硕士', '咨询师资格证', '200+小时实习', '督导经验'], personalityFit: { highDimensions: ['A', 'O'], jungPreference: ['Fi', 'Ni'], mbtiTypes: ['INFJ', 'INFP', 'ENFJ'] } },
  { id: 'j21', title: '社区运营经理', company: '即刻', department: 'C轮', location: '上海', salary: '18-30K', description: '你的亲和力和用户洞察力非常适合社区氛围建设', requirements: ['社区运营经验', '用户洞察力', '内容创作能力', '善于倾听'], personalityFit: { highDimensions: ['A', 'E'], jungPreference: ['Fe', 'Ne'], mbtiTypes: ['ENFP', 'ENFJ', 'ESFJ'] } },

  // --- 低神经质（情绪稳定）---
  { id: 'j22', title: '危机公关总监', company: '网易', department: '已上市', location: '杭州', salary: '30-50K', description: '你的情绪稳定和抗压能力是危机公关的核心竞争力', requirements: ['5年以上公关经验', '危机处理能力', '媒体资源', '抗压能力极强'], personalityFit: { highDimensions: ['E', 'C'], jungPreference: ['Te', 'Se'], mbtiTypes: ['ESTJ', 'ENTJ', 'ESTP'] } },
  { id: 'j23', title: '急诊科医生', company: '协和医院', department: '三甲医院', location: '北京', salary: '25-40K', description: '你的冷静决断力和高压承受力与急诊工作完美匹配', requirements: ['医学博士', '住院医师规培', '临床经验丰富', '高度抗压'], personalityFit: { highDimensions: ['C'], jungPreference: ['Se', 'Ti'], mbtiTypes: ['ISTP', 'ISTJ', 'ESTP'] } },

  // --- 高外向性 + 高宜人性 ---
  { id: 'j24', title: '客户关系经理', company: '招商银行', department: '已上市', location: '深圳', salary: '25-45K+提成', description: '你的人际魅力和信任建立能力是高净值客户管理的关键', requirements: ['金融从业资格', '3年以上银行经验', '客户资源', '服务意识强'], personalityFit: { highDimensions: ['E', 'A'], jungPreference: ['Fe', 'Se'], mbtiTypes: ['ESFJ', 'ENFJ', 'ESFP'] } },
  { id: 'j25', title: '公关传播经理', company: '字节跳动', department: '已上市', location: '北京', salary: '25-40K', description: '你的沟通天赋和故事讲述能力是品牌传播的有力武器', requirements: ['媒体关系资源', '优秀的写作能力', '活动策划经验', '沟通协调能力'], personalityFit: { highDimensions: ['E', 'A'], jungPreference: ['Fe', 'Ne'], mbtiTypes: ['ENFJ', 'ENFP', 'ESFJ'] } },

  // --- 低外向性 + 高尽责性 ---
  { id: 'j26', title: '信息安全工程师', company: '奇安信', department: '已上市', location: '北京', salary: '25-45K', description: '你的专注力和风险敏感度是信息安全领域的稀缺特质', requirements: ['安全认证(CISP/CISSP)', '渗透测试经验', '安全工具熟练', '细致严谨'], personalityFit: { highDimensions: ['C'], jungPreference: ['Ti', 'Si'], mbtiTypes: ['ISTJ', 'ISTP', 'INTJ'] } },
  { id: 'j27', title: '供应链管理专家', company: '京东', department: '已上市', location: '北京', salary: '25-40K', description: '你的流程优化思维和数据驱动习惯与供应链管理高度匹配', requirements: ['供应链管理经验', '数据分析能力', '流程优化能力', 'ERP系统经验'], personalityFit: { highDimensions: ['C'], jungPreference: ['Te', 'Si'], mbtiTypes: ['ISTJ', 'ESTJ', 'INTJ'] } },

  // --- 高开放性 + 创意类 ---
  { id: 'j28', title: '创意总监', company: 'W+K 上海', department: '全球知名4A', location: '上海', salary: '35-60K', description: '你的创意爆发力和审美品位是广告创意行业的顶级资产', requirements: ['8年以上广告创意经验', '获奖作品', '团队管理能力', '跨文化视野'], personalityFit: { highDimensions: ['O', 'E'], jungPreference: ['Ne', 'Fi'], mbtiTypes: ['ENFP', 'ENTP', 'INFP'] } },
  { id: 'j29', title: '用户研究员', company: '小米', department: '已上市', location: '北京', salary: '20-35K', description: '你的共情力和洞察力能帮助产品真正理解用户需求', requirements: ['用户研究方法论', '定性定量分析', '共情能力', '报告撰写'], personalityFit: { highDimensions: ['O', 'A'], jungPreference: ['Fi', 'Ne'], mbtiTypes: ['INFP', 'INFJ', 'ENFP'] } },

  // --- 均衡型 ---
  { id: 'j30', title: '全栈工程师', company: '拼多多', department: '已上市', location: '上海', salary: '30-50K', description: '你的多维能力和快速学习力非常适合全栈开发的挑战', requirements: ['全栈开发能力', 'React/Vue + Node.js', '数据库经验', '快速学习能力'], personalityFit: { highDimensions: ['C', 'O'], jungPreference: ['Ti', 'Ne'], mbtiTypes: ['INTP', 'INTJ', 'ENTP'] } },
  { id: 'j31', title: '运营经理', company: '滴滴', department: 'D轮', location: '北京', salary: '22-38K', description: '你的策略思维和执行力是运营增长的核心驱动力', requirements: ['3年以上运营经验', '数据分析能力', '项目管理能力', '跨部门协调'], personalityFit: { highDimensions: ['C', 'E'], jungPreference: ['Te', 'Ne'], mbtiTypes: ['ENTJ', 'ESTJ', 'ENTP'] } },
  { id: 'j32', title: '技术写作工程师', company: 'PingCAP', department: 'D轮', location: '远程', salary: '18-30K', description: '你的技术理解力和清晰表达力是技术写作的完美组合', requirements: ['技术背景', '优秀的写作能力', '英文能力', '学习能力强'], personalityFit: { highDimensions: ['C', 'O'], jungPreference: ['Ti', 'Si'], mbtiTypes: ['ISTJ', 'INTJ', 'INTP'] } },
  { id: 'j33', title: '投资分析师', company: '红杉中国', department: '顶级VC', location: '北京', salary: '30-50K', description: '你的战略眼光和深度分析能力与投资研究高度契合', requirements: ['金融或技术背景', '行业研究能力', '财务建模', '逻辑分析能力'], personalityFit: { highDimensions: ['O', 'C'], jungPreference: ['Ni', 'Te'], mbtiTypes: ['INTJ', 'ENTJ', 'INTP'] } },
  { id: 'j34', title: '活动策划专员', company: '万达文化', department: '已上市', location: '上海', salary: '15-25K', description: '你的行动力和组织协调能力是活动策划的重要保障', requirements: ['活动策划经验', '供应商管理', '预算控制', '现场执行力'], personalityFit: { highDimensions: ['E', 'C'], jungPreference: ['Se', 'Fe'], mbtiTypes: ['ESFP', 'ESFJ', 'ENFP'] } },
  { id: 'j35', title: '法务合规经理', company: '蚂蚁集团', department: '已上市', location: '杭州', salary: '25-45K', description: '你的严谨逻辑和规则意识是法务合规岗位的核心素养', requirements: ['法学背景', '律师资格证', '合规经验', '细致严谨'], personalityFit: { highDimensions: ['C'], jungPreference: ['Ti', 'Si'], mbtiTypes: ['ISTJ', 'INTJ', 'ESTJ'] } },
];

/**
 * 按匹配度排序岗位
 */
export function getMatchingJobs(bfiScores, jungScores, mbtiType, excludeIds = []) {
  const dims = ['E', 'A', 'C', 'N', 'O'];

  // Find user's top dimensions (above norm)
  const norms = { E: 3.10, A: 3.75, C: 3.36, N: 3.05, O: 3.69 };
  const userHighDims = bfiScores
    ? dims.filter((d) => bfiScores[d] > norms[d] + 0.2)
    : [];

  const userMbti = mbtiType ? mbtiType.toUpperCase() : null;

  return mockJobs
    .filter((j) => !excludeIds.includes(j.id))
    .map((job) => {
      let score = 0;
      const fit = job.personalityFit;

      // Dimension match
      for (const dim of fit.highDimensions) {
        if (userHighDims.includes(dim)) score += 2;
      }

      // MBTI match
      if (userMbti && fit.mbtiTypes.includes(userMbti)) score += 3;

      // Jung preference match
      if (jungScores && fit.jungPreference) {
        for (const pref of fit.jungPreference) {
          if (jungScores[pref] && jungScores[pref] > 60) score += 1;
        }
      }

      return { ...job, matchScore: score };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * 从匹配池随机抽取
 */
export function pickRandomJobs(matchedJobs, count = 3, excludeIds = []) {
  const pool = matchedJobs.filter((j) => !excludeIds.includes(j.id));
  // Take from top 50% of matched jobs for quality
  const topHalf = pool.slice(0, Math.max(count * 2, Math.ceil(pool.length / 2)));
  const shuffled = [...topHalf].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * 按 id 获取岗位
 */
export function getJobById(id) {
  return mockJobs.find((j) => j.id === id) || null;
}
