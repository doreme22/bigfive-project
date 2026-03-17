import Markdown from 'react-markdown';

export default function ReportSummary({ report }) {
  const section = extractSection(report, '寄语');
  if (!section) return null;

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-[#6b5ca5]/20 flex items-center justify-center">
          <svg className="w-4 h-4 text-[#6b5ca5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
        </div>
        <h3 className="text-base font-bold text-text-primary">寄语</h3>
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
