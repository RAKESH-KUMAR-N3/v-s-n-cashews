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
  Building2,
} from 'lucide-react';
import { SITE_CONFIG, ActiveView } from '@/config/site';
import { SquareBadge } from '@/components/ui/SquareBadge';
import { SquareButton } from '@/components/ui/SquareButton';
import { SquareInput } from '@/components/ui/SquareInput';

interface ContactViewProps {
  onNavigate?: (view: ActiveView) => void;
}

export const ContactView: React.FC<ContactViewProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    inquiryType: 'RETAIL' as 'RETAIL' | 'WHOLESALE_BULK' | 'EXPORTS' | 'CUSTOM_GIFTING',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [successResponse, setSuccessResponse] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessResponse(null);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessResponse(
          data.message ||
            'Your inquiry has been dispatched to our Hyderabad office. Reference ID: ' +
              data.referenceId
        );
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          inquiryType: 'RETAIL',
          message: '',
        });
      } else {
        setErrorMessage(
          data.error || 'Failed to submit inquiry. Please verify your input.'
        );
      }
    } catch (err: any) {
      setErrorMessage(
        'Unable to connect to the server. Please check your network or reach out directly via phone.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-[#F8F9FA] space-y-16"
    >
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <SquareBadge variant="gold">Hyderabad Office Desk</SquareBadge>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#F8F9FA]">
          Connect With V S N CASHEWS
        </h1>
        <p className="text-xs sm:text-sm text-gray-300">
          Whether you require retail express delivery, festive gift hampers, or bulk quotes, our Kukatpally, Hyderabad office is at your service.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Info Column (5 cols) */}
        <div className="lg:col-span-5 space-y-8">
          <div className="border border-[#D4AF37]/30 bg-[#0B132B] p-6 space-y-6 shadow-xl">
            <h2 className="font-serif text-xl font-bold text-[#F3E5AB] pb-3 border-b border-[#D4AF37]/20 flex items-center gap-2">
              <Building className="w-5 h-5 text-[#D4AF37]" /> Kukatpally Hyderabad Headquarters
            </h2>

            <div className="space-y-4 text-xs">
              {/* Address */}
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#F8F9FA] block mb-0.5">
                    Physical Store & Office Address:
                  </span>
                  <p className="text-gray-300 leading-relaxed">
                    {SITE_CONFIG.contact.address}
                  </p>
                </div>
              </div>

              {/* Phone & WhatsApp */}
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#F8F9FA] block mb-0.5">
                    Telephone & WhatsApp Direct:
                  </span>
                  <a
                    href={`tel:${SITE_CONFIG.contact.phone}`}
                    className="text-[#D4AF37] hover:underline block font-semibold"
                  >
                    {SITE_CONFIG.contact.phone}
                  </a>
                  <span className="text-[10px] text-gray-400">
                    Direct connect with Sales Officers
                  </span>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#F8F9FA] block mb-0.5">
                    Official Email Desk:
                  </span>
                  <a
                    href={`mailto:${SITE_CONFIG.contact.email}`}
                    className="text-[#D4AF37] hover:underline font-semibold"
                  >
                    {SITE_CONFIG.contact.email}
                  </a>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#F8F9FA] block mb-0.5">
                    Working Hours:
                  </span>
                  <p className="text-gray-300">
                    {SITE_CONFIG.contact.workingHours}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Direct Actions */}
          <div className="p-6 border border-[#D4AF37]/30 bg-[#1C2541]/40 space-y-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#D4AF37]" />
              <h3 className="font-serif font-bold text-sm text-[#F3E5AB]">
                Instant B2B Quotations Portal
              </h3>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              Require GST quotes for corporate bulk purchasing, industrial bakery grades, or special packaging? Submit your requirements directly to our desk.
            </p>
            {onNavigate && (
              <SquareButton
                variant="gold"
                fullWidth
                onClick={() => onNavigate('quotes')}
                className="py-2.5 text-xs font-bold"
              >
                <Building2 className="w-4 h-4 mr-2" /> Launch B2B Quotation Portal
              </SquareButton>
            )}
            <a
              href={`https://wa.me/${SITE_CONFIG.contact.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello V S N Cashews team, I would like to inquire about wholesale pricing in Kukatpally Hyderabad.')}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-colors"
            >
              <MessageSquare className="w-4 h-4" /> Inquiry via WhatsApp
            </a>
          </div>
        </div>

        {/* Right Form Column (7 cols) */}
        <div className="lg:col-span-7">
          <div className="border-2 border-[#D4AF37]/40 bg-[#0B132B] p-6 sm:p-8 space-y-6 shadow-2xl">
            <div>
              <SquareBadge variant="gold">Official Inquiry Desk</SquareBadge>
              <h2 className="font-serif text-2xl font-bold text-[#F8F9FA] mt-1">
                Send Direct Message
              </h2>
              <p className="text-xs text-gray-300 mt-1">
                Fill out the form below to request custom quotes or general order inquiries.
              </p>
            </div>

            {successResponse && (
              <div className="p-4 border border-emerald-500/50 bg-emerald-950/40 text-emerald-300 text-xs flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Inquiry Dispatched Successfully!</p>
                  <p className="mt-1 text-gray-300">{successResponse}</p>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="p-4 border border-red-500/50 bg-red-950/40 text-red-300 text-xs">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] block mb-1">
                    Your Full Name *
                  </label>
                  <SquareInput
                    required
                    placeholder="e.g., Rajesh Sharma"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] block mb-1">
                    Email Address *
                  </label>
                  <SquareInput
                    required
                    type="email"
                    placeholder="e.g., rajesh@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Phone & Inquiry Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] block mb-1">
                    Phone Number (10 digits) *
                  </label>
                  <SquareInput
                    required
                    type="tel"
                    placeholder="+91 98450 00000"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] block mb-1">
                    Inquiry Category *
                  </label>
                  <select
                    value={formData.inquiryType}
                    onChange={(e: any) =>
                      setFormData({ ...formData, inquiryType: e.target.value })
                    }
                    className="w-full bg-[#1C2541] border border-[#D4AF37]/40 px-3 py-2 text-xs text-[#F8F9FA] focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="RETAIL">Retail Personal Order</option>
                    <option value="WHOLESALE_BULK">Wholesale Bulk (50kg+)</option>
                    <option value="EXPORTS">Export & Shipping</option>
                    <option value="CUSTOM_GIFTING">Corporate Velvet Gifting</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] block mb-1">
                  Message Details *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Please specify grades (W180, W240, Roasted), quantities required, or delivery address..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full bg-[#1C2541] border border-[#D4AF37]/40 p-3 text-xs text-[#F8F9FA] placeholder-gray-400 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <SquareButton
                variant="gold"
                size="lg"
                fullWidth
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 animate-spin text-[#0B132B]" /> Dispatching Inquiry...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="w-4 h-4" /> Send Official Inquiry
                  </span>
                )}
              </SquareButton>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
