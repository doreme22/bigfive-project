export default function HomePage({ onGoTest }) {
  return (
    <div className="home-page min-h-screen flex flex-col">
      {/* Content area */}
      <div className="flex-1 px-4 pt-6">
        {/* Entry card */}
        <button
          onClick={onGoTest}
          className="home-card w-full rounded-3xl overflow-hidden active:scale-[0.98] transition-transform text-left"
        >
          <div className="relative px-6 pt-8 pb-6">
            {/* Decorative circles */}
            <div className="absolute top-4 right-4 w-24 h-24 rounded-full bg-white/10" />
            <div className="absolute bottom-2 right-16 w-12 h-12 rounded-full bg-white/8" />

            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white mb-1">职业性格测评</h2>
              <p className="text-sm text-white/70 mb-5">BFI-44 量表 + AI 深度解析，发现你的职场性格密码</p>
              <div className="inline-flex items-center gap-1.5 text-xs font-medium text-white/90 bg-white/15 rounded-full px-3.5 py-1.5">
                开始探索
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* Bottom tab bar */}
      <div className="home-tabbar flex items-center justify-around px-6 py-2 pb-6">
        <div className="flex flex-col items-center gap-0.5">
          <svg className="w-6 h-6 text-[#1a6b4a]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 11-1.06 1.06l-.97-.97V19.5a.75.75 0 01-.75.75h-4.5a.75.75 0 01-.75-.75v-3.75h-3v3.75a.75.75 0 01-.75.75h-4.5a.75.75 0 01-.75-.75v-6.88l-.97.97a.75.75 0 01-1.06-1.06l8.69-8.69z" />
          </svg>
          <span className="text-[10px] font-medium text-[#1a6b4a]">首页</span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <svg className="w-6 h-6 text-[#8a8a8a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
          </svg>
          <span className="text-[10px] text-[#8a8a8a]">消息</span>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <svg className="w-6 h-6 text-[#8a8a8a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
          <span className="text-[10px] text-[#8a8a8a]">我的</span>
        </div>
      </div>
    </div>
  );
}
