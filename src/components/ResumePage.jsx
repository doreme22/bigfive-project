import { useState, useRef, useEffect } from 'react';
import PageHeader from './ui/PageHeader';
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

  // Which source row is active
  const isOnlineActive = importSource === '在线简历';
  const isLocalActive = !!(importSource && /\.\w+$/.test(importSource));
  const isAttachActive = !!(importSource && !isOnlineActive && !isLocalActive);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] relative overflow-hidden">
      {/* Top gradient background */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none z-0"
        style={{
          height: 275,
          background: 'linear-gradient(175deg, rgba(142,241,205,0.5) 5%, rgba(255,255,255,0) 61%)',
        }}
      />

      {/* Header */}
      <div className="relative z-10 [&>div]:bg-transparent">
        <PageHeader title="上传你的简历" onBack={onBack} sticky={false} />
      </div>

      {/* Subtitle */}
      <div className="relative z-10 px-4">
        <p className="text-[14px] text-[#7b838d] leading-[20px]">
          AI将结合你的性格数据与职业经历生成一份专属的深度职场画像
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-4 relative z-[1] mt-[12px]">

        {/* Shared hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.md,.doc,.docx,.pdf"
          className="hidden"
          onChange={(e) => { handleFileChange(e.target.files[0]); e.target.value = ''; }}
        />

        <div className="animate-fade-in-up flex-1 flex flex-col gap-[12px]">
          {/* ================================================================
              State B: picker — 有在线数据，选择来源卡片
             ================================================================ */}
          {displayState === 'picker' && (
            <>
              <div className="bg-white rounded-[12px] px-4 py-5 flex flex-col gap-[10px]">
                <h3 className="text-[16px] font-semibold text-black">选择简历来源</h3>

                {onlineResumeData && (
                  <button
                    onClick={handleImportOnlineResume}
                    className={`w-full flex items-center justify-between px-3 py-5 rounded-[4px] text-left ${
                      isOnlineActive ? 'bg-[#EBFAF5] ring-1 ring-[#009688]' : 'bg-[#f8fafc]'
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <img src="/images/icon-resume-online.svg" alt="" className="w-5 h-5 shrink-0" style={isOnlineActive ? { filter: 'brightness(0) saturate(100%) invert(25%) sepia(60%) saturate(900%) hue-rotate(140deg)' } : undefined} />
                      <span className="text-[14px] font-medium text-black">在线简历</span>
                    </div>
                    {onlineResumeData.name ? (
                      <span className={`text-[14px] ${isOnlineActive ? 'text-black' : 'text-[#656D76]'}`}>{onlineResumeData.name}·{onlineResumeData.title}</span>
                    ) : (
                      <img src="/images/icon-arrow-right.svg" alt="" className="w-5 h-5 shrink-0" />
                    )}
                  </button>
                )}

                {hasAttachments && onGoAttachments && (
                  <button
                    onClick={() => onGoAttachments(resumeText, importSource)}
                    className={`w-full flex items-center justify-between px-3 py-5 rounded-[4px] text-left ${
                      isAttachActive ? 'bg-[#EBFAF5] ring-1 ring-[#009688]' : 'bg-[#f8fafc]'
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <img src="/images/icon-resume-attachment.svg" alt="" className="w-5 h-5 shrink-0" style={isAttachActive ? { filter: 'brightness(0) saturate(100%) invert(25%) sepia(60%) saturate(900%) hue-rotate(140deg)' } : undefined} />
                      <span className="text-[14px] font-medium text-black">附件导入</span>
                    </div>
                    <img src="/images/icon-arrow-right.svg" alt="" className="w-5 h-5 shrink-0" />
                  </button>
                )}

                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={parsing}
                  className={`w-full flex items-center justify-between px-3 py-5 rounded-[4px] text-left ${
                    isLocalActive ? 'bg-[#EBFAF5] ring-1 ring-[#009688]' : 'bg-[#f8fafc]'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    {parsing ? (
                      <svg className="w-5 h-5 text-black animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : (
                      <img src="/images/icon-resume-local.svg" alt="" className="w-5 h-5 shrink-0" style={isLocalActive ? { filter: 'brightness(0) saturate(100%) invert(25%) sepia(60%) saturate(900%) hue-rotate(140deg)' } : undefined} />
                    )}
                    <span className="text-[14px] font-medium text-black">
                      {parsing ? '正在解析...' : '本地文件'}
                    </span>
                  </div>
                  {!parsing && (
                    <span className={`text-[14px] ${isLocalActive ? 'text-black' : 'text-[#656D76]'}`}>支持TXT、MD、DOC、PDF</span>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-[#e5e5e5]" />
                <span className="text-xs text-[#bbc1c9]">或直接粘贴</span>
                <div className="flex-1 h-px bg-[#e5e5e5]" />
              </div>

              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="在这里粘贴你的简历内容…&#10;&#10;包括：教育经历、工作经历、项目经验、技能特长等"
                className="w-full h-[224px] bg-white rounded-[12px] px-4 py-5 text-[14px] text-black placeholder-[#bbc1c9] resize-none focus:outline-none scrollbar-hide"
              />
            </>
          )}

          {/* ================================================================
              State C: empty — 无在线数据，大框上传 + 粘贴
             ================================================================ */}
          {displayState === 'empty' && (
            <>
              <div className="bg-white rounded-[12px] px-4 py-5 flex flex-col gap-[10px]">
                <h3 className="text-[16px] font-semibold text-black">选择简历来源</h3>

                <div
                  className={`w-full flex items-center justify-between px-3 py-5 rounded-[4px] cursor-pointer transition-colors ${
                    dragActive ? 'bg-primary/5' : 'bg-[#f8fafc]'
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleDrop}
                >
                  <div className="flex items-center gap-1">
                    {parsing ? (
                      <svg className="w-5 h-5 text-black animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : importSource ? (
                      <svg className="w-5 h-5 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <img src="/images/icon-resume-local.svg" alt="" className="w-5 h-5 shrink-0" />
                    )}
                    <span className="text-[14px] font-medium text-black">
                      {parsing ? '正在解析...' : importSource ? importSource : '本地文件'}
                    </span>
                    {importSource && !parsing && (
                      <span className="text-[10px] text-[#bbc1c9] ml-1">点击重新上传</span>
                    )}
                  </div>
                  {!parsing && !importSource && (
                    <span className="text-[14px] text-[#bbc1c9]">支持TXT、MD、DOC、PDF</span>
                  )}
                </div>
              </div>

              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="在这里粘贴你的简历内容…&#10;&#10;包括：教育经历、工作经历、项目经验、技能特长等"
                className="w-full h-[224px] bg-white rounded-[12px] px-4 py-5 text-[14px] text-black placeholder-[#bbc1c9] resize-none focus:outline-none scrollbar-hide"
              />
            </>
          )}
        </div>

        {/* Buttons */}
        <div className="mt-6 flex flex-col gap-3 items-center pb-6" style={{ paddingLeft: '6%', paddingRight: '6%' }}>
          <button
            onClick={() => onSubmit(resumeText)}
            disabled={!resumeText.trim() || parsing}
            className={`w-full h-[50px] rounded-[12px] flex items-center justify-center transition-transform bg-[#494949] ${
              resumeText.trim() && !parsing
                ? 'active:scale-[0.98]'
                : 'opacity-60 cursor-not-allowed'
            }`}
          >
            <span className="text-[16px] font-semibold text-[#d1fff0]">生成 AI 分析报告</span>
          </button>
          {onSkip && (
            <button
              onClick={onSkip}
              className="w-full h-[50px] rounded-full flex items-center justify-center"
            >
              <span className="text-[16px] font-semibold text-[#7b838d]">跳过，仅查看测评结果</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
