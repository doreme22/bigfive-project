export default function JobCard({ job, onClick }) {
  return (
    <button
      onClick={() => onClick?.(job.id)}
      className="w-full text-left glass rounded-2xl p-4 active:bg-bg-card-hover transition-colors"
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-sm font-semibold text-text-primary">{job.title}</h4>
        <span className="text-xs text-primary font-medium shrink-0 ml-2">{job.salary}</span>
      </div>
      <div className="flex items-center gap-2 text-xs text-text-secondary mb-2">
        <span>{job.company}</span>
        <span className="w-1 h-1 rounded-full bg-border" />
        <span>{job.department}</span>
        <span className="w-1 h-1 rounded-full bg-border" />
        <span>{job.location}</span>
      </div>
      <p className="text-xs text-text-secondary/70 line-clamp-2 leading-relaxed">{job.description}</p>
    </button>
  );
}
