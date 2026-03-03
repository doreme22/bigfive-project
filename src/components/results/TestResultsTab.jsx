import RadarChartComponent from '../RadarChart';
import { dimensionNames, norms } from '../../data/questions';

function ScoreBar({ dim, score }) {
  const norm = norms[dim];
  const pct = (score / 5) * 100;
  const normPct = (norm / 5) * 100;

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm font-medium text-text-primary">
          {dimensionNames[dim]}
        </span>
        <span className="text-sm font-semibold text-text-primary">{score.toFixed(2)}</span>
      </div>
      <div className="relative h-2.5 bg-bg-dark rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-primary/50 to-primary"
          style={{ width: `${pct}%` }}
        />
        <div
          className="absolute top-0 h-full w-0.5 bg-[#1a2e23]/40"
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

const dimensionDescriptions = {
  E: '衡量个体的社交能量和外部刺激偏好。高分者热情、善于社交；低分者内敛、偏好独处。',
  A: '反映人际互动中的合作倾向。高分者友善、信任他人；低分者竞争意识强、更具挑战性。',
  C: '体现目标导向和自律程度。高分者组织性强、注重细节；低分者灵活自由、但可能缺乏计划性。',
  N: '衡量情绪波动和压力敏感度。高分者情绪起伏大、容易焦虑；低分者情绪稳定、抗压力强。',
  O: '反映对新经验和创新思维的开放程度。高分者富有想象力、追求新奇；低分者务实保守、偏好传统。',
};

export default function TestResultsTab({ scores }) {
  return (
    <div className="animate-fade-in">
      {/* Radar chart */}
      <div className="glass rounded-3xl p-4 mb-6">
        <h3 className="text-sm font-semibold text-text-secondary mb-2 text-center">
          五维人格雷达图
        </h3>
        <RadarChartComponent scores={scores} />
      </div>

      {/* Score bars */}
      <div className="glass rounded-3xl p-5 mb-4">
        <h3 className="text-sm font-semibold text-text-secondary mb-4">各维度得分详情</h3>
        {Object.keys(dimensionNames).map((dim) => (
          <ScoreBar key={dim} dim={dim} score={scores[dim]} />
        ))}
        <p className="text-[10px] text-text-secondary/50 mt-4 text-center">
          深色竖线 = 中国青年样本常模参考值
        </p>
      </div>

      {/* Dimension descriptions */}
      <div className="space-y-3">
        {Object.entries(dimensionDescriptions).map(([dim, desc]) => (
          <div key={dim} className="glass rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-sm font-semibold text-text-primary">
                {dimensionNames[dim]}
              </span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
