import { useState } from 'react';
import PageHeader from './ui/PageHeader';
import ModalOverlay from './ui/ModalOverlay';
import { getHistory, deleteHistoryRecord } from '../utils/storage';

const typeLabels = {
  bfi: 'BFI测试',
  mbti: 'MBTI',
  jung: '荣格八维',
};

const typeColors = {
  bfi: 'bg-[#e8f4dd] text-[#2c9364]',
  mbti: 'bg-[#e8f5fa] text-[#3c7a94]',
  jung: 'bg-[#faf9e8] text-[#a48341]',
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
          <div className="flex flex-col items-center justify-center flex-1 w-full text-center -mt-12">
            <img src="/EmptyInbox.png" alt="暂无记录" className="w-[250px] h-[200px] -mb-[30px]" />
            <p className="text-[#656D76] text-[16px]">暂无测评记录</p>
            <p className="text-[#7B838D] text-[14px] mt-1">完成一次测评后记录将出现在这里</p>
          </div>
        ) : (
          <div className="w-full px-4 flex flex-col gap-3">
            {history.map((record) => (
              <button
                key={record.id}
                onClick={() => onSelectRecord(record.id)}
                className="w-full text-left rounded-[4px] px-3 py-3.5 bg-white border-[0.5px] border-[#F1F2F4] active:bg-[#f8f8f8] transition-colors"
              >
                <div className="flex flex-col gap-2.5">
                  {/* Row 1: Date + Delete */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[12px] text-[#BBC1C9] tracking-[0.5px]">
                      <span>{formatDate(record.timestamp).split(' ')[0]}</span>
                      <span>{formatDate(record.timestamp).split(' ')[1]}</span>
                    </div>
                    <button
                      onClick={(e) => handleDeleteClick(e, record.id)}
                      className="text-[#BBC1C9] active:text-red-400 transition-colors"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
                        <path d="M6 6L14 14M14 6L6 14" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>

                  {/* Row 2: Personality tag + Type badge */}
                  <div className="flex items-center gap-4">
                    {record.personalityTag && (
                      <span className="text-sm font-semibold text-black">{record.personalityTag}</span>
                    )}
                    <span className={`text-[12px] px-2 py-px rounded-full tracking-[0.5px] ${typeColors[record.assessmentType] || typeColors.bfi}`}>
                      {typeLabels[record.assessmentType] || 'BFI测试'}
                    </span>
                  </div>

                  {/* Row 3: Status + Resume */}
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-[#7B838D] leading-[21px]">
                      {record.report ? '已生成报告' : (record.assessmentType === 'mbti' || record.assessmentType === 'jung') ? '报告生成失败' : '仅测评结果'}
                    </span>
                    {record.resumeSkipped && (
                      <span className="text-[13px] text-[#00674D] leading-[21px]">
                        未上传简历
                      </span>
                    )}
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
