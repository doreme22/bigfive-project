import { useState, useEffect } from 'react';

const traits = ['外向性', '宜人性', '尽责性', '情绪性', '开放性'];

export default function WelcomePage({ onStart }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((i) => (i + 1) % traits.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-emerald-400/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl" />

      {/* Icon */}
      <div className="animate-fade-in-up mb-8">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center shadow-xl animate-float">
          <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
          </svg>
        </div>
      </div>

      {/* Title */}
      <div className="animate-fade-in-up text-center" style={{ animationDelay: '0.15s' }}>
        <h1 className="text-3xl font-bold mb-3">
          <span className="gradient-text">大五人格</span>
        </h1>
        <h2 className="text-xl font-semibold text-text-primary mb-2">职场深度测评</h2>
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
          { icon: '📊', text: '五维雷达图，直观呈现' },
          { icon: '🤖', text: 'AI 深度分析职场画像' },
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
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-white font-semibold text-lg shadow-xl shadow-primary/25 active:scale-[0.98] transition-transform"
        >
          开始测评
        </button>
        <p className="text-center text-xs text-text-secondary mt-3">
          约 5-8 分钟 · 结果仅供参考
        </p>
      </div>
    </div>
  );
}
