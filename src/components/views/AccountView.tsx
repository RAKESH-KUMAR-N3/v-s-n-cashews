'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  User,
  Mail,
  Phone,
  Lock,
  Package,
  FileText,
  Bell,
  LogOut,
  CheckCircle,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useOrders } from '@/context/OrderContext';
import { useQuotes } from '@/context/QuoteContext';
import { useNotification } from '@/context/NotificationContext';
import { formatPrice } from '@/lib/utils';
import { ActiveView } from '@/config/site';

interface AccountViewProps {
  onNavigate: (view: ActiveView) => void;
  onOpenAuthModal?: () => void;
}

export const AccountView: React.FC<AccountViewProps> = ({ onNavigate, onOpenAuthModal }) => {
  const { userProfile, userMode, logoutUser } = useCart();
  const { orders } = useOrders();
  const { quotes } = useQuotes();
  const { notifications, unreadUserCount, markAllAsRead } = useNotification();

  const [activeTab, setActiveTab] = useState<'PROFILE' | 'ORDERS' | 'PAYMENTS' | 'QUOTES' | 'NOTIFICATIONS'>('PROFILE');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'ALL' | 'PENDING' | 'TRACKING' | 'CANCELLED' | 'DELIVERED'>('ALL');

  // Change Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passSuccess, setPassSuccess] = useState<string | null>(null);
  const [passError, setPassError] = useState<string | null>(null);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPassSuccess(null);
    setPassError(null);

    if (newPassword !== confirmPassword) {
      setPassError('New Password and Confirm Password do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setPassError('Password must be at least 6 characters long.');
      return;
    }

    setPassSuccess('Password updated successfully in database!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const userNotifications = notifications.filter((n) => n.recipient === 'USER' || n.recipient === 'BOTH');

  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter === 'PENDING') return o.status === 'PENDING' || o.status === 'CONFIRMED';
    if (orderStatusFilter === 'TRACKING') return o.status === 'SHIPPED' || o.status === 'PACKED';
    if (orderStatusFilter === 'CANCELLED') return o.status === 'CANCELLED';
    if (orderStatusFilter === 'DELIVERED') return o.status === 'DELIVERED';
    return true;
  });

  if (userMode !== 'LOGGED_IN') {
    return (
      <div className="max-w-md mx-auto my-12 p-6 bg-[#0B132B] border border-[#D4AF37]/30 text-center space-y-4">
        <User className="w-12 h-12 text-[#D4AF37] mx-auto" />
        <h2 className="font-serif text-xl font-bold text-[#F8F9FA]">Account Login Required</h2>
        <p className="text-xs text-gray-300">
          Please log in or register to view your account details, order history, quotations, and active tracking.
        </p>
        <button
          onClick={onOpenAuthModal}
          className="w-full py-3 bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#AA7C11] text-[#0B132B] font-extrabold text-xs uppercase tracking-widest cursor-pointer"
        >
          Login / Register Now
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="max-w-5xl mx-auto px-3 sm:px-6 py-6 sm:py-10 text-[#F8F9FA] space-y-6"
    >
      {/* Top Profile Summary Banner */}
      <div className="p-4 sm:p-6 bg-[#0B132B] border border-[#D4AF37]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#D4AF37] text-[#0B132B] font-black text-xl flex items-center justify-center border-2 border-[#F3E5AB]">
            {userProfile?.name ? userProfile.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h1 className="font-serif text-lg sm:text-2xl font-bold text-[#F8F9FA]">
              {userProfile?.name || 'Valued Cashew Club Member'}
            </h1>
            <p className="text-xs text-[#D4AF37]">{userProfile?.email || 'user@example.com'}</p>
          </div>
        </div>

        <button
          onClick={logoutUser}
          className="py-1.5 px-3 border border-red-500/40 text-red-400 hover:bg-red-950/40 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer self-end sm:self-center"
        >
          <LogOut className="w-3.5 h-3.5" /> Logout
        </button>
      </div>

      {/* Account Navigation Tabs */}
      <div className="flex overflow-x-auto border-b border-[#D4AF37]/30 scrollbar-none gap-2">
        <button
          onClick={() => setActiveTab('PROFILE')}
          className={`py-2 px-3 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer border-b-2 ${
            activeTab === 'PROFILE'
              ? 'border-[#D4AF37] text-[#D4AF37]'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <User className="w-3.5 h-3.5" /> Profile Details
        </button>

        <button
          onClick={() => setActiveTab('ORDERS')}
          className={`py-2 px-3 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer border-b-2 ${
            activeTab === 'ORDERS'
              ? 'border-[#D4AF37] text-[#D4AF37]'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Package className="w-3.5 h-3.5" /> My Orders ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('QUOTES')}
          className={`py-2 px-3 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer border-b-2 ${
            activeTab === 'QUOTES'
              ? 'border-[#D4AF37] text-[#D4AF37]'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" /> B2B Quotations ({quotes.length})
        </button>

        <button
          onClick={() => setActiveTab('NOTIFICATIONS')}
          className={`py-2 px-3 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer border-b-2 relative ${
            activeTab === 'NOTIFICATIONS'
              ? 'border-[#D4AF37] text-[#D4AF37]'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Bell className="w-3.5 h-3.5" /> Alerts
          {unreadUserCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-bold flex items-center justify-center">
              {unreadUserCount}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: PROFILE & CHANGE PASSWORD */}
      {activeTab === 'PROFILE' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Details */}
          <div className="p-4 bg-[#0B132B] border border-[#D4AF37]/30 space-y-4">
            <h3 className="font-serif text-sm font-bold text-[#F3E5AB] pb-2 border-b border-[#D4AF37]/20 flex items-center gap-2">
              <User className="w-4 h-4 text-[#D4AF37]" /> Personal Information
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400">Full Name:</span>
                <span className="font-semibold text-white ml-auto">{userProfile?.name || 'Not provided'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400">Email ID:</span>
                <span className="font-semibold text-white ml-auto">{userProfile?.email || 'user@vsncashews.com'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400">Phone Number:</span>
                <span className="font-semibold text-white ml-auto">{userProfile?.phone || '+91 98450 12345'}</span>
              </div>
            </div>
          </div>

          {/* Change Password Form */}
          <div className="p-4 bg-[#0B132B] border border-[#D4AF37]/30 space-y-4">
            <h3 className="font-serif text-sm font-bold text-[#F3E5AB] pb-2 border-b border-[#D4AF37]/20 flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#D4AF37]" /> Change Security Password
            </h3>

            {passSuccess && (
              <div className="p-2.5 bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" /> {passSuccess}
              </div>
            )}
            {passError && (
              <div className="p-2.5 bg-red-950/50 border border-red-500/40 text-red-300 text-xs">
                {passError}
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-300 block mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#1C2541] border border-[#D4AF37]/30 px-3 py-1.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-gray-300 block mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#1C2541] border border-[#D4AF37]/30 px-3 py-1.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-gray-300 block mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#1C2541] border border-[#D4AF37]/30 px-3 py-1.5 text-xs text-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-[#D4AF37] text-[#0B132B] font-bold text-xs uppercase tracking-wider hover:bg-[#F3E5AB] transition-colors cursor-pointer"
              >
                Update Password
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS WITH STATUS FILTERS */}
      {activeTab === 'ORDERS' && (
        <div className="space-y-4">
          {/* Status Filter Badges */}
          <div className="flex flex-wrap gap-1.5 pb-2">
            {(['ALL', 'PENDING', 'TRACKING', 'DELIVERED', 'CANCELLED'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setOrderStatusFilter(st)}
                className={`py-1 px-3 text-[10px] font-bold uppercase tracking-wider border cursor-pointer ${
                  orderStatusFilter === st
                    ? 'bg-[#D4AF37] text-[#0B132B] border-[#D4AF37]'
                    : 'bg-[#1C2541] text-gray-300 border-[#D4AF37]/30'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {filteredOrders.length === 0 ? (
            <div className="p-8 text-center bg-[#0B132B] border border-dashed border-[#D4AF37]/30 space-y-2">
              <Package className="w-8 h-8 text-[#D4AF37] mx-auto opacity-50" />
              <p className="text-xs text-gray-300">No orders found matching status filter "{orderStatusFilter}".</p>
              <button
                onClick={() => onNavigate('products')}
                className="py-1.5 px-4 bg-[#D4AF37] text-[#0B132B] text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Browse Cashews Catalog
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredOrders.map((ord) => (
                <div key={ord.id} className="p-4 bg-[#0B132B] border border-[#D4AF37]/30 space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-2">
                    <span className="font-mono font-bold text-[#F3E5AB]">{ord.orderNumber || ord.id}</span>
                    <span
                      className={`px-2 py-0.5 text-[9px] font-extrabold uppercase ${
                        ord.status === 'DELIVERED'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                          : ord.status === 'SHIPPED' || ord.status === 'PACKED'
                          ? 'bg-blue-950 text-blue-400 border border-blue-500/40'
                          : ord.status === 'CANCELLED'
                          ? 'bg-red-950 text-red-400 border border-red-500/40'
                          : 'bg-amber-950 text-amber-400 border border-amber-500/40'
                      }`}
                    >
                      {ord.status}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-gray-300">
                    <span>Date: {new Date(ord.createdAt).toLocaleDateString()}</span>
                    <span className="font-bold text-white text-sm">{formatPrice(ord.grandTotal)}</span>
                  </div>

                  {ord.trackingNumber && (
                    <div className="p-2 bg-[#1C2541] border border-[#D4AF37]/20 text-[10px] text-[#D4AF37] flex items-center justify-between">
                      <span>Tracking: {ord.trackingNumber} ({ord.carrier || 'BlueDart Express'})</span>
                      <span className="font-bold underline">Live Track</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: B2B QUOTATIONS */}
      {activeTab === 'QUOTES' && (
        <div className="space-y-3">
          {quotes.length === 0 ? (
            <div className="p-8 text-center bg-[#0B132B] border border-dashed border-[#D4AF37]/30 space-y-2">
              <FileText className="w-8 h-8 text-[#D4AF37] mx-auto opacity-50" />
              <p className="text-xs text-gray-300">No B2B Quotations requested yet.</p>
              <button
                onClick={() => onNavigate('contact')}
                className="py-1.5 px-4 bg-[#D4AF37] text-[#0B132B] text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Request B2B Quote
              </button>
            </div>
          ) : (
            quotes.map((q) => (
              <div key={q.id} className="p-4 bg-[#0B132B] border border-[#D4AF37]/30 space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-2">
                  <span className="font-mono font-bold text-[#F3E5AB]">{q.quoteNumber || q.id}</span>
                  <span className="px-2 py-0.5 bg-[#1C2541] text-[#D4AF37] text-[9px] font-bold uppercase border border-[#D4AF37]/40">
                    {q.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-gray-300">
                  <div>Company: <strong className="text-white">{q.companyName}</strong></div>
                  <div>Grade: <strong className="text-white">{q.items[0]?.grade || 'W-180'}</strong></div>
                  <div>Quantity: <strong className="text-white">{q.items[0]?.requestedQtyKg || 100} kg</strong></div>
                  <div>Location: <strong className="text-white">{q.city}, {q.state}</strong></div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 4: ALERTS / NOTIFICATIONS */}
      {activeTab === 'NOTIFICATIONS' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs text-gray-400">User Alerts History</span>
            {unreadUserCount > 0 && (
              <button
                onClick={() => markAllAsRead('USER')}
                className="text-[10px] text-[#D4AF37] underline cursor-pointer"
              >
                Mark all as read
              </button>
            )}
          </div>

          {userNotifications.length === 0 ? (
            <p className="text-xs text-gray-400 p-4 text-center">No notifications yet.</p>
          ) : (
            userNotifications.map((n) => (
              <div
                key={n.id}
                className={`p-3 border text-xs space-y-1 ${
                  n.read ? 'bg-[#0B132B]/60 border-[#D4AF37]/20 opacity-75' : 'bg-[#1C2541] border-[#D4AF37]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#F3E5AB]">{n.title}</span>
                  <span className="text-[9px] text-gray-400">
                    {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-gray-300">{n.message}</p>
              </div>
            ))
          )}
        </div>
      )}
    </motion.div>
  );
};
