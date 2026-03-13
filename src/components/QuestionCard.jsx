import { useState, useEffect } from 'react';
import { options } from '../data/questions';
import ModalOverlay from './ui/ModalOverlay';

const optionLetters = ['A', 'B', 'C', 'D', 'E'];

export default function QuestionCard({ question, index, total, onAnswer, onBack, onExit, currentAnswer }) {
  const [selected, setSelected] = useState(currentAnswer || null);
  const [animDir, setAnimDir] = useState('right');
  const [animating, setAnimating] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const progress = ((index) / total) * 100;

  useEffect(() => {
    setSelected(currentAnswer || null);
  }, [question.id, currentAnswer]);

  const handleSelect = (value) => {
    if (animating) return;
    setSelected(value);
    setAnimating(true);
    setAnimDir('right');
    setTimeout(() => {
      onAnswer(question.id, value);
      setAnimating(false);
    }, 350);
  };

  const handleBack = () => {
    if (animating || index === 0) return;
    setAnimDir('left');
    setAnimating(true);
    setTimeout(() => {
      onBack();
      setAnimating(false);
    }, 300);
  };

  return (
    <div className="welcome-page relative min-h-[100dvh]">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <img
          src="/images/home-bg-pattern.svg"
          alt=""
          className="absolute top-[-286px] left-[-41px] w-[851px] h-[1334px] opacity-80"
        />
      </div>

      {/* Decorative illustration */}
      <div
        className="absolute z-[1] pointer-events-none"
        style={{ left: '33%', top: '81px', width: '67%', aspectRatio: '251 / 297' }}
      >
        <img src="/images/quiz-illustration.svg" alt="" className="w-full h-full" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Navigation bar */}
        <div className="safe-top flex items-center justify-center px-4 pb-2 relative">
          <button onClick={() => setShowExitModal(true)} className="absolute left-4 bottom-2 w-10 h-10 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 19L8 12L15 5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <span className="text-[16px] font-medium text-black">职场性格测试</span>
        </div>

        {/* Progress section */}
        <div className="px-4 mt-4">
          <p className="text-black">
            <span className="text-[20px] font-semibold tracking-[0.5px]">出题{index + 1}</span>
            {' '}
            <span className="text-[14px] text-[#7b838d]">/{total}</span>
          </p>
          <div className="mt-2 w-[194px] h-[6px] bg-white rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out bg-[#00674d]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question card */}
        <div
          className="mx-4 mt-6 bg-white rounded-[12px] px-5 py-7"
          style={{ boxShadow: '-10px -11px 30px 0px rgba(0,0,0,0.03), 15px 13px 30px 0px rgba(0,0,0,0.1)' }}
        >
          <div
            key={question.id}
            className={animDir === 'right' ? 'animate-slide-right' : 'animate-slide-left'}
          >
            {/* Question text */}
            <p className="text-[18px] font-medium text-black tracking-[0.5px] leading-[24px]">
              {index + 1}、{question.text}
            </p>

            {/* Options */}
            <div className="mt-10 flex flex-col gap-4">
              {options.map((opt, i) => {
                const isSelected = selected === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    disabled={animating}
                    className={`w-full flex gap-3 items-start p-5 rounded-[4px] text-left transition-all duration-200 ${
                      isSelected
                        ? 'bg-[#00674d]/10 ring-1 ring-[#00674d]'
                        : 'bg-[#f8fafc] active:bg-[#f0f2f4]'
                    }`}
                  >
                    <span className="text-[16px] font-semibold text-black shrink-0">{optionLetters[i]}、</span>
                    <span className="text-[16px] text-black">{opt.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Prev / Next navigation */}
            <div className="mt-10 flex items-center justify-between">
              <button
                onClick={handleBack}
                disabled={index === 0}
                className={`flex items-center gap-1 ${index === 0 ? 'opacity-30' : ''}`}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="scale-y-[-1]">
                  <path d="M10 4L6 8L10 12" stroke="#7b838d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-[14px] text-[#7b838d] leading-[21px]">上一题</span>
              </button>
              <button
                onClick={() => {
                  if (selected && !animating) {
                    handleSelect(selected);
                  }
                }}
                disabled={!selected || animating}
                className={`flex items-center gap-1 ${!selected ? 'opacity-30' : ''}`}
              >
                <span className="text-[14px] text-[#00674d] leading-[21px]">下一题</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="rotate-180">
                  <path d="M10 4L6 8L10 12" stroke="#00674d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Exit confirmation modal */}
      {showExitModal && (
        <ModalOverlay
          title="确定要退出测评吗？"
          onConfirm={onExit}
          onCancel={() => setShowExitModal(false)}
          confirmText="退出"
          cancelText="继续答题"
        >
          <p>当前进度已自动保存，下次可继续作答。</p>
        </ModalOverlay>
      )}
    </div>
  );
}
