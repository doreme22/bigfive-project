export default function ArticleCard({ article }) {
  return (
    <div className="flex items-center rounded gap-3">
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <div className="w-9 h-9 rounded bg-white flex-shrink-0 overflow-hidden">
          {article.cover && (
            <img src={article.cover} alt="" className="w-full h-full object-cover" />
          )}
        </div>
        <span className="text-[12px] text-black leading-[18px] tracking-[0.5px] truncate">{article.title}</span>
      </div>
      <svg className="w-6 h-6 flex-shrink-0 ml-3" viewBox="0 0 24 24" fill="none">
        <path d="M12 1.25C17.9371 1.25 22.75 6.06294 22.75 12C22.75 17.9371 17.9371 22.75 12 22.75C6.06294 22.75 1.25 17.9371 1.25 12C1.25 6.06294 6.06294 1.25 12 1.25ZM12.126 8.51562C10.8966 7.69639 9.25003 8.57823 9.25 10.0557V13.9443C9.25 15.4219 10.8965 16.303 12.126 15.4834L15.043 13.5391C16.1413 12.8068 16.1413 11.1932 15.043 10.4609L12.126 8.51562Z" fill="#BBC1C9" />
      </svg>
    </div>
  );
}
