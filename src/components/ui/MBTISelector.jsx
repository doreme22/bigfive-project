const dimensions = [
  { pair: ['E', 'I'], labels: ['外向 E', '内向 I'] },
  { pair: ['S', 'N'], labels: ['感觉 S', '直觉 N'] },
  { pair: ['T', 'F'], labels: ['思维 T', '情感 F'] },
  { pair: ['J', 'P'], labels: ['判断 J', '知觉 P'] },
];

export default function MBTISelector({ value, onChange }) {
  // value is like { 0: 'E', 1: 'S', 2: 'T', 3: 'J' } or partial
  const selections = value || {};

  const handleSelect = (dimIndex, letter) => {
    const newSelections = { ...selections, [dimIndex]: letter };
    onChange(newSelections);
  };

  const mbtiString = Object.keys(selections).length === 4
    ? dimensions.map((_, i) => selections[i]).join('')
    : null;

  return (
    <div>
      <div className="space-y-3">
        {dimensions.map((dim, i) => (
          <div key={i} className="flex gap-2">
            {dim.pair.map((letter, j) => {
              const isSelected = selections[i] === letter;
              return (
                <button
                  key={letter}
                  onClick={() => handleSelect(i, letter)}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                    isSelected
                      ? 'bg-primary text-white shadow-lg shadow-primary/25'
                      : 'bg-bg-card text-text-secondary border border-border active:bg-bg-card-hover'
                  }`}
                >
                  {dim.labels[j]}
                </button>
              );
            })}
          </div>
        ))}
      </div>
      {mbtiString && (
        <div className="mt-3 text-center">
          <span className="text-lg font-bold gradient-text">{mbtiString}</span>
        </div>
      )}
    </div>
  );
}
