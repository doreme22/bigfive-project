const dimensions = [
  { pair: ['E', 'I'], labels: ['外向', '内向'] },
  { pair: ['S', 'N'], labels: ['感觉', '直觉'] },
  { pair: ['T', 'F'], labels: ['思考', '情感'] },
  { pair: ['J', 'P'], labels: ['判断', '知觉'] },
];

export default function MBTISelector({ value, onChange }) {
  const selections = value || {};

  const handleSelect = (dimIndex, letter) => {
    const newSelections = { ...selections, [dimIndex]: letter };
    onChange(newSelections);
  };

  // Build display string like "IN--"
  const displayLetters = dimensions.map((_, i) =>
    selections[i] || null
  );

  return (
    <div>
      {/* Dimension rows */}
      <div className="flex flex-col gap-4">
        {dimensions.map((dim, dimIndex) => {
          const selected = selections[dimIndex];
          const selectedIdx = selected === dim.pair[0] ? 0 : selected === dim.pair[1] ? 1 : -1;
          return (
            <div
              key={dimIndex}
              className="relative flex rounded-full border border-[#DDE2E8] bg-[#F8FAFC] h-[52px]"
            >
              {/* Sliding indicator */}
              {selectedIdx >= 0 && (
                <div
                  className="absolute top-0 bottom-0 w-1/2 rounded-full bg-[#EBFAF5] border border-[#009688] transition-transform duration-300 ease-out"
                  style={{ transform: `translateX(${selectedIdx * 100}%)` }}
                />
              )}
              {dim.pair.map((letter, j) => (
                <button
                  key={letter}
                  onClick={() => handleSelect(dimIndex, letter)}
                  className={`relative z-10 flex-1 h-full flex items-center justify-center text-[15px] transition-colors duration-300 rounded-full ${
                    selected === letter
                      ? 'text-black font-semibold'
                      : 'text-[#7B838D] font-normal'
                  }`}
                >
                  {letter}（{dim.labels[j]}）
                </button>
              ))}
            </div>
          );
        })}
      </div>

      {/* MBTI type preview */}
      <div className="flex items-center justify-center gap-1 mt-6">
        {displayLetters.map((letter, i) => (
          <span
            key={i}
            className={`text-[32px] font-bold tracking-[2px] ${
              letter ? 'text-black' : 'text-[#D1D5DB]'
            }`}
            style={{ fontFamily: '"PingFang SC", -apple-system, sans-serif' }}
          >
            {letter || '—'}
          </span>
        ))}
      </div>

      {/* MBTI character image */}
      {Object.keys(selections).length === 4 && (
        <div className="mt-4 flex justify-center animate-fade-in">
          <img
            src={`/images/mbti/${dimensions.map((_, i) => selections[i]).join('')}.png`}
            alt={dimensions.map((_, i) => selections[i]).join('')}
            className="w-40 h-40 object-contain"
          />
        </div>
      )}
    </div>
  );
}
