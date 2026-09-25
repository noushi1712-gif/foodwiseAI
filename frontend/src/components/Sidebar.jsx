import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  TrendingUp,
  Scale,
  HeartHandshake,
  Users,
  Activity,
  Bell,
  Settings,
  LogOut,
  LogIn,
  Leaf
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/predict', label: 'Demand Forecast', icon: TrendingUp },
  { path: '/history', label: 'Waste Tracking', icon: Scale },
  { path: '/surplus', label: 'Surplus', icon: HeartHandshake },
  { path: '/partners', label: 'Partners', icon: Users },
  { path: '/impact', label: 'Impact', icon: Activity },
  { path: '/notifications', label: 'Notifications', icon: Bell, badge: '2' },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ onCloseMobile }) {
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 bg-forest text-ivory flex flex-col justify-between shrink-0 h-screen sticky top-0 border-r border-forest-dark select-none z-40">
      <div>
        {/* Brand / Wordmark */}
        <div className="h-16 px-6 flex items-center gap-3 border-b border-forest-light/30">
          <div className="w-8 h-8 rounded-lg bg-emerald flex items-center justify-center text-white shrink-0">
            <Leaf className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-white block leading-none">
              FoodWise <span className="text-sage text-xs font-semibold ml-1">AI</span>
            </span>
            <span className="text-[11px] text-sage/70 font-normal">
              Food Service Operations
            </span>
          </div>
        </div>

        {/* Primary Navigation */}
        <nav className="p-3 space-y-1 mt-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-[13px] font-medium transition-colors ${
                    isActive
                      ? 'bg-forest-light text-white font-semibold shadow-sm'
                      : 'text-sage hover:text-white hover:bg-forest-light/40'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0 opacity-80" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber text-charcoal leading-none">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User profile & Logout */}
      <div className="p-3 border-t border-forest-light/30 bg-forest-dark/40">
        <div className="flex items-center justify-between px-2 py-2">
          <div className="min-w-0 pr-2">
            <p className="text-xs font-semibold text-white truncate">
              {user?.name || 'Kitchen Operations'}
            </p>
            <p className="text-[11px] text-sage/80 capitalize truncate">
              {user?.role || 'Operations Manager'}
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <NavLink
              to="/login"
              title="Sign in / Switch manager"
              onClick={onCloseMobile}
              className="p-1.5 rounded-md text-sage hover:text-white hover:bg-forest-light transition-colors"
            >
              <LogIn className="w-4 h-4" />
            </NavLink>
            <button
              onClick={logout}
              title="Sign out"
              className="p-1.5 rounded-md text-sage hover:text-white hover:bg-forest-light transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
