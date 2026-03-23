import { useState, useCallback } from 'react';
import PageHeader from './ui/PageHeader';
import TestResultsTab from './results/TestResultsTab';
import DeepReportTab from './results/DeepReportTab';
import WavyTabLine from './ui/WavyTabLine';

export default function ResultPage({
  scores,
  mbtiType,
  report,
  assessmentType,
  displayedJobs,
  onRefreshJobs,
  onSelectJob,
  onGoResume,
  onBack,
}) {
  const hasReport = !!report;
  const isManualType = assessmentType === 'mbti' || assessmentType === 'jung';

  const tabs = isManualType
    ? [{ key: 'report', label: '深度报告' }]
    : hasReport
      ? [{ key: 'test', label: '测评结果' }, { key: 'report', label: '深度报告' }]
      : [{ key: 'test', label: '测评结果' }];

  const [activeTab, setActiveTab] = useState(isManualType ? 'report' : 'test');

  const tagParts = [];
  if (mbtiType) tagParts.push(mbtiType);
  if (assessmentType === 'bfi') tagParts.push('BFI 实测');
  else if (assessmentType === 'mbti') tagParts.push('MBTI');
  else if (assessmentType === 'jung') tagParts.push('荣格八维');

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
        <PageHeader title="测评报告" onBack={onBack} sticky={false} />
        {tabs.length > 1 && (
          <div className="mb-3">
            <div className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 pt-3 pb-1 text-sm font-medium transition-all ${
                    activeTab === tab.key
                      ? 'text-primary'
                      : 'text-[#7B838D]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <WavyTabLine activeIndex={tabs.findIndex(t => t.key === activeTab)} tabCount={tabs.length} />
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
                    onClick={onGoResume}
                    className="w-full mt-6 p-5 text-center bg-bg-card border border-dashed border-[#F1F2F4] rounded-lg active:bg-bg-card-hover transition-colors"
                  >
                    <svg className="w-8 h-8 text-[#7B838D] mx-auto mb-2" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth={1.25}>
                      <path d="M3.33325 5.0013C3.33325 3.16035 4.82564 1.66797 6.66659 1.66797H9.99992H11.7193C12.2139 1.66797 12.683 1.88767 12.9997 2.26766L16.2803 6.20441C16.5299 6.50394 16.6666 6.88149 16.6666 7.27139V10.0013V15.0013C16.6666 16.8423 15.1742 18.3346 13.3333 18.3346H6.66658C4.82563 18.3346 3.33325 16.8423 3.33325 15.0013V5.0013Z" />
                      <path d="M12.4998 2.08594V5.0026C12.4998 5.92308 13.2459 6.66927 14.1664 6.66927H16.2498" strokeLinecap="round" />
                      <path d="M6.6665 10H13.3332" strokeLinecap="round" />
                      <path d="M6.6665 14.168H9.99984" strokeLinecap="round" />
                    </svg>
                    <p className="text-sm font-semibold text-text-primary mb-1">上传简历，获取 AI 深度报告</p>
                    <p className="text-xs text-[#BBC1C9]">结合简历生成职场画像、岗位推荐与成长建议</p>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-6 pb-[35px] relative z-[1] scrollbar-hide">
          {activeTab === 'report' && hasReport && (
            <DeepReportTab
              report={report}
              displayedJobs={displayedJobs}
              onRefreshJobs={onRefreshJobs}
              onSelectJob={onSelectJob}
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
                  onClick={onGoResume}
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
