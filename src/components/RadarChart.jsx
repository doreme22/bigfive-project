import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import { dimensionNames, norms } from '../data/questions';

// Custom dot renderer for axis endpoints
const createTickRenderer = (scoreMap, normMap) => ({ payload, x, y, cx, cy }) => {
  const dotRadius = 5;
  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);

  const dotDist = dist - 8;
  const dotX = cx + (dx / dist) * dotDist;
  const dotY = cy + (dy / dist) * dotDist;

  const isTop = Math.abs(dy) > Math.abs(dx) && dy < 0;
  const labelOffset = isTop ? 30 : 28;
  const isLeft = dx < 0 && Math.abs(dx) > Math.abs(dy);
  const labelX = cx + (dx / dist) * (dist + labelOffset) + (isLeft ? -12 : 0);
  const isBottom = dy > 0 && Math.abs(dy) > Math.abs(dx) * 0.5;
  const labelY = cy + (dy / dist) * (dist + labelOffset) + (isBottom ? -6 : 0);

  const score = scoreMap[payload.value];
  const norm = normMap[payload.value];
  const diff = score != null && norm != null ? score - norm : null;
  const absDiff = diff != null ? Math.abs(diff).toFixed(2) : '';
  const arrowUp = (ax, ay) => (
    <polygon points={`${ax},${ay - 4} ${ax + 3},${ay + 2} ${ax - 3},${ay + 2}`} fill="#DEA57A" />
  );
  const arrowDown = (ax, ay) => (
    <polygon points={`${ax},${ay + 4} ${ax + 3},${ay - 2} ${ax - 3},${ay - 2}`} fill="#DEA57A" />
  );

  return (
    <g>
      <circle cx={dotX} cy={dotY} r={dotRadius} fill="#F1F2F4" />
      <text
        x={labelX}
        y={labelY}
        textAnchor="middle"
        dominantBaseline="central"
        fill="#000000"
        fontSize={12}
        fontFamily="PingFang SC, -apple-system, sans-serif"
        letterSpacing={0.5}
      >
        {payload.value}
      </text>
      <text
        x={labelX}
        y={labelY + 16}
        dominantBaseline="central"
        textAnchor="middle"
        fontFamily="PingFang SC, -apple-system, sans-serif"
      >
        <tspan fill="#00674D" fontSize={14} fontWeight={600}>{score != null ? score.toFixed(1) : ''}</tspan>
        <tspan dx={6} fill="#DEA57A" fontSize={12} fontWeight={400}>{absDiff}</tspan>
      </text>
      {diff != null && diff !== 0 && (() => {
        const scoreWidth = score != null ? String(score.toFixed(1)).length * 7.5 : 0;
        const diffWidth = absDiff.length * 6.5;
        const totalWidth = scoreWidth + 6 + diffWidth;
        const arrowX = labelX - totalWidth / 2 + totalWidth + 5;
        const arrowY = labelY + 16;
        return diff > 0 ? arrowUp(arrowX, arrowY) : arrowDown(arrowX, arrowY);
      })()}
    </g>
  );
};

export default function RadarChartComponent({ scores }) {
  const scoreMap = {};
  const normMap = {};
  Object.keys(dimensionNames).forEach((dim) => {
    scoreMap[dimensionNames[dim]] = scores[dim] || 0;
    normMap[dimensionNames[dim]] = norms[dim];
  });

  const data = Object.keys(dimensionNames).map((dim) => ({
    dimension: dimensionNames[dim],
    fullName: dimensionNames[dim],
    score: scores[dim] || 0,
    norm: norms[dim],
    fullMark: 5,
  }));

  return (
    <div className="w-full outline-none" style={{ WebkitTapHighlightColor: 'transparent' }}>
      <div className="relative">
        {/* Legend */}
        <div className="absolute top-2 left-0 flex flex-col gap-1 z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#7B838D]">你的得分</span>
            <div className="w-6 h-0.5 bg-[#6FCDAE] rounded-full" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#7B838D]">常模参考</span>
            <svg width="24" height="4"><line x1="0" y1="2" x2="24" y2="2" stroke="#F2CFB4" strokeWidth="2" strokeDasharray="4 3" /></svg>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <RechartsRadarChart cx="50%" cy="50%" outerRadius="58%" data={data}>
            <PolarGrid
              stroke="#F1F2F4"
              strokeWidth={1.5}
              gridType="circle"
            />
            <PolarAngleAxis
              dataKey="dimension"
              tick={createTickRenderer(scoreMap, normMap)}
              axisLine={false}
              tickLine={false}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 5]}
              tickCount={6}
              tick={false}
              axisLine={false}
            />
            <Radar
              name="常模参考"
              dataKey="norm"
              stroke="#F2CFB4"
              fill="none"
              strokeDasharray="4 4"
              strokeWidth={1.5}
            />
            <Radar
              name="你的得分"
              dataKey="score"
              stroke="#6FCDAE"
              fill="#CEEEE2"
              fillOpacity={0.3}
              strokeWidth={2}
              dot={false}
            />
          </RechartsRadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
