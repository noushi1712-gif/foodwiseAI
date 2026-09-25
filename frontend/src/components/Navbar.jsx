import React from 'react';
import { Menu, Bell, Building2, Calendar, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar({ onToggleMobile }) {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  return (
    <header className="h-16 bg-white border-b border-mist px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Mobile Menu Toggle & Facility Label */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobile}
          className="lg:hidden p-1.5 rounded-lg text-charcoal hover:bg-ivory border border-mist transition-colors"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs text-charcoal font-medium">
          <div className="w-2 h-2 rounded-full bg-emerald"></div>
          <span className="font-semibold text-forest">Central Dining Facility</span>
          <span className="text-charcoal-muted hidden sm:inline">&bull; Active Service</span>
        </div>
      </div>

      {/* Date & Notifications */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-charcoal-muted bg-ivory px-3 py-1.5 rounded-lg border border-mist">
          <Calendar className="w-3.5 h-3.5 text-forest" />
          <span>{today}</span>
        </div>

        <Link
          to="/notifications"
          className="relative p-2 rounded-lg text-charcoal hover:text-forest hover:bg-ivory border border-mist transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber"></span>
        </Link>

        <Link
          to="/login"
          className="flex items-center gap-1.5 text-xs font-semibold text-forest hover:text-white bg-ivory hover:bg-forest px-3 py-1.5 rounded-lg border border-mist transition-colors shadow-2xs"
          title="Sign in or switch manager account"
        >
          <LogIn className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Sign In / Switch</span>
        </Link>
      </div>
    </header>
  );
}
