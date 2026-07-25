import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Printer,
  ShoppingBag,
  MapPin,
  FileText,
  CreditCard,
  ShieldCheck,
  Building2,
  Receipt,
  Download,
  Calendar,
  Truck,
} from 'lucide-react';
import { Order } from '@/types';
import { formatPrice } from '@/lib/utils';
import { SquareBadge } from '@/components/ui/SquareBadge';
import { SquareButton } from '@/components/ui/SquareButton';
import { OrderTrackingTimeline } from './OrderTrackingTimeline';
import { useInvoice } from '@/context/InvoiceContext';
import { TaxInvoicePrintView } from '@/components/invoices/TaxInvoicePrintView';

interface OrderDetailsModalProps {
  order: Order | null;
  onClose: () => void;
  onReorder?: (order: Order) => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  onClose,
  onReorder,
}) => {
  const { generateInvoiceFromOrder } = useInvoice();
  const [showFormalInvoice, setShowFormalInvoice] = React.useState(false);

  if (!order) return null;

  const handlePrintFormalInvoice = () => {
    generateInvoiceFromOrder(order);
    setShowFormalInvoice(true);
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
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-4xl bg-[#0B132B] border-2 border-[#D4AF37] p-6 sm:p-8 text-[#F8F9FA] shadow-[0_0_50px_rgba(212,175,55,0.25)] my-8 max-h-[90vh] overflow-y-auto"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-[#D4AF37] border border-gray-700 hover:border-[#D4AF37] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-[#D4AF37]/30 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-black text-xl sm:text-2xl text-[#F3E5AB]">
                  Order #{order.orderNumber}
                </h2>
                <SquareBadge variant={getStatusBadgeVariant(order.status)} className="text-xs uppercase">
                  {order.status}
                </SquareBadge>
              </div>
              <p className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" /> Placed on{' '}
                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <SquareButton variant="gold" size="sm" onClick={handlePrintFormalInvoice}>
                <Printer className="w-3.5 h-3.5 mr-1" /> View Official GST Tax Invoice
              </SquareButton>
              {onReorder && (
                <SquareButton variant="navy" size="sm" onClick={() => onReorder(order)}>
                  <ShoppingBag className="w-3.5 h-3.5 mr-1" /> Buy Again
                </SquareButton>
              )}
            </div>
          </div>

          {/* SECTION 1: Tracking Timeline */}
          <div className="my-6">
            <h3 className="text-xs font-serif font-bold text-[#F3E5AB] uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[#D4AF37]" /> Live Dispatch & Package Tracking
            </h3>
            <OrderTrackingTimeline
              status={order.status}
              createdAt={order.createdAt}
              estimatedDelivery={order.estimatedDelivery}
            />
          </div>

          {/* Printable Invoice Container */}
          <div id="printable-tax-invoice" className="bg-[#1C2541]/90 border border-[#D4AF37]/40 p-5 space-y-5">
            {/* Seller Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-[#D4AF37]/30 gap-2">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#F3E5AB] tracking-wider">
                  V S N CASHEWS
                </h3>
                <p className="text-[11px] text-gray-300">
                  FSSAI Lic No. 11218333000123 • GSTIN: 29AAAAA0000A1Z5
                </p>
                <p className="text-[10px] text-gray-400">
                  Morampudi Junction, Rajahmundry, Andhra Pradesh 533107
                </p>
              </div>

              <div className="text-left sm:text-right text-xs">
                <span className="font-mono text-[#D4AF37] font-bold block uppercase">
                  TAX INVOICE
                </span>
                <span className="text-gray-300">
                  Payment Status:{' '}
                  <strong
                    className={
                      order.paymentStatus === 'PAID' ? 'text-emerald-400' : 'text-amber-400'
                    }
                  >
                    {order.paymentStatus}
                  </strong>
                </span>
              </div>
            </div>

            {/* Addresses Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-[#0B132B] border border-[#D4AF37]/30 space-y-1">
                <h4 className="font-serif font-bold text-[#F3E5AB] uppercase flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" /> Shipping Destination
                </h4>
                <p className="font-bold text-[#F8F9FA]">{order.shippingAddress.fullName}</p>
                <p className="text-gray-300">{order.shippingAddress.street}</p>
                <p className="text-gray-300">
                  {order.shippingAddress.city}, {order.shippingAddress.state} -{' '}
                  <strong className="text-[#D4AF37]">{order.shippingAddress.pincode}</strong>
                </p>
                <p className="text-gray-400">Phone: {order.shippingAddress.phone}</p>
                <p className="text-gray-400">Email: {order.shippingAddress.email}</p>
              </div>

              <div className="p-3 bg-[#0B132B] border border-[#D4AF37]/30 space-y-1">
                <h4 className="font-serif font-bold text-[#F3E5AB] uppercase flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-[#D4AF37]" /> Billing & Tax Info
                </h4>
                {order.companyName && (
                  <p className="font-bold text-[#F3E5AB]">Company: {order.companyName}</p>
                )}
                {order.gstin && (
                  <p className="font-mono text-emerald-400 font-bold">GSTIN: {order.gstin}</p>
                )}
                <p className="text-gray-300">
                  {order.billingAddress.sameAsShipping
                    ? 'Same as Shipping Address'
                    : order.billingAddress.fullName}
                </p>
                <p className="text-gray-400 mt-2">
                  Payment Method:{' '}
                  <strong className="text-[#D4AF37] uppercase">{order.paymentMethod}</strong>
                </p>
              </div>
            </div>

            {/* Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#D4AF37] text-[#D4AF37] font-mono uppercase">
                    <th className="py-2 px-1">Item Description</th>
                    <th className="py-2 px-1">Weight</th>
                    <th className="py-2 px-1 text-center">Qty</th>
                    <th className="py-2 px-1 text-right">Unit Price</th>
                    <th className="py-2 px-1 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D4AF37]/20">
                  {order.items.map((item) => (
                    <tr key={item.id} className="text-gray-200">
                      <td className="py-2 px-1 font-medium text-[#F8F9FA]">
                        {item.product.name}
                        <span className="block text-[10px] text-gray-400 font-mono">
                          Grade: {item.product.grade}
                        </span>
                      </td>
                      <td className="py-2 px-1">{item.weight}</td>
                      <td className="py-2 px-1 text-center font-bold">{item.quantity}</td>
                      <td className="py-2 px-1 text-right">{formatPrice(item.price)}</td>
                      <td className="py-2 px-1 text-right font-bold text-[#F3E5AB]">
                        {formatPrice(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Tax Totals Breakdown */}
            <div className="flex flex-col sm:flex-row justify-between items-start pt-3 border-t border-[#D4AF37]/40 gap-4">
              <div className="text-[11px] text-gray-400 max-w-xs space-y-1 bg-[#0B132B] p-2.5 border border-[#D4AF37]/20">
                <p className="font-bold text-[#F3E5AB] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" /> Freshness Lock
                </p>
                <p>
                  Handpacked and nitrogen flushed at Rajahmundry Orchards. Sealed for maximum crunch.
                </p>
              </div>

              <div className="w-full sm:w-60 text-xs space-y-1.5 text-gray-300">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (5% Included)</span>
                  <span>{formatPrice(order.gstAmount)}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount</span>
                    <span>-{formatPrice(order.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span>{order.shippingFee === 0 ? 'FREE' : formatPrice(order.shippingFee)}</span>
                </div>
                {order.codFee > 0 && (
                  <div className="flex justify-between text-amber-400">
                    <span>Pay on Delivery Fee</span>
                    <span>+{formatPrice(order.codFee)}</span>
                  </div>
                )}
                <div className="flex justify-between items-baseline pt-2 border-t border-[#D4AF37] font-serif font-black text-sm text-[#F3E5AB]">
                  <span>Grand Total</span>
                  <span className="text-lg gold-gradient-text">
                    {formatPrice(order.grandTotal)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {showFormalInvoice && (
        <TaxInvoicePrintView
          invoice={generateInvoiceFromOrder(order)}
          onClose={() => setShowFormalInvoice(false)}
        />
      )}
    </AnimatePresence>
  );
};
