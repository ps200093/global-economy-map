'use client';

import { RegionData } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getIssueColor } from '@/utils/helpers';

interface RegionChartsProps {
  regions: RegionData[];
}

export default function RegionCharts({ regions }: RegionChartsProps) {
  // 빈곤율 비교 데이터
  const povertyData = regions.map(r => ({
    name: r.name.length > 15 ? r.name.substring(0, 15) + '...' : r.name,
    빈곤율: r.povertyRate,
    실업률: r.unemploymentRate,
  }));

  // 이슈 타입별 집계
  const issueTypeData: { [key: string]: number } = {};
  regions.forEach(region => {
    region.issues.forEach(issue => {
      if (issueTypeData[issue.type]) {
        issueTypeData[issue.type] += issue.affectedPopulation;
      } else {
        issueTypeData[issue.type] = issue.affectedPopulation;
      }
    });
  });

  const pieData = Object.entries(issueTypeData).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* 빈곤율 및 실업률 비교 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold mb-4 text-gray-800">지역별 빈곤율 & 실업률 비교</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={povertyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} fontSize={12} />
            <YAxis label={{ value: '(%)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="빈곤율" fill="#dc2626" />
            <Bar dataKey="실업률" fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 이슈 타입별 영향 인구 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold mb-4 text-gray-800">경제 이슈별 영향 인구</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getIssueColor(entry.name)} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `${(value / 1000000).toFixed(1)}M 명`} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

