import CoreProfileSection from './CoreProfileSection';
import BestBattlefieldSection from './BestBattlefieldSection';
import GrowthEngineSection from './GrowthEngineSection';
import ReportSummary from './ReportSummary';

export default function DeepReportTab({
  report,
  growthSuggestions,
  displayedJobs,
  onRefreshJobs,
  onSelectJob,
}) {
  return (
    <div className="animate-fade-in">
      <CoreProfileSection report={report} />
      <BestBattlefieldSection
        report={report}
        displayedJobs={displayedJobs}
        onRefreshJobs={onRefreshJobs}
        onSelectJob={onSelectJob}
      />
      <GrowthEngineSection report={report} growthSuggestions={growthSuggestions} />
      <ReportSummary report={report} />

      {/* Disclaimer */}
      <div className="mt-4 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
        <p className="text-xs text-amber-400/70 leading-relaxed">
          声明：本报告由 AI 基于性格测评数据与简历内容生成，仅供参考，不构成专业心理咨询或职业规划建议。如需专业帮助，请咨询持证心理咨询师或职业规划师。
        </p>
      </div>
    </div>
  );
}
