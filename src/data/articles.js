export const mockArticles = [
  // --- 情绪管理 ---
  { id: 'a01', title: '李松蔚·心理学通识：情绪管理篇', tags: ['情绪管理', '焦虑', '情绪稳定', '压力'], cover: '/images/course-caikang.jpg' },
  { id: 'a02', title: '武志红的心理学课：认知突破篇', tags: ['CBT', '心理', '情绪管理', '思维模式'], cover: '/images/course-02.jpg' },
  { id: 'a03', title: '潮汐冥想·每日10分钟正念练习', tags: ['正念', '冥想', '情绪稳定', '焦虑缓解'], cover: '/images/course-03.jpg' },

  // --- 社交与人际 ---
  { id: 'a04', title: '蔡康永的201堂情商课：人际沟通篇', tags: ['人际关系', '社交', '外向性提升', '弱关系'], cover: '/images/course-04.jpg' },
  { id: 'a05', title: '蔡康永的201堂情商课：高效表达篇', tags: ['沟通', '表达', '外向性提升', '个人品牌'], cover: '/images/course-05.jpg' },

  // --- 执行力与自律 ---
  { id: 'a06', title: '张萌·人生效率手册：告别拖延', tags: ['执行力', '习惯养成', '尽责性提升', '拖延'], cover: '/images/course-06.jpg' },
  { id: 'a07', title: '许岑·有效训练你的研究能力', tags: ['习惯养成', '自律', '尽责性提升', '行为设计'], cover: '/images/course-07.jpg' },
  { id: 'a08', title: '邹小强·极简时间管理GTD实战', tags: ['时间管理', 'GTD', '尽责性提升', '执行力'], cover: '/images/course-08.jpg' },

  // --- 开放性与创新 ---
  { id: 'a09', title: '刘润·5分钟商学院：突破舒适区', tags: ['开放性提升', '成长', '挑战', '舒适区'], cover: '/images/course-03.jpg' },
  { id: 'a10', title: '万维钢·精英日课：跨界思维训练', tags: ['跨学科', '思维', '开放性提升', '认知升级', '创新'], cover: '/images/course-07.jpg' },

  // --- 边界与宜人性 ---
  { id: 'a11', title: '陈海贤·自我发展心理学：学会说不', tags: ['边界', '拒绝', '宜人性', '自我保护'], cover: '/images/course-02.jpg' },
  { id: 'a12', title: '周小宽·走出讨好型人格', tags: ['边界', '宜人性', '自我保护', '人际关系'], cover: '/images/course-06.jpg' },

  // --- 职业发展 ---
  { id: 'a13', title: '古典·超级个体：内向者职场生存指南', tags: ['内向', '职业发展', '自我认知', '外向性提升'], cover: '/images/course-08.jpg' },
  { id: 'a14', title: '脱不花·怎样成为高效学习的人', tags: ['个人品牌', '影响力', '职业发展', '外向性提升'], cover: '/images/course-05.jpg' },

  // --- 心理韧性 ---
  { id: 'a15', title: '动机在杭州·逆商训练营', tags: ['韧性', '抗压', '情绪稳定', '成长'], cover: '/images/course-04.jpg' },
];

/**
 * 按 tags 匹配文章，返回 0-1 条（要求至少 2 个 tag 命中）
 */
export function getArticlesForTopic(topicTags, count = 1) {
  if (!topicTags || topicTags.length === 0) return [];

  const lowerTags = topicTags.map((t) => t.toLowerCase());

  const scored = mockArticles.map((article) => {
    let matchCount = 0;
    for (const tag of article.tags) {
      if (lowerTags.some((t) => tag.toLowerCase().includes(t) || t.includes(tag.toLowerCase()))) {
        matchCount++;
      }
    }
    return { ...article, matchCount };
  });

  return scored
    .filter((a) => a.matchCount >= 2)
    .sort((a, b) => b.matchCount - a.matchCount)
    .slice(0, count);
}
