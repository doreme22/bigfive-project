import Markdown from 'react-markdown';
import ArticleCard from '../ui/ArticleCard';
import { getArticlesForTopic } from '../../data/articles';

export default function GrowthEngineSection({ report, growthSuggestions }) {
  const section = extractSection(report, '成长引擎');

  return (
    <div className="bg-white rounded-[12px] border border-[#F1F2F4] p-6 mb-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
          <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
          </svg>
        </div>
        <h3 className="text-base font-bold text-text-primary">成长引擎</h3>
      </div>

      {growthSuggestions && growthSuggestions.length > 0 ? (
        <div className="space-y-4">
          {growthSuggestions.map((suggestion, i) => {
            const articles = getArticlesForTopic(suggestion.tags, 1);
            return (
              <div key={i} className="bg-bg-dark/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                    {i + 1}
                  </span>
                  <h4 className="text-sm font-semibold text-text-primary">{suggestion.title}</h4>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">{suggestion.description}</p>

                {articles.length > 0 && (
                  <div className="mt-3 space-y-2">
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
  );
}

function extractSection(markdown, heading) {
  if (!markdown) return null;
  const regex = new RegExp(`##\\s*${heading}([\\s\\S]*?)(?=##\\s|$)`);
  const match = markdown.match(regex);
  return match ? match[1].trim() : null;
}
