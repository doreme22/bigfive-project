export default function ModalOverlay({ title, children, onConfirm, onCancel, confirmText = '确定', cancelText = '取消' }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-[35px] modal-backdrop">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-[12px] w-[306px] overflow-hidden modal-content">
        {/* Title */}
        {title && (
          <div className="px-4 pt-4">
            <h3 className="text-[16px] font-semibold text-black text-center">{title}</h3>
          </div>
        )}
        {/* Content */}
        <div className="py-4 mx-auto text-[14px] text-[#78787d] leading-relaxed text-center" style={{ maxWidth: '256.76px' }}>
          {children}
        </div>
        {/* Buttons */}
        <div className="flex border-t border-[#f5f5f5]">
          {onCancel && (
            <button
              onClick={onCancel}
              className="flex-1 h-[50px] flex items-center justify-center text-[16px] font-medium text-[#78787d] active:bg-[#f5f5f5] transition-colors"
            >
              {cancelText}
            </button>
          )}
          {onCancel && <div className="w-px bg-[#f5f5f5]" />}
          <button
            onClick={onConfirm}
            className="flex-1 h-[50px] flex items-center justify-center text-[16px] font-semibold text-[#008b68] active:bg-[#f5f5f5] transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
