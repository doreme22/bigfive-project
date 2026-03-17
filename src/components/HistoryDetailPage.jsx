import { useState, useCallback } from 'react';
import PageHeader from './ui/PageHeader';
import TestResultsTab from './results/TestResultsTab';
import DeepReportTab from './results/DeepReportTab';
import { getHistoryRecord } from '../utils/storage';
import { mergePersonalityData } from '../utils/personality';
import { getMatchingJobs, pickRandomJobs } from '../data/jobs';

function useJobRotation(scores, jungScores, mbtiType) {
  const [state, setState] = useState(() => {
    const matched = getMatchingJobs(scores, jungScores, mbtiType);
    const picked = pickRandomJobs(matched, 3);
    return { jobs: picked, excludedIds: picked.map((j) => j.id) };
  });

  const refresh = useCallback(() => {
    setState((prev) => {
      const matched = getMatchingJobs(scores, jungScores, mbtiType, prev.excludedIds);
      let picked = pickRandomJobs(matched, 3);
      if (picked.length === 0) {
        const all = getMatchingJobs(scores, jungScores, mbtiType);
        picked = pickRandomJobs(all, 3);
        return { jobs: picked, excludedIds: picked.map((j) => j.id) };
      }
      return {
        jobs: picked,
        excludedIds: [...prev.excludedIds, ...picked.map((j) => j.id)],
      };
    });
  }, [scores, jungScores, mbtiType]);

  return [state.jobs, refresh];
}

export default function HistoryDetailPage({ recordId, onBack, onSelectJob, onGoResume }) {
  const record = getHistoryRecord(recordId);
  const isManualType = record?.assessmentType === 'mbti' || record?.assessmentType === 'jung';
  const hasReport = !!record?.report;
  const [activeTab, setActiveTab] = useState(isManualType ? 'report' : 'test');

  const scores = record ? mergePersonalityData(record.bfiScores, record.jungScores, record.mbtiType) : null;
  const [displayedJobs, refreshJobs] = useJobRotation(
    scores,
    record?.jungScores,
    record?.mbtiType,
  );

  if (!record) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FBFBFB]">
        <PageHeader title="历史记录详情" onBack={onBack} />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-text-secondary text-sm">记录不存在或已被删除</p>
        </div>
      </div>
    );
  }

  const tabs = isManualType
    ? [{ key: 'report', label: '深度报告' }]
    : hasReport
      ? [{ key: 'test', label: '测评结果' }, { key: 'report', label: '深度报告' }]
      : [{ key: 'test', label: '测评结果' }];

  const [isScrolled, setIsScrolled] = useState(false);
  const handleScroll = useCallback((e) => {
    setIsScrolled(e.target.scrollTop > 0);
  }, []);

  const showTestTab = activeTab === 'test' && scores;

  return (
    <div className="h-screen flex flex-col bg-[#FBFBFB] relative overflow-hidden">
      {/* Top gradient background */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none z-0"
        style={{
          height: 275,
          background: 'linear-gradient(180deg, rgba(142,241,205,0.5) 0%, rgba(255,255,255,0) 70%)',
        }}
      />

      {/* Fixed header + tabs */}
      <div className="relative z-10 flex-shrink-0 [&>div]:bg-transparent">
        <PageHeader title="历史报告" onBack={onBack} sticky={false} />
        {tabs.length > 1 && (
          <div className="px-6 py-[12px] flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? 'bg-primary text-white'
                    : 'bg-bg-card text-text-secondary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Scrollable content area */}
      {showTestTab ? (
        <div className="flex-1 relative z-[1] flex flex-col overflow-hidden">
          {/* Radar chart — fixed area */}
          <div className="flex-shrink-0 px-10">
            <TestResultsTab scores={scores} section="radar" />
          </div>

          {/* Score details — scrollable card that pulls up */}
          <div className="relative flex-1 overflow-hidden">
            <div
              className="absolute top-0 left-0 right-0 z-10 pointer-events-none transition-opacity duration-300"
              style={{
                height: 40,
                background: 'linear-gradient(180deg, #FBFBFB 0%, rgba(251,251,251,0) 100%)',
                opacity: isScrolled ? 1 : 0,
              }}
            />
            <div className="h-full overflow-y-auto px-6 scrollbar-hide" onScroll={handleScroll}>
            <div className="py-5 min-h-full">
              <TestResultsTab scores={scores} section="details" />

              {!hasReport && onGoResume && (
                <button
                  onClick={() => onGoResume(record)}
                  className="w-full mt-6 p-5 text-center active:bg-bg-card-hover transition-colors"
                >
                  <svg className="w-8 h-8 text-primary mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  <p className="text-sm font-semibold text-text-primary mb-1">上传简历，获取 AI 深度报告</p>
                  <p className="text-xs text-text-secondary">结合简历生成职场画像、岗位推荐与成长建议</p>
                </button>
              )}
            </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-6 relative z-[1]">
          {activeTab === 'report' && hasReport && (
            <DeepReportTab
              report={record.report || ''}
              jobTypeRecs={record.jobTypeRecs || []}
              growthSuggestions={record.growthSuggestions || []}
              displayedJobs={displayedJobs}
              onRefreshJobs={refreshJobs}
              onSelectJob={onSelectJob || (() => {})}
            />
          )}

          {activeTab === 'report' && !hasReport && isManualType && (
            <div className="animate-fade-in p-6 text-center">
              <svg className="w-12 h-12 text-text-secondary/40 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <p className="text-sm font-semibold text-text-primary mb-1">报告生成失败</p>
              <p className="text-xs text-text-secondary mb-4">AI 报告未能成功生成，请重新上传简历重试</p>
              {onGoResume && (
                <button
                  onClick={() => onGoResume(record)}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#1a6b4a] to-[#22875e] text-white font-semibold text-sm active:scale-[0.98] transition-all"
                >
                  重新上传简历
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
