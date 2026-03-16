import { useState, useEffect, useRef } from 'react';
import PageHeader from './ui/PageHeader';
import ModalOverlay from './ui/ModalOverlay';
import {
  getOnlineAttachments,
  uploadAttachmentToOnline,
  deleteOnlineAttachment,
  formatRelativeTime,
} from '../utils/onlineResume';

function FileTypeBadge({ fileType }) {
  const config = {
    pdf: { label: 'PDF', bg: 'bg-red-500/80', text: 'text-white' },
    doc: { label: 'DOC', bg: 'bg-blue-500/80', text: 'text-white' },
  };
  const c = config[fileType] || { label: fileType?.toUpperCase() || '?', bg: 'bg-gray-500/80', text: 'text-white' };
  return (
    <span className={`absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-bold ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  );
}

function FileCard({ attachment, onSelect, onDelete }) {
  return (
    <div
      onClick={() => onSelect(attachment)}
      className="relative bg-bg-card border border-border rounded-2xl overflow-hidden active:scale-[0.97] transition-transform cursor-pointer"
    >
      {/* Thumbnail placeholder */}
      <div className="relative w-full aspect-[4/3] bg-bg-dark/50 flex items-center justify-center">
        <svg className="w-10 h-10 text-text-secondary/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
        <FileTypeBadge fileType={attachment.fileType} />
      </div>

      {/* Delete button */}
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(attachment); }}
        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/40 flex items-center justify-center active:bg-black/60 transition-colors"
      >
        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Info */}
      <div className="p-3">
        <p className="text-sm text-text-primary truncate">{attachment.fileName}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
            {attachment.category || '简历'}
          </span>
          <span className="text-[10px] text-text-secondary">
            {formatRelativeTime(attachment.uploadTime)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function AttachmentPage({ onBack, onSelect }) {
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const fileInputRef = useRef(null);

  const loadAttachments = async () => {
    setLoading(true);
    const list = await getOnlineAttachments();
    setAttachments(list);
    setLoading(false);
  };

  useEffect(() => {
    loadAttachments();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteOnlineAttachment(deleteTarget.id);
    setDeleteTarget(null);
    await loadAttachments();
  };

  const handleUpload = async (file) => {
    if (!file) return;
    await uploadAttachmentToOnline(file);
    await loadAttachments();
    setShowSyncModal(true);
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-bg-dark">
      <PageHeader title="附件管理" onBack={onBack} />

      {/* Content */}
      <div className="flex-1 px-4 pb-24 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <svg className="w-6 h-6 text-primary animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : attachments.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <svg className="w-16 h-16 text-text-secondary/20 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
            </svg>
            <p className="text-text-secondary text-sm">暂无附件</p>
          </div>
        ) : (
          /* 2-column grid */
          <div className="grid grid-cols-2 gap-3 mt-2">
            {attachments.map((att) => (
              <FileCard
                key={att.id}
                attachment={att}
                onSelect={onSelect}
                onDelete={setDeleteTarget}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bottom fixed upload button */}
      <div className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto px-4 pb-6 pt-3 bg-gradient-to-t from-bg-dark via-bg-dark/95 to-transparent">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-4 rounded-2xl font-semibold text-base bg-gradient-to-r from-[#1a6b4a] to-[#22875e] text-white shadow-xl shadow-primary/25 active:scale-[0.98] transition-transform"
        >
          文件上传
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.md,.doc,.docx,.pdf"
          className="hidden"
          onChange={(e) => { handleUpload(e.target.files[0]); e.target.value = ''; }}
        />
      </div>

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <ModalOverlay
          title="删除附件"
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          confirmText="删除"
          cancelText="取消"
        >
          确定要删除「{deleteTarget.fileName}」吗？此操作不可恢复。
        </ModalOverlay>
      )}

      {/* Upload sync modal */}
      {showSyncModal && (
        <ModalOverlay
          title="发现新的简历信息"
          onConfirm={() => setShowSyncModal(false)}
          onCancel={() => setShowSyncModal(false)}
          confirmText="立即同步"
          cancelText="之后再说"
        >
          检测到新上传的文件中包含简历信息，是否同步至在线简历？
        </ModalOverlay>
      )}
    </div>
  );
}
