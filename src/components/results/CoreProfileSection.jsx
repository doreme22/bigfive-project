import Markdown from 'react-markdown';
import BoldItemsOrMarkdown from '../ui/BoldItemsOrMarkdown';


export default function CoreProfileSection({ report }) {
  const section = extractSection(report, '核心画像');
  if (!section) return null;

  const subs = splitByStandaloneBold(section);

  return (
    <div className="mb-4">
      {/* 标题区：白色背景 + 左侧绿色竖条 */}
      <div className="bg-white rounded-t-lg pt-3 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 bg-[#00674D] rounded-r-lg" />
          <h3 className="text-base font-medium text-black">核心画像</h3>
        </div>
      </div>

      {/* 内容区 */}
      <div className="bg-white rounded-b-lg pb-4 px-4">
        {subs.length > 1 ? (
          <div className="space-y-6">
            {subs.filter(sub => sub.content && sub.content.trim()).map((sub, i) => (
              <div key={i} className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-[#6FCDAE] leading-[21px]">{sub.title}</span>
                <BoldItemsOrMarkdown content={sub.content} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-[13px] text-black leading-[18px] tracking-[0.5px]">
            <Markdown>{section}</Markdown>
          </div>
        )}
      </div>
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
