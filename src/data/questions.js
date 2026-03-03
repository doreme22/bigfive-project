// BFI-44 题目数据
// 维度: E=外向性, A=宜人性, C=尽责性, N=神经质, O=开放性
// R=反向计分 (6 - 原始分)

export const questions = [
  { id: 1,  text: '我充满了活力',                       dimension: 'E', reverse: false },
  { id: 2,  text: '我倾向于挑剔别人的缺点',             dimension: 'A', reverse: true },
  { id: 3,  text: '我做事有效率',                       dimension: 'C', reverse: false },
  { id: 4,  text: '我容易感到不安',                     dimension: 'N', reverse: false },
  { id: 5,  text: '我具有创造力',                       dimension: 'O', reverse: false },
  { id: 6,  text: '我通常内向矜持',                     dimension: 'E', reverse: true },
  { id: 7,  text: '我乐于助人，不自私',                 dimension: 'A', reverse: false },
  { id: 8,  text: '我往往比较懒散',                     dimension: 'C', reverse: true },
  { id: 9,  text: '我很放松，能很好应对压力',           dimension: 'N', reverse: true },
  { id: 10, text: '对一些想法，我喜欢反复推敲',         dimension: 'O', reverse: false },
  { id: 11, text: '我充满了热情',                       dimension: 'E', reverse: false },
  { id: 12, text: '我有时对人很粗鲁',                   dimension: 'A', reverse: true },
  { id: 13, text: '我做事有始有终',                     dimension: 'C', reverse: false },
  { id: 14, text: '我可能会紧张',                       dimension: 'N', reverse: false },
  { id: 15, text: '我是一个思想有深度的人',             dimension: 'O', reverse: false },
  { id: 16, text: '我可能会害羞或拘谨',                 dimension: 'E', reverse: true },
  { id: 17, text: '我对绝大多数人都很友善',             dimension: 'A', reverse: false },
  { id: 18, text: '我可能有点粗心',                     dimension: 'C', reverse: true },
  { id: 19, text: '我情绪稳定，不易心烦意乱',           dimension: 'N', reverse: true },
  { id: 20, text: '我对很多事情都很好奇',               dimension: 'O', reverse: false },
  { id: 21, text: '我是开朗外向，好交际的',             dimension: 'E', reverse: false },
  { id: 22, text: '我愿意和别人合作',                   dimension: 'A', reverse: false },
  { id: 23, text: '我往往没有条理',                     dimension: 'C', reverse: true },
  { id: 24, text: '我总是担心很多事情',                 dimension: 'N', reverse: false },
  { id: 25, text: '我拥有活跃的想象力',                 dimension: 'O', reverse: false },
  { id: 26, text: '我往往很安静',                       dimension: 'E', reverse: true },
  { id: 27, text: '我可能会很冷淡，难以接近',           dimension: 'A', reverse: true },
  { id: 28, text: '我会坚持不懈直到任务完成',           dimension: 'C', reverse: false },
  { id: 29, text: '我可能会很情绪化',                   dimension: 'N', reverse: false },
  { id: 30, text: '我很重视艺术和审美体验',             dimension: 'O', reverse: false },
  { id: 31, text: '我有时会感到忧郁或沮丧',             dimension: 'N', reverse: false },
  { id: 32, text: '我更喜欢常规性的工作',               dimension: 'O', reverse: true },
  { id: 33, text: '我制定计划并按计划行事',             dimension: 'C', reverse: false },
  { id: 34, text: '我在紧张情况下能保持冷静',           dimension: 'N', reverse: true },
  { id: 35, text: '我没什么艺术上的兴趣',               dimension: 'O', reverse: true },
  { id: 36, text: '我倾向于挑起和别人的争执',           dimension: 'A', reverse: true },
  { id: 37, text: '我是一个可信赖的工作者',             dimension: 'C', reverse: false },
  { id: 38, text: '我很容易分心',                       dimension: 'C', reverse: true },
  { id: 39, text: '我很容易感到焦虑',                   dimension: 'N', reverse: false },
  { id: 40, text: '我生性宽容',                         dimension: 'A', reverse: false },
  { id: 41, text: '我觉得我缺乏独创力',                 dimension: 'O', reverse: true },
  { id: 42, text: '我往往怀疑别人的动机',               dimension: 'A', reverse: true },
  { id: 43, text: '我做决定很果断',                     dimension: 'C', reverse: false },
  { id: 44, text: '我对艺术、音乐很在行',               dimension: 'O', reverse: false },
];

// 中国青年样本常模
export const norms = {
  E: 3.10,
  A: 3.75,
  C: 3.36,
  N: 3.05,
  O: 3.69,
};

// 维度中文名映射
export const dimensionNames = {
  E: '外向性',
  A: '宜人性',
  C: '尽责性',
  N: '神经质',
  O: '开放性',
};

// 选项定义
export const options = [
  { value: 1, label: '非常不同意' },
  { value: 2, label: '不同意' },
  { value: 3, label: '中立' },
  { value: 4, label: '同意' },
  { value: 5, label: '非常同意' },
];

// 打乱题目顺序 (Fisher-Yates)
export function shuffleQuestions() {
  const arr = [...questions];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
