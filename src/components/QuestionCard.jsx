import { useState, useEffect, useRef } from 'react';
import { options } from '../data/questions';
import ModalOverlay from './ui/ModalOverlay';

const optionLetters = ['A', 'B', 'C', 'D', 'E'];

export default function QuestionCard({ question, index, total, onAnswer, onBack, onExit, currentAnswer }) {
  const [selected, setSelected] = useState(currentAnswer || null);
  const [showExitModal, setShowExitModal] = useState(false);
  const [wentBack, setWentBack] = useState(false);
  const progress = ((index) / total) * 100;
  const pendingTimeout = useRef(null);

  useEffect(() => {
    setSelected(currentAnswer || null);
  }, [question.id, currentAnswer]);

  const isLast = index === total - 1;
  // Show next button only when went back (re-answering), or on last question
  const showNext = isLast || wentBack;

  const handleSelect = (value) => {
    setSelected(value);
    if (!isLast && !wentBack) {
      if (pendingTimeout.current) clearTimeout(pendingTimeout.current);
      pendingTimeout.current = setTimeout(() => {
        pendingTimeout.current = null;
        onAnswer(question.id, value);
      }, 200);
    }
  };

  const handleBack = () => {
    if (index === 0) return;
    setWentBack(true);
    onBack();
  };

  return (
    <div className="welcome-page relative min-h-[100dvh]">
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
        <div className="safe-top flex items-center justify-between px-4 pb-2">
          <button onClick={() => setShowExitModal(true)} className="w-10 h-10 -ml-2 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 19L8 12L15 5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <span className="text-[16px] font-medium text-black">职场性格测试</span>
          <div className="w-10 h-10" />
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
              className="h-full rounded-full transition-all duration-500 ease-out bg-[#009688]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question card */}
        <div
          className="mx-4 mt-6 bg-white rounded-[12px] px-5 py-7"
          style={{ boxShadow: '-10px -11px 30px 0px rgba(0,0,0,0.03), 15px 13px 30px 0px rgba(0,0,0,0.1)' }}
        >
          <div>
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

                    style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
                    className={`w-full flex gap-3 items-start p-5 rounded-[4px] text-left ${
                      isSelected
                        ? 'bg-[#EBFAF5] ring-1 ring-[#009688]'
                        : 'bg-[#f8fafc]'
                    }`}
                  >
                    <span className="text-[16px] font-semibold text-black shrink-0">{optionLetters[i]}、</span>
                    <span className="text-[16px] text-black">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Prev / Next navigation — outside animated wrapper */}
          <div className="mt-10 flex items-center justify-between">
            {index > 0 ? (
              <button
                onClick={handleBack}
                className="flex items-center gap-1"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="scale-y-[-1]">
                  <path d="M10 4L6 8L10 12" stroke="#7b838d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-[14px] text-[#7b838d] leading-[21px]">上一题</span>
              </button>
            ) : (
              <div />
            )}
            {showNext ? (
              isLast ? (
                <button
                  onClick={() => {
                    if (selected) {
                      if (pendingTimeout.current) {
                        clearTimeout(pendingTimeout.current);
                        pendingTimeout.current = null;
                      }
                      setWentBack(false);
                      onAnswer(question.id, selected);
                    }
                  }}
                  disabled={!selected}
                  className={`h-[36px] px-6 rounded-full bg-[#EBFAF5] flex items-center justify-center active:scale-[0.98] transition-transform ${!selected ? 'opacity-30' : ''}`}
                >
                  <span className="text-[14px] font-semibold text-[#008B68]">完成</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (selected) {
                      if (pendingTimeout.current) {
                        clearTimeout(pendingTimeout.current);
                        pendingTimeout.current = null;
                      }
                      setWentBack(false);
                      onAnswer(question.id, selected);
                    }
                  }}
                  disabled={!selected}
                  className={`flex items-center gap-1 ${!selected ? 'opacity-30' : ''}`}
                >
                  <span className="text-[14px] text-[#00674d] leading-[21px]">下一题</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="rotate-180">
                    <path d="M10 4L6 8L10 12" stroke="#00674d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              )
            ) : (
              <div />
            )}
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
