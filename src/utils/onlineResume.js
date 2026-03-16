// 在线简历服务层 — Mock 实现
// 后续替换为真实 API 时，只需修改此文件

const KEYS = {
  ONLINE_RESUME: 'bfi_online_resume',
  ONLINE_ATTACHMENTS: 'bfi_online_attachments',
};

// 初始化 mock 数据（仅首次）
function ensureMockData() {
  try {
    if (!localStorage.getItem(KEYS.ONLINE_RESUME)) {
      localStorage.setItem(
        KEYS.ONLINE_RESUME,
        JSON.stringify({
          name: '张三',
          title: '前端开发工程师',
          education: '本科 · 计算机科学与技术 · 某大学（2018-2022）',
          experience:
            '2022.07 - 至今  某科技公司 前端开发工程师\n- 负责公司核心产品的前端架构设计与开发\n- 使用 React + TypeScript 构建企业级 SPA 应用\n- 主导性能优化，首屏加载时间降低 40%',
          skills: 'JavaScript, TypeScript, React, Vue, Node.js, Webpack, Vite, Git',
        }),
      );
    }
    if (!localStorage.getItem(KEYS.ONLINE_ATTACHMENTS)) {
      localStorage.setItem(
        KEYS.ONLINE_ATTACHMENTS,
        JSON.stringify([
          { id: 'att_1', fileName: '前端开发简历_2024.pdf', fileType: 'pdf', category: '简历', uploadTime: Date.now() - 86400000 },
          { id: 'att_2', fileName: '产品经理简历.pdf', fileType: 'pdf', category: '简历', uploadTime: Date.now() - 172800000 },
          { id: 'att_3', fileName: '作品集_UI设计.doc', fileType: 'doc', category: '作品', uploadTime: Date.now() - 604800000 },
        ]),
      );
    }
  } catch {
    // storage unavailable
  }
}

/**
 * 获取结构化在线简历
 * @returns {{ name: string, title: string, education: string, experience: string, skills: string } | null}
 */
export async function getOnlineResume() {
  ensureMockData();
  try {
    const raw = localStorage.getItem(KEYS.ONLINE_RESUME);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * 获取附件列表
 * @returns {Array<{ id: string, fileName: string, uploadTime: number }>}
 */
export async function getOnlineAttachments() {
  ensureMockData();
  try {
    const raw = localStorage.getItem(KEYS.ONLINE_ATTACHMENTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * 上传文件到在线简历附件
 * @param {File} file
 * @returns {{ id: string, fileName: string }}
 */
export async function uploadAttachmentToOnline(file) {
  ensureMockData();
  const ext = file.name.split('.').pop().toLowerCase();
  const fileType = ext === 'pdf' ? 'pdf' : ext === 'doc' || ext === 'docx' ? 'doc' : 'other';
  const newAttachment = {
    id: `att_${Date.now()}`,
    fileName: file.name,
    fileType,
    category: '简历',
    uploadTime: Date.now(),
  };
  try {
    const list = await getOnlineAttachments();
    list.unshift(newAttachment);
    localStorage.setItem(KEYS.ONLINE_ATTACHMENTS, JSON.stringify(list));
  } catch {
    // ignore
  }
  return { id: newAttachment.id, fileName: newAttachment.fileName };
}

/**
 * 删除附件
 * @param {string} id
 */
export async function deleteOnlineAttachment(id) {
  ensureMockData();
  try {
    const list = await getOnlineAttachments();
    const filtered = list.filter((att) => att.id !== id);
    localStorage.setItem(KEYS.ONLINE_ATTACHMENTS, JSON.stringify(filtered));
  } catch {
    // ignore
  }
}

/**
 * 计算相对时间
 * @param {number} timestamp
 * @returns {string}
 */
export function formatRelativeTime(timestamp) {
  const diff = Date.now() - timestamp;
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return '刚刚';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}分钟前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}小时前`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}天前`;
  const weeks = Math.floor(days / 7);
  return `${weeks}周前`;
}

/**
 * 将结构化简历拼成纯文本
 * @param {{ name: string, title: string, education: string, experience: string, skills: string }} resumeData
 * @returns {string}
 */
export function formatResumeToText(resumeData) {
  if (!resumeData) return '';
  const sections = [];
  if (resumeData.name) sections.push(`姓名：${resumeData.name}`);
  if (resumeData.title) sections.push(`职位：${resumeData.title}`);
  if (resumeData.education) sections.push(`\n教育背景：\n${resumeData.education}`);
  if (resumeData.experience) sections.push(`\n工作经历：\n${resumeData.experience}`);
  if (resumeData.skills) sections.push(`\n技能特长：\n${resumeData.skills}`);
  return sections.join('\n');
}
