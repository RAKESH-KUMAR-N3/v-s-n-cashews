'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AppNotification {
  id: string;
  recipient: 'USER' | 'ADMIN' | 'BOTH';
  title: string;
  message: string;
  type: 'order' | 'quote' | 'enquiry' | 'payment' | 'system';
  read: boolean;
  createdAt: string;
  linkView?: string;
}

interface NotificationContextType {
  notifications: AppNotification[];
  addNotification: (notification: Omit<AppNotification, 'id' | 'read' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: (recipient?: 'USER' | 'ADMIN') => void;
  clearNotification: (id: string) => void;
  unreadUserCount: number;
  unreadAdminCount: number;
}

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    recipient: 'ADMIN',
    title: 'New B2B Quotation Request',
    message: 'Southern Sweets Corp requested quote for 500kg W-180 King Cashews.',
    type: 'quote',
    read: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    linkView: 'admin',
  },
  {
    id: 'notif-2',
    recipient: 'USER',
    title: 'Order Status Update',
    message: 'Your Order #VSN-84920 has been dispatched via BlueDart Express (Tracking: BLU98721).',
    type: 'order',
    read: false,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    linkView: 'orders',
  },
  {
    id: 'notif-3',
    recipient: 'ADMIN',
    title: 'New Retail Order Received',
    message: 'Order #VSN-99820 for ₹3,450 placed via Razorpay (UPI).',
    type: 'payment',
    read: false,
    createdAt: new Date(Date.now() - 10800000).toISOString(),
    linkView: 'admin',
  },
];

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vsn_notifications');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse notifications', e);
        }
      }
    }
    return INITIAL_NOTIFICATIONS;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('vsn_notifications', JSON.stringify(notifications));
    }
  }, [notifications]);

  const addNotification = (notif: Omit<AppNotification, 'id' | 'read' | 'createdAt'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = (recipient?: 'USER' | 'ADMIN') => {
    setNotifications((prev) =>
      prev.map((n) => {
        if (!recipient || n.recipient === recipient || n.recipient === 'BOTH') {
          return { ...n, read: true };
        }
        return n;
      })
    );
  };

  const clearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const unreadUserCount = notifications.filter(
    (n) => !n.read && (n.recipient === 'USER' || n.recipient === 'BOTH')
  ).length;

  const unreadAdminCount = notifications.filter(
    (n) => !n.read && (n.recipient === 'ADMIN' || n.recipient === 'BOTH')
  ).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotification,
        unreadUserCount,
        unreadAdminCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
