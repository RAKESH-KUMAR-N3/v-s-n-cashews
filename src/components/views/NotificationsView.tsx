'use client';

import React, { useState } from 'react';
import {
  Bell,
  CheckCheck,
  Trash2,
  Package,
  FileText,
  CreditCard,
  Info,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Clock,
  Filter
} from 'lucide-react';
import { ActiveView } from '@/config/site';
import { useNotification, AppNotification } from '@/context/NotificationContext';
import { SquareButton } from '@/components/ui/SquareButton';
import { SquareBadge } from '@/components/ui/SquareBadge';

interface NotificationsViewProps {
  onNavigate: (view: ActiveView) => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({ onNavigate }) => {
  const { notifications, markAsRead, markAllAsRead, clearNotification } = useNotification();
  const [filter, setFilter] = useState<'ALL' | 'UNREAD' | 'ORDER' | 'QUOTE'>('ALL');

  // Filter notifications for user/both
  const userNotifications = notifications.filter(
    (n) => n.recipient === 'USER' || n.recipient === 'BOTH' || n.recipient === 'ADMIN'
  );

  const unreadCount = userNotifications.filter((n) => !n.read).length;

  const filteredNotifications = userNotifications.filter((n) => {
    if (filter === 'UNREAD') return !n.read;
    if (filter === 'ORDER') return n.type === 'order' || n.type === 'payment';
    if (filter === 'QUOTE') return n.type === 'quote' || n.type === 'enquiry';
    return true;
  });

  const getNotificationIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'order':
        return <Package className="w-5 h-5 text-[#D4AF37]" />;
      case 'quote':
        return <FileText className="w-5 h-5 text-blue-400" />;
      case 'payment':
        return <CreditCard className="w-5 h-5 text-emerald-400" />;
      default:
        return <Info className="w-5 h-5 text-[#F3E5AB]" />;
    }
  };

  const formatTimestamp = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return 'Yesterday';
      return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return isoString;
    }
  };

  return (
    <div className="py-8 sm:py-16 bg-[#0B132B] min-h-screen">
      <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6">
        {/* Navigation Breadcrumb */}
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-gray-400 hover:text-[#D4AF37] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Storefront
        </button>

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D4AF37]/30 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-[#1C2541] border border-[#D4AF37] text-[#D4AF37]">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-serif font-black text-2xl sm:text-3xl text-[#F3E5AB]">
                  Notifications & Updates
                </h1>
                <p className="text-xs text-gray-300">
                  Stay updated with real-time order status, B2B quote estimates, and royal offers.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <SquareButton
                variant="gold"
                size="sm"
                onClick={() => markAllAsRead('USER')}
                className="text-xs flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" /> Mark All as Read
              </SquareButton>
            )}
            <SquareBadge variant="gold" className="text-xs font-mono py-1.5 px-3">
              {unreadCount} Unread
            </SquareBadge>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#1C2541]/60 p-3 border border-[#D4AF37]/30">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-bold text-gray-400 flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5 text-[#D4AF37]" /> Filter:
            </span>

            {[
              { id: 'ALL', label: 'All Updates' },
              { id: 'UNREAD', label: `Unread (${unreadCount})` },
              { id: 'ORDER', label: 'Orders & Payments' },
              { id: 'QUOTE', label: 'B2B Quotes & Inquiries' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={`px-3 py-1.5 text-xs font-bold transition-all cursor-pointer border ${
                  filter === tab.id
                    ? 'bg-[#D4AF37] text-[#0B132B] border-[#D4AF37]'
                    : 'bg-[#0B132B]/60 text-gray-300 border-[#D4AF37]/30 hover:border-[#D4AF37] hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="bg-[#1C2541]/40 border border-[#D4AF37]/30 p-10 text-center space-y-3">
              <div className="w-14 h-14 bg-[#0B132B] border border-[#D4AF37]/40 flex items-center justify-center mx-auto text-gray-400">
                <Bell className="w-7 h-7 text-[#D4AF37]/60" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#F3E5AB]">
                No Notifications Found
              </h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                {filter === 'UNREAD'
                  ? 'You have read all your notifications! Check back later for order updates.'
                  : 'You do not have any notification alerts matching this filter criteria.'}
              </p>
              <SquareButton variant="outline" size="sm" onClick={() => setFilter('ALL')}>
                Show All Notifications
              </SquareButton>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markAsRead(notif.id)}
                className={`p-4 sm:p-5 border transition-all relative overflow-hidden group ${
                  notif.read
                    ? 'bg-[#1C2541]/40 border-[#D4AF37]/20 text-gray-300'
                    : 'bg-[#1C2541] border-[#D4AF37] text-white shadow-xl ring-1 ring-[#D4AF37]/40'
                }`}
              >
                {!notif.read && (
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-[#D4AF37]" />
                )}

                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <div className={`p-2.5 border mt-0.5 shrink-0 ${
                      notif.read
                        ? 'bg-[#0B132B]/80 border-[#D4AF37]/30'
                        : 'bg-[#0B132B] border-[#D4AF37] shadow-md'
                    }`}>
                      {getNotificationIcon(notif.type)}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-serif font-bold text-sm sm:text-base text-[#F3E5AB] leading-snug">
                          {notif.title}
                        </h4>
                        {!notif.read && (
                          <SquareBadge variant="gold" className="text-[9px] px-1.5 py-0">
                            NEW
                          </SquareBadge>
                        )}
                      </div>

                      <p className="text-xs text-gray-300 leading-relaxed max-w-xl">
                        {notif.message}
                      </p>

                      <div className="flex items-center gap-3 pt-1 text-[10px] text-gray-400 font-mono">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#D4AF37]" />
                          {formatTimestamp(notif.createdAt)}
                        </span>
                        <span>•</span>
                        <span className="uppercase tracking-wider text-[#D4AF37]">
                          {notif.type}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Right */}
                  <div className="flex items-center gap-2 shrink-0">
                    {notif.linkView && (
                      <SquareButton
                        variant="gold"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notif.id);
                          onNavigate(notif.linkView as ActiveView);
                        }}
                        className="text-xs py-1.5 px-3 flex items-center gap-1"
                      >
                        View <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                      </SquareButton>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        clearNotification(notif.id);
                      }}
                      className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-950/40 border border-transparent hover:border-red-500/30 transition-all cursor-pointer"
                      title="Delete notification"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
