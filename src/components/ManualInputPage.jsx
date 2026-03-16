import { useState, useEffect } from 'react';
import PageHeader from './ui/PageHeader';
import MBTISelector from './ui/MBTISelector';
import JungSlider from './ui/JungSlider';
import { saveManualProgress } from '../utils/storage';

const jungFunctions = ['Ti', 'Te', 'Fi', 'Fe', 'Ni', 'Ne', 'Si', 'Se'];

const defaultJung = { Ti: 0, Te: 0, Fi: 0, Fe: 0, Ni: 0, Ne: 0, Si: 0, Se: 0 };

const MODE_MBTI = 'mbti';
const MODE_JUNG = 'jung';

export default function ManualInputPage({ onSubmit, onBack, initialData }) {
  const [mode, setMode] = useState(initialData?.mode || MODE_MBTI);
  const [mbtiSelections, setMbtiSelections] = useState(initialData?.mbtiSelections || {});
  const [jungScores, setJungScores] = useState(initialData?.jungScores || defaultJung);
  const [jungTouched, setJungTouched] = useState(initialData?.jungScores ? true : false);

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

  const canSubmit = mode === MODE_MBTI ? mbtiString !== null : jungTouched;

  const handleJungChange = (fn, val) => {
    setJungScores((prev) => ({ ...prev, [fn]: val }));
    setJungTouched(true);
  };

  const handleSubmit = () => {
    if (mode === MODE_MBTI) {
      onSubmit(mbtiString, null);
    } else {
      onSubmit(null, jungScores);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFB]">
      <PageHeader title="输入人格数据" onBack={onBack} />

      <div className="flex-1 px-6 pb-8 overflow-y-auto">
        {/* Mode toggle */}
        <div className="animate-fade-in-up mt-4 flex gap-2">
          <button
            onClick={() => setMode(MODE_MBTI)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${
              mode === MODE_MBTI
                ? 'bg-primary text-white'
                : 'bg-bg-card text-text-secondary border border-border'
            }`}
          >
            <span className="w-6 h-6 rounded-md bg-white/20 flex items-center justify-center text-xs font-bold">M</span>
            MBTI 类型
          </button>
          <button
            onClick={() => setMode(MODE_JUNG)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${
              mode === MODE_JUNG
                ? 'bg-primary text-white'
                : 'bg-bg-card text-text-secondary border border-border'
            }`}
          >
            <span className="w-6 h-6 rounded-md bg-white/20 flex items-center justify-center text-xs font-bold">J</span>
            荣格八维
          </button>
        </div>

        {/* MBTI Section */}
        {mode === MODE_MBTI && (
          <div className="animate-fade-in mt-6">
            <p className="text-xs text-text-secondary mb-3">选择你的四个维度偏好</p>
            <div className="glass rounded-2xl p-4">
              <MBTISelector value={mbtiSelections} onChange={setMbtiSelections} />
            </div>
          </div>
        )}

        {/* Jung Section */}
        {mode === MODE_JUNG && (
          <div className="animate-fade-in mt-6">
            <p className="text-xs text-text-secondary mb-3">拖动滑条调整各功能强度（0-100）</p>
            <div className="glass rounded-2xl p-4 space-y-4">
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
        <p className="text-xs text-text-secondary/50 text-center mt-4">
          选择一种输入方式，将结合简历生成 AI 深度报告
        </p>
      </div>

      {/* Submit */}
      <div className="px-6 pb-6">
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all ${
            canSubmit
              ? 'bg-gradient-to-r from-[#1a6b4a] to-[#22875e] text-white shadow-xl shadow-primary/25 active:scale-[0.98]'
              : 'bg-bg-card text-text-secondary/50 cursor-not-allowed'
          }`}
        >
          下一步
        </button>
      </div>
    </div>
  );
}
