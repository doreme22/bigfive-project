import { useState, useEffect } from 'react';
import { options } from '../data/questions';

export default function QuestionCard({ question, index, total, onAnswer, onBack, currentAnswer }) {
  const [selected, setSelected] = useState(currentAnswer || null);
  const [animDir, setAnimDir] = useState('right');
  const [animating, setAnimating] = useState(false);
  const progress = ((index) / total) * 100;

  useEffect(() => {
    setSelected(currentAnswer || null); // eslint-disable-line react-hooks/set-state-in-effect -- sync selected on question change
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
    <div className="min-h-screen flex flex-col bg-bg-dark">
      {/* Header with progress */}
      <div className="sticky top-0 z-10 bg-bg-dark/90 backdrop-blur-sm px-4 pt-4 pb-3">
        {/* Progress bar */}
        <div className="w-full h-1.5 bg-bg-card rounded-full overflow-hidden mb-3">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(90deg, #1a6b4a, #22875e)`,
            }}
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={index === 0}
            className={`flex items-center gap-1 text-sm transition-colors ${
              index === 0 ? 'text-text-secondary/30' : 'text-text-secondary active:text-primary'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            上一题
          </button>
          <span className="text-sm text-text-secondary">
            <span className="text-text-primary font-semibold">{index + 1}</span> / {total}
          </span>
          <div className="w-12" />
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col justify-center px-6 pb-8">
        <div
          key={question.id}
          className={`${animDir === 'right' ? 'animate-slide-right' : 'animate-slide-left'}`}
        >
          {/* Question number bubble */}
          <div className="flex justify-center mb-6">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl"
              style={{ background: `linear-gradient(135deg, #1a6b4a90, #1a6b4a)` }}
            >
              {index + 1}
            </div>
          </div>

          {/* Question text */}
          <h2 className="text-xl font-semibold text-center mb-10 leading-relaxed px-2">
            {question.text}
          </h2>

          {/* Options */}
          <div className="space-y-3 max-w-sm mx-auto w-full">
            {options.map((opt) => {
              const isSelected = selected === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  disabled={animating}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-left transition-all duration-200 border ${
                    isSelected
                      ? 'border-primary bg-primary/15 scale-[1.02]'
                      : 'border-border bg-bg-card active:bg-bg-card-hover active:scale-[0.99]'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 transition-all ${
                    isSelected
                      ? 'bg-primary text-white'
                      : 'bg-bg-dark text-text-secondary'
                  }`}>
                    {opt.value}
                  </div>
                  <span className={`text-sm font-medium ${isSelected ? 'text-text-primary' : 'text-text-secondary'}`}>
                    {opt.label}
                  </span>
                  {isSelected && (
                    <svg className="w-5 h-5 text-primary ml-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
