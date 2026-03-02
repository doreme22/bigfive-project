export default function TabBar({ tabs, activeKey, onChange }) {
  return (
    <div className="sticky top-0 z-10 bg-bg-dark/95 backdrop-blur-sm px-6 py-3 flex gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            activeKey === tab.key
              ? 'bg-primary text-white shadow-lg shadow-primary/25'
              : 'bg-bg-card text-text-secondary'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
