import Markdown from 'react-markdown';
import JobCard from '../ui/JobCard';


export default function BestBattlefieldSection({
  report,
  displayedJobs,
  onRefreshJobs,
  onSelectJob,
}) {
  const section = extractSection(report, '最佳战场');
  if (!section && (!displayedJobs || displayedJobs.length === 0)) {
    return null;
  }

  const subs = section ? splitByBoldItems(section) : [];

  return (
    <div className="glass rounded-3xl p-6 mb-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
          <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.58-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
          </svg>
        </div>
        <h3 className="text-base font-bold text-text-primary">最佳战场</h3>
      </div>

      {/* AI report sub-sections */}
      {subs.length > 1 ? (
        <div className="space-y-3 mb-4">
          {subs.map((sub, i) => {
            return (
              <div key={i} className="rounded-xl p-4 bg-bg-dark/50">
                <h4 className="text-sm font-semibold mb-2 text-text-primary">{sub.title}</h4>
                <div className="report-content text-sm">
                  <Markdown>{sub.content}</Markdown>
                </div>
              </div>
            );
          })}
        </div>
      ) : section ? (
        <div className="report-content mb-4">
          <Markdown>{section}</Markdown>
        </div>
      ) : null}

      {/* Job cards */}
      {displayedJobs && displayedJobs.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-text-secondary">为你精选的岗位</p>
            <button
              onClick={onRefreshJobs}
              className="flex items-center gap-1 text-xs text-primary active:text-primary-light transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
              </svg>
              换一换
            </button>
          </div>
          <div className="space-y-3">
            {displayedJobs.map((job) => (
              <JobCard key={job.id} job={job} onClick={onSelectJob} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function extractSection(markdown, heading) {
  if (!markdown) return null;
  const regex = new RegExp(`##\\s*${heading}([\\s\\S]*?)(?=##\\s|$)`);
  const match = markdown.match(regex);
  return match ? match[1].trim() : null;
}

/**
 * Split by every bold heading pattern: **Title**、**Title**：content、### Title
 * Each becomes its own sub-section.
 */
function splitByBoldItems(markdown) {
  if (!markdown) return [];

  const lines = markdown.split('\n');
  const sections = [];
  let currentTitle = '';
  let contentLines = [];

  const flush = () => {
    const content = contentLines.join('\n').trim();
    if (currentTitle || content) {
      sections.push({ title: currentTitle, content });
    }
    currentTitle = '';
    contentLines = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();

    const h3 = trimmed.match(/^###\s+(.+)/);
    if (h3) {
      flush();
      currentTitle = h3[1].replace(/\*\*/g, '');
      continue;
    }

    // **Title** standalone or **Title**：content or - **Title**：content
    const bold = trimmed.match(/^[-*]?\s*\*\*([^*]+)\*\*\s*[：:]?\s*(.*)/);
    if (bold) {
      flush();
      currentTitle = bold[1];
      if (bold[2]) contentLines.push(bold[2]);
      continue;
    }

    contentLines.push(line);
  }

  flush();
  return sections;
}
