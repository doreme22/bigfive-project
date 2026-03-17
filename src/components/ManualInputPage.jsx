import { useState, useEffect } from 'react';
import PageHeader from './ui/PageHeader';
import MBTISelector from './ui/MBTISelector';
import JungSlider from './ui/JungSlider';
import { saveManualProgress, loadManualProgress } from '../utils/storage';

const jungFunctions = ['Ti', 'Te', 'Fi', 'Fe', 'Ni', 'Ne', 'Si', 'Se'];

const defaultJung = { Ti: 0, Te: 0, Fi: 0, Fe: 0, Ni: 0, Ne: 0, Si: 0, Se: 0 };

const MODE_MBTI = 'mbti';
const MODE_JUNG = 'jung';

export default function ManualInputPage({ onSubmit, onBack }) {
  const [restored] = useState(() => loadManualProgress());
  const [mode, setMode] = useState(restored?.mode || MODE_MBTI);
  const [mbtiSelections, setMbtiSelections] = useState(restored?.mbtiSelections || {});
  const [jungScores, setJungScores] = useState(restored?.jungScores || defaultJung);

  // Auto-save manual input progress
  useEffect(() => {
    saveManualProgress({
      mode,
      mbtiSelections,
      jungScores,
      completed: false,
    });
  }, [mode, mbtiSelections, jungScores]);

  const mbtiString = Object.keys(mbtiSelections).length === 4
    ? [mbtiSelections[0], mbtiSelections[1], mbtiSelections[2], mbtiSelections[3]].join('')
    : null;

  const jungAllNonZero = jungFunctions.every((fn) => jungScores[fn] > 0);
  const canSubmit = mode === MODE_MBTI ? mbtiString !== null : jungAllNonZero;

  const handleJungChange = (fn, val) => {
    setJungScores((prev) => ({ ...prev, [fn]: val }));

  };

  const handleSubmit = () => {
    if (mode === MODE_MBTI) {
      onSubmit(mbtiString, null, 'mbti');
    } else {
      onSubmit(null, jungScores, 'jung');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFB]">
      <PageHeader title="输入人格数据" onBack={onBack} />

      <div className="flex-1 px-6 pb-8 overflow-y-auto">
        {/* Mode toggle */}
        <div className="animate-fade-in-up mt-[12px] flex gap-5 justify-center">
          <button
            onClick={() => setMode(MODE_MBTI)}
            className={`relative w-[134px] h-[48px] rounded-[12px] text-[16px] transition-all border overflow-hidden ${
              mode === MODE_MBTI
                ? 'bg-white border-[#008B68] text-[#008B68] font-semibold'
                : 'bg-white border-[#D9D9D9] text-black font-normal'
            }`}
          >
            MBTI
            {mode === MODE_MBTI && (
              <span className="absolute -bottom-[2px] -right-[2px]">
                <svg width="23" height="16" viewBox="0 0 23 16" fill="none">
                  <path d="M3.17996 6.7492C4.56803 2.71119 8.3669 0 12.6368 0H23V4C23 10.6274 17.6274 16 11 16H0L3.17996 6.7492Z" fill="#008B68" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M8.93994 8.96919C8.64392 8.64626 8.64392 8.15061 8.93994 7.82768C9.27471 7.46248 9.85045 7.46248 10.1852 7.82768L10.7084 8.39844C11.3245 9.07051 12.384 9.07051 13.0001 8.39844L15.8149 5.32768C16.1497 4.96248 16.7255 4.96248 17.0602 5.32768C17.3562 5.65061 17.3562 6.14626 17.0602 6.46919L13.3286 10.5401C12.5359 11.4048 11.1726 11.4048 10.3799 10.5401L8.93994 8.96919Z" fill="white" stroke="white" strokeWidth="0.583333" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            )}
          </button>
          <button
            onClick={() => setMode(MODE_JUNG)}
            className={`relative w-[134px] h-[48px] rounded-[12px] text-[16px] transition-all border overflow-hidden ${
              mode === MODE_JUNG
                ? 'bg-white border-[#008B68] text-[#008B68] font-semibold'
                : 'bg-white border-[#D9D9D9] text-black font-normal'
            }`}
          >
            荣格八维
            {mode === MODE_JUNG && (
              <span className="absolute -bottom-[2px] -right-[2px]">
                <svg width="23" height="16" viewBox="0 0 23 16" fill="none">
                  <path d="M3.17996 6.7492C4.56803 2.71119 8.3669 0 12.6368 0H23V4C23 10.6274 17.6274 16 11 16H0L3.17996 6.7492Z" fill="#008B68" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M8.93994 8.96919C8.64392 8.64626 8.64392 8.15061 8.93994 7.82768C9.27471 7.46248 9.85045 7.46248 10.1852 7.82768L10.7084 8.39844C11.3245 9.07051 12.384 9.07051 13.0001 8.39844L15.8149 5.32768C16.1497 4.96248 16.7255 4.96248 17.0602 5.32768C17.3562 5.65061 17.3562 6.14626 17.0602 6.46919L13.3286 10.5401C12.5359 11.4048 11.1726 11.4048 10.3799 10.5401L8.93994 8.96919Z" fill="white" stroke="white" strokeWidth="0.583333" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            )}
          </button>
        </div>

        {/* MBTI Section */}
        {mode === MODE_MBTI && (
          <div className="animate-fade-in mt-6">
            <p className="text-xs text-black mb-3">选择你的四个维度偏好</p>
            <MBTISelector value={mbtiSelections} onChange={setMbtiSelections} />
          </div>
        )}

        {/* Jung Section */}
        {mode === MODE_JUNG && (
          <div className="animate-fade-in mt-6">
            <p className="text-xs text-black mb-3">输入各功能强度（0-100）</p>
            <div className="space-y-[16px] px-[28px]">
              {jungFunctions.map((fn) => (
                <JungSlider
                  key={fn}
                  label={fn}
                  value={jungScores[fn]}
                  onChange={(val) => handleJungChange(fn, val)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Hint */}
        <p className="text-xs text-[#BBC1C9] text-center mt-4">
          选择一种输入方式，将结合简历生成 AI 深度报告
        </p>
      </div>

      {/* Submit */}
      <div className="flex justify-center pb-6">
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`w-[331px] h-[50px] rounded-[12px] text-[16px] font-semibold transition-all bg-[#494949] text-[#D1FFF0] ${
            canSubmit
              ? 'active:scale-[0.98]'
              : 'opacity-60 cursor-not-allowed'
          }`}
        >
          下一步
        </button>
      </div>
    </div>
  );
}
