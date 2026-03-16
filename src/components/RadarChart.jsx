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
const renderPolarAngleAxisTick = ({ payload, x, y, cx, cy }) => {
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
  const labelOffset = isTop ? 14 : 24;
  const labelX = cx + (dx / dist) * (dist + labelOffset);
  const labelY = cy + (dy / dist) * (dist + labelOffset);

  return (
    <g>
      <circle cx={dotX} cy={dotY} r={dotRadius} fill="#F1F2F4" />
      <text
        x={labelX}
        y={labelY}
        textAnchor="middle"
        dominantBaseline="central"
        fill="#BBC1C9"
        fontSize={12}
        fontFamily="PingFang SC, -apple-system, sans-serif"
        letterSpacing={0.5}
      >
        {payload.value}
      </text>
    </g>
  );
};

export default function RadarChartComponent({ scores }) {
  const data = Object.keys(dimensionNames).map((dim) => ({
    dimension: dimensionNames[dim],
    fullName: dimensionNames[dim],
    score: scores[dim] || 0,
    norm: norms[dim],
    fullMark: 5,
  }));

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={300}>
        <RechartsRadarChart cx="50%" cy="50%" outerRadius="58%" data={data}>
          <PolarGrid
            stroke="#F1F2F4"
            strokeWidth={1.5}
            gridType="circle"
          />
          <PolarAngleAxis
            dataKey="dimension"
            tick={renderPolarAngleAxisTick}
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
            stroke="#DDE2E8"
            fill="#DDE2E8"
            fillOpacity={0.15}
            strokeDasharray="4 4"
            strokeWidth={1.5}
          />
          <Radar
            name="你的得分"
            dataKey="score"
            stroke="#BBC1C9"
            fill="#BBC1C9"
            fillOpacity={0.2}
            strokeWidth={2}
            dot={{ r: 4, fill: '#DDE2E8', stroke: '#F1F2F4', strokeWidth: 1 }}
          />
          <Tooltip content={<CustomTooltip />} />
        </RechartsRadarChart>
      </ResponsiveContainer>

      {/* Score cards */}
      <div className="grid grid-cols-5 gap-2 mt-4 px-2">
        {Object.keys(dimensionNames).map((dim) => {
          const diff = (scores[dim] || 0) - norms[dim];
          return (
            <div key={dim} className="text-center">
              <div className="text-lg font-bold text-gray-600">
                {(scores[dim] || 0).toFixed(1)}
              </div>
              <div className="text-[10px] text-[#BBC1C9] mt-0.5">
                {dimensionNames[dim]}
              </div>
              <div className={`text-[10px] mt-0.5 ${diff > 0 ? 'text-green-400' : diff < 0 ? 'text-amber-400' : 'text-gray-400'}`}>
                {diff > 0 ? '+' : ''}{diff.toFixed(2)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
