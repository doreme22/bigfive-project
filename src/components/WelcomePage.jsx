import { useState } from 'react';
import { loadQuizProgress, clearQuizProgress } from '../utils/storage';
import ModalOverlay from './ui/ModalOverlay';

function loadInitialProgress() {
  const progress = loadQuizProgress();
  if (progress && progress.shuffledIds && progress.shuffledIds.length > 0) {
    return progress;
  }
  return null;
}

/*
 * Label positions relative to the illustration image (339×401).
 * Figma: page=375×812, illustration at left=37 top=378 w=339 h=401
 * left = (figma_label_left - 37) / 339
 * top  = (figma_label_top  - 378) / 401
 */
const dimensionLabels = [
  { text: '宜人性', left: '54.6%', top: '24.4%' },
  { text: '尽责性', left: '77.3%', top: '29.4%' },
  { text: '外向性', left: '33.0%', top: '45.4%' },
  { text: '情绪性', left: '84.4%', top: '49.1%' },
  { text: '开放性', left: '63.4%', top: '60.8%' },
];

export default function WelcomePage({ onStart, onGoManualInput, onGoHistory, onRestoreProgress, onBack }) {
  const [savedProgress, setSavedProgress] = useState(loadInitialProgress);
  const [showRestoreModal, setShowRestoreModal] = useState(() => loadInitialProgress() !== null);

  const handleRestore = () => {
    setShowRestoreModal(false);
    onRestoreProgress(savedProgress);
  };

  const handleDiscardProgress = () => {
    clearQuizProgress();
    setSavedProgress(null);
    setShowRestoreModal(false);
  };

  const answeredCount = savedProgress ? Object.keys(savedProgress.answers || {}).length : 0;
  const totalCount = savedProgress ? (savedProgress.shuffledIds || []).length : 44;
  const allAnswered = answeredCount >= totalCount && totalCount > 0;

  return (
    <div className="welcome-page relative h-[100dvh] flex flex-col overflow-hidden">
      {/* Background decorative pattern */}
      <img
        src="/images/home-bg-pattern.svg"
        alt=""
        className="absolute top-[-286px] left-[-41px] w-[724px] h-[1314px] opacity-80 pointer-events-none"
      />

      {/* Top navigation bar */}
      <div className="safe-top relative z-10 shrink-0 flex items-center justify-between px-4 pb-2">
        <button onClick={onBack} className="w-10 h-10 -ml-2 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 19L8 12L15 5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button onClick={onGoHistory} className="w-10 h-10 -mr-2 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 4.16667V10L13.3333 11.6667" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="10" cy="10" r="7.5" stroke="black" strokeWidth="1.5"/>
          </svg>
        </button>
      </div>

      {/* Title */}
      <div className="relative z-10 shrink-0 px-4 mt-5">
        <p className="text-[28px] leading-normal text-black font-normal">测测你的</p>
        <p className="text-[32px] leading-normal text-black font-semibold">职场</p>
        <p className="text-[32px] leading-normal text-black font-semibold inline-flex items-end gap-1">
          性格密码
          <img src="/images/home-search-icon.svg" alt="" className="w-[13px] h-[13px] mb-[6px]" />
        </p>
      </div>

      {/* Subtitle */}
      <div className="relative z-10 shrink-0 px-4 mt-2">
        <p className="text-[13px] leading-normal text-[#656d76]">基于BFI-44量表 + AI深度解析</p>
      </div>

      {/* Feature list */}
      <div className="relative z-10 shrink-0 px-4 mt-8 flex flex-col gap-4">
        {[
          '44道经典题目，科学测评',
          '五维雷达图 + 常模对比',
          'AI深度分析 + 岗位推荐',
        ].map((text) => (
          <div key={text} className="flex items-center gap-2">
            <img src="/images/home-feature-icon.svg" alt="" className="w-[18px] h-[18px] flex-shrink-0" />
            <span className="text-[14px] leading-[21px] text-black">{text}</span>
          </div>
        ))}
      </div>

      {/* Illustration area — flex-1 absorbs remaining height, illustration scales to fit */}
      <div className="flex-1 min-h-0 relative z-[5]" style={{ paddingLeft: '9.87%' }}>
        <div className="relative h-full" style={{ aspectRatio: '339 / 401' }}>
          <img
            src="/images/home-illustration.svg"
            alt=""
            className="w-full h-full pointer-events-none"
          />
          {dimensionLabels.map(({ text, left, top }) => (
            <div
              key={text}
              className="absolute flex flex-col items-center gap-1"
              style={{ left, top }}
            >
              <span className="text-[14px] leading-[21px] text-[#98cebd] whitespace-nowrap">{text}</span>
              <span className="w-[7px] h-[7px] rounded-full bg-[#98cebd]" />
            </div>
          ))}
        </div>
      </div>

      {/* CTA buttons */}
      <div className="safe-bottom relative z-10 shrink-0 flex flex-col gap-3 items-center" style={{ paddingLeft: '16.5%', paddingRight: '16.5%' }}>
        <button
          onClick={onStart}
          className="w-full h-[50px] rounded-full bg-[#494949] flex items-center justify-center active:scale-[0.98] transition-transform"
        >
          <span className="text-[16px] font-semibold text-[#d1fff0]">开始测试</span>
        </button>
        <button
          onClick={onGoManualInput}
          className="w-full h-[50px] rounded-full flex items-center justify-center gap-0.5"
        >
          <span className="text-[16px] font-semibold text-[#7b838d]">已有MBTI / 荣格八维？</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="rotate-180">
            <path d="M10 4L6 8L10 12" stroke="#7b838d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Progress restore modal */}
      {showRestoreModal && (
        <ModalOverlay
          title={allAnswered ? '检测到已完成的测评' : '检测到未完成的测评'}
          onConfirm={handleRestore}
          onCancel={handleDiscardProgress}
          confirmText={allAnswered ? '继续上传简历' : '继续答题'}
          cancelText="重新开始"
        >
          {allAnswered ? (
            <p>上次测评已完成答题，还未上传简历生成报告。是否继续？</p>
          ) : (
            <>
              <p>上次测评未完成，已完成 {answeredCount}/{totalCount} 题。</p>
              <p className="mt-1">是否继续上次的进度？</p>
            </>
          )}
        </ModalOverlay>
      )}
    </div>
  );
}
