import PageHeader from './ui/PageHeader';
import { getJobById } from '../data/jobs';

export default function JobDetailPage({ jobId, onBack }) {
  const job = getJobById(jobId);

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col bg-bg-dark">
        <PageHeader title="岗位详情" onBack={onBack} />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-text-secondary text-sm">岗位不存在</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg-dark pb-8">
      <PageHeader title="岗位详情" onBack={onBack} />

      <div className="px-6 mt-4">
        {/* Header */}
        <div className="glass rounded-3xl p-6 mb-4">
          <h2 className="text-xl font-bold text-text-primary mb-2">{job.title}</h2>
          <div className="flex items-center gap-2 text-sm text-text-secondary mb-3">
            <span>{job.company}</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span>{job.department}</span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1 text-xs text-text-secondary">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              {job.location}
            </div>
            <span className="text-sm font-semibold text-primary">{job.salary}</span>
          </div>
        </div>

        {/* Description */}
        <div className="glass rounded-3xl p-6 mb-4">
          <h3 className="text-sm font-semibold text-text-secondary mb-3">职位描述</h3>
          <p className="text-sm text-text-primary leading-relaxed">{job.description}</p>
        </div>

        {/* Requirements */}
        <div className="glass rounded-3xl p-6 mb-4">
          <h3 className="text-sm font-semibold text-text-secondary mb-3">岗位要求</h3>
          <ul className="space-y-2">
            {job.requirements.map((req, i) => (
              <li key={i} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <span className="text-sm text-text-primary">{req}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Personality fit */}
        <div className="glass rounded-3xl p-6">
          <h3 className="text-sm font-semibold text-text-secondary mb-3">性格匹配</h3>
          <div className="space-y-2">
            {job.personalityFit.mbtiTypes && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-secondary">适合 MBTI：</span>
                <div className="flex gap-1">
                  {job.personalityFit.mbtiTypes.map((t) => (
                    <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {job.personalityFit.highDimensions && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-secondary">偏好维度：</span>
                <div className="flex gap-1">
                  {job.personalityFit.highDimensions.map((d) => (
                    <span key={d} className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-medium">
                      高{d}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
