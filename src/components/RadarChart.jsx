import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { dimensionNames, norms } from '../data/questions';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white rounded-xl px-3 py-2 text-xs shadow-sm border border-gray-100">
        <p className="font-semibold text-gray-700 mb-1">{data.fullName}</p>
        <p className="text-gray-500">你的得分: {data.score}</p>
        <p className="text-gray-400">常模参考: {data.norm}</p>
        <p className={`font-medium ${data.score > data.norm ? 'text-green-500' : data.score < data.norm ? 'text-amber-500' : 'text-gray-400'}`}>
          {data.score > data.norm ? '↑ 高于常模' : data.score < data.norm ? '↓ 低于常模' : '— 接近常模'}
          {' '}{Math.abs(data.score - data.norm).toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
};

// Custom dot renderer for axis endpoints
const createTickRenderer = (scoreMap, normMap) => ({ payload, x, y, cx, cy }) => {
  const dotRadius = 5;
  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Move dot inward by 8px so it sits exactly on the outer circle
  const dotDist = dist - 8;
  const dotX = cx + (dx / dist) * dotDist;
  const dotY = cy + (dy / dist) * dotDist;

  // Label stays outside — top label (外向性) closer
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
  // Small triangle arrow
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
        // Position arrow after the diff text
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
  // Map dimension display name -> score/norm for tick renderer
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
    <div className="w-full">
      {/* Legend — overlaid top-left, aligned with radar */}
      <div className="relative">
        <div className="absolute top-2 -left-4 flex flex-col gap-1 z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#7B838D]">你的得分</span>
            <div className="w-6 h-0.5 bg-[#6FCDAE] rounded-full" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#7B838D]">常模参考</span>
            <div className="w-6 border-t-2 border-dashed border-[#F2CFB4] rounded-full" />
          </div>
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
          <Tooltip content={<CustomTooltip />} />
        </RechartsRadarChart>
      </ResponsiveContainer>

    </div>
  );
}
