export default function ActionSheet({ options, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center action-sheet-backdrop">
      <div className="absolute inset-0 bg-black/60" onClick={onCancel} />
      <div className="relative bg-white w-full rounded-t-[16px] py-[9px] action-sheet-content">
        {options.map((opt, i) => (
          <div key={i}>
            <button
              onClick={opt.disabled ? undefined : opt.onClick}
              className={`w-full h-[41px] flex items-center justify-center text-[16px] tracking-[0.5px] transition-colors ${
                opt.disabled
                  ? 'text-[#BBC1C9]'
                  : 'text-black active:bg-[#f5f5f5]'
              }`}
            >
              {opt.label}
            </button>
            {i < options.length - 1 && (
              <div className="h-px bg-[#F1F2F4] mx-4" />
            )}
          </div>
        ))}
        <div className="h-[8px] bg-[#f5f5f5] w-full" />
        <button
          onClick={onCancel}
          className="w-full h-[41px] flex items-center justify-center text-[16px] text-black tracking-[0.5px] active:bg-[#f5f5f5] transition-colors"
        >
          取消
        </button>
      </div>
    </div>
  );
}
