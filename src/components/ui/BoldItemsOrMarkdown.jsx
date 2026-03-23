import Markdown from 'react-markdown';

/**
 * Renders content as numbered bold-item cards if the content contains
 * **Title**：description patterns, otherwise falls back to Markdown.
 */
export default function BoldItemsOrMarkdown({ content }) {
  if (!content) return null;

  const items = parseBoldItems(content);

  if (items.length >= 2) {
    return (
      <div className="space-y-0">
        {items.map((item, j) => (
          <div key={j} className="flex gap-2">
            {/* Left: number + vertical line */}
            <div className="flex flex-col items-center shrink-0 w-5">
              <span className="text-[13px] text-[#BBC1C9] font-medium leading-[18px] italic">
                {String(j + 1).padStart(2, '0')}
              </span>
              {j < items.length - 1 && (
                <div className="w-[0.5px] flex-1 bg-[#DDE2E8] my-1" />
              )}
            </div>
            {/* Right: title + description */}
            <div className={`flex-1 min-w-0 ${j < items.length - 1 ? 'pb-3' : ''}`}>
              <p className="text-[13px] font-medium text-black leading-[18px] tracking-[0.5px]">{item.title}</p>
              <p className="text-[13px] text-[#656D76] leading-[18px] tracking-[0.5px] mt-1">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="text-[13px] text-black leading-[18px] tracking-[0.5px]">
      <Markdown>{content}</Markdown>
    </div>
  );
}

/**
 * Parse **Title**：description patterns from content.
 * Returns items only if ALL non-empty paragraphs match the pattern (to avoid dropping content).
 */
function parseBoldItems(content) {
  if (!content) return [];
  const parts = content.split(/\n\n+/).filter((p) => p.trim());
  const items = [];
  for (const part of parts) {
    const trimmed = part.trim();
    const match = trimmed.match(/^\*\*([^*]+)\*\*\s*[：:]\s*([\s\S]*)/);
    if (match) {
      items.push({ title: match[1], desc: match[2].trim() });
    }
  }
  // Only use card rendering if all paragraphs matched
  if (items.length >= 2 && items.length === parts.length) {
    return items;
  }
  return [];
}
