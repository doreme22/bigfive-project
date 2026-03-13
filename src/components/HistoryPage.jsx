import { useState } from 'react';
import PageHeader from './ui/PageHeader';
import ModalOverlay from './ui/ModalOverlay';
import { getHistory, deleteHistoryRecord } from '../utils/storage';

const typeLabels = {
  bfi: 'BFI 测评',
  manual: '手动输入',
  both: '综合测评',
};

const typeColors = {
  bfi: 'bg-primary/20 text-primary',
  manual: 'bg-[#6b5ca5]/20 text-[#6b5ca5]',
  both: 'bg-amber-500/20 text-amber-400',
};

export default function HistoryPage({ onBack, onSelectRecord }) {
  const [history, setHistory] = useState(() => getHistory());
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    setDeleteTarget(id);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteHistoryRecord(deleteTarget);
      setHistory(getHistory());
    }
    setDeleteTarget(null);
  };

  const formatDate = (ts) => {
    const d = new Date(ts);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFB]">
      <PageHeader title="历史记录" onBack={onBack} />

      <div className="flex-1 flex flex-col items-center pt-3 pb-5">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <svg className="w-16 h-16 text-text-secondary/20 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-text-secondary text-sm">暂无测评记录</p>
            <p className="text-text-secondary/50 text-xs mt-1">完成一次测评后记录将出现在这里</p>
          </div>
        ) : (
          <div className="w-[343px] flex flex-col gap-5">
            {history.map((record) => (
              <button
                key={record.id}
                onClick={() => onSelectRecord(record.id)}
                className="w-full text-left rounded-[12px] p-5 bg-white border border-[#F1F2F4] active:bg-[#f8f8f8] transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-text-secondary">{formatDate(record.timestamp)}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${typeColors[record.assessmentType] || typeColors.bfi}`}>
                      {typeLabels[record.assessmentType] || 'BFI 测评'}
                    </span>
                  </div>
                  <button
                    onClick={(e) => handleDeleteClick(e, record.id)}
                    className="text-text-secondary/40 active:text-red-400 transition-colors p-1"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                {record.personalityTag && (
                  <p className="text-sm font-semibold text-text-primary mb-1">{record.personalityTag}</p>
                )}
                <div className="flex items-center justify-between">
                  <p className="text-xs text-text-secondary/60 line-clamp-1">
                    {record.report ? '已生成报告' : record.assessmentType === 'manual' ? '报告生成失败' : '仅测评结果'}
                  </p>
                  <div className="flex items-center gap-2">
                    {record.resumeSkipped && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-text-secondary/10 text-text-secondary">
                        未上传简历
                      </span>
                    )}
                    <span className="text-xs text-primary">查看详情 →</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {deleteTarget && (
        <ModalOverlay
          title="删除记录"
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
          confirmText="删除"
          cancelText="取消"
        >
          <p>确定要删除这条测评记录吗？删除后无法恢复。</p>
        </ModalOverlay>
      )}
    </div>
  );
}
