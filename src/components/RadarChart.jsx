import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { dimensionNames, norms } from '../data/questions';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="glass rounded-xl px-3 py-2 text-xs">
        <p className="font-semibold text-text-primary mb-1">{data.fullName}</p>
        <p className="text-primary-light">你的得分: {data.score}</p>
        <p className="text-text-secondary">常模参考: {data.norm}</p>
        <p className={`font-medium ${data.score > data.norm ? 'text-green-400' : data.score < data.norm ? 'text-amber-400' : 'text-text-secondary'}`}>
          {data.score > data.norm ? '↑ 高于常模' : data.score < data.norm ? '↓ 低于常模' : '— 接近常模'}
          {' '}{Math.abs(data.score - data.norm).toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
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
        <RechartsRadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="#d8e4d4" strokeDasharray="3 3" />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{ fill: '#6b7c72', fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 5]}
            tick={{ fill: '#a3b5a8', fontSize: 10 }}
            tickCount={6}
          />
          <Radar
            name="常模参考"
            dataKey="norm"
            stroke="#a3b5a8"
            fill="#a3b5a8"
            fillOpacity={0.15}
            strokeDasharray="5 5"
            strokeWidth={2}
          />
          <Radar
            name="你的得分"
            dataKey="score"
            stroke="#22875e"
            fill="#1a6b4a"
            fillOpacity={0.25}
            strokeWidth={2.5}
            dot={{ r: 4, fill: '#22875e', stroke: '#fff', strokeWidth: 1 }}
          />
          <Legend
            wrapperStyle={{ fontSize: '12px', color: '#6b7c72' }}
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
              <div className="text-lg font-bold text-primary">
                {(scores[dim] || 0).toFixed(1)}
              </div>
              <div className="text-[10px] text-text-secondary mt-0.5">
                {dimensionNames[dim]}
              </div>
              <div className={`text-[10px] mt-0.5 ${diff > 0 ? 'text-green-400' : diff < 0 ? 'text-amber-400' : 'text-text-secondary'}`}>
                {diff > 0 ? '+' : ''}{diff.toFixed(2)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
