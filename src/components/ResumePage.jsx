import { useState, useRef, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import {
  getOnlineResume,
  getOnlineAttachments,
  uploadAttachmentToOnline,
  formatResumeToText,
} from '../utils/onlineResume';

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

// Display state: 'picker' | 'empty'
// picker = has online resume or attachments → source selection card
// empty  = no online data → big upload area + paste

export default function ResumePage({
  onSubmit, onSkip, onBack, onGoAttachments, selectedAttachment,
  draftResumeText, draftImportSource,
}) {
  const [resumeText, setResumeText] = useState(draftResumeText || '');
  const [importSource, setImportSource] = useState(draftImportSource || '');
  const [parsing, setParsing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [displayState, setDisplayState] = useState(null); // null = loading
  const fileInputRef = useRef(null);

  // Data availability
  const [onlineResumeData, setOnlineResumeData] = useState(null);
  const [hasAttachments, setHasAttachments] = useState(false);

  // Fetch online data to determine display state
  useEffect(() => {
    (async () => {
      const [resume, attachments] = await Promise.all([
        getOnlineResume(),
        getOnlineAttachments(),
      ]);
      if (resume) setOnlineResumeData(resume);
      const hasAtt = attachments && attachments.length > 0;
      if (hasAtt) setHasAttachments(true);
      setDisplayState((resume || hasAtt) ? 'picker' : 'empty');
    })();
  }, []);

  // Handle selectedAttachment from AttachmentPage
  useEffect(() => {
    if (selectedAttachment) {
      const text = `[附件内容] ${selectedAttachment.fileName}\n\n（这是从在线简历导入的附件，实际内容将在 API 接入后加载）`;
      setResumeText(text);
      setImportSource(selectedAttachment.fileName);
      setDisplayState('picker');
    }
  }, [selectedAttachment]);

  const handleImportOnlineResume = () => {
    const text = formatResumeToText(onlineResumeData);
    setResumeText(text);
    setImportSource('在线简历');
  };

  const handleFileChange = async (file) => {
    if (!file) return;
    const isPDF = file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf';

    if (isPDF) {
      setParsing(true);
      try {
        const text = await extractTextFromPDF(file);
        setResumeText(text);
        setImportSource(file.name);
        uploadAttachmentToOnline(file).then(() => setHasAttachments(true));
      } catch (err) {
        console.error('PDF 解析失败:', err);
        setResumeText('');
        setImportSource('');
        alert('PDF 解析失败，请尝试粘贴文本内容');
      } finally {
        setParsing(false);
      }
    } else {
      const text = await file.text();
      setResumeText(text);
      setImportSource(file.name);
      uploadAttachmentToOnline(file).then(() => setHasAttachments(true));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col px-6 py-8 bg-bg-dark">
      {/* Header */}
      <div className="animate-fade-in-up text-center mb-8">
        {onBack && (
          <button
            onClick={onBack}
            className="absolute left-4 top-8 p-2 text-text-secondary active:text-text-primary transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
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

      <div className="animate-fade-in-up flex-1">
        {/* Shared hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.md,.doc,.docx,.pdf"
          className="hidden"
          onChange={(e) => { handleFileChange(e.target.files[0]); e.target.value = ''; }}
        />

        {/* ================================================================
            State B: picker — 有在线数据，选择来源卡片
           ================================================================ */}
        {displayState === 'picker' && (
          <>
            <div className="bg-bg-card border border-border rounded-2xl p-4 mb-4">
              <h3 className="text-sm font-semibold text-text-primary mb-3">选择简历来源</h3>
              <div className="space-y-2">
                {onlineResumeData && (
                  <button
                    onClick={handleImportOnlineResume}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-bg-dark/50 border border-border/50 active:bg-bg-dark transition-colors"
                  >
                    <div className="flex items-center gap-2 text-left">
                      <svg className="w-5 h-5 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                      <div>
                        <span className="text-sm text-text-primary">使用在线简历内容</span>
                        <p className="text-xs text-text-secondary mt-0.5">{onlineResumeData.name} · {onlineResumeData.title}</p>
                      </div>
                    </div>
                    <svg className="w-4 h-4 text-text-secondary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}

                {hasAttachments && onGoAttachments && (
                  <button
                    onClick={() => onGoAttachments(resumeText, importSource)}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-bg-dark/50 border border-border/50 active:bg-bg-dark transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                      <span className="text-sm text-text-primary">从附件导入</span>
                    </div>
                    <svg className="w-4 h-4 text-text-secondary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}

                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={parsing}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-bg-dark/50 border border-border/50 active:bg-bg-dark transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    {parsing
                      ? <span className="text-sm text-text-secondary">正在解析...</span>
                      : <div>
                          <span className="text-sm text-text-primary">上传本地文件</span>
                          <p className="text-xs text-text-secondary mt-0.5">支持 TXT、MD、DOC、PDF</p>
                        </div>
                    }
                  </div>
                  {parsing ? (
                    <svg className="w-5 h-5 text-primary animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-text-secondary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-text-secondary">或直接粘贴</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {importSource && (
              <div className="flex items-center gap-2 mb-2 px-1">
                <svg className="w-4 h-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs text-text-secondary">
                  已导入：<span className="text-primary">{importSource}</span>
                </span>
              </div>
            )}

            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="在这里粘贴你的简历内容...&#10;&#10;包括：教育背景、工作经历、项目经验、技能特长等"
              className="w-full h-48 bg-bg-card border border-border rounded-2xl p-4 text-sm text-text-primary placeholder-text-secondary/50 resize-none focus:outline-none focus:border-primary/50 transition-colors"
            />
          </>
        )}

        {/* ================================================================
            State C: empty — 无在线数据，大框上传 + 粘贴
           ================================================================ */}
        {displayState === 'empty' && (
          <>
            <div
              className={`border-2 border-dashed rounded-2xl p-8 text-center mb-4 transition-colors cursor-pointer ${
                dragActive ? 'border-primary bg-primary/5' : 'border-border'
              }`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
            >
              {parsing ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 text-primary animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span className="text-sm text-text-secondary">正在解析...</span>
                </div>
              ) : importSource ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-primary">{importSource}</span>
                  <span className="text-[10px] text-text-secondary/50 ml-1">点击重新上传</span>
                </div>
              ) : (
                <>
                  <svg className="w-12 h-12 text-text-secondary/30 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  <p className="text-sm text-text-primary mb-1">点击上传简历文件</p>
                  <p className="text-xs text-text-secondary/50">支持 TXT、MD、DOC、PDF</p>
                </>
              )}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-text-secondary">或直接粘贴</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="在这里粘贴你的简历内容...&#10;&#10;包括：教育背景、工作经历、项目经验、技能特长等"
              className="w-full h-48 bg-bg-card border border-border rounded-2xl p-4 text-sm text-text-primary placeholder-text-secondary/50 resize-none focus:outline-none focus:border-primary/50 transition-colors"
            />
          </>
        )}
      </div>

      {/* Buttons */}
      <div className="animate-fade-in-up mt-6 space-y-3" style={{ animationDelay: '0.3s' }}>
        <button
          onClick={() => onSubmit(resumeText)}
          disabled={!resumeText.trim() || parsing}
          className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all ${
            resumeText.trim() && !parsing
              ? 'bg-gradient-to-r from-[#1a6b4a] to-[#22875e] text-white shadow-xl shadow-primary/25 active:scale-[0.98]'
              : 'bg-bg-card text-text-secondary/50 cursor-not-allowed'
          }`}
        >
          生成 AI 分析报告
        </button>
        {onSkip && (
          <button
            onClick={onSkip}
            className="w-full py-3 rounded-2xl text-text-secondary text-sm active:bg-bg-card transition-colors"
          >
            跳过，仅查看测评结果
          </button>
        )}
      </div>
    </div>
  );
}
