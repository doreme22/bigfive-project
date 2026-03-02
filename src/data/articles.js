export const mockArticles = [
  // --- 情绪管理 ---
  { id: 'a01', title: '把焦虑变成"早期预警系统"的三步法', tags: ['情绪管理', '焦虑', '情绪稳定', '压力'] },
  { id: 'a02', title: '识别你的自动化思维陷阱', tags: ['CBT', '心理', '情绪管理', '思维模式'] },
  { id: 'a03', title: '每天10分钟正念练习指南', tags: ['正念', '冥想', '情绪稳定', '焦虑缓解'] },

  // --- 社交与人际 ---
  { id: 'a04', title: '内向者的人脉经营法：弱关系的力量', tags: ['人际关系', '社交', '外向性提升', '弱关系'] },
  { id: 'a05', title: '不社交也能被记住的5个方法', tags: ['沟通', '表达', '外向性提升', '个人品牌'] },

  // --- 执行力与自律 ---
  { id: 'a06', title: '两分钟规则：治愈拖延的最小行动单元', tags: ['执行力', '习惯养成', '尽责性提升', '拖延'] },
  { id: 'a07', title: '为什么微小改变比宏大目标更有效', tags: ['习惯养成', '自律', '尽责性提升', '行为设计'] },
  { id: 'a08', title: '从"记住一切"到"清空大脑"的GTD实践', tags: ['时间管理', 'GTD', '尽责性提升', '执行力'] },

  // --- 开放性与创新 ---
  { id: 'a09', title: '舒适区是怎么一步步变成陷阱的', tags: ['开放性提升', '成长', '挑战', '舒适区'] },
  { id: 'a10', title: '跨界思维：最好的想法为什么来自门外汉', tags: ['跨学科', '思维', '开放性提升', '认知升级', '创新'] },

  // --- 边界与宜人性 ---
  { id: 'a11', title: '不含歉意的拒绝指南', tags: ['边界', '拒绝', '宜人性', '自我保护'] },
  { id: 'a12', title: '讨好型人格自救手册', tags: ['边界', '宜人性', '自我保护', '人际关系'] },

  // --- 职业发展 ---
  { id: 'a13', title: '内向性格如何在外向型公司里生存', tags: ['内向', '职业发展', '自我认知', '外向性提升'] },
  { id: 'a14', title: '找到你的不可替代性', tags: ['个人品牌', '影响力', '职业发展', '外向性提升'] },

  // --- 心理韧性 ---
  { id: 'a15', title: '从挫折中快速恢复的4个心理策略', tags: ['韧性', '抗压', '情绪稳定', '成长'] },
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
