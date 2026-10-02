import React from 'react';
import { BarChart3, Users, MousePointer2, Search, TrendingUp, Clock } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend, color }: {
  title: string;
  value: string;
  icon: any;
  trend?: string;
  color: string;
}) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
        {trend && (
          <p className="text-xs font-medium text-green-600 mt-1 flex items-center gap-1">
            <TrendingUp size={12} /> {trend}
          </p>
        )}
      </div>
      <div className={`p-3 rounded-xl ${color} text-white`}>
        <Icon size={24} />
      </div>
    </div>
  </div>
);

export default function AnalyticsPage() {
  // Mock data for now, will connect to backend later
  const stats = [
    { title: 'Total Visits', value: '12,843', icon: Users, trend: '+12% from last month', color: 'bg-blue-600' },
    { title: 'Unique Visitors', value: '8,210', icon: MousePointer2, trend: '+5% from last month', color: 'bg-indigo-600' },
    { title: 'Avg. Session', value: '3m 42s', icon: Clock, trend: '+22s', color: 'bg-purple-600' },
    { title: 'Search Queries', value: '1,420', icon: Search, trend: '+18% growth', color: 'bg-emerald-600' },
  ];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Site Analytics</h1>
        <p className="text-slate-500 mt-1">Monitor your website performance and user engagement.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 size={20} className="text-blue-600" />
              Traffic Overview
            </h3>
            <select className="text-sm border-slate-200 rounded-lg bg-slate-50 px-2 py-1 outline-none">
              <option>Last 30 Days</option>
              <option>Last 7 Days</option>
              <option>Last 24 Hours</option>
            </select>
          </div>
          <div className="h-64 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 italic">
            Traffic graph visualization will be implemented here (e.g., using Recharts)
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Search size={20} className="text-blue-600" />
            Top Search Queries
          </h3>
          <div className="space-y-4">
            {[
              { query: 'Fixtures 2026', count: 420, percent: '40%' },
              { query: 'Player Roster', count: 310, percent: '30%' },
              { query: 'Club History', count: 200, percent: '20%' },
              { query: 'Contact Details', count: 150, percent: '10%' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors">
                <span className="text-sm font-medium text-slate-700">{item.query}</span>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-slate-500">{item.count} searches</span>
                  <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600" style={{ width: item.percent }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
