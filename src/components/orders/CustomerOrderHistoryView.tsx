'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Package,
  Truck,
  Calendar,
  Eye,
  ShoppingBag,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ArrowLeft,
  Crown,
  Sparkles,
  MapPin,
  RefreshCw,
} from 'lucide-react';
import { Order } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useOrders } from '@/context/OrderContext';
import { useCart } from '@/context/CartContext';
import { SquareBadge } from '@/components/ui/SquareBadge';
import { SquareButton } from '@/components/ui/SquareButton';
import { SquareInput } from '@/components/ui/SquareInput';
import { OrderDetailsModal } from './OrderDetailsModal';

interface CustomerOrderHistoryViewProps {
  onBackToCatalog: () => void;
}

export const CustomerOrderHistoryView: React.FC<CustomerOrderHistoryViewProps> = ({
  onBackToCatalog,
}) => {
  const { orders } = useOrders();
  const { userProfile, addToCart } = useCart();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // User filter
  const userEmail = userProfile?.email || 'nrakeshkumar36@gmail.com';

  // Filter orders
  const filteredOrders = orders.filter((ord) => {
    // Filter status tab
    if (selectedStatus !== 'ALL' && ord.status !== selectedStatus) {
      return false;
    }

    // Filter search term (order number, customer name, email, item name)
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      const matchNum = ord.orderNumber.toLowerCase().includes(q);
      const matchEmail = ord.shippingAddress.email.toLowerCase().includes(q);
      const matchName = ord.shippingAddress.fullName.toLowerCase().includes(q);
      const matchItem = ord.items.some((i) => i.product.name.toLowerCase().includes(q));
      return matchNum || matchEmail || matchName || matchItem;
    }

    return true;
  });

  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      addToCart(item.product, item.weight, item.quantity);
    });
    alert(`Added ${order.items.length} items from Order #${order.orderNumber} to your Bag!`);
  };

  const getStatusBadgeVariant = (status: Order['status']) => {
    switch (status) {
      case 'DELIVERED':
        return 'success';
      case 'SHIPPED':
      case 'PACKED':
      case 'CONFIRMED':
        return 'gold';
      case 'PENDING':
        return 'warning';
      case 'CANCELLED':
        return 'danger';
      default:
        return 'navy';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-[#F8F9FA] animate-fade-in">
      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-[#D4AF37]/30 gap-4 mb-6">
        <div>
          <button
            onClick={onBackToCatalog}
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-gray-400 hover:text-[#D4AF37] transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Products Catalog
          </button>
          <h1 className="font-serif font-black text-2xl sm:text-3xl text-[#F3E5AB] flex items-center gap-2">
            <Package className="w-7 h-7 text-[#D4AF37]" /> Order History & Dispatch Tracking
          </h1>
          <p className="text-xs text-gray-300 mt-1">
            Track real-time shipment updates, review tax invoices, or re-order your favorite Mangalore cashew grades.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <SquareBadge variant="gold" className="text-xs flex items-center gap-1">
            <Crown className="w-3.5 h-3.5" /> Royal Patron Logged In
          </SquareBadge>
        </div>
      </div>

      {/* Search & Status Filter Tabs */}
      <div className="bg-[#1C2541]/80 border border-[#D4AF37]/40 p-4 space-y-4 shadow-lg mb-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <SquareInput
              placeholder="Search by Order # (e.g. VSN-ORD-882109), Item name, or Email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4 text-[#D4AF37]" />}
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {['ALL', 'PENDING', 'CONFIRMED', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`py-2 px-3 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap border ${
                  selectedStatus === st
                    ? 'border-[#D4AF37] bg-[#D4AF37] text-[#0B132B] font-bold'
                    : 'border-gray-700 bg-[#0B132B] text-gray-400 hover:border-gray-500 hover:text-gray-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Order List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-[#1C2541]/50 border border-[#D4AF37]/20 p-8 space-y-4">
          <div className="w-16 h-16 rounded-full border border-[#D4AF37] bg-[#0B132B] text-[#D4AF37] flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="font-serif font-bold text-lg text-[#F3E5AB]">No Orders Found</h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            {searchTerm || selectedStatus !== 'ALL'
              ? 'No cashew orders match your search criteria. Try clearing search filters.'
              : 'You have not placed any cashew orders yet. Explore our Mangalore catalog to place your first order.'}
          </p>
          <SquareButton variant="gold" onClick={onBackToCatalog}>
            <ShoppingBag className="w-4 h-4 mr-2" /> Explore Cashew Catalog
          </SquareButton>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((ord) => (
            <div
              key={ord.id}
              className="bg-[#1C2541]/90 border border-[#D4AF37]/40 p-5 space-y-4 shadow-lg hover:border-[#D4AF37] transition-all"
            >
              {/* Order Card Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-3 border-b border-[#D4AF37]/20 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-base text-[#F3E5AB]">
                      {ord.orderNumber}
                    </span>
                    <SquareBadge variant={getStatusBadgeVariant(ord.status)} className="text-[10px] uppercase">
                      {ord.status}
                    </SquareBadge>
                    <SquareBadge variant="navy" className="text-[10px] uppercase">
                      {ord.paymentMethod}
                    </SquareBadge>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-[#D4AF37]" /> Placed on{' '}
                    {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-left sm:text-right">
                    <span className="block text-[10px] text-gray-400 uppercase">Grand Total</span>
                    <span className="font-serif font-black text-lg text-[#F3E5AB] gold-gradient-text">
                      {formatPrice(ord.grandTotal)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <SquareButton
                      variant="gold"
                      size="sm"
                      onClick={() => setSelectedOrder(ord)}
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" /> View Details
                    </SquareButton>
                    <SquareButton
                      variant="navy"
                      size="sm"
                      onClick={() => handleReorder(ord)}
                    >
                      <RefreshCw className="w-3.5 h-3.5 mr-1" /> Re-Order
                    </SquareButton>
                  </div>
                </div>
              </div>

              {/* Items Summary & Delivery Status */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center text-xs">
                {/* Thumbnails preview */}
                <div className="md:col-span-8 flex items-center gap-3 overflow-x-auto pb-1">
                  {ord.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-2 bg-[#0B132B] p-2 border border-[#D4AF37]/20 shrink-0"
                    >
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-10 h-10 object-cover border border-[#D4AF37]/30"
                      />
                      <div>
                        <p className="font-semibold text-[#F8F9FA] max-w-[140px] truncate">
                          {item.product.name}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          {item.weight} x {item.quantity} units
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delivery Info */}
                <div className="md:col-span-4 bg-[#0B132B] p-2.5 border border-[#D4AF37]/20 space-y-1">
                  <p className="text-[11px] font-semibold text-[#F3E5AB] flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-[#D4AF37]" /> Delivery Status
                  </p>
                  <p className="text-[11px] text-gray-300">
                    Destination: {ord.shippingAddress.city}, {ord.shippingAddress.state} ({ord.shippingAddress.pincode})
                  </p>
                  <p className="text-[10px] text-emerald-400 font-bold">
                    Est. Delivery: {ord.estimatedDelivery}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Details & Invoice Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onReorder={handleReorder}
        />
      )}
    </div>
  );
};
