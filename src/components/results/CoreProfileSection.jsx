import Markdown from 'react-markdown';

export default function CoreProfileSection({ report }) {
  // Extract ## 核心画像 section from report markdown
  const section = extractSection(report, '核心画像');
  if (!section) return null;

  return (
    <div className="glass rounded-3xl p-6 mb-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
          <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
          </svg>
        </div>
        <h3 className="text-base font-bold text-text-primary">核心画像</h3>
      </div>
      <div className="report-content">
        <Markdown>{section}</Markdown>
      </div>
    </div>
  );
}

function extractSection(markdown, heading) {
  if (!markdown) return null;
  const regex = new RegExp(`##\\s*${heading}([\\s\\S]*?)(?=##\\s|$)`);
  const match = markdown.match(regex);
  return match ? match[1].trim() : null;
}
