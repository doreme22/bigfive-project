import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const params = new URLSearchParams(location.search);

// ?clear → 清除所有 bfi_ 缓存并重定向
if (params.has('clear')) {
  Object.keys(localStorage)
    .filter((k) => k.startsWith('bfi_'))
    .forEach((k) => localStorage.removeItem(k));
  location.replace(location.pathname);
}

// ?preview=picker|empty → 配置对应 localStorage 状态后跳转到 ResumePage
else if (params.has('preview')) {
  const mode = params.get('preview');
  // 先清空
  Object.keys(localStorage)
    .filter((k) => k.startsWith('bfi_'))
    .forEach((k) => localStorage.removeItem(k));

  if (mode === 'picker') {
    // 有在线简历 + 有附件
    localStorage.setItem('bfi_online_resume', JSON.stringify({
      name: '张三', title: '前端开发工程师',
      education: '本科', experience: '2022-至今', skills: 'React',
    }));
    localStorage.setItem('bfi_online_attachments', JSON.stringify([
      { id: 'att_1', fileName: '前端开发简历_2024.pdf', fileType: 'pdf', category: '简历', uploadTime: Date.now() - 86400000 },
      { id: 'att_2', fileName: '产品经理简历.pdf', fileType: 'pdf', category: '简历', uploadTime: Date.now() - 172800000 },
      { id: 'att_3', fileName: '作品集_UI设计.doc', fileType: 'doc', category: '作品', uploadTime: Date.now() - 604800000 },
    ]));
  }
  // empty: 已全部清空，什么都不设

  location.replace(location.pathname + '?_go=resume');
}

else {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App autoStage={params.get('_go') || null} />
    </StrictMode>,
  );
}
