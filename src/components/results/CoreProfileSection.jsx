import Markdown from 'react-markdown';


export default function CoreProfileSection({ report }) {
  const section = extractSection(report, '核心画像');
  if (!section) return null;

  const subs = splitByStandaloneBold(section);

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
          <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
          </svg>
        </div>
        <h3 className="text-base font-bold text-text-primary">核心画像</h3>
      </div>

      {subs.length > 1 ? (
        <div className="space-y-3">
          {subs.map((sub, i) => {
            return (
              <div key={i} className="rounded-xl p-4 bg-bg-dark/50">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  <h4 className="text-sm font-semibold text-text-primary">{sub.title}</h4>
                </div>
                <div className="report-content text-sm">
                  <Markdown>{sub.content}</Markdown>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="report-content">
          <Markdown>{section}</Markdown>
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
 * Split by standalone bold headings (**Title**) or ### headings.
 * Lines like **ItemTitle**：description are kept as content, not section breaks.
 */
function splitByStandaloneBold(markdown) {
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

    // Standalone bold: **Title** with no text after (optionally ：)
    const standalone = trimmed.match(/^\*\*([^*]+)\*\*\s*[：:]?\s*$/);
    if (standalone) {
      flush();
      currentTitle = standalone[1];
      continue;
    }

    contentLines.push(line);
  }

  flush();
  return sections;
}
