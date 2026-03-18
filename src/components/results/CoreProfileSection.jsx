import Markdown from 'react-markdown';


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
            {subs.map((sub, i) => {
              const items = splitBoldItems(sub.content);
              return (
                <div key={i} className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-[#6FCDAE] leading-[21px]">{sub.title}</span>
                  {items.length > 0 ? (
                    <div className="space-y-0">
                      {items.map((item, j) => (
                        <div key={j} className="flex gap-2">
                          {/* 左侧：编号 + 竖线 */}
                          <div className="flex flex-col items-center shrink-0 w-5">
                            <span className="text-[13px] text-[#BBC1C9] font-medium leading-[18px]">{String(j + 1).padStart(2, '0')}</span>
                            {j < items.length - 1 && (
                              <div className="w-[0.5px] flex-1 bg-[#DDE2E8] my-1" />
                            )}
                          </div>
                          {/* 右侧：内容 */}
                          <div className={`flex-1 min-w-0 ${j < items.length - 1 ? 'pb-3' : ''}`}>
                            <p className="text-[13px] font-medium text-black leading-[18px] tracking-[0.5px]">{item.title}</p>
                            <p className="text-[13px] text-[#656D76] leading-[18px] tracking-[0.5px] mt-1">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-[13px] text-black leading-[18px] tracking-[0.5px]">
                      <Markdown>{sub.content}</Markdown>
                    </div>
                  )}
                </div>
              );
            })}
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

/**
 * Split content like "**Title**：desc\n\n**Title2**：desc2" into [{title, desc}]
 */
function splitBoldItems(content) {
  if (!content) return [];
  const items = [];
  const parts = content.split(/\n\n+/);
  for (const part of parts) {
    const trimmed = part.trim();
    const match = trimmed.match(/^\*\*([^*]+)\*\*\s*[：:]\s*([\s\S]*)/);
    if (match) {
      items.push({ title: match[1], desc: match[2].trim() });
    }
  }
  return items;
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
