export default function PageHeader({ title, onBack, rightAction }) {
  return (
    <div className="sticky top-0 z-10 bg-bg-dark/95 backdrop-blur-sm px-4 py-3 flex items-center justify-between">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-text-secondary active:text-primary transition-colors"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        返回
      </button>
      <h1 className="text-base font-semibold text-text-primary">{title}</h1>
      <div className="w-12 flex justify-end">
        {rightAction || null}
      </div>
    </div>
  );
}
