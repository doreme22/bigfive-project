import { useState } from 'react';
import Markdown from 'react-markdown';
import RadarChartComponent from './RadarChart';
import { dimensionNames, dimensionColors, norms } from '../data/questions';

function ScoreBar({ dim, score }) {
  const norm = norms[dim];
  const pct = (score / 5) * 100;
  const normPct = (norm / 5) * 100;

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm font-medium" style={{ color: dimensionColors[dim] }}>
          {dimensionNames[dim]}
        </span>
        <span className="text-sm font-semibold text-text-primary">{score.toFixed(2)}</span>
      </div>
      <div className="relative h-2.5 bg-bg-dark rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${dimensionColors[dim]}80, ${dimensionColors[dim]})`,
          }}
        />
        {/* Norm marker */}
        <div
          className="absolute top-0 h-full w-0.5 bg-white/50"
          style={{ left: `${normPct}%` }}
          title={`常模: ${norm}`}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-text-secondary">1.0</span>
        <span className="text-[10px] text-text-secondary/50">常模 {norm}</span>
        <span className="text-[10px] text-text-secondary">5.0</span>
      </div>
    </div>
  );
}

export default function ResultPage({ scores, report, onRestart }) {
  const [activeTab, setActiveTab] = useState('chart');

  return (
    <div className="min-h-screen bg-bg-dark pb-24">
      {/* Hero header */}
      <div className="relative bg-gradient-to-b from-primary/15 to-transparent pt-8 pb-6 px-6">
        <div className="absolute top-4 right-4">
          <button
            onClick={onRestart}
            className="text-xs text-text-secondary glass px-3 py-1.5 rounded-full"
          >
            重新测评
          </button>
        </div>
        <div className="animate-fade-in-up text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center mx-auto mb-3">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-1">你的性格画像</h1>
          <p className="text-sm text-text-secondary">BFI-44 大五人格测评结果</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-0 z-10 bg-bg-dark/95 backdrop-blur-sm px-6 py-3 flex gap-2">
        {[
          { key: 'chart', label: '数据总览' },
          { key: 'detail', label: '维度详情' },
          ...(report ? [{ key: 'report', label: 'AI 深度分析' }] : []),
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                : 'bg-bg-card text-text-secondary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="px-6 mt-4">
        {activeTab === 'chart' && (
          <div className="animate-fade-in">
            {/* Radar chart */}
            <div className="glass rounded-3xl p-4 mb-6">
              <h3 className="text-sm font-semibold text-text-secondary mb-2 text-center">
                五维人格雷达图
              </h3>
              <RadarChartComponent scores={scores} />
            </div>

            {/* Quick summary */}
            <div className="glass rounded-3xl p-5">
              <h3 className="text-sm font-semibold text-text-secondary mb-4">常模对比一览</h3>
              <div className="space-y-1">
                {Object.keys(dimensionNames).map((dim) => {
                  const diff = scores[dim] - norms[dim];
                  const absDiff = Math.abs(diff);
                  let level, levelColor;
                  if (absDiff > 0.5) {
                    level = diff > 0 ? '显著偏高' : '显著偏低';
                    levelColor = diff > 0 ? 'text-green-400' : 'text-amber-400';
                  } else if (absDiff > 0.2) {
                    level = diff > 0 ? '略高' : '略低';
                    levelColor = diff > 0 ? 'text-green-400/70' : 'text-amber-400/70';
                  } else {
                    level = '接近常模';
                    levelColor = 'text-text-secondary';
                  }
                  return (
                    <div key={dim} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: dimensionColors[dim] }} />
                        <span className="text-sm text-text-primary">{dimensionNames[dim]}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold">{scores[dim].toFixed(2)}</span>
                        <span className={`text-xs ${levelColor}`}>{level}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'detail' && (
          <div className="animate-fade-in">
            <div className="glass rounded-3xl p-5">
              <h3 className="text-sm font-semibold text-text-secondary mb-4">各维度得分详情</h3>
              {Object.keys(dimensionNames).map((dim) => (
                <ScoreBar key={dim} dim={dim} score={scores[dim]} />
              ))}
              <p className="text-[10px] text-text-secondary/50 mt-4 text-center">
                白色竖线 = 中国青年样本常模参考值
              </p>
            </div>

            {/* Dimension descriptions */}
            <div className="mt-4 space-y-3">
              {Object.entries({
                E: '衡量个体的社交能量和外部刺激偏好。高分者热情、善于社交；低分者内敛、偏好独处。',
                A: '反映人际互动中的合作倾向。高分者友善、信任他人；低分者竞争意识强、更具挑战性。',
                C: '体现目标导向和自律程度。高分者组织性强、注重细节；低分者灵活自由、但可能缺乏计划性。',
                N: '衡量情绪波动和压力敏感度。高分者情绪起伏大、容易焦虑；低分者情绪稳定、抗压力强。',
                O: '反映对新经验和创新思维的开放程度。高分者富有想象力、追求新奇；低分者务实保守、偏好传统。',
              }).map(([dim, desc]) => (
                <div key={dim} className="glass rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: dimensionColors[dim] }} />
                    <span className="text-sm font-semibold" style={{ color: dimensionColors[dim] }}>
                      {dimensionNames[dim]}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'report' && report && (
          <div className="animate-fade-in">
            {/* Report header */}
            <div className="glass rounded-3xl p-6 mb-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold">AI 深度分析报告</h2>
                  <p className="text-xs text-text-secondary">基于 BFI-44 + 简历综合分析</p>
                </div>
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>

            {/* Report content */}
            <div className="glass rounded-3xl p-6 report-content">
              <Markdown>{report}</Markdown>
            </div>

            {/* Disclaimer */}
            <div className="mt-4 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
              <p className="text-xs text-amber-400/70 leading-relaxed">
                声明：本报告由 AI 基于 BFI-44 量表得分与简历内容生成，仅供参考，不构成专业心理咨询或职业规划建议。如需专业帮助，请咨询持证心理咨询师或职业规划师。
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom action */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-bg-dark via-bg-dark to-transparent">
        <button
          onClick={onRestart}
          className="w-full py-3.5 rounded-2xl glass text-text-secondary font-medium text-sm active:scale-[0.98] transition-transform"
        >
          重新开始测评
        </button>
      </div>
    </div>
  );
}
