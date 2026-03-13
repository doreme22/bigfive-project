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
  const isManual = assessmentType === 'manual';

  // Manual input: only deep report tab (no BFI scores to show)
  // BFI / both: test results tab + optional deep report tab
  const tabs = isManual
    ? [{ key: 'report', label: '深度报告' }]
    : hasReport
      ? [{ key: 'test', label: '测评结果' }, { key: 'report', label: '深度报告' }]
      : [{ key: 'test', label: '测评结果' }];

  const [activeTab, setActiveTab] = useState(isManual ? 'report' : 'test');

  // Personality tag display
  const tagParts = [];
  if (mbtiType) tagParts.push(mbtiType);
  if (assessmentType === 'bfi') tagParts.push('BFI 实测');
  else if (assessmentType === 'manual') tagParts.push('手动输入');
  else if (assessmentType === 'both') tagParts.push('综合测评');

  return (
    <div className="min-h-screen bg-[#FBFBFB] pb-8">
      {/* Sticky header + tabs as one unit */}
      <div className="sticky top-0 z-10 bg-[#FBFBFB]">
        <PageHeader title="测评报告" onBack={onBack} sticky={false} />
        <div className="px-6 py-3 flex gap-2">
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
      </div>

      {/* Content */}
      <div className="px-6 mt-4">
        {activeTab === 'test' && scores && (
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

        {activeTab === 'report' && hasReport && (
          <DeepReportTab
            report={report}
            growthSuggestions={growthSuggestions}
            displayedJobs={displayedJobs}
            onRefreshJobs={onRefreshJobs}
            onSelectJob={onSelectJob}
          />
        )}

        {/* Manual input with report generation failed */}
        {activeTab === 'report' && !hasReport && isManual && (
          <div className="animate-fade-in glass rounded-3xl p-6 text-center">
            <svg className="w-12 h-12 text-text-secondary/40 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <p className="text-sm font-semibold text-text-primary mb-1">报告生成失败</p>
            <p className="text-xs text-text-secondary mb-4">AI 报告未能成功生成，请重新上传简历重试</p>
            {onGoResume && (
              <button
                onClick={onGoResume}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#1a6b4a] to-[#22875e] text-white font-semibold text-sm shadow-lg shadow-primary/25 active:scale-[0.98] transition-all"
              >
                重新上传简历
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
