import JobCard from '../ui/JobCard';

export default function JobRecommendations({ jobTypeRecs, displayedJobs, onRefreshJobs, onSelectJob }) {
  return (
    <div className="bg-white rounded-[12px] border border-[#F1F2F4] p-6 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-text-primary">岗位推荐</h3>
        </div>
        {displayedJobs.length > 0 && (
          <button
            onClick={onRefreshJobs}
            className="flex items-center gap-1 text-xs text-primary active:text-primary-light transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
            </svg>
            换一换
          </button>
        )}
      </div>

      {/* AI job type recommendations */}
      {jobTypeRecs && jobTypeRecs.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-text-secondary mb-2">AI 推荐岗位方向</p>
          <div className="space-y-2">
            {jobTypeRecs.map((rec, i) => (
              <div key={i} className="bg-bg-dark/50 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-text-primary">{rec.type}</span>
                </div>
                <p className="text-xs text-text-secondary">{rec.reason}</p>
                {rec.tags && (
                  <div className="flex gap-1 mt-2">
                    {rec.tags.map((tag) => (
                      <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mock job cards */}
      {displayedJobs.length > 0 && (
        <div>
          <p className="text-xs text-text-secondary mb-2">为你精选的岗位</p>
          <div className="space-y-3">
            {displayedJobs.map((job) => (
              <JobCard key={job.id} job={job} onClick={onSelectJob} />
            ))}
          </div>
        </div>
      )}

      {displayedJobs.length === 0 && (!jobTypeRecs || jobTypeRecs.length === 0) && (
        <p className="text-xs text-text-secondary/50 text-center py-4">暂无岗位推荐</p>
      )}
    </div>
  );
}
