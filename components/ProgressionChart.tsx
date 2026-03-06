
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { date: '2023-01', grade: 0 },
  { date: '2023-06', grade: 1 },
  { date: '2023-12', grade: 1 },
  { date: '2024-05', grade: 2 },
];

const ProgressionChart: React.FC = () => {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis fontSize={12} tickLine={false} axisLine={false} domain={[0, 4]} ticks={[0, 1, 2, 3, 4]} />
          <Tooltip />
          <Line 
            type="monotone" 
            dataKey="grade" 
            stroke="#0f172a" 
            strokeWidth={3} 
            dot={{ r: 6, fill: '#0f172a' }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressionChart;
