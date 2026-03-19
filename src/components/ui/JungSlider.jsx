const jungLabels = {
  Si: '内倾感觉',
  Se: '外倾感觉',
  Ni: '内倾直觉',
  Ne: '外倾直觉',
  Ti: '内倾思考',
  Te: '外倾思考',
  Fi: '内倾情感',
  Fe: '外倾情感',
};

export default function JungSlider({ label, value, onChange }) {
  const handleInput = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    if (raw === '') {
      onChange(0);
      return;
    }
    const num = Math.min(100, Math.max(0, Number(raw)));
    onChange(num);
    // 确保光标始终在末尾
    requestAnimationFrame(() => {
      const len = e.target.value.length;
      e.target.setSelectionRange(len, len);
    });
  };

  const handleClick = (e) => {
    const len = e.target.value.length;
    e.target.setSelectionRange(len, len);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col items-center w-16">
        <span className="text-[20px] font-semibold text-[#00674D] leading-none">{label}</span>
        <span className="text-[12px] text-[#7B838D] mt-0.5 leading-none">{jungLabels[label] || label}</span>
      </div>
      <div className="flex flex-col items-center">
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={handleInput}
          onClick={handleClick}
          onFocus={handleClick}
          className={`w-16 text-center text-[18px] font-medium bg-transparent outline-none leading-none ${
            value === 0 ? 'text-[#7B838D]' : 'text-[#00674D]'
          }`}
        />
        <div className="w-16 h-[2px] mt-0.5 bg-[#00674D]" />
      </div>
    </div>
  );
}
