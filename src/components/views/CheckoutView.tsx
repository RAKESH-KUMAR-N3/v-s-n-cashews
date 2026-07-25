'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin,
  CheckCircle2,
  Building2,
  CreditCard,
  QrCode,
  Truck,
  ShieldCheck,
  ChevronRight,
  Plus,
  Trash2,
  Edit2,
  FileText,
  AlertCircle,
  ArrowLeft,
  Lock,
  Printer,
  Sparkles,
  ShoppingBag,
  Info,
  Check,
  Phone,
  Mail,
  User,
  IndianRupee,
  BadgePercent,
  Receipt,
  Download,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useOrders } from '@/context/OrderContext';
import {
  Address,
  AddressLabel,
  BillingDetails,
  PaymentMethodType,
  Order,
  ShippingMethod,
} from '@/types';
import { formatPrice } from '@/lib/utils';
import { SAVED_ADDRESSES } from '@/data/savedAddresses';
import { SquareButton } from '@/components/ui/SquareButton';
import { SquareInput } from '@/components/ui/SquareInput';
import { SquareBadge } from '@/components/ui/SquareBadge';

interface CheckoutViewProps {
  onBackToCatalog: () => void;
  onOrderComplete?: (order: Order) => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  onBackToCatalog,
  onOrderComplete,
}) => {
  const {
    cartItems,
    subtotal,
    gstAmount,
    discountAmount,
    discountPercent,
    shippingMethod,
    shippingFee,
    grandTotal,
    setShippingMethod,
    couponCode,
    userMode,
    userProfile,
    clearCart,
  } = useCart();
  const { addOrder } = useOrders();

  // Address Book State
  const [savedAddresses, setSavedAddresses] = useState<Address[]>(SAVED_ADDRESSES);
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    SAVED_ADDRESSES[0]?.id || ''
  );
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);

  // Form State for Shipping Address
  const [shippingForm, setShippingForm] = useState<Omit<Address, 'id'>>({
    label: 'Home',
    fullName: userProfile?.name || 'Rakesh Kumar',
    phone: '9845012345',
    email: userProfile?.email || 'nrakeshkumar36@gmail.com',
    street: 'Flat 402, Sovereign Residency, 4th Main Road, Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
    landmark: 'Near 100 Feet Road Signal',
    isDefault: true,
  });

  // Billing Address State
  const [billingForm, setBillingForm] = useState<BillingDetails>({
    sameAsShipping: true,
    fullName: 'Rakesh Kumar',
    phone: '9845012345',
    email: 'nrakeshkumar36@gmail.com',
    street: 'Flat 402, Sovereign Residency, 4th Main Road, Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
    companyName: '',
    gstin: '',
  });

  // GST Invoice Request State
  const [needsGstInvoice, setNeedsGstInvoice] = useState(false);
  const [gstinInput, setGstinInput] = useState('');
  const [companyNameInput, setCompanyNameInput] = useState('');

  // Payment Selection State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('UPI');
  const [upiVpa, setUpiVpa] = useState('vsncashews@upi');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // Form Errors State
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Checkout Status State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Get active shipping address object
  const activeShippingAddress: Address =
    savedAddresses.find((a) => a.id === selectedAddressId) || {
      id: 'custom-shipping',
      ...shippingForm,
    };

  // COD Fee logic (₹50 extra handling fee if COD selected)
  const codFee = paymentMethod === 'COD' ? 50 : 0;
  const finalGrandTotal = grandTotal + codFee;

  // Form Validation Handler
  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};

    // Validate active shipping address
    const currentAddr = activeShippingAddress;

    if (!currentAddr.fullName || currentAddr.fullName.trim().length < 2) {
      errs.fullName = 'Full Name is required (at least 2 characters)';
    }

    if (!currentAddr.phone || !/^[6-9]\d{9}$/.test(currentAddr.phone.replace(/\D/g, ''))) {
      errs.phone = 'Enter a valid 10-digit mobile number';
    }

    if (!currentAddr.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentAddr.email)) {
      errs.email = 'Enter a valid email address for order receipt';
    }

    if (!currentAddr.street || currentAddr.street.trim().length < 5) {
      errs.street = 'Complete street address is required';
    }

    if (!currentAddr.city || currentAddr.city.trim().length < 2) {
      errs.city = 'City name is required';
    }

    if (!currentAddr.state || currentAddr.state.trim().length < 2) {
      errs.state = 'State name is required';
    }

    if (!currentAddr.pincode || !/^\d{6}$/.test(currentAddr.pincode.trim())) {
      errs.pincode = 'Enter a valid 6-digit Indian PIN code';
    }

    // Validate Billing if not same as shipping
    if (!billingForm.sameAsShipping) {
      if (!billingForm.fullName || billingForm.fullName.trim().length < 2) {
        errs.billingFullName = 'Billing name is required';
      }
      if (!billingForm.street || billingForm.street.trim().length < 5) {
        errs.billingStreet = 'Billing street address is required';
      }
      if (!billingForm.pincode || !/^\d{6}$/.test(billingForm.pincode.trim())) {
        errs.billingPincode = 'Enter a valid 6-digit PIN code';
      }
    }

    // Validate GSTIN if requested
    if (needsGstInvoice) {
      const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
      if (!gstinInput || !gstinRegex.test(gstinInput.trim().toUpperCase())) {
        errs.gstin = 'Enter a valid 15-character Indian GSTIN (e.g. 29AAAAA0000A1Z5)';
      }
      if (!companyNameInput || companyNameInput.trim().length < 2) {
        errs.companyName = 'Company name is required for tax invoice';
      }
    }

    // Validate Payment specific inputs
    if (paymentMethod === 'CARD') {
      const cleanNum = cardDetails.number.replace(/\s/g, '');
      if (!/^\d{16}$/.test(cleanNum)) {
        errs.cardNumber = 'Enter a valid 16-digit card number';
      }
      if (!cardDetails.name) {
        errs.cardName = 'Cardholder name is required';
      }
      if (!/^\d{2}\/\d{2}$/.test(cardDetails.expiry)) {
        errs.cardExpiry = 'Expiry format MM/YY required';
      }
      if (!/^\d{3,4}$/.test(cardDetails.cvv)) {
        errs.cardCvv = 'Enter a 3 or 4-digit CVV';
      }
    } else if (paymentMethod === 'UPI') {
      if (!upiVpa || !upiVpa.includes('@')) {
        errs.upiVpa = 'Enter a valid UPI ID (e.g. name@upi or name@okaxis)';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Add new address to address book
  const handleAddNewAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingForm.fullName || !shippingForm.phone || !shippingForm.street || !shippingForm.pincode) {
      alert('Please fill in all required shipping address fields');
      return;
    }

    const newId = `addr-${Date.now()}`;
    const newAddr: Address = {
      id: newId,
      ...shippingForm,
    };

    setSavedAddresses((prev) => [newAddr, ...prev]);
    setSelectedAddressId(newId);
    setIsAddingNewAddress(false);
  };

  // Execute Order Creation
  const handlePlaceOrder = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    if (!validateForm()) {
      window.scrollTo({ top: 100, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    // Simulate backend payment gateway handoff & Mangalore estate dispatch registration
    setTimeout(() => {
      const orderNum = `VSN-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      const estDate = new Date();
      estDate.setDate(estDate.getDate() + (shippingMethod === 'EXPRESS_AIR' ? 2 : 4));

      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber: orderNum,
        items: [...cartItems],
        subtotal,
        gstAmount,
        discountAmount,
        shippingFee,
        codFee,
        grandTotal: finalGrandTotal,
        shippingMethod,
        paymentMethod,
        paymentDetails: {
          upiId: paymentMethod === 'UPI' ? upiVpa : undefined,
          cardLast4: paymentMethod === 'CARD' ? cardDetails.number.slice(-4) : undefined,
          bankName: paymentMethod === 'NETBANKING' ? selectedBank : undefined,
        },
        shippingAddress: activeShippingAddress,
        billingAddress: {
          ...billingForm,
          companyName: companyNameInput,
          gstin: gstinInput,
        },
        gstin: needsGstInvoice ? gstinInput : undefined,
        companyName: needsGstInvoice ? companyNameInput : undefined,
        status: 'CONFIRMED',
        paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PAID',
        createdAt: new Date().toISOString(),
        estimatedDelivery: estDate.toLocaleDateString('en-IN', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
      };

      addOrder(newOrder);
      setCompletedOrder(newOrder);
      setIsSubmitting(false);
      clearCart();

      if (onOrderComplete) {
        onOrderComplete(newOrder);
      }
    }, 1800);
  };

  // Printable Tax Invoice
  const handlePrintInvoice = () => {
    window.print();
  };

  // If order complete, display Sovereign Order Confirmation Screen
  if (completedOrder) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 animate-fade-in text-[#F8F9FA]">
        {/* Header Badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border-2 border-[#D4AF37] bg-[#1C2541] text-[#D4AF37] mb-3 shadow-[0_0_30px_rgba(212,175,55,0.3)]">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="font-serif font-black text-2xl sm:text-3xl text-[#F3E5AB]">
            Sovereign Order Placed & Confirmed
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-lg mx-auto">
            Order Reference:{' '}
            <span className="font-mono text-[#D4AF37] font-bold text-base">
              {completedOrder.orderNumber}
            </span>
          </p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <SquareBadge variant="gold" className="text-xs">
              Direct Mangalore Orchard Dispatch
            </SquareBadge>
            <SquareBadge variant="success" className="text-xs">
              {completedOrder.paymentStatus === 'PAID' ? 'Payment Verified ✓' : 'Pay on Delivery'}
            </SquareBadge>
          </div>
        </div>

        {/* Invoice Card Container */}
        <div id="printable-tax-invoice" className="bg-[#1C2541]/90 border-2 border-[#D4AF37] p-6 sm:p-8 space-y-6 shadow-2xl relative">
          {/* Company Banner */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-[#D4AF37]/40 gap-4">
            <div>
              <h2 className="font-serif font-bold text-xl text-[#F3E5AB] tracking-wider">
                V S N CASHEWS
              </h2>
              <p className="text-xs text-gray-300">
                Sovereign Mangalore Cashews & Gourmet Dry Fruits
              </p>
              <p className="text-[11px] text-gray-400 mt-1">
                FSSAI Lic. No: 11218333000123 • GSTIN: 29AAAAA0000A1Z5
              </p>
              <p className="text-[10px] text-gray-400">
                Baikampady Industrial Estate, Mangalore, Karnataka 575011
              </p>
            </div>
            <div className="text-left sm:text-right border-l-2 sm:border-l-0 sm:border-r-2 border-[#D4AF37] pl-3 sm:pl-0 sm:pr-3">
              <span className="text-xs font-mono text-[#D4AF37] font-semibold block uppercase">
                TAX INVOICE
              </span>
              <span className="text-xs text-gray-300">Date: {new Date(completedOrder.createdAt).toLocaleDateString()}</span>
              <span className="block text-xs text-emerald-400 font-bold mt-1">
                Est. Delivery: {completedOrder.estimatedDelivery}
              </span>
            </div>
          </div>

          {/* Billing & Shipping Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs border-b border-[#D4AF37]/30 pb-6">
            <div className="space-y-1 bg-[#0B132B] p-3 border border-[#D4AF37]/30">
              <h4 className="font-serif font-bold text-[#F3E5AB] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" /> Shipping Destination
              </h4>
              <p className="font-bold text-[#F8F9FA] text-sm">{completedOrder.shippingAddress.fullName}</p>
              <p className="text-gray-300">{completedOrder.shippingAddress.street}</p>
              <p className="text-gray-300">
                {completedOrder.shippingAddress.city}, {completedOrder.shippingAddress.state} -{' '}
                <strong className="text-[#D4AF37]">{completedOrder.shippingAddress.pincode}</strong>
              </p>
              <p className="text-gray-400">Phone: {completedOrder.shippingAddress.phone}</p>
              <p className="text-gray-400">Email: {completedOrder.shippingAddress.email}</p>
            </div>

            <div className="space-y-1 bg-[#0B132B] p-3 border border-[#D4AF37]/30">
              <h4 className="font-serif font-bold text-[#F3E5AB] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#D4AF37]" /> Billing & Tax Details
              </h4>
              {completedOrder.companyName && (
                <p className="font-bold text-[#F3E5AB]">Company: {completedOrder.companyName}</p>
              )}
              {completedOrder.gstin && (
                <p className="font-mono text-emerald-400 font-semibold">
                  Buyer GSTIN: {completedOrder.gstin}
                </p>
              )}
              <p className="text-gray-300 font-medium">
                {completedOrder.billingAddress.sameAsShipping
                  ? 'Same as Shipping Address'
                  : completedOrder.billingAddress.fullName}
              </p>
              <p className="text-gray-400 mt-2">
                Payment Method: <span className="font-bold text-[#D4AF37] uppercase">{completedOrder.paymentMethod}</span>
              </p>
              <p className="text-gray-400">
                Shipping Class:{' '}
                <span className="font-bold text-[#F8F9FA]">
                  {completedOrder.shippingMethod === 'EXPRESS_AIR' ? 'Express Priority Air' : 'Standard Delivery'}
                </span>
              </p>
            </div>
          </div>

          {/* Itemized Order Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#D4AF37] text-[#D4AF37] font-mono uppercase">
                  <th className="py-2 px-1">Item Description</th>
                  <th className="py-2 px-1">Weight</th>
                  <th className="py-2 px-1 text-center">HSN Code</th>
                  <th className="py-2 px-1 text-center">Qty</th>
                  <th className="py-2 px-1 text-right">Unit Price</th>
                  <th className="py-2 px-1 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D4AF37]/20">
                {completedOrder.items.map((item) => (
                  <tr key={item.id} className="text-gray-200">
                    <td className="py-2.5 px-1 font-medium text-[#F8F9FA]">
                      {item.product.name}
                      <span className="block text-[10px] text-gray-400 font-mono">
                        Grade: {item.product.grade}
                      </span>
                    </td>
                    <td className="py-2.5 px-1">{item.weight}</td>
                    <td className="py-2.5 px-1 text-center font-mono text-[10px]">08013100</td>
                    <td className="py-2.5 px-1 text-center font-bold">{item.quantity}</td>
                    <td className="py-2.5 px-1 text-right">{formatPrice(item.price)}</td>
                    <td className="py-2.5 px-1 text-right font-bold text-[#F3E5AB]">
                      {formatPrice(item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tax Breakdown & Totals */}
          <div className="flex flex-col sm:flex-row justify-between items-start pt-4 border-t border-[#D4AF37]/40 gap-4">
            <div className="text-[11px] text-gray-400 max-w-xs space-y-1 bg-[#0B132B] p-3 border border-[#D4AF37]/20">
              <p className="font-bold text-[#F3E5AB] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" /> Mangalore Freshness Assurance
              </p>
              <p>
                Each pouch is vacuum-sealed with food-grade nitrogen flush to guarantee fresh orchard taste. Keep in a cool, dry place.
              </p>
            </div>

            <div className="w-full sm:w-64 text-xs space-y-1.5 text-gray-300">
              <div className="flex justify-between">
                <span>Subtotal (Net)</span>
                <span>{formatPrice(completedOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>CGST (2.5%)</span>
                <span>{formatPrice(Math.round(completedOrder.gstAmount / 2))}</span>
              </div>
              <div className="flex justify-between">
                <span>SGST (2.5%)</span>
                <span>{formatPrice(Math.round(completedOrder.gstAmount / 2))}</span>
              </div>
              {completedOrder.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Discount</span>
                  <span>-{formatPrice(completedOrder.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping ({completedOrder.shippingMethod === 'EXPRESS_AIR' ? 'Express' : 'Standard'})</span>
                <span>{completedOrder.shippingFee === 0 ? 'FREE' : formatPrice(completedOrder.shippingFee)}</span>
              </div>
              {completedOrder.codFee > 0 && (
                <div className="flex justify-between text-amber-400">
                  <span>Pay on Delivery Charge</span>
                  <span>+{formatPrice(completedOrder.codFee)}</span>
                </div>
              )}
              <div className="flex justify-between items-baseline pt-2 border-t border-[#D4AF37] font-serif font-black text-sm text-[#F3E5AB]">
                <span>Total Paid</span>
                <span className="text-xl gold-gradient-text">
                  {formatPrice(completedOrder.grandTotal)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
          <SquareButton variant="gold" onClick={handlePrintInvoice}>
            <Printer className="w-4 h-4 mr-1.5" /> Print / Download Tax Invoice
          </SquareButton>

          <SquareButton variant="navy" onClick={onBackToCatalog}>
            <ShoppingBag className="w-4 h-4 mr-1.5" /> Continue Shopping
          </SquareButton>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-10 text-[#F8F9FA] animate-fade-in">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#D4AF37]/30">
        <button
          onClick={onBackToCatalog}
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-gray-400 hover:text-[#D4AF37] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Products Catalog
        </button>

        <div className="flex items-center gap-2 text-xs font-serif text-[#F3E5AB]">
          <Lock className="w-3.5 h-3.5 text-[#D4AF37]" /> 256-Bit SSL Encrypted Sovereign Checkout
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Checkout Forms */}
        <div className="lg:col-span-8 space-y-8">
          {/* SECTION 1: Shipping Address & Address Book */}
          <div className="bg-[#1C2541]/80 border border-[#D4AF37]/40 p-5 sm:p-6 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#D4AF37]/30">
              <h3 className="font-serif font-bold text-lg text-[#F3E5AB] flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#D4AF37]" />
                1. Shipping Address & Saved Address Book
              </h3>

              <button
                onClick={() => setIsAddingNewAddress(!isAddingNewAddress)}
                className="text-xs font-mono uppercase tracking-wider text-[#D4AF37] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                {isAddingNewAddress ? 'Cancel Add' : 'Add New Address'}
              </button>
            </div>

            {/* Saved Address Cards Grid */}
            {!isAddingNewAddress && (
              <div className="space-y-3">
                <p className="text-xs text-gray-300">
                  Select a delivery address from your saved address book or add a new location:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {savedAddresses.map((addr) => {
                    const isSelected = selectedAddressId === addr.id;
                    return (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={`p-3.5 border cursor-pointer transition-all relative ${
                          isSelected
                            ? 'border-[#D4AF37] bg-[#0B132B] shadow-[0_0_15px_rgba(212,175,55,0.15)]'
                            : 'border-gray-700 bg-[#0B132B]/50 hover:border-gray-500'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <SquareBadge
                            variant={isSelected ? 'gold' : 'navy'}
                            className="text-[10px] uppercase font-bold px-2 py-0.5"
                          >
                            {addr.label}
                          </SquareBadge>
                          {isSelected && <Check className="w-4 h-4 text-[#D4AF37]" />}
                        </div>

                        <p className="font-serif font-bold text-sm text-[#F8F9FA]">{addr.fullName}</p>
                        <p className="text-xs text-gray-300 mt-1 line-clamp-2">{addr.street}</p>
                        <p className="text-xs text-gray-400">
                          {addr.city}, {addr.state} - <strong className="text-[#D4AF37]">{addr.pincode}</strong>
                        </p>
                        <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-[#D4AF37]" /> {addr.phone}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Add New Address Inline Form */}
            {isAddingNewAddress && (
              <form onSubmit={handleAddNewAddressSubmit} className="space-y-3 pt-2 bg-[#0B132B] p-4 border border-[#D4AF37]/30">
                <h4 className="text-xs font-serif font-bold text-[#F3E5AB] uppercase">
                  Add New Delivery Location
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <SquareInput
                    label="Full Name"
                    value={shippingForm.fullName}
                    onChange={(e) => setShippingForm({ ...shippingForm, fullName: e.target.value })}
                    error={errors.fullName}
                    icon={<User className="w-3.5 h-3.5" />}
                  />

                  <SquareInput
                    label="10-Digit Mobile Number"
                    value={shippingForm.phone}
                    onChange={(e) => setShippingForm({ ...shippingForm, phone: e.target.value })}
                    error={errors.phone}
                    icon={<Phone className="w-3.5 h-3.5" />}
                  />

                  <SquareInput
                    label="Email Address (for Order Invoice)"
                    type="email"
                    value={shippingForm.email}
                    onChange={(e) => setShippingForm({ ...shippingForm, email: e.target.value })}
                    error={errors.email}
                    icon={<Mail className="w-3.5 h-3.5" />}
                  />

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Address Type / Label
                    </label>
                    <select
                      value={shippingForm.label}
                      onChange={(e) =>
                        setShippingForm({ ...shippingForm, label: e.target.value as AddressLabel })
                      }
                      className="w-full bg-[#0B132B] border border-gray-700 focus:border-[#D4AF37] text-xs text-[#F8F9FA] p-2 focus:outline-none"
                    >
                      <option value="Home">Home</option>
                      <option value="Office">Office / Corporate</option>
                      <option value="Estate">Estate Plantation</option>
                      <option value="Gifting">Gifting Recipient</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <SquareInput
                  label="Street Address / House No. / Building"
                  value={shippingForm.street}
                  onChange={(e) => setShippingForm({ ...shippingForm, street: e.target.value })}
                  error={errors.street}
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <SquareInput
                    label="Landmark (Optional)"
                    value={shippingForm.landmark || ''}
                    onChange={(e) => setShippingForm({ ...shippingForm, landmark: e.target.value })}
                  />

                  <SquareInput
                    label="City / Town"
                    value={shippingForm.city}
                    onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                    error={errors.city}
                  />

                  <SquareInput
                    label="State"
                    value={shippingForm.state}
                    onChange={(e) => setShippingForm({ ...shippingForm, state: e.target.value })}
                    error={errors.state}
                  />
                </div>

                <SquareInput
                  label="6-Digit Indian Pincode"
                  value={shippingForm.pincode}
                  onChange={(e) => setShippingForm({ ...shippingForm, pincode: e.target.value })}
                  error={errors.pincode}
                />

                <div className="pt-2 flex gap-2">
                  <SquareButton type="submit" variant="gold" size="sm">
                    Save Address & Deliver Here
                  </SquareButton>
                  <SquareButton
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAddingNewAddress(false)}
                  >
                    Cancel
                  </SquareButton>
                </div>
              </form>
            )}
          </div>

          {/* SECTION 2: Billing & GSTIN Tax Credit */}
          <div className="bg-[#1C2541]/80 border border-[#D4AF37]/40 p-5 sm:p-6 shadow-lg space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#F3E5AB] flex items-center gap-2 pb-3 border-b border-[#D4AF37]/30">
              <FileText className="w-5 h-5 text-[#D4AF37]" />
              2. Billing Address & GSTIN Tax Invoice
            </h3>

            {/* Checkbox: Same as Shipping */}
            <label className="flex items-center gap-2 text-xs text-gray-200 cursor-pointer">
              <input
                type="checkbox"
                checked={billingForm.sameAsShipping}
                onChange={(e) =>
                  setBillingForm({ ...billingForm, sameAsShipping: e.target.checked })
                }
                className="accent-[#D4AF37] w-4 h-4"
              />
              <span>Billing address is same as selected shipping address</span>
            </label>

            {/* Custom Billing Address Form if unchecked */}
            {!billingForm.sameAsShipping && (
              <div className="space-y-3 pt-2 bg-[#0B132B] p-4 border border-[#D4AF37]/30">
                <h4 className="text-xs font-serif font-bold text-[#F3E5AB]">
                  Enter Custom Billing Address
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <SquareInput
                    label="Billing Full Name"
                    value={billingForm.fullName}
                    onChange={(e) => setBillingForm({ ...billingForm, fullName: e.target.value })}
                    error={errors.billingFullName}
                  />
                  <SquareInput
                    label="Phone Number"
                    value={billingForm.phone}
                    onChange={(e) => setBillingForm({ ...billingForm, phone: e.target.value })}
                  />
                </div>
                <SquareInput
                  label="Billing Street Address"
                  value={billingForm.street}
                  onChange={(e) => setBillingForm({ ...billingForm, street: e.target.value })}
                  error={errors.billingStreet}
                />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <SquareInput
                    label="City"
                    value={billingForm.city}
                    onChange={(e) => setBillingForm({ ...billingForm, city: e.target.value })}
                  />
                  <SquareInput
                    label="State"
                    value={billingForm.state}
                    onChange={(e) => setBillingForm({ ...billingForm, state: e.target.value })}
                  />
                  <SquareInput
                    label="Pincode"
                    value={billingForm.pincode}
                    onChange={(e) => setBillingForm({ ...billingForm, pincode: e.target.value })}
                    error={errors.billingPincode}
                  />
                </div>
              </div>
            )}

            {/* B2B / Wholesale GSTIN Input Section */}
            <div className="pt-2 border-t border-[#D4AF37]/20">
              <label className="flex items-center gap-2 text-xs text-[#F3E5AB] font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={needsGstInvoice}
                  onChange={(e) => setNeedsGstInvoice(e.target.checked)}
                  className="accent-[#D4AF37] w-4 h-4"
                />
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Need a GST Tax Invoice for Business / Wholesale Tax Credit?
                </span>
              </label>

              {needsGstInvoice && (
                <div className="mt-3 p-3 bg-[#0B132B] border border-[#D4AF37]/40 space-y-3">
                  <p className="text-[11px] text-gray-300">
                    Enter your registered GSTIN to claim 5% input tax credit (ITC) on your corporate or wholesale cashew purchases.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <SquareInput
                      label="Company / Firm Name"
                      placeholder="e.g. V S N Enterprises Pvt Ltd"
                      value={companyNameInput}
                      onChange={(e) => setCompanyNameInput(e.target.value)}
                      error={errors.companyName}
                      icon={<Building2 className="w-3.5 h-3.5" />}
                    />

                    <SquareInput
                      label="GSTIN Number (15 Characters)"
                      placeholder="e.g. 29AAAAA0000A1Z5"
                      value={gstinInput}
                      onChange={(e) => setGstinInput(e.target.value.toUpperCase())}
                      error={errors.gstin}
                      icon={<Receipt className="w-3.5 h-3.5" />}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 3: Payment Selection & Gateway Method */}
          <div className="bg-[#1C2541]/80 border border-[#D4AF37]/40 p-5 sm:p-6 shadow-lg space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#F3E5AB] flex items-center gap-2 pb-3 border-b border-[#D4AF37]/30">
              <CreditCard className="w-5 h-5 text-[#D4AF37]" />
              3. Payment Selection & Secure Gateway
            </h3>

            {/* Payment Method Selector Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { type: 'UPI', label: 'UPI / QR', icon: <QrCode className="w-4 h-4" /> },
                { type: 'CARD', label: 'Cards', icon: <CreditCard className="w-4 h-4" /> },
                { type: 'NETBANKING', label: 'NetBanking', icon: <Building2 className="w-4 h-4" /> },
                { type: 'COD', label: 'Pay on Delivery', icon: <Truck className="w-4 h-4" /> },
                { type: 'CORPORATE_NEFT', label: 'NEFT / RTGS', icon: <FileText className="w-4 h-4" /> },
              ].map((m) => (
                <button
                  key={m.type}
                  type="button"
                  onClick={() => setPaymentMethod(m.type as PaymentMethodType)}
                  className={`p-2.5 border text-center flex flex-col items-center justify-center gap-1 transition-all ${
                    paymentMethod === m.type
                      ? 'border-[#D4AF37] bg-[#0B132B] text-[#F3E5AB] shadow-[0_0_10px_rgba(212,175,55,0.2)]'
                      : 'border-gray-700 bg-[#0B132B]/40 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  <span className="text-[#D4AF37]">{m.icon}</span>
                  <span className="text-[11px] font-bold uppercase tracking-wider">{m.label}</span>
                </button>
              ))}
            </div>

            {/* Dynamic Payment Method View */}
            <div className="p-4 bg-[#0B132B] border border-[#D4AF37]/30">
              {paymentMethod === 'UPI' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#F3E5AB] font-semibold">
                    <span>Instant UPI Payment (Zero Gateway Fee)</span>
                    <span className="text-emerald-400">GPay, PhonePe, Paytm, BHIM</span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#1C2541]/50 p-3 border border-[#D4AF37]/20">
                    <div className="w-24 h-24 bg-white p-2 border border-[#D4AF37] flex flex-col items-center justify-center shrink-0">
                      <QrCode className="w-16 h-16 text-[#0B132B]" />
                      <span className="text-[8px] font-bold text-gray-800 uppercase mt-0.5">VSN CASHEWS</span>
                    </div>

                    <div className="space-y-2 flex-1 w-full">
                      <p className="text-xs text-gray-300">
                        Scan the QR code with your UPI app or enter your Virtual Payment Address (VPA):
                      </p>
                      <SquareInput
                        label="UPI VPA / ID"
                        placeholder="e.g. rakesh@okaxis or vsncashews@upi"
                        value={upiVpa}
                        onChange={(e) => setUpiVpa(e.target.value)}
                        error={errors.upiVpa}
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'CARD' && (
                <div className="space-y-3">
                  <p className="text-xs text-gray-300">
                    Pay securely using Visa, MasterCard, RuPay, or American Express:
                  </p>

                  <SquareInput
                    label="Card Number (16 Digits)"
                    placeholder="4123 4567 8901 2345"
                    value={cardDetails.number}
                    onChange={(e) =>
                      setCardDetails({
                        ...cardDetails,
                        number: e.target.value
                          .replace(/\D/g, '')
                          .replace(/(.{4})/g, '$1 ')
                          .trim()
                          .slice(0, 19),
                      })
                    }
                    error={errors.cardNumber}
                    icon={<CreditCard className="w-3.5 h-3.5" />}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <SquareInput
                        label="Cardholder Name"
                        placeholder="Name as printed on card"
                        value={cardDetails.name}
                        onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                        error={errors.cardName}
                      />
                    </div>

                    <SquareInput
                      label="Expiry (MM/YY)"
                      placeholder="08/28"
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                      error={errors.cardExpiry}
                    />

                    <SquareInput
                      label="CVV Code"
                      placeholder="123"
                      type="password"
                      maxLength={4}
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                      error={errors.cardCvv}
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'NETBANKING' && (
                <div className="space-y-3">
                  <p className="text-xs text-gray-300">Choose your bank account for secure NetBanking routing:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank'].map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setSelectedBank(b)}
                        className={`p-2 border text-xs font-semibold text-center transition-colors ${
                          selectedBank === b
                            ? 'border-[#D4AF37] bg-[#1C2541] text-[#F3E5AB]'
                            : 'border-gray-700 bg-[#0B132B] text-gray-400 hover:border-gray-500'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {paymentMethod === 'COD' && (
                <div className="p-3 bg-amber-950/30 border border-amber-500/40 text-xs text-amber-200 space-y-1">
                  <p className="font-bold flex items-center gap-1.5 text-amber-300">
                    <Truck className="w-4 h-4" /> Pay on Delivery Verification
                  </p>
                  <p>
                    Cash on Delivery orders are subject to OTP verification via mobile SMS prior to estate dispatch. A standard handling fee of <strong>₹50</strong> applies.
                  </p>
                </div>
              )}

              {paymentMethod === 'CORPORATE_NEFT' && (
                <div className="p-3 bg-[#1C2541] border border-[#D4AF37]/30 text-xs text-gray-200 space-y-1 font-mono">
                  <p className="font-bold text-[#F3E5AB]">Bank Transfer (NEFT / RTGS) Account:</p>
                  <p>Account Name: V S N CASHEWS PRIVATE LIMITED</p>
                  <p>Bank Name: HDFC Bank, Mangalore Main Branch</p>
                  <p>A/C Number: 50200088991234</p>
                  <p>IFSC Code: HDFC0000123</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Execution Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#1C2541]/90 border-2 border-[#D4AF37] p-5 shadow-2xl sticky top-24 space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#F3E5AB] pb-3 border-b border-[#D4AF37]/30 flex items-center justify-between">
              <span>Order Summary</span>
              <SquareBadge variant="gold" className="text-xs">
                {cartItems.length} Items
              </SquareBadge>
            </h3>

            {/* Itemized Thumbnails */}
            <div className="max-h-60 overflow-y-auto space-y-2.5 pr-1 border-b border-[#D4AF37]/20 pb-3">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-2.5 text-xs">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-12 h-12 object-cover border border-[#D4AF37]/30 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-serif font-bold text-[#F8F9FA] truncate">{item.product.name}</p>
                    <p className="text-[10px] text-gray-400">
                      {item.weight} x {item.quantity} units
                    </p>
                  </div>
                  <span className="font-bold font-serif text-[#F3E5AB] shrink-0">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Shipping Class Selection */}
            <div className="space-y-2 pt-1">
              <label className="block text-xs font-semibold text-gray-300">
                Choose Shipping Class:
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setShippingMethod('STANDARD')}
                  className={`p-2 border text-left transition-all ${
                    shippingMethod === 'STANDARD'
                      ? 'border-[#D4AF37] bg-[#0B132B] text-[#F3E5AB]'
                      : 'border-gray-700 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  <p className="font-bold text-[11px]">Standard Delivery</p>
                  <p className="text-[10px] text-gray-400">
                    {subtotal >= 1499 ? 'FREE' : '₹99'} (3-5 Days)
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setShippingMethod('EXPRESS_AIR')}
                  className={`p-2 border text-left transition-all ${
                    shippingMethod === 'EXPRESS_AIR'
                      ? 'border-[#D4AF37] bg-[#0B132B] text-[#F3E5AB]'
                      : 'border-gray-700 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  <p className="font-bold text-[11px]">Express Air</p>
                  <p className="text-[10px] text-gray-400">
                    {subtotal >= 2499 ? 'FREE' : '₹199'} (24-48 Hrs)
                  </p>
                </button>
              </div>
            </div>

            {/* Financial Calculations */}
            <div className="space-y-2 text-xs text-gray-300 pt-3 border-t border-[#D4AF37]/20">
              <div className="flex justify-between">
                <span>Items Subtotal (Net)</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              <div className="flex justify-between text-gray-300">
                <span>GST Tax (5% Included)</span>
                <span>+{formatPrice(gstAmount)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>
                    Discount ({discountPercent}%)
                    {couponCode && ` [${couponCode}]`}
                  </span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>
                  Shipping ({shippingMethod === 'EXPRESS_AIR' ? 'Express Air' : 'Standard'})
                </span>
                <span className={shippingFee === 0 ? 'text-emerald-400 font-bold' : ''}>
                  {shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}
                </span>
              </div>

              {codFee > 0 && (
                <div className="flex justify-between text-amber-400">
                  <span>Pay on Delivery Charge</span>
                  <span>+{formatPrice(codFee)}</span>
                </div>
              )}

              <div className="flex justify-between items-baseline pt-3 border-t border-[#D4AF37] font-serif font-black text-base text-[#F3E5AB]">
                <span>Grand Total</span>
                <span className="text-2xl gold-gradient-text">{formatPrice(finalGrandTotal)}</span>
              </div>
            </div>

            {/* Order Execution Button */}
            <SquareButton
              variant="gold"
              size="lg"
              fullWidth
              isLoading={isSubmitting}
              onClick={handlePlaceOrder}
              className="mt-4"
            >
              Confirm & Pay Sovereign Order
            </SquareButton>

            <div className="text-[10px] text-gray-400 text-center space-y-1 pt-2">
              <p className="flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                100% Direct Estate Packaging Guarantee
              </p>
              <p>Razorpay 256-Bit Encrypted Payment Highway</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
