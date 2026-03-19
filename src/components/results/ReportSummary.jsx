import Markdown from 'react-markdown';

export default function ReportSummary({ report }) {
  const section = extractSection(report, '寄语');
  if (!section) return null;

  // 去掉「」符号，只保留文字内容
  const cleanSection = section.replace(/[「」]/g, '');

  return (
    <div className="mb-4 flex gap-3">
      <div className="w-[2px] bg-[#00674D] rounded-full shrink-0" />
      <div className="flex-1 min-w-0">
        <Markdown components={{
          blockquote: ({ children }) => <>{children}</>,
          em: ({ children }) => <em>{children}</em>,
          p: ({ children }) => (
            <div className="relative">
              <img src="/images/quote.svg" alt="" className="absolute -top-1.5 left-0 z-0" />
              <p className="text-base text-[#1a6b4a] leading-relaxed relative z-10">{children}</p>
            </div>
          ),
        }}>{cleanSection}</Markdown>
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
