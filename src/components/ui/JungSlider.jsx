export default function JungSlider({ label, value, onChange }) {
  const pct = value;

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-text-secondary w-8 shrink-0">{label}</span>
      <div className="relative flex-1 h-5 flex items-center">
        <div className="absolute inset-x-0 h-1.5 rounded-full bg-border" />
        <div
          className="absolute left-0 h-1.5 rounded-full bg-primary"
          style={{ width: `${pct}%` }}
        />
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="jung-slider absolute inset-0 w-full"
        />
      </div>
      <span className="text-sm font-semibold text-text-primary w-8 text-right">{value}</span>
    </div>
  );
}
