import { useState, useEffect } from 'react';
import { loadQuizProgress, clearQuizProgress } from '../utils/storage';
import ModalOverlay from './ui/ModalOverlay';

const traits = ['外向性', '宜人性', '尽责性', '情绪性', '开放性'];

function loadInitialProgress() {
  const progress = loadQuizProgress();
  if (progress && progress.shuffledIds && progress.shuffledIds.length > 0) {
    return progress;
  }
  return null;
}

export default function WelcomePage({ onStart, onGoManualInput, onGoHistory, onRestoreProgress, onBack }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [savedProgress, setSavedProgress] = useState(loadInitialProgress);
  const [showRestoreModal, setShowRestoreModal] = useState(() => loadInitialProgress() !== null);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((i) => (i + 1) % traits.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#1a6b4a]/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#1a6b4a]/5 rounded-full blur-3xl" />

      {/* Back button */}
      <button
        onClick={onBack}
        className="absolute top-4 left-4 glass w-10 h-10 rounded-xl flex items-center justify-center text-text-secondary active:text-primary transition-colors"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      {/* History button */}
      <button
        onClick={onGoHistory}
        className="absolute top-4 right-4 glass w-10 h-10 rounded-xl flex items-center justify-center text-text-secondary active:text-primary transition-colors"
        title="历史记录"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      {/* Icon */}
      <div className="animate-fade-in-up mb-8">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#1a6b4a] to-[#22875e] flex items-center justify-center shadow-xl animate-float">
          <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
          </svg>
        </div>
      </div>

      {/* Title */}
      <div className="animate-fade-in-up text-center" style={{ animationDelay: '0.15s' }}>
        <h1 className="text-3xl font-bold mb-3">
          <span className="gradient-text">职业性格测评</span>
        </h1>
        <p className="text-text-secondary text-sm max-w-xs mx-auto leading-relaxed">
          基于 BFI-44 量表 + AI 深度解析
          <br />
          发现你的职场性格密码
        </p>
      </div>

      {/* Animated traits */}
      <div className="animate-fade-in-up mt-8 flex gap-2 flex-wrap justify-center max-w-xs" style={{ animationDelay: '0.3s' }}>
        {traits.map((t, i) => (
          <span
            key={t}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-500 ${
              i === activeIndex
                ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/30'
                : 'bg-bg-card text-text-secondary border border-border'
            }`}
          >
            {t}
          </span>
        ))}
      </div>

      {/* Features */}
      <div className="animate-fade-in-up mt-10 space-y-3 w-full max-w-xs" style={{ animationDelay: '0.45s' }}>
        {[
          { icon: '📋', text: '44 道经典题目，科学测评' },
          { icon: '📊', text: '五维雷达图 + 常模对比' },
          { icon: '🤖', text: 'AI 深度分析 + 岗位推荐' },
        ].map((item) => (
          <div key={item.text} className="flex items-center gap-3 glass rounded-xl px-4 py-3">
            <span className="text-lg">{item.icon}</span>
            <span className="text-sm text-text-secondary">{item.text}</span>
          </div>
        ))}
      </div>

      {/* Start button */}
      <div className="animate-fade-in-up mt-10 w-full max-w-xs" style={{ animationDelay: '0.6s' }}>
        <button
          onClick={onStart}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#1a6b4a] to-[#22875e] text-white font-semibold text-lg shadow-xl shadow-primary/25 active:scale-[0.98] transition-transform"
        >
          开始测评
        </button>
        <button
          onClick={onGoManualInput}
          className="w-full mt-4 text-center text-sm text-primary active:text-primary-dark transition-colors py-2"
        >
          已有 MBTI / 荣格八维数据？点此输入 →
        </button>
      </div>

      {/* Progress restore modal */}
      {showRestoreModal && (
        <ModalOverlay
          title="检测到未完成的测评"
          onConfirm={handleRestore}
          onCancel={handleDiscardProgress}
          confirmText="继续答题"
          cancelText="重新开始"
        >
          <p>上次测评未完成，已完成 {answeredCount}/44 题。</p>
          <p className="mt-1">是否继续上次的进度？</p>
        </ModalOverlay>
      )}
    </div>
  );
}
