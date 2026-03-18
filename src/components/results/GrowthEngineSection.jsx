import Markdown from 'react-markdown';
import ArticleCard from '../ui/ArticleCard';
import { getArticlesForTopic } from '../../data/articles';

const MOCK_GROWTH = [
  { title: '自我觉察', description: '定期回顾自己的决策模式和情绪反应，建立自我认知的习惯', tags: ['情绪管理', '情绪稳定', '自我认知'] },
  { title: '跨界学习', description: '每月接触一个新领域的知识，保持认知弹性和创新思维', tags: ['开放性提升', '跨学科', '成长', '创新'] },
  { title: '关系经营', description: '主动维护职场人际关系，每周与一位同事或朋友进行有质量的交流', tags: ['人际关系', '社交', '外向性提升'] },
];

export default function GrowthEngineSection({ report, growthSuggestions }) {
  const section = extractSection(report, '成长引擎');
  // TODO: 临时强制使用 mock 数据，验证样式后恢复
  const suggestions = MOCK_GROWTH;

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
      <div className="bg-white rounded-b-lg pb-3 px-4">
        {suggestions.length > 0 ? (
          <div className="space-y-6">
            {suggestions.map((suggestion, i) => {
              const articles = getArticlesForTopic(suggestion.tags, 3);
              return (
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

                  {articles.length > 0 && (
                    <div className="mt-2 space-y-2">
                      <div className="border-t border-[#2B3F6C]/10 my-2" />
                      {articles.map((article) => (
                        <ArticleCard key={article.id} article={article} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
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
