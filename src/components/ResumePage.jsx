import { useState, useRef, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { getCachedResume, setCachedResume } from '../utils/storage';
import ModalOverlay from './ui/ModalOverlay';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url,
).toString();

async function extractTextFromPDF(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pages = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = content.items.map((item) => item.str).join(' ');
    pages.push(text);
  }
  return pages.join('\n');
}

export default function ResumePage({ onSubmit, onSkip }) {
  const [resumeText, setResumeText] = useState('');
  const [fileName, setFileName] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [showCacheModal, setShowCacheModal] = useState(false);
  const [cachedResume, setCachedResumeState] = useState(null);
  const fileInputRef = useRef(null);

  // Check for cached resume on mount
  useEffect(() => {
    const cached = getCachedResume();
    if (cached && cached.text) {
      setCachedResumeState(cached);
      setShowCacheModal(true);
    }
  }, []);

  const handleUseCached = () => {
    setResumeText(cachedResume.text);
    if (cachedResume.source) setFileName(cachedResume.source);
    setShowCacheModal(false);
  };

  const handleDiscardCache = () => {
    setShowCacheModal(false);
  };

  const handleFileChange = async (file) => {
    if (!file) return;
    setFileName(file.name);

    const isPDF = file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf';

    if (isPDF) {
      setParsing(true);
      try {
        const text = await extractTextFromPDF(file);
        setResumeText(text);
      } catch (err) {
        console.error('PDF 解析失败:', err);
        setResumeText('');
        setFileName('');
        alert('PDF 解析失败，请尝试粘贴文本内容');
      } finally {
        setParsing(false);
      }
    } else {
      const text = await file.text();
      setResumeText(text);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = () => {
    // Cache the new resume
    setCachedResume(resumeText, fileName || 'manual_input');
    onSubmit(resumeText);
  };

  return (
    <div className="min-h-screen flex flex-col px-6 py-8 bg-bg-dark">
      {/* Header */}
      <div className="animate-fade-in-up text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1a6b4a] to-[#22875e] flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-2">上传你的简历</h1>
        <p className="text-text-secondary text-sm leading-relaxed">
          AI 将结合你的性格数据与职业经历
          <br />
          生成一份专属的深度职场画像
        </p>
      </div>

      {/* Upload area */}
      <div className="animate-fade-in-up flex-1" style={{ animationDelay: '0.15s' }}>
        {/* File upload */}
        <div
          className={`border-2 border-dashed rounded-2xl p-6 text-center mb-4 transition-colors cursor-pointer ${
            dragActive ? 'border-primary bg-primary/5' : 'border-border'
          }`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.md,.doc,.docx,.pdf"
            className="hidden"
            onChange={(e) => handleFileChange(e.target.files[0])}
          />
          {parsing ? (
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5 text-primary animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span className="text-sm text-text-secondary">正在解析 PDF...</span>
            </div>
          ) : fileName ? (
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm text-green-400">{fileName}</span>
              <button
                onClick={(e) => { e.stopPropagation(); setFileName(''); setResumeText(''); }}
                className="text-text-secondary ml-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <>
              <svg className="w-10 h-10 text-text-secondary/40 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              <p className="text-sm text-text-secondary">点击上传文件</p>
              <p className="text-xs text-text-secondary/50 mt-1">支持 TXT、MD、DOC、PDF</p>
            </>
          )}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-text-secondary">或直接粘贴</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Text area */}
        <textarea
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          placeholder="在这里粘贴你的简历内容...&#10;&#10;包括：教育背景、工作经历、项目经验、技能特长等"
          className="w-full h-48 bg-bg-card border border-border rounded-2xl p-4 text-sm text-text-primary placeholder-text-secondary/50 resize-none focus:outline-none focus:border-primary/50 transition-colors"
        />

        <p className="text-xs text-text-secondary/50 mt-2 text-center">
          简历将被缓存以便下次复用
        </p>
      </div>

      {/* Buttons */}
      <div className="animate-fade-in-up mt-6 space-y-3" style={{ animationDelay: '0.3s' }}>
        <button
          onClick={handleSubmit}
          disabled={!resumeText.trim() || parsing}
          className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all ${
            resumeText.trim() && !parsing
              ? 'bg-gradient-to-r from-[#1a6b4a] to-[#22875e] text-white shadow-xl shadow-primary/25 active:scale-[0.98]'
              : 'bg-bg-card text-text-secondary/50 cursor-not-allowed'
          }`}
        >
          生成 AI 分析报告
        </button>
        <button
          onClick={onSkip}
          className="w-full py-3 rounded-2xl text-text-secondary text-sm active:bg-bg-card transition-colors"
        >
          跳过，仅查看测评结果
        </button>
      </div>

      {/* Resume cache modal */}
      {showCacheModal && (
        <ModalOverlay
          title="检测到之前的简历"
          onConfirm={handleUseCached}
          onCancel={handleDiscardCache}
          confirmText="使用"
          cancelText="重新上传"
        >
          <p>上次上传的简历仍在缓存中{cachedResume.source ? `（来源：${cachedResume.source}）` : ''}。</p>
          <p className="mt-1">是否直接使用？</p>
        </ModalOverlay>
      )}
    </div>
  );
}
