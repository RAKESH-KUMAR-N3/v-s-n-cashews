'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  Building,
  Sparkles,
  MessageSquare,
  FileText,
  CreditCard,
  RefreshCw,
  ShieldCheck,
  Building2,
  PackageCheck
} from 'lucide-react';
import { SITE_CONFIG, ActiveView } from '@/config/site';
import { SquareBadge } from '@/components/ui/SquareBadge';
import { SquareButton } from '@/components/ui/SquareButton';
import { SquareInput } from '@/components/ui/SquareInput';
import { useNotification } from '@/context/NotificationContext';
import { useQuotes } from '@/context/QuoteContext';

interface ContactViewProps {
  onNavigate?: (view: ActiveView) => void;
}

export const ContactView: React.FC<ContactViewProps> = ({ onNavigate }) => {
  const { addNotification } = useNotification();
  const { requestQuote } = useQuotes();

  // Quotation Form State
  const [quoteData, setQuoteData] = useState({
    companyName: '',
    gstNumber: '',
    contactName: '',
    email: '',
    phone: '',
    cashewGrade: 'W-180 King (Jumbo)',
    quantityKg: 100,
    deliveryLocation: 'Rajahmundry, Andhra Pradesh',
    notes: '',
  });

  // Contact Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    inquiryType: 'RETAIL' as 'RETAIL' | 'WHOLESALE_BULK' | 'EXPORTS' | 'CUSTOM_GIFTING',
    message: '',
  });

  const [loadingQuote, setLoadingQuote] = useState(false);
  const [loadingContact, setLoadingContact] = useState(false);
  const [quoteSuccessMsg, setQuoteSuccessMsg] = useState<string | null>(null);
  const [contactSuccessMsg, setContactSuccessMsg] = useState<string | null>(null);

  // Handle B2B Quote Submit (FIRST)
  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingQuote(true);

    try {
      requestQuote({
        companyName: quoteData.companyName || 'B2B Wholesale Buyer',
        contactPerson: quoteData.contactName,
        email: quoteData.email || 'client@vsncashews.com',
        phone: quoteData.phone,
        gstin: quoteData.gstNumber,
        city: quoteData.deliveryLocation.split(',')[0] || 'Rajahmundry',
        state: 'Andhra Pradesh',
        pincode: '533107',
        items: [
          {
            productName: quoteData.cashewGrade,
            grade: quoteData.cashewGrade,
            requestedQtyKg: quoteData.quantityKg,
          },
        ],
        notes: quoteData.notes,
      });

      // Trigger Notification to Admin
      addNotification({
        recipient: 'ADMIN',
        title: `B2B Quote Request: ${quoteData.companyName || quoteData.contactName}`,
        message: `Requested ${quoteData.quantityKg}kg of ${quoteData.cashewGrade} for ${quoteData.deliveryLocation}`,
        type: 'quote',
        linkView: 'admin',
      });

      setQuoteSuccessMsg(
        `B2B Quotation Request submitted successfully! Generated Quote Reference: VSN-QT-${Date.now().toString().slice(-5)}. Our Rajahmundry Wholesale Desk will respond within 2 hours.`
      );
      setQuoteData({
        companyName: '',
        gstNumber: '',
        contactName: '',
        email: '',
        phone: '',
        cashewGrade: 'W-180 King (Jumbo)',
        quantityKg: 100,
        deliveryLocation: 'Rajahmundry, Andhra Pradesh',
        notes: '',
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingQuote(false);
    }
  };

  // Handle Contact Form Submit (NEXT)
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingContact(true);

    try {
      // Trigger notification for Admin
      addNotification({
        recipient: 'ADMIN',
        title: `New Inquiry: ${formData.fullName}`,
        message: `${formData.inquiryType} inquiry: "${formData.message.substring(0, 60)}..."`,
        type: 'enquiry',
        linkView: 'admin',
      });

      setContactSuccessMsg(
        `Thank you ${formData.fullName}! Your inquiry message has been submitted. Reference ID: VSN-INQ-${Date.now().toString().slice(-5)}`
      );
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        inquiryType: 'RETAIL',
        message: '',
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingContact(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12 text-[#F8F9FA] space-y-10"
    >
      {/* Page Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <SquareBadge variant="gold">Rajahmundry Estate Desk</SquareBadge>
        <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold text-[#F8F9FA]">
          Connect & Get Wholesale Quotation
        </h1>
        <p className="text-xs sm:text-sm text-gray-300">
          Direct factory pricing, custom volume quotations, and personal customer support straight from Rajahmundry, Andhra Pradesh.
        </p>
      </div>

      {/* ========================================================================= */}
      {/* 1. FIRST SECTION: GET B2B WHOLESALE QUOTATION FORM */}
      {/* ========================================================================= */}
      <div id="quotation-form-section" className="border-2 border-[#D4AF37] bg-[#0B132B] p-5 sm:p-8 space-y-6 shadow-2xl relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#D4AF37]/30 pb-4 gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#1C2541] border border-[#D4AF37] text-[#D4AF37]">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] block">
                STEP 1 • B2B PROCUREMENT
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#F3E5AB]">
                1. Request B2B Wholesale Quotation
              </h2>
            </div>
          </div>
          <SquareBadge variant="gold" className="self-start sm:self-center text-xs">
            Direct Factory Rates
          </SquareBadge>
        </div>

        {quoteSuccessMsg && (
          <div className="p-4 border border-emerald-500/50 bg-emerald-950/50 text-emerald-300 text-xs flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Quotation Request Submitted!</p>
              <p className="mt-1 text-gray-200">{quoteSuccessMsg}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleQuoteSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] block mb-1">
                Company / Firm Name
              </label>
              <SquareInput
                placeholder="e.g., Godavari Sweets & Bakery"
                value={quoteData.companyName}
                onChange={(e) => setQuoteData({ ...quoteData, companyName: e.target.value })}
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] block mb-1">
                GSTIN Number (Optional)
              </label>
              <SquareInput
                placeholder="37AAAAA0000A1Z5"
                value={quoteData.gstNumber}
                onChange={(e) => setQuoteData({ ...quoteData, gstNumber: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] block mb-1">
                Contact Person Name *
              </label>
              <SquareInput
                required
                placeholder="e.g., Rajesh Rao"
                value={quoteData.contactName}
                onChange={(e) => setQuoteData({ ...quoteData, contactName: e.target.value })}
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] block mb-1">
                Mobile Phone / WhatsApp *
              </label>
              <SquareInput
                required
                type="tel"
                placeholder="+91 98450 12345"
                value={quoteData.phone}
                onChange={(e) => setQuoteData({ ...quoteData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] block mb-1">
                Cashew Grade / Type *
              </label>
              <select
                value={quoteData.cashewGrade}
                onChange={(e) => setQuoteData({ ...quoteData, cashewGrade: e.target.value })}
                className="w-full bg-[#1C2541] border border-[#D4AF37]/50 px-3 py-2.5 text-xs text-[#F8F9FA] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
              >
                <option value="JH Jumbo Halves">JH Jumbo Cashew Halves (Splits)</option>
                <option value="W-180 King (Jumbo)">W-180 King Jumbo Whole</option>
                <option value="W-210 Royal Jumbo">W-210 Royal Jumbo Whole</option>
                <option value="W-240 Premium">W-240 Select Whole</option>
                <option value="W-320 Standard">W-320 Standard Whole</option>
                <option value="W-400 Economy">W-400 Economy Small Whole</option>
                <option value="Ghee Roasted Salted">Ghee Roasted & Salted Cashews</option>
                <option value="California Badam">California Jumbo Badam (Almonds)</option>
                <option value="Kishmish Raisins">Long Green Kishmish (Raisins)</option>
                <option value="Kashmiri Walnuts">Kashmiri Walnut Kernels</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] block mb-1">
                Quantity Required (Kilograms) *
              </label>
              <SquareInput
                required
                type="number"
                min={10}
                value={quoteData.quantityKg}
                onChange={(e) => setQuoteData({ ...quoteData, quantityKg: Number(e.target.value) })}
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] block mb-1">
                Destination City / State *
              </label>
              <SquareInput
                required
                placeholder="Rajahmundry, Andhra Pradesh"
                value={quoteData.deliveryLocation}
                onChange={(e) => setQuoteData({ ...quoteData, deliveryLocation: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] block mb-1">
              Special Packaging or Target Delivery Date
            </label>
            <textarea
              rows={2}
              placeholder="Specify custom pouch packaging, tin sealing, or expected target date..."
              value={quoteData.notes}
              onChange={(e) => setQuoteData({ ...quoteData, notes: e.target.value })}
              className="w-full bg-[#1C2541] border border-[#D4AF37]/40 p-2.5 text-xs text-[#F8F9FA] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
            />
          </div>

          <SquareButton variant="gold" size="lg" fullWidth type="submit" disabled={loadingQuote}>
            {loadingQuote ? 'Submitting Quotation Request...' : <span className="flex items-center justify-center gap-2"><FileText className="w-4 h-4" /> Submit B2B Wholesale Quotation Request</span>}
          </SquareButton>
        </form>
      </div>

      {/* ========================================================================= */}
      {/* 2. NEXT SECTION: GENERAL CONTACT FORM */}
      {/* ========================================================================= */}
      <div id="contact-form-section" className="border border-[#D4AF37]/40 bg-[#0B132B] p-5 sm:p-8 space-y-6 shadow-xl relative">
        <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#1C2541] border border-[#D4AF37] text-[#D4AF37]">
              <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] block">
                STEP 2 • DIRECT INQUIRY
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#F3E5AB]">
                2. Send Message to Admin Desk
              </h2>
            </div>
          </div>
          <SquareBadge variant="outline" className="text-xs">
            Personal Support
          </SquareBadge>
        </div>

        {contactSuccessMsg && (
          <div className="p-4 border border-emerald-500/50 bg-emerald-950/50 text-emerald-300 text-xs flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Message Sent Successfully!</p>
              <p className="mt-1 text-gray-200">{contactSuccessMsg}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleContactSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] block mb-1">
                Your Full Name *
              </label>
              <SquareInput
                required
                placeholder="e.g., Rajesh Sharma"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] block mb-1">
                Email Address *
              </label>
              <SquareInput
                required
                type="email"
                placeholder="rajesh@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] block mb-1">
                Phone Number *
              </label>
              <SquareInput
                required
                type="tel"
                placeholder="+91 98450 12345"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] block mb-1">
              Inquiry Purpose *
            </label>
            <select
              value={formData.inquiryType}
              onChange={(e: any) => setFormData({ ...formData, inquiryType: e.target.value })}
              className="w-full bg-[#1C2541] border border-[#D4AF37]/50 px-3 py-2.5 text-xs text-[#F8F9FA] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
            >
              <option value="RETAIL">Retail Personal Order Inquiry</option>
              <option value="WHOLESALE_BULK">Wholesale Bulk Procurement (50kg+)</option>
              <option value="EXPORTS">Export Container Inquiry</option>
              <option value="CUSTOM_GIFTING">Corporate Gift Hampers & Festival Packs</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] block mb-1">
              Your Message / Questions *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Type your message or query details here..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full bg-[#1C2541] border border-[#D4AF37]/40 p-2.5 text-xs text-[#F8F9FA] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
            />
          </div>

          <SquareButton variant="gold" size="lg" fullWidth type="submit" disabled={loadingContact}>
            {loadingContact ? 'Sending Message...' : <span className="flex items-center justify-center gap-2"><Send className="w-4 h-4" /> Submit Inquiry to Admin Desk</span>}
          </SquareButton>
        </form>
      </div>

      {/* ========================================================================= */}
      {/* 3. LAST SECTION: INSTRUCTIONS, POLICIES & OFFICE LOCATION DETAILS */}
      {/* ========================================================================= */}
      <div className="space-y-6 pt-4 border-t border-[#D4AF37]/30">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">
            POLICIES & OFFICIAL DESK
          </span>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#F3E5AB]">
            Instructions, Payment Policies & Office Location
          </h2>
        </div>

        {/* Testing Dummy Policy & Instructions Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Policy Card 1: Payment Instructions */}
          <div className="p-4 bg-[#1C2541]/70 border border-[#D4AF37]/40 space-y-2 shadow-md">
            <div className="flex items-center gap-2 text-[#D4AF37] font-bold text-xs">
              <CreditCard className="w-4 h-4" /> Payment Instructions
            </div>
            <p className="text-gray-300 text-xs leading-relaxed">
              Supports Razorpay Test UPI, PhonePe, GPay, Credit/Debit Cards, Cash on Delivery (COD), & Direct Bank NEFT/RTGS Transfer.
            </p>
          </div>

          {/* Policy Card 2: Refund Policy */}
          <div className="p-4 bg-[#1C2541]/70 border border-[#D4AF37]/40 space-y-2 shadow-md">
            <div className="flex items-center gap-2 text-[#D4AF37] font-bold text-xs">
              <RefreshCw className="w-4 h-4" /> Refund & Return Policy
            </div>
            <p className="text-gray-300 text-xs leading-relaxed">
              100% Replacement or Refund guaranteed if nitrogen vacuum packaging is damaged upon delivery. Report within 48 hours.
            </p>
          </div>

          {/* Policy Card 3: Terms & GST Billing */}
          <div className="p-4 bg-[#1C2541]/70 border border-[#D4AF37]/40 space-y-2 shadow-md">
            <div className="flex items-center gap-2 text-[#D4AF37] font-bold text-xs">
              <ShieldCheck className="w-4 h-4" /> Terms & GST Billing
            </div>
            <p className="text-gray-300 text-xs leading-relaxed">
              5% GST applicable on all taxable bills. Instant GST Tax Invoices generated with B2B company tax credit claiming.
            </p>
          </div>
        </div>

        {/* Office Location Card & Quick WhatsApp Contact */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 border border-[#D4AF37]/40 bg-[#1C2541]/90 p-5 sm:p-6 space-y-4 shadow-xl">
            <h3 className="font-serif font-bold text-lg text-[#F3E5AB] pb-3 border-b border-[#D4AF37]/30 flex items-center gap-2">
              <Building className="w-5 h-5 text-[#D4AF37]" /> Rajahmundry Estate & Processing Headquarters
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#F8F9FA] block">Processing Plant Address:</span>
                  <p className="text-gray-300">{SITE_CONFIG.contact.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#F8F9FA] block">Phone & WhatsApp Hotline:</span>
                  <a href={`tel:${SITE_CONFIG.contact.phone}`} className="text-[#D4AF37] font-bold text-sm">
                    {SITE_CONFIG.contact.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#F8F9FA] block">Official Corporate Email:</span>
                  <a href={`mailto:${SITE_CONFIG.contact.email}`} className="text-[#D4AF37] font-semibold">
                    {SITE_CONFIG.contact.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#F8F9FA] block">Working Operating Hours:</span>
                  <p className="text-gray-300">{SITE_CONFIG.contact.workingHours}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col justify-between gap-3 bg-[#1C2541]/90 border border-[#D4AF37]/40 p-5 shadow-xl">
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs text-[#D4AF37] font-bold">
                <Sparkles className="w-4 h-4" /> Direct WhatsApp Ordering
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                Want instant bulk price quotes or custom packaging details on WhatsApp? Connect directly with our Rajahmundry desk!
              </p>
            </div>

            <a
              href={`https://wa.me/${SITE_CONFIG.contact.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello VSN Cashews Rajahmundry, I want to inquire about cashew wholesale rates.')}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg"
            >
              <MessageSquare className="w-4 h-4" /> Open WhatsApp Desk
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
