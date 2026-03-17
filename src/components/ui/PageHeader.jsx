export default function PageHeader({ title, onBack, rightAction, sticky = true }) {
  return (
    <div className={`${sticky ? 'sticky top-0 z-10' : ''} bg-[#FBFBFB] safe-top flex items-center justify-between px-4 pb-[12px]`}>
      <button
        onClick={onBack}
        className="w-10 h-10 -ml-2 flex items-center justify-center"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M15 19L8 12L15 5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <span className="text-[16px] font-medium text-black">{title}</span>
      <div className="w-10 h-10 -mr-2 flex items-center justify-center">
        {rightAction || null}
      </div>
    </div>
  );
}
