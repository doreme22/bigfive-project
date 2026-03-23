import Markdown from 'react-markdown';
import BoldItemsOrMarkdown from '../ui/BoldItemsOrMarkdown';
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
    <div className="mb-4">
      {/* 标题区：白色背景 + 左侧绿色竖条 */}
      <div className="bg-white rounded-t-lg pt-3 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 bg-[#00674D] rounded-r-lg" />
          <h3 className="text-base font-medium text-black">最佳战场</h3>
        </div>
      </div>

      {/* 内容区 */}
      <div className="bg-white rounded-b-lg pb-4 px-4">
        {/* AI report sub-sections */}
        {subs.length > 1 ? (
          <div className="space-y-6">
            {subs.map((sub, i) => (
              <div key={i}>
                <div className="mb-1">
                  <span className="text-sm font-semibold text-[#6FCDAE] leading-[21px]">{sub.title}</span>
                </div>
                <BoldItemsOrMarkdown content={sub.content} />
              </div>
            ))}
          </div>
        ) : section ? (
          <div className="text-[13px] text-black leading-[18px] tracking-[0.5px]">
            <Markdown>{section}</Markdown>
          </div>
        ) : null}
      </div>

      {/* Job cards */}
      {displayedJobs && displayedJobs.length > 0 && (
        <div className="mt-4">
          {/* 标题区：白色背景 + 左侧绿色竖条 */}
          <div className="bg-white rounded-t-lg pt-3 pb-4 pr-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 bg-[#00674D] rounded-r-lg" />
                <h3 className="text-base font-medium text-black">为你精选的岗位</h3>
              </div>
              <button
                onClick={onRefreshJobs}
                className="flex items-center gap-1 text-sm text-[#7B838D] active:text-gray-500 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                  <path d="M4.3335 7.00001H11.6668L8.60801 4.33334" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M11.6665 8.99999L4.33317 8.99999L7.39199 11.6667" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                换一换
              </button>
            </div>
          </div>
          {/* 岗位卡片列表 */}
          <div className="bg-white rounded-b-lg pb-4 px-4 space-y-2.5">
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
  const regex = new RegExp(`##\\s*${heading}([\\s\\S]*?)(?=\\n## |$)`);
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
