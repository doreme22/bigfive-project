import Markdown from 'react-markdown';

export default function GrowthEngineSection({ report, growthSuggestions }) {
  const section = extractSection(report, '成长引擎');
  const suggestions = Array.isArray(growthSuggestions) && growthSuggestions.length > 0
    ? growthSuggestions
    : null;

  return (
    <div className="mb-4">
      {/* 标题区：白色背景 + 左侧绿色竖条 */}
      <div className="bg-white rounded-t-lg pt-3 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 bg-[#00674D] rounded-r-lg" />
          <h3 className="text-base font-medium text-black">成长引擎</h3>
        </div>
      </div>

      {/* 内容区 */}
      <div className="bg-white rounded-b-lg pb-4 px-4">
        {suggestions ? (
          <div className="space-y-6">
            {suggestions.map((suggestion, i) => (
              <div key={i}>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="w-[14px] h-[14px] rounded-tl-full rounded-tr-full rounded-br-full bg-[#6FCDAE] flex items-center justify-center text-[10px] font-semibold text-white">
                      {i + 1}
                    </span>
                    <span className="text-sm font-semibold text-[#6FCDAE] leading-[21px]">{suggestion.title}</span>
                  </div>
                  <p className="text-[13px] text-black leading-[18px] tracking-[0.5px]">{suggestion.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : section ? (
          <div className="report-content">
            <Markdown>{section}</Markdown>
          </div>
        ) : (
          <p className="text-xs text-text-secondary/50 text-center py-4">暂无成长建议</p>
        )}
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
