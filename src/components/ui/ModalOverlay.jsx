export default function ModalOverlay({ title, children, onConfirm, onCancel, confirmText = '确定', cancelText = '取消' }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6 modal-backdrop">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative glass rounded-3xl p-6 w-full max-w-sm modal-content">
        {title && <h3 className="text-lg font-bold text-text-primary mb-3">{title}</h3>}
        <div className="text-sm text-text-secondary leading-relaxed mb-6">
          {children}
        </div>
        <div className="flex gap-3">
          {onCancel && (
            <button
              onClick={onCancel}
              className="flex-1 py-3 rounded-xl bg-bg-card text-text-secondary text-sm font-medium active:scale-[0.98] transition-transform"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#1a6b4a] to-[#22875e] text-white text-sm font-medium active:scale-[0.98] transition-transform"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
