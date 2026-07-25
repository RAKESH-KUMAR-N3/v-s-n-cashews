'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  FileCheck,
  Building2,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  CreditCard,
  Download,
  Plus,
  Mail,
  Phone,
  ShieldCheck,
  ArrowLeft,
  DollarSign,
  FileText,
} from 'lucide-react';
import { useQuotes } from '@/context/QuoteContext';
import { useCart } from '@/context/CartContext';
import { Quotation, QuotationStatus } from '@/types';
import { SquareButton } from '@/components/ui/SquareButton';
import { RequestQuoteModal } from './RequestQuoteModal';
import { QuotePdfModal } from './QuotePdfModal';

interface CustomerQuotesViewProps {
  onBackToCatalog?: () => void;
}

export const CustomerQuotesView: React.FC<CustomerQuotesViewProps> = ({ onBackToCatalog }) => {
  const { quotes, updateQuoteStatus, recordAdvancePayment } = useQuotes();
  const { userProfile } = useCart();

  const [filterEmail, setFilterEmail] = useState(userProfile?.email || '');
  const [selectedQuoteForPdf, setSelectedQuoteForPdf] = useState<Quotation | null>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [payingQuoteId, setPayingQuoteId] = useState<string | null>(null);
  const [paySuccessMsg, setPaySuccessMsg] = useState('');

  // Filter quotes by user email if provided, otherwise show all active
  const filteredQuotes = filterEmail
    ? quotes.filter((q) => q.email.toLowerCase().includes(filterEmail.toLowerCase().trim()))
    : quotes;

  const getStatusBadge = (status: QuotationStatus) => {
    switch (status) {
      case 'REQUESTED':
        return (
          <span className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-950 text-amber-300 border border-amber-600/50 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Under Factory Review
          </span>
        );
      case 'QUOTED':
        return (
          <span className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider bg-blue-950 text-blue-300 border border-blue-500/50 flex items-center gap-1">
            <FileCheck className="w-3 h-3 text-blue-400" /> Formal Quote Issued
          </span>
        );
      case 'ACCEPTED':
        return (
          <span className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-500/50 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Accepted by Customer
          </span>
        );
      case 'REJECTED':
        return (
          <span className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider bg-red-950 text-red-300 border border-red-500/50 flex items-center gap-1">
            <XCircle className="w-3 h-3 text-red-400" /> Declined / Cancelled
          </span>
        );
      case 'EXPIRED':
        return (
          <span className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider bg-gray-900 text-gray-400 border border-gray-700 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Quote Expired
          </span>
        );
      case 'ADVANCE_PAID':
        return (
          <span className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider bg-purple-950 text-purple-300 border border-purple-500/50 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-purple-400" /> Advance Paid & Scheduled
          </span>
        );
      default:
        return null;
    }
  };

  const handlePayAdvance = (quote: Quotation) => {
    if (!quote.advanceRequiredAmount) return;
    setPayingQuoteId(quote.id);
    setTimeout(() => {
      recordAdvancePayment(
        quote.id,
        quote.advanceRequiredAmount!,
        `UPI/NEFT-REF-${Math.floor(100000 + Math.random() * 900000)}`
      );
      setPayingQuoteId(null);
      setPaySuccessMsg(`Advance payment of ₹${quote.advanceRequiredAmount?.toLocaleString('en-IN')} confirmed for ${quote.quoteNumber}! Production batch allocated.`);
      setTimeout(() => setPaySuccessMsg(''), 6000);
    }, 1200);
  };

  return (
    <div className="w-full min-h-screen bg-[#0B132B] text-[#F8F9FA] p-4 sm:p-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#D4AF37]/30">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
            <Building2 className="w-4 h-4" /> B2B Wholesale Portal
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#F3E5AB] mt-1">
            My Quotations & Bulk Inquiries
          </h1>
          <p className="text-xs text-gray-300 mt-1">
            Review formal factory quotes, download official PDFs, accept terms, and release advance payments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {onBackToCatalog && (
            <SquareButton variant="outline" size="sm" onClick={onBackToCatalog}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Products
            </SquareButton>
          )}

          <SquareButton
            variant="gold"
            size="md"
            onClick={() => setIsRequestModalOpen(true)}
            className="shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" /> Request New Quote
          </SquareButton>
        </div>
      </div>

      {paySuccessMsg && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs font-semibold flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{paySuccessMsg}</span>
        </div>
      )}

      {/* Filter by Email Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#1C2541] p-4 border border-[#D4AF37]/30">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Mail className="w-4 h-4 text-[#D4AF37]" />
          <span className="text-xs text-gray-300 font-medium">Filter by Email:</span>
          <input
            type="email"
            value={filterEmail}
            onChange={(e) => setFilterEmail(e.target.value)}
            placeholder="Enter business email..."
            className="bg-[#0B132B] text-xs text-[#F3E5AB] border border-[#D4AF37]/40 px-3 py-1.5 focus:outline-none focus:border-[#D4AF37] w-full sm:w-64"
          />
        </div>

        <div className="text-xs text-gray-400 font-mono">
          Showing <span className="text-[#D4AF37] font-bold">{filteredQuotes.length}</span> quotation record(s)
        </div>
      </div>

      {/* Quotations List */}
      {filteredQuotes.length === 0 ? (
        <div className="bg-[#1C2541]/60 border border-[#D4AF37]/30 p-12 text-center space-y-4">
          <FileText className="w-12 h-12 text-[#D4AF37] mx-auto opacity-50" />
          <h3 className="font-serif font-bold text-lg text-[#F3E5AB]">
            No Quotations Found
          </h3>
          <p className="text-xs text-gray-300 max-w-md mx-auto">
            You haven't requested any bulk cashew quotes yet or no matching email records were found.
          </p>
          <SquareButton
            variant="gold"
            onClick={() => setIsRequestModalOpen(true)}
            className="mx-auto"
          >
            Submit First B2B Quote Request
          </SquareButton>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredQuotes.map((quote) => (
            <motion.div
              key={quote.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#1C2541] border border-[#D4AF37]/40 p-5 sm:p-6 shadow-xl relative overflow-hidden"
            >
              {/* Top Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D4AF37]/30 pb-4 mb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-sm text-[#D4AF37]">
                      {quote.quoteNumber}
                    </span>
                    {getStatusBadge(quote.status)}
                  </div>
                  <h3 className="font-serif font-bold text-lg text-[#F3E5AB] mt-1">
                    {quote.companyName}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-300 mt-1">
                    <span>Contact: {quote.contactPerson}</span>
                    <span>• {quote.phone}</span>
                    <span>• {quote.email}</span>
                    {quote.gstin && <span className="font-mono text-[#D4AF37]">GST: {quote.gstin}</span>}
                  </div>
                </div>

                <div className="text-left sm:text-right text-xs text-gray-400">
                  <div className="flex items-center sm:justify-end gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Requested: {new Date(quote.createdAt).toLocaleDateString('en-IN')}</span>
                  </div>
                  {quote.validUntil && (
                    <div className="text-amber-300 font-mono mt-1">
                      Quote Valid Until: {new Date(quote.validUntil).toLocaleDateString('en-IN')}
                    </div>
                  )}
                </div>
              </div>

              {/* Items Breakdown Table */}
              <div className="mb-4">
                <div className="text-xs font-serif font-bold text-[#F3E5AB] uppercase mb-2">
                  Cashew Grade & Volume Breakdown
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-[#D4AF37]/30">
                    <thead className="bg-[#0B132B] text-[#D4AF37] uppercase font-mono">
                      <tr>
                        <th className="p-2 border-b border-[#D4AF37]/30">Product / Grade</th>
                        <th className="p-2 border-b border-[#D4AF37]/30 text-right">Requested Qty</th>
                        <th className="p-2 border-b border-[#D4AF37]/30 text-right">Quoted Price / KG</th>
                        <th className="p-2 border-b border-[#D4AF37]/30 text-right">Total (Excl Tax)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#D4AF37]/20 text-gray-200">
                      {quote.items.map((it, idx) => (
                        <tr key={idx} className="hover:bg-[#0B132B]/40">
                          <td className="p-2">
                            <div className="font-bold text-[#F3E5AB]">{it.productName}</div>
                            <div className="text-[10px] text-gray-400 font-mono">{it.grade}</div>
                          </td>
                          <td className="p-2 text-right font-mono text-[#F3E5AB]">
                            {it.requestedQtyKg} KG
                          </td>
                          <td className="p-2 text-right font-mono">
                            {it.quotedUnitPricePerKg
                              ? `₹${it.quotedUnitPricePerKg.toLocaleString('en-IN')}`
                              : 'Pending Review'}
                          </td>
                          <td className="p-2 text-right font-mono font-bold text-[#D4AF37]">
                            {it.totalPrice
                              ? `₹${it.totalPrice.toLocaleString('en-IN')}`
                              : 'Pending Review'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Cost Summary Box (If Quoted) */}
              {quote.quotedGrandTotal ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#0B132B] p-4 border border-[#D4AF37]/40 mb-4">
                  <div className="space-y-1">
                    <div className="text-[10px] text-gray-400 uppercase font-mono">Quoted Subtotal</div>
                    <div className="font-mono text-sm text-[#F3E5AB]">
                      ₹{quote.quotedSubtotal?.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-gray-400 uppercase font-mono">GST (5%)</div>
                    <div className="font-mono text-sm text-[#F3E5AB]">
                      ₹{quote.quotedGst?.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div className="space-y-1 border-t md:border-t-0 md:border-l border-[#D4AF37]/20 pt-2 md:pt-0 md:pl-4">
                    <div className="text-[10px] text-gray-400 uppercase font-mono">Quoted Grand Total</div>
                    <div className="font-mono text-xl font-extrabold text-[#D4AF37]">
                      ₹{quote.quotedGrandTotal?.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-amber-300/80">Includes bulk packing & GST invoice</div>
                  </div>

                  <div className="space-y-1 border-t md:border-t-0 md:border-l border-[#D4AF37]/20 pt-2 md:pt-0 md:pl-4">
                    <div className="text-[10px] text-gray-400 uppercase font-mono">
                      Advance Required ({quote.advancePercentage || 25}%)
                    </div>
                    <div className="font-mono text-lg font-bold text-emerald-400">
                      ₹{quote.advanceRequiredAmount?.toLocaleString('en-IN')}
                    </div>
                    {quote.advancePaidAmount ? (
                      <div className="text-xs text-purple-300 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> Advance Paid: ₹
                        {quote.advancePaidAmount.toLocaleString('en-IN')}
                      </div>
                    ) : (
                      <div className="text-[10px] text-gray-400">Balance payable upon delivery</div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-amber-950/40 border border-amber-600/30 text-amber-200 text-xs mb-4">
                  Factory desk is calculating bulk discount tier based on harvest batch availability. You will receive an official quotation notification shortly.
                </div>
              )}

              {/* Notes & Admin Remarks */}
              {quote.adminNotes && (
                <div className="text-xs bg-[#0B132B]/80 p-3 border-l-2 border-[#D4AF37] text-gray-300 mb-4">
                  <span className="font-bold text-[#D4AF37]">Factory Desk Remarks:</span> {quote.adminNotes}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#D4AF37]/20">
                <div className="flex items-center gap-2">
                  <SquareButton
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedQuoteForPdf(quote)}
                  >
                    <Download className="w-4 h-4 mr-1 text-[#D4AF37]" /> View & Print PDF
                  </SquareButton>
                </div>

                <div className="flex items-center gap-2">
                  {quote.status === 'QUOTED' && (
                    <>
                      <SquareButton
                        variant="danger"
                        size="sm"
                        onClick={() => updateQuoteStatus(quote.id, 'REJECTED', 'Declined by customer.')}
                      >
                        <XCircle className="w-4 h-4 mr-1" /> Decline Quote
                      </SquareButton>

                      <SquareButton
                        variant="gold"
                        size="sm"
                        onClick={() => updateQuoteStatus(quote.id, 'ACCEPTED', 'Accepted by customer.')}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1" /> Accept Quote
                      </SquareButton>
                    </>
                  )}

                  {(quote.status === 'ACCEPTED' || quote.status === 'QUOTED') &&
                    quote.advanceRequiredAmount &&
                    !quote.advancePaidAmount && (
                      <SquareButton
                        variant="gold"
                        size="sm"
                        disabled={payingQuoteId === quote.id}
                        onClick={() => handlePayAdvance(quote)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400"
                      >
                        <CreditCard className="w-4 h-4 mr-1" />
                        {payingQuoteId === quote.id ? 'Processing Advance...' : 'Pay Advance Deposit'}
                      </SquareButton>
                    )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* PDF Modal */}
      {selectedQuoteForPdf && (
        <QuotePdfModal
          quote={selectedQuoteForPdf}
          onClose={() => setSelectedQuoteForPdf(null)}
        />
      )}

      {/* Request Modal */}
      <RequestQuoteModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
      />
    </div>
  );
};
