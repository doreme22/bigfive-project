const dimensions = [
  { pair: ['E', 'I'], labels: ['外向', '内向'] },
  { pair: ['S', 'N'], labels: ['感觉', '直觉'] },
  { pair: ['T', 'F'], labels: ['思维', '情感'] },
  { pair: ['J', 'P'], labels: ['判断', '知觉'] },
];

export default function MBTISelector({ value, onChange }) {
  const selections = value || {};

  const handleSelect = (dimIndex, letter) => {
    const newSelections = { ...selections, [dimIndex]: letter };
    onChange(newSelections);
  };

  const mbtiString = Object.keys(selections).length === 4
    ? dimensions.map((_, i) => selections[i]).join('')
    : null;

  const topRow = dimensions.map((dim, i) => ({ letter: dim.pair[0], label: dim.labels[0], dimIndex: i }));
  const bottomRow = dimensions.map((dim, i) => ({ letter: dim.pair[1], label: dim.labels[1], dimIndex: i }));

  const renderButton = ({ letter, label, dimIndex }) => {
    const isSelected = selections[dimIndex] === letter;
    return (
      <button
        key={`${dimIndex}-${letter}`}
        onClick={() => handleSelect(dimIndex, letter)}
        className={`w-[68.6px] h-[68.6px] rounded-[12px] flex flex-col items-center justify-center transition-all border ${
          isSelected
            ? 'bg-[#EBFAF5] border-[#009688]'
            : 'bg-[#F1F2F4] border-transparent'
        }`}
      >
        <span
          className={`text-[20px] font-semibold leading-tight transition-colors ${
            isSelected ? 'text-black' : 'text-[#7B838D]'
          }`}
          style={{ fontFamily: '"PingFang SC", -apple-system, sans-serif' }}
        >
          {letter}
        </span>
        <span
          className={`text-[12px] font-normal leading-tight mt-0.5 transition-colors ${
            isSelected ? 'text-black' : 'text-[#7B838D]'
          }`}
        >
          {label}
        </span>
      </button>
    );
  };

  return (
    <div>
      <div className="flex justify-between">
        {topRow.map(renderButton)}
      </div>
      <div className="flex justify-between mt-3">
        {bottomRow.map(renderButton)}
      </div>
      {mbtiString && (
        <div className="mt-8 flex flex-col items-center animate-fade-in">
          <img
            src={`/images/mbti/${mbtiString}.png`}
            alt={mbtiString}
            className="w-40 h-40 object-contain"
          />
          <span className="mt-2 text-[18px] font-semibold text-black">{mbtiString}</span>
        </div>
      )}
    </div>
  );
}
