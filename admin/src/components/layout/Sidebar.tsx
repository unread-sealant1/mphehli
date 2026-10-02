import React from 'react';
import { LayoutDashboard, Users, Calendar, Newspaper, Image as ImageIcon, BarChart3, LogOut, Palette } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../../utils';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Users, label: 'Players', path: '/players' },
    { icon: Calendar, label: 'Fixtures', path: '/fixtures' },
    { icon: Newspaper, label: 'News', path: '/news' },
    { icon: ImageIcon, label: 'Media', path: '/media' },
    { icon: Palette, label: 'Website Editor', path: '/website-editor' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 h-screen bg-slate-900 text-white flex flex-col sticky top-0 shadow-2xl">
      <div className="p-6 border-b border-slate-800 flex flex-col items-center gap-4">
        <div className="w-20 h-20 relative bg-white rounded-full p-1 shadow-inner">
          <img
            src="/color-logo-no-bg.png"
            alt="MPHEHLI ALL STARS Logo"
            className="w-full h-full object-contain rounded-full"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
        <div className="text-center">
          <h1 className="text-xl font-bold tracking-tight text-white">MPHEHLI ADMIN</h1>
          <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">Since 2022</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <div className="text-slate-500 text-[10px] font-bold uppercase tracking-wider px-4 mb-2">Main Menu</div>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
              location.pathname === item.path
                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            )}
          >
            <item.icon size={20} className={cn(
              "transition-colors",
              location.pathname === item.path ? "text-white" : "text-slate-500 group-hover:text-white"
            )} />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-left text-slate-400 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all duration-200 group"
        >
          <LogOut size={20} className="text-slate-500 group-hover:text-red-400 transition-colors" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
