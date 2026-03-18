import Markdown from 'react-markdown';

export default function ReportSummary({ report }) {
  const section = extractSection(report, '寄语');
  if (!section) return null;

  return (
    <div className="mb-4">
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
