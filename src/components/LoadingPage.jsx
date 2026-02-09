import { useState, useEffect } from 'react';

const stages = [
  { text: '正在解析你的性格数据', icon: '🧬' },
  { text: '正在将你的人格维度与常模对比', icon: '📊' },
  { text: 'AI 正在通过你的性格数据阅读你的简历', icon: '📄' },
  { text: '正在构建你的职场画像', icon: '🎨' },
  { text: '正在生成深度分析报告', icon: '✨' },
];

export default function LoadingPage() {
  const [currentStage, setCurrentStage] = useState(0);
  const [dots, setDots] = useState('');

  useEffect(() => {
    const stageTimer = setInterval(() => {
      setCurrentStage((prev) => (prev < stages.length - 1 ? prev + 1 : prev));
    }, 2500);
    return () => clearInterval(stageTimer);
  }, []);

  useEffect(() => {
    const dotTimer = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(dotTimer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-bg-dark relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-56 h-56 bg-emerald-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 text-center">
        {/* Spinning brain icon */}
        <div className="mb-8 relative">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-400/20 flex items-center justify-center mx-auto animate-pulse-glow">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center">
              <svg className="w-10 h-10 text-white animate-spin-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
              </svg>
            </div>
          </div>

          {/* Orbiting dots */}
          <div className="absolute inset-0 animate-spin-slow" style={{ animationDuration: '6s' }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rounded-full" />
          </div>
          <div className="absolute inset-0 animate-spin-slow" style={{ animationDuration: '8s', animationDirection: 'reverse' }}>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-teal-400 rounded-full" />
          </div>
        </div>

        {/* Stage text */}
        <div className="min-h-[80px]">
          {stages.map((stage, i) => (
            <div
              key={i}
              className={`flex items-center justify-center gap-2 mb-2 transition-all duration-500 ${
                i === currentStage
                  ? 'opacity-100 scale-100'
                  : i < currentStage
                    ? 'opacity-30 scale-95'
                    : 'opacity-0 scale-95 h-0 overflow-hidden'
              }`}
            >
              <span className="text-lg">{stage.icon}</span>
              <span className={`text-sm ${i === currentStage ? 'text-white' : 'text-text-secondary'}`}>
                {stage.text}{i === currentStage ? dots : ''}
              </span>
              {i < currentStage && (
                <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          ))}
        </div>

        {/* Progress indicator */}
        <div className="mt-8 flex gap-1.5 justify-center">
          {stages.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-700 ${
                i <= currentStage ? 'bg-primary w-6' : 'bg-bg-card w-3'
              }`}
            />
          ))}
        </div>

        <p className="text-xs text-text-secondary/50 mt-6">
          AI 正在为你撰写专属分析报告
        </p>
      </div>
    </div>
  );
}
