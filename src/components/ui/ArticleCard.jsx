export default function ArticleCard({ article }) {
  return (
    <div className="flex items-center gap-3 bg-bg-card/60 rounded-xl p-3">
      <div className="w-7 h-7 rounded-lg bg-primary/10 flex-shrink-0 flex items-center justify-center">
        <svg className="w-3.5 h-3.5 text-primary/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      </div>
      <span className="text-xs text-primary/80 min-w-0 flex-1 line-clamp-1">{article.title}</span>
      <svg className="w-3 h-3 text-text-secondary/30 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
      </svg>
    </div>
  );
}
