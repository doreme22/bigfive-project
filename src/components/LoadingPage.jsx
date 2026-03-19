import { useState, useEffect } from 'react';

const stages = [
  { text: '正在解析你的性格数据', icon: '🧬' },
  { text: '正在将你的人格维度与常模对比', icon: '📊' },
  { text: 'AI 正在通过你的性格数据阅读你的简历', icon: '📄' },
  { text: '正在构建你的职场画像', icon: '🎨' },
  { text: '正在生成深度分析报告', icon: '✨' },
];

const DOT_COUNT = 12;
const RADIUS = 56;
const DOT_SIZE = 8;
const DOT_COLOR = '#6FCDAE';

function DotsRing({ className }) {
  const dots = Array.from({ length: DOT_COUNT }, (_, i) => {
    const angle = (i * 360) / DOT_COUNT - 90;
    const rad = (angle * Math.PI) / 180;
    return {
      x: Math.cos(rad) * RADIUS,
      y: Math.sin(rad) * RADIUS,
    };
  });

  return (
    <div className={className} style={{ position: 'absolute', inset: 0 }}>
      {dots.map((dot, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: DOT_SIZE,
            height: DOT_SIZE,
            borderRadius: '50%',
            backgroundColor: DOT_COLOR,
            left: '50%',
            top: '50%',
            transform: `translate(${dot.x - DOT_SIZE / 2}px, ${dot.y - DOT_SIZE / 2}px)`,
          }}
        />
      ))}
    </div>
  );
}

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
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-white relative overflow-hidden">
      {/* Spinning dots */}
      <div className="relative mb-8" style={{ width: 160, height: 160 }}>
        <DotsRing className="dots-ring-a" />
        <DotsRing className="dots-ring-b" />
      </div>

      {/* Stage text */}
      <p className="text-[13px] text-black">
        {stages[currentStage].text}{dots}
      </p>
    </div>
  );
}
