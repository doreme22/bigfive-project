import RadarChartComponent from '../RadarChart';
import { dimensionNames, norms } from '../../data/questions';

function ScoreBar({ dim, score }) {
  const norm = norms[dim];
  const pct = (score / 5) * 100;
  const normPct = (norm / 5) * 100;

  return (
    <div>
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          {/* Progress bar: 307 width, 6px height */}
          <div className="relative h-[6px] bg-[#F1F2F4] rounded-full" style={{ maxWidth: 307 }}>
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out bg-[#6FCDAE]"
              style={{ width: `${pct}%` }}
            />
            <div
              className="absolute top-0 h-full w-[2px] bg-[#F2CFB4]"
              style={{ left: `${normPct}%` }}
            />
          </div>
          {/* Bottom labels */}
          <div className="relative mt-1" style={{ maxWidth: 307 }}>
            <div className="flex justify-between">
              <span className="text-[11px] text-[#BBC1C9]">1.0</span>
              <span className="text-[11px] text-[#BBC1C9]">5.0</span>
            </div>
            <span
              className="absolute text-[11px] text-[#DEA57A] -translate-x-1/2"
              style={{ left: `${normPct}%`, top: 0 }}
            >
              常模{norm}
            </span>
          </div>
        </div>
        <span className="text-[13px] font-semibold text-[#1a2e23] whitespace-nowrap leading-[6px]">
          {score.toFixed(2)}
        </span>
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
      <div className="px-4 mb-6">
        <RadarChartComponent scores={scores} />
      </div>

      {/* Score bars + descriptions grouped per dimension */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M14.1665 1.04163C14.6242 1.04163 15.0666 1.1073 15.4858 1.22717C14.9308 1.75825 14.5835 2.5048 14.5835 3.33362C14.5837 4.94414 15.889 6.24937 17.4995 6.24963C18.0315 6.24963 18.529 6.10485 18.9585 5.85608V14.1666C18.9585 16.813 16.8129 18.9586 14.1665 18.9586H5.8335C3.18713 18.9586 1.0415 16.813 1.0415 14.1666V5.83362C1.0415 3.18725 3.18713 1.04163 5.8335 1.04163H14.1665ZM14.5776 7.23792C14.3179 7.01096 13.923 7.03686 13.6958 7.29651L11.1821 10.1715L9.1499 8.47815C8.88933 8.26114 8.50322 8.29145 8.27979 8.54651L5.36279 11.8805C5.13582 12.1402 5.16182 12.5351 5.42139 12.7623C5.68114 12.9896 6.07593 12.9625 6.30322 12.7028L8.81885 9.82874L10.8501 11.5221C11.0781 11.7118 11.4023 11.7124 11.6294 11.5387L11.7202 11.4528L14.6372 8.11975C14.8643 7.85998 14.8373 7.46515 14.5776 7.23792ZM16.7915 1.82581C17.717 2.43324 18.4194 3.35156 18.7495 4.43323C18.4794 4.74009 18.0998 4.94819 17.6704 4.99182L17.4995 4.99963C16.6367 4.99939 15.9265 4.34391 15.8413 3.50354L15.8335 3.33362C15.8335 2.66671 16.2257 2.09225 16.7915 1.82581Z" fill="#6FCDAE"/>
            <circle cx="1.66667" cy="1.66667" r="1.66667" transform="matrix(-1 0 0 1 19.1665 1.66663)" fill="#6FCDAE"/>
          </svg>
          <h3 className="text-[15px] font-semibold text-[#1a2e23]">各维度得分详情</h3>
        </div>
        <div className="h-4" />
        {Object.keys(dimensionNames).map((dim) => (
          <div key={dim} className="pb-5 mb-5 border-b border-[#F1F2F4] last:border-b-0 last:mb-0 last:pb-0">
            {/* Title with dot */}
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-sm font-semibold text-text-primary">
                {dimensionNames[dim]}
              </span>
            </div>
            {/* Description */}
            <p className="text-xs text-text-secondary leading-relaxed mb-3">
              {dimensionDescriptions[dim]}
            </p>
            {/* Score bar */}
            <ScoreBar dim={dim} score={scores[dim]} />
          </div>
        ))}
      </div>
    </div>
  );
}
