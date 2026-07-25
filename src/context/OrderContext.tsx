import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Order } from '@/types';
import { INITIAL_MOCK_ORDERS } from '@/data/mockOrders';

const ORDERS_STORAGE_KEY = 'vsn_cashews_orders_v1';

interface OrderContextType {
  orders: Order[];
  addOrder: (newOrder: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status'], trackingNotes?: string) => void;
  getOrderById: (orderId: string) => Order | undefined;
  getOrderByNumber: (orderNumber: string) => Order | undefined;
  getOrdersForUser: (email: string) => Order[];
  deleteOrder: (orderId: string) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load orders from localStorage:', e);
    }
    return INITIAL_MOCK_ORDERS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders to localStorage:', e);
    }
  }, [orders]);

  const addOrder = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId || ord.orderNumber === orderId) {
          const updatedPaymentStatus =
            status === 'DELIVERED' || status === 'SHIPPED' || status === 'PACKED' || status === 'CONFIRMED'
              ? (ord.paymentMethod === 'COD' && status === 'DELIVERED' ? 'PAID' : ord.paymentStatus)
              : ord.paymentStatus;
          return {
            ...ord,
            status,
            paymentStatus: updatedPaymentStatus,
          };
        }
        return ord;
      })
    );
  };

  const getOrderById = (orderId: string) => {
    return orders.find((o) => o.id === orderId || o.orderNumber === orderId);
  };

  const getOrderByNumber = (orderNumber: string) => {
    const cleanNumber = orderNumber.trim().toUpperCase();
    return orders.find(
      (o) =>
        o.orderNumber.toUpperCase() === cleanNumber ||
        o.orderNumber.toUpperCase().includes(cleanNumber) ||
        o.id === orderNumber
    );
  };

  const getOrdersForUser = (email: string) => {
    if (!email) return orders;
    const clean = email.toLowerCase().trim();
    return orders.filter(
      (o) =>
        o.shippingAddress.email.toLowerCase().includes(clean) ||
        o.billingAddress.email.toLowerCase().includes(clean)
    );
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId && o.orderNumber !== orderId));
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        addOrder,
        updateOrderStatus,
        getOrderById,
        getOrderByNumber,
        getOrdersForUser,
        deleteOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
