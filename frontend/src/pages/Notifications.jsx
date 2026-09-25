import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  Clock,
  CheckCircle2,
  TrendingDown,
  AlertTriangle,
  ArrowRight,
  Filter,
  Check
} from 'lucide-react';

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    type: 'surplus_expiry',
    title: 'Surplus Holding Expiry Warning',
    message: '18 kg of prepared surplus expires in 2 hours (Safe holding window expiring at 02:00 PM).',
    timestamp: '25 mins ago',
    actionUrl: '/surplus',
    actionText: 'Dispatch to Partner',
    severity: 'urgent', // amber / terracotta
    read: false,
  },
  {
    id: 'notif-2',
    type: 'partner_accept',
    title: 'Surplus Pickup Scheduled',
    message: 'Partner Community Food Center accepted your surplus offer. Van dispatched with ETA 25 minutes.',
    timestamp: '1 hour ago',
    actionUrl: '/surplus',
    actionText: 'View Delivery Status',
    severity: 'success', // emerald
    read: false,
  },
  {
    id: 'notif-3',
    type: 'demand_shift',
    title: 'Forecast Attendance Shift',
    message: "Tomorrow's predicted demand is 12% lower due to the regional academic holiday. Target preparation: 440 meals.",
    timestamp: '3 hours ago',
    actionUrl: '/predict',
    actionText: 'Review Forecast Model',
    severity: 'info', // forest
    read: true,
  },
  {
    id: 'notif-4',
    type: 'waste_alert',
    title: 'Waste Rate Spike Detected',
    message: 'Your kitchen waste increased 8% this week, predominantly driven by carbohydrate overproduction on Friday shifts.',
    timestamp: '1 day ago',
    actionUrl: '/history',
    actionText: 'Audit Waste Reasons',
    severity: 'warning', // terracotta
    read: true,
  }
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-mist">
        <div>
          <h1 className="text-2xl font-bold text-forest tracking-tight">
            Operational Alerts & Notifications
          </h1>
          <p className="text-sm text-charcoal-muted mt-0.5">
            Real-time triggers for surplus expiration, partner acceptance, and kitchen demand variances.
          </p>
        </div>

        <button
          onClick={markAllRead}
          className="text-xs font-semibold text-forest hover:text-forest-dark flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Check className="w-3.5 h-3.5" />
          Mark all as read
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`saas-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
              !notif.read ? 'border-l-4 border-l-forest bg-white' : 'bg-ivory/40'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  notif.severity === 'urgent'
                    ? 'bg-amber/15 text-amber-dark border border-amber/30'
                    : notif.severity === 'warning'
                    ? 'bg-terracotta/15 text-terracotta border border-terracotta/30'
                    : notif.severity === 'success'
                    ? 'bg-emerald/15 text-emerald border border-emerald/30'
                    : 'bg-forest/15 text-forest border border-forest/30'
                }`}
              >
                {notif.severity === 'urgent' ? (
                  <Clock className="w-4 h-4" />
                ) : notif.severity === 'warning' ? (
                  <AlertTriangle className="w-4 h-4" />
                ) : notif.severity === 'success' ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-forest">{notif.title}</h3>
                  <span className="text-[11px] text-charcoal-muted">&bull; {notif.timestamp}</span>
                </div>
                <p className="text-xs text-charcoal mt-1 leading-relaxed">
                  {notif.message}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
              <Link
                to={notif.actionUrl}
                onClick={() => markAsRead(notif.id)}
                className="px-3.5 py-1.5 rounded-lg bg-forest hover:bg-forest-light text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <span>{notif.actionText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
