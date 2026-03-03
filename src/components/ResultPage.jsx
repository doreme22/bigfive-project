import { useState } from 'react';
import PageHeader from './ui/PageHeader';
import TestResultsTab from './results/TestResultsTab';
import DeepReportTab from './results/DeepReportTab';

export default function ResultPage({
  scores,
  mbtiType,
  report,
  assessmentType,
  growthSuggestions,
  displayedJobs,
  onRefreshJobs,
  onSelectJob,
  onGoResume,
  onBack,
}) {
  const hasReport = !!report;
  const tabs = hasReport
    ? [{ key: 'test', label: '测评结果' }, { key: 'report', label: '深度报告' }]
    : [{ key: 'test', label: '测评结果' }];

  const [activeTab, setActiveTab] = useState('test');

  // Personality tag display
  const tagParts = [];
  if (mbtiType) tagParts.push(mbtiType);
  if (assessmentType === 'bfi') tagParts.push('BFI 实测');
  else if (assessmentType === 'manual') tagParts.push('手动输入');
  else if (assessmentType === 'both') tagParts.push('综合测评');

  return (
    <div className="min-h-screen bg-bg-dark pb-8">
      <PageHeader title="测评报告" onBack={onBack} />

      {/* Hero summary */}
      <div className="bg-gradient-to-b from-primary/10 to-transparent pt-2 pb-4 px-6">
        <div className="animate-fade-in-up text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1a6b4a] to-[#22875e] flex items-center justify-center mx-auto mb-3">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-1">你的性格画像</h1>
          <p className="text-sm text-text-secondary">
            {tagParts.join(' · ') || '性格测评结果'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-0 z-10 bg-bg-dark/95 backdrop-blur-sm px-6 py-3 flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                : 'bg-bg-card text-text-secondary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="px-6 mt-4">
        {activeTab === 'test' && (
          <>
            <TestResultsTab scores={scores} />

            {/* Prompt to upload resume when no report */}
            {!hasReport && onGoResume && (
              <button
                onClick={onGoResume}
                className="w-full mt-6 glass rounded-2xl p-5 text-center active:bg-bg-card-hover transition-colors"
              >
                <svg className="w-8 h-8 text-primary mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                <p className="text-sm font-semibold text-text-primary mb-1">上传简历，获取 AI 深度报告</p>
                <p className="text-xs text-text-secondary">结合简历生成职场画像、岗位推荐与成长建议</p>
              </button>
            )}
          </>
        )}

        {activeTab === 'report' && (
          <DeepReportTab
            report={report}
            growthSuggestions={growthSuggestions}
            displayedJobs={displayedJobs}
            onRefreshJobs={onRefreshJobs}
            onSelectJob={onSelectJob}
          />
        )}
      </div>
    </div>
  );
}
