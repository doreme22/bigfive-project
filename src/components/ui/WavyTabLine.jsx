// Seeded random for consistent render
function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export default function WavyTabLine({ activeIndex, tabCount }) {
  const buildPath = () => {
    const W = 400;
    const midY = 16;
    const tabW = W / tabCount;
    const waveW = 80;
    const waveSteps = 18;
    const stepW = waveW / waveSteps;

    const rand = seededRandom(42);

    let d = `M 0 ${midY}`;

    for (let t = 0; t < tabCount; t++) {
      const tabCenter = t * tabW + tabW / 2;
      const waveStart = tabCenter - waveW / 2;
      const isActive = t === activeIndex;
      const maxAmp = isActive ? 12 : 2.8;

      d += ` L ${waveStart} ${midY}`;

      for (let i = 0; i < waveSteps; i++) {
        const progress = i / (waveSteps - 1);
        const envelope = Math.sin(progress * Math.PI);
        // Random amplitude variation (0.4~1.0) × envelope
        const ampScale = 0.4 + rand() * 0.6;
        const amp = maxAmp * envelope * ampScale;
        // Random direction bias - not strictly alternating
        const dir = rand() > 0.45 ? -1 : 1;
        // Random step width variation for irregular spacing
        const sw = stepW * (0.7 + rand() * 0.6);

        const cx = waveStart + (i / waveSteps) * waveW;
        const nx = cx + sw;
        const peakX = cx + sw * 0.5;
        const peakY = midY + dir * amp;

        d += ` C ${cx + sw * 0.2} ${midY} ${peakX - sw * 0.15} ${peakY} ${peakX} ${peakY}`;
        d += ` C ${peakX + sw * 0.15} ${peakY} ${nx - sw * 0.2} ${midY} ${nx} ${midY}`;
      }

      d += ` L ${(t + 1) * tabW} ${midY}`;
    }

    return d;
  };

  return (
    <svg
      viewBox="0 0 400 32"
      preserveAspectRatio="none"
      className="w-full h-[14px]"
      style={{ display: 'block' }}
    >
      <path
        d={buildPath()}
        fill="none"
        stroke="#00674D"
        strokeWidth="1.2"
        strokeOpacity="0.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
