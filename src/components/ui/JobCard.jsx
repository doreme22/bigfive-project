export default function JobCard({ job, onClick }) {
  return (
    <button
      onClick={() => onClick?.(job.id)}
      className="w-full text-left bg-white border border-[#F1F2F4] rounded-lg px-2.5 py-2 active:bg-gray-50 transition-colors"
    >
      <div className="flex flex-col gap-1">
        {/* 标题行：职位名 + 薪资 */}
        <div className="flex gap-1">
          <h4 className="flex-1 text-sm font-semibold text-black leading-[21px] line-clamp-2 min-w-0">{job.title}</h4>
          <span className="text-sm font-semibold text-[#008B68] text-right shrink-0 leading-[21px] whitespace-nowrap">{job.salary}</span>
        </div>
        {/* 公司信息 */}
        <p className="text-[12px] text-[#7B838D] tracking-[0.5px] leading-[18px]">
          {job.company}{job.department ? `·${job.department}` : ''}{job.location ? `·${job.location}` : ''}
        </p>
      </div>
      {/* 分割线 */}
      <div className="border-t border-[#F1F2F4] my-2" />
      {/* 简介 */}
      <p className="text-[12px] font-medium text-[#7B838D] tracking-[0.5px] leading-[18px] line-clamp-1">{job.description}</p>
    </button>
  );
}
