import React, { useState } from 'react';
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  Edit,
  Filter,
  DollarSign,
  Download,
  Calendar,
  Building2,
  MapPin,
  RefreshCcw,
  Sparkles,
  Printer,
  ChevronDown,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { Order } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useOrders } from '@/context/OrderContext';
import { SquareBadge } from '@/components/ui/SquareBadge';
import { SquareButton } from '@/components/ui/SquareButton';
import { SquareInput } from '@/components/ui/SquareInput';
import { OrderDetailsModal } from './OrderDetailsModal';

export const AdminOrderManagementView: React.FC = () => {
  const { orders, updateOrderStatus } = useOrders();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);

  // Stats Calculations
  const totalOrdersCount = orders.length;
  const pendingCount = orders.filter((o) => o.status === 'PENDING').length;
  const confirmedCount = orders.filter((o) => o.status === 'CONFIRMED').length;
  const packedCount = orders.filter((o) => o.status === 'PACKED').length;
  const shippedCount = orders.filter((o) => o.status === 'SHIPPED').length;
  const deliveredCount = orders.filter((o) => o.status === 'DELIVERED').length;
  const cancelledCount = orders.filter((o) => o.status === 'CANCELLED').length;

  const totalRevenue = orders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + o.grandTotal, 0);

  // Filter Orders
  const filteredOrders = orders.filter((ord) => {
    if (selectedStatusFilter !== 'ALL' && ord.status !== selectedStatusFilter) {
      return false;
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      const matchNum = ord.orderNumber.toLowerCase().includes(q);
      const matchEmail = ord.shippingAddress.email.toLowerCase().includes(q);
      const matchName = ord.shippingAddress.fullName.toLowerCase().includes(q);
      const matchPhone = ord.shippingAddress.phone.includes(q);
      const matchCity = ord.shippingAddress.city.toLowerCase().includes(q);
      return matchNum || matchEmail || matchName || matchPhone || matchCity;
    }

    return true;
  });

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    updateOrderStatus(orderId, newStatus);
    setEditingOrderId(null);
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
    <div className="space-y-6 text-[#F8F9FA] animate-fade-in">
      {/* Top Banner Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="bg-[#1C2541] border border-[#D4AF37]/30 p-3 text-center">
          <span className="block text-[10px] text-gray-400 uppercase tracking-wider">Total Orders</span>
          <strong className="text-lg font-serif text-[#F3E5AB]">{totalOrdersCount}</strong>
        </div>

        <div className="bg-[#1C2541] border border-amber-500/30 p-3 text-center">
          <span className="block text-[10px] text-amber-400 uppercase tracking-wider">Pending</span>
          <strong className="text-lg font-serif text-amber-300">{pendingCount}</strong>
        </div>

        <div className="bg-[#1C2541] border border-[#D4AF37]/30 p-3 text-center">
          <span className="block text-[10px] text-[#D4AF37] uppercase tracking-wider">Confirmed</span>
          <strong className="text-lg font-serif text-[#F3E5AB]">{confirmedCount}</strong>
        </div>

        <div className="bg-[#1C2541] border border-cyan-500/30 p-3 text-center">
          <span className="block text-[10px] text-cyan-400 uppercase tracking-wider">Packed</span>
          <strong className="text-lg font-serif text-cyan-300">{packedCount}</strong>
        </div>

        <div className="bg-[#1C2541] border border-blue-500/30 p-3 text-center">
          <span className="block text-[10px] text-blue-400 uppercase tracking-wider">Shipped</span>
          <strong className="text-lg font-serif text-blue-300">{shippedCount}</strong>
        </div>

        <div className="bg-[#1C2541] border border-emerald-500/30 p-3 text-center">
          <span className="block text-[10px] text-emerald-400 uppercase tracking-wider">Delivered</span>
          <strong className="text-lg font-serif text-emerald-300">{deliveredCount}</strong>
        </div>

        <div className="bg-[#1C2541] border border-red-500/30 p-3 text-center col-span-2 sm:col-span-1">
          <span className="block text-[10px] text-red-400 uppercase tracking-wider">Gross Sales</span>
          <strong className="text-base font-serif text-[#F3E5AB] gold-gradient-text">
            {formatPrice(totalRevenue)}
          </strong>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-[#1C2541]/80 border border-[#D4AF37]/40 p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <SquareInput
              placeholder="Search order #, customer name, email, phone, city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4 text-[#D4AF37]" />}
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['ALL', 'PENDING', 'CONFIRMED', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatusFilter(st)}
                className={`py-2 px-3 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap border ${
                  selectedStatusFilter === st
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

      {/* Orders Table */}
      <div className="bg-[#1C2541]/90 border border-[#D4AF37]/40 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#0B132B] border-b border-[#D4AF37] text-[#D4AF37] font-mono uppercase">
                <th className="py-3 px-3">Order # & Date</th>
                <th className="py-3 px-3">Customer & Location</th>
                <th className="py-3 px-3">Items Purchased</th>
                <th className="py-3 px-3 text-right">Grand Total</th>
                <th className="py-3 px-3">Payment</th>
                <th className="py-3 px-3">Order Status (Update)</th>
                <th className="py-3 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D4AF37]/20">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">
                    No orders found matching the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#0B132B]/50 transition-colors">
                    {/* Order # & Date */}
                    <td className="py-3 px-3">
                      <span className="font-serif font-bold text-sm text-[#F3E5AB] block">
                        {ord.orderNumber}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono block">
                        {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </td>

                    {/* Customer Info */}
                    <td className="py-3 px-3 max-w-[180px]">
                      <span className="font-bold text-[#F8F9FA] block truncate">
                        {ord.shippingAddress.fullName}
                      </span>
                      <span className="text-[10px] text-gray-400 block truncate">
                        {ord.shippingAddress.city}, {ord.shippingAddress.state}
                      </span>
                      <span className="text-[10px] text-gray-400 block truncate font-mono">
                        {ord.shippingAddress.phone}
                      </span>
                    </td>

                    {/* Items */}
                    <td className="py-3 px-3 max-w-[200px]">
                      <span className="text-gray-300 font-medium block truncate">
                        {ord.items.map((i) => i.product.name).join(', ')}
                      </span>
                      <span className="text-[10px] text-gray-400 block">
                        {ord.items.length} item(s) • {ord.shippingMethod}
                      </span>
                    </td>

                    {/* Total */}
                    <td className="py-3 px-3 text-right">
                      <span className="font-serif font-bold text-[#F3E5AB]">
                        {formatPrice(ord.grandTotal)}
                      </span>
                    </td>

                    {/* Payment */}
                    <td className="py-3 px-3">
                      <span className="block font-mono text-[10px] uppercase text-[#D4AF37]">
                        {ord.paymentMethod}
                      </span>
                      <span
                        className={`text-[10px] font-bold ${
                          ord.paymentStatus === 'PAID' ? 'text-emerald-400' : 'text-amber-400'
                        }`}
                      >
                        {ord.paymentStatus}
                      </span>
                    </td>

                    {/* STATUS SELECTOR / QUICK UPDATER */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <select
                          value={ord.status}
                          onChange={(e) =>
                            handleStatusChange(ord.id, e.target.value as Order['status'])
                          }
                          className="bg-[#0B132B] text-[#F3E5AB] text-xs border border-[#D4AF37]/50 py-1.5 px-2 uppercase font-mono font-bold focus:outline-none focus:border-[#D4AF37] cursor-pointer"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="PACKED">PACKED</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-center">
                      <SquareButton
                        variant="gold"
                        size="sm"
                        onClick={() => setSelectedOrder(ord)}
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" /> View Invoice
                      </SquareButton>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details & Tax Invoice Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};
