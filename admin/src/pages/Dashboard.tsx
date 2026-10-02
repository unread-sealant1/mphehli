import React from 'react';
import { Users, Calendar, Newspaper, Image as ImageIcon, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
}

function StatCard({ label, value, icon: Icon, color }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4 transition-transform hover:scale-[1.02]">
      <div className={cn("p-3 rounded-xl", color)}>
        <Icon size={24} className="text-white" />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
      </div>
    </div>
  );
}

// Helper to avoid repeated imports if not present
function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Club Overview</h1>
        <p className="text-slate-500 mt-1">Welcome back, Administrator. Here is what's happening at the club.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Players" value="24" icon={Users} color="bg-blue-600" />
        <StatCard label="Fixtures" value="12" icon={Calendar} color="bg-emerald-600" />
        <StatCard label="News Articles" value="8" icon={Newspaper} color="bg-amber-600" />
        <StatCard label="Media Assets" value="45" icon={ImageIcon} color="bg-purple-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Activity size={20} className="text-blue-600" />
              Recent Activity
            </h2>
            <button className="text-sm text-blue-600 font-medium hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {[
              { event: 'New player added: John Doe', time: '2 hours ago', type: 'PLAYER' },
              { event: 'Fixture updated: vs City Lions', time: '5 hours ago', type: 'FIX' },
              { event: 'News published: Season Opener', time: '1 day ago', type: 'NEWS' },
            ].map((activity, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  <span className="text-sm text-slate-700 font-medium">{activity.event}</span>
                </div>
                <span className="text-xs text-slate-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl shadow-xl text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link to="/players" className="flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors font-medium">
                <Users size={18} /> Add Player
              </Link>
              <Link to="/fixtures" className="flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors font-medium">
                <Calendar size={18} /> Schedule Match
              </Link>
              <Link to="/news" className="flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors font-medium">
                <Newspaper size={18} /> Write News
              </Link>
            </div>
          </div>
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-600 rounded-full blur-3xl opacity-30"></div>
        </div>
      </div>
    </div>
  );
}
