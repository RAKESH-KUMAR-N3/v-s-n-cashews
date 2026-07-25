import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText,
  Edit,
  Save,
  Send,
  Download,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  CreditCard,
  Building2,
  Calendar,
  Mail,
  Phone,
  DollarSign,
  Clock,
  Sparkles,
  X,
  FileCheck,
  Percent,
} from 'lucide-react';
import { useQuotes } from '@/context/QuoteContext';
import { useInvoice } from '@/context/InvoiceContext';
import { TaxInvoicePrintView } from '@/components/invoices/TaxInvoicePrintView';
import { Quotation, QuotationStatus, QuoteItem, Invoice } from '@/types';
import { SquareButton } from '@/components/ui/SquareButton';
import { QuotePdfModal } from '../quotes/QuotePdfModal';

export const AdminQuotationManager: React.FC = () => {
  const { quotes, updateQuote, updateQuoteStatus, recordAdvancePayment, deleteQuote } = useQuotes();
  const { generateInvoiceFromQuote } = useInvoice();

  const [editingQuote, setEditingQuote] = useState<Quotation | null>(null);
  const [selectedQuoteForPdf, setSelectedQuoteForPdf] = useState<Quotation | null>(null);
  const [emailModalQuote, setEmailModalQuote] = useState<Quotation | null>(null);
  const [emailSentMsg, setEmailSentMsg] = useState('');
  const [viewingGeneratedInvoice, setViewingGeneratedInvoice] = useState<Invoice | null>(null);

  // Status Filter State
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Edit Form Fields
  const [editedItems, setEditedItems] = useState<QuoteItem[]>([]);
  const [editedAdvancePct, setEditedAdvancePct] = useState<number>(25);
  const [editedValidUntil, setEditedValidUntil] = useState<string>('');
  const [editedAdminNotes, setEditedAdminNotes] = useState<string>('');

  // Advance Payment Modal State
  const [advanceModalQuote, setAdvanceModalQuote] = useState<Quotation | null>(null);
  const [advanceAmount, setAdvanceAmount] = useState<number>(0);
  const [advanceRef, setAdvanceRef] = useState<string>('');

  const filteredQuotes =
    statusFilter === 'ALL' ? quotes : quotes.filter((q) => q.status === statusFilter);

  const startEditQuote = (quote: Quotation) => {
    setEditingQuote(quote);
    setEditedItems(
      quote.items.map((it) => ({
        ...it,
        quotedUnitPricePerKg: it.quotedUnitPricePerKg || 1400,
        totalPrice: (it.quotedUnitPricePerKg || 1400) * it.requestedQtyKg,
      }))
    );
    setEditedAdvancePct(quote.advancePercentage || 25);
    setEditedValidUntil(
      quote.validUntil ||
        new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    );
    setEditedAdminNotes(quote.adminNotes || 'Volume discount rate applied. Immediate factory dispatch upon 25% advance clearance.');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuote) return;

    updateQuote(editingQuote.id, {
      items: editedItems,
      advancePercentage: editedAdvancePct,
      validUntil: editedValidUntil,
      adminNotes: editedAdminNotes,
      status: editingQuote.status === 'REQUESTED' ? 'QUOTED' : editingQuote.status,
    });

    setEditingQuote(null);
  };

  const handleUnitRateChange = (idx: number, rate: number) => {
    const updated = [...editedItems];
    updated[idx].quotedUnitPricePerKg = Math.max(0, rate);
    updated[idx].totalPrice = updated[idx].quotedUnitPricePerKg! * updated[idx].requestedQtyKg;
    setEditedItems(updated);
  };

  const openAdvanceModal = (quote: Quotation) => {
    setAdvanceModalQuote(quote);
    setAdvanceAmount(quote.advanceRequiredAmount || 100000);
    setAdvanceRef(`NEFT-BANK-REF-${Math.floor(100000 + Math.random() * 900000)}`);
  };

  const handleRecordAdvance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!advanceModalQuote) return;

    recordAdvancePayment(advanceModalQuote.id, advanceAmount, advanceRef);
    setAdvanceModalQuote(null);
  };

  const handleSendEmailSimulation = (quote: Quotation) => {
    setEmailModalQuote(quote);
  };

  const confirmSendEmail = () => {
    if (!emailModalQuote) return;
    setEmailSentMsg(`Quote ${emailModalQuote.quoteNumber} successfully emailed to ${emailModalQuote.email}!`);
    setEmailModalQuote(null);
    setTimeout(() => setEmailSentMsg(''), 5000);
  };

  const getStatusBadge = (status: QuotationStatus) => {
    switch (status) {
      case 'REQUESTED':
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase bg-amber-950 text-amber-300 border border-amber-600/50">
            Pending Quote
          </span>
        );
      case 'QUOTED':
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase bg-blue-950 text-blue-300 border border-blue-500/50">
            Quote Issued
          </span>
        );
      case 'ACCEPTED':
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase bg-emerald-950 text-emerald-300 border border-emerald-500/50">
            Accepted
          </span>
        );
      case 'REJECTED':
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase bg-red-950 text-red-300 border border-red-500/50">
            Rejected
          </span>
        );
      case 'EXPIRED':
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase bg-gray-900 text-gray-400 border border-gray-700">
            Expired
          </span>
        );
      case 'ADVANCE_PAID':
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase bg-purple-950 text-purple-300 border border-purple-500/50">
            Advance Paid
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1C2541] p-4 border border-[#D4AF37]/30">
        <div>
          <h2 className="font-serif font-bold text-lg text-[#F3E5AB] flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#D4AF37]" /> B2B Wholesale Quotations Console
          </h2>
          <p className="text-xs text-gray-300">
            Manage corporate cashew quote requests, edit pricing, trigger PDF generation, send emails, and log advance payments.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#0B132B] p-1 border border-[#D4AF37]/30">
          {['ALL', 'REQUESTED', 'QUOTED', 'ACCEPTED', 'ADVANCE_PAID', 'REJECTED', 'EXPIRED'].map(
            (st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 text-[10px] font-mono uppercase font-bold transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-[#D4AF37] text-[#0B132B]'
                    : 'text-gray-300 hover:text-[#D4AF37]'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            )
          )}
        </div>
      </div>

      {emailSentMsg && (
        <div className="p-3 bg-emerald-950 border border-emerald-500 text-emerald-200 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{emailSentMsg}</span>
        </div>
      )}

      {/* Quote Cards Grid */}
      <div className="space-y-4">
        {filteredQuotes.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-xs bg-[#1C2541] border border-[#D4AF37]/20">
            No quotations found for filter: {statusFilter}
          </div>
        ) : (
          filteredQuotes.map((quote) => (
            <div
              key={quote.id}
              className="bg-[#1C2541] border border-[#D4AF37]/30 p-5 space-y-4 transition-all hover:border-[#D4AF37]"
            >
              {/* Header Info */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#D4AF37]/20 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-[#D4AF37]">
                      {quote.quoteNumber}
                    </span>
                    {getStatusBadge(quote.status)}
                  </div>
                  <h3 className="font-serif font-bold text-base text-[#F3E5AB] mt-0.5">
                    {quote.companyName}
                  </h3>
                  <div className="text-xs text-gray-300 flex flex-wrap gap-x-3 gap-y-0.5">
                    <span>Contact: {quote.contactPerson}</span>
                    <span>• {quote.email}</span>
                    <span>• {quote.phone}</span>
                    {quote.gstin && <span className="text-[#D4AF37]">GST: {quote.gstin}</span>}
                  </div>
                </div>

                <div className="text-left md:text-right text-xs text-gray-400">
                  <div>Requested: {new Date(quote.createdAt).toLocaleDateString('en-IN')}</div>
                  {quote.validUntil && (
                    <div className="text-amber-300 font-mono">
                      Valid Until: {new Date(quote.validUntil).toLocaleDateString('en-IN')}
                    </div>
                  )}
                </div>
              </div>

              {/* Items Breakdown Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-[#D4AF37]/20">
                  <thead className="bg-[#0B132B] text-[#D4AF37] uppercase font-mono">
                    <tr>
                      <th className="p-2">Item Grade</th>
                      <th className="p-2 text-right">Requested Qty</th>
                      <th className="p-2 text-right">Unit Rate / KG</th>
                      <th className="p-2 text-right">Line Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D4AF37]/10 text-gray-200">
                    {quote.items.map((it, idx) => (
                      <tr key={idx}>
                        <td className="p-2 font-medium">{it.productName} ({it.grade})</td>
                        <td className="p-2 text-right font-mono text-[#F3E5AB]">{it.requestedQtyKg} KG</td>
                        <td className="p-2 text-right font-mono">
                          {it.quotedUnitPricePerKg ? `₹${it.quotedUnitPricePerKg}` : 'Not Set'}
                        </td>
                        <td className="p-2 text-right font-mono text-[#D4AF37] font-bold">
                          {it.totalPrice ? `₹${it.totalPrice.toLocaleString('en-IN')}` : 'Not Set'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Financial Totals Row */}
              {quote.quotedGrandTotal && (
                <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0B132B] p-3 border border-[#D4AF37]/30 text-xs">
                  <div>
                    <span className="text-gray-400 uppercase font-mono">Subtotal: </span>
                    <span className="font-mono text-[#F3E5AB]">₹{quote.quotedSubtotal?.toLocaleString('en-IN')}</span>
                    <span className="text-gray-400 uppercase font-mono ml-4">GST (5%): </span>
                    <span className="font-mono text-[#F3E5AB]">₹{quote.quotedGst?.toLocaleString('en-IN')}</span>
                  </div>

                  <div>
                    <span className="text-gray-400 uppercase font-mono">Grand Total: </span>
                    <span className="font-mono font-bold text-[#D4AF37] text-sm">
                      ₹{quote.quotedGrandTotal?.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div>
                    <span className="text-gray-400 uppercase font-mono">Advance ({quote.advancePercentage}%): </span>
                    <span className="font-mono font-bold text-emerald-400">
                      ₹{quote.advanceRequiredAmount?.toLocaleString('en-IN')}
                    </span>
                    {quote.advancePaidAmount ? (
                      <span className="ml-2 text-purple-300 font-bold">(Paid: ₹{quote.advancePaidAmount.toLocaleString('en-IN')})</span>
                    ) : null}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#D4AF37]/20">
                {/* Left Action Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <SquareButton variant="gold" size="sm" onClick={() => startEditQuote(quote)}>
                    <Edit className="w-3.5 h-3.5 mr-1" /> Edit Quote Rates
                  </SquareButton>

                  <SquareButton
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedQuoteForPdf(quote)}
                  >
                    <Download className="w-3.5 h-3.5 mr-1 text-[#D4AF37]" /> Quote PDF
                  </SquareButton>

                  <SquareButton
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const inv = generateInvoiceFromQuote(quote);
                      setViewingGeneratedInvoice(inv);
                    }}
                    className="border-emerald-500/50 text-emerald-300 hover:bg-emerald-500 hover:text-[#0B132B]"
                  >
                    <FileText className="w-3.5 h-3.5 mr-1" /> Issue Tax Invoice
                  </SquareButton>

                  <SquareButton
                    variant="outline"
                    size="sm"
                    onClick={() => handleSendEmailSimulation(quote)}
                  >
                    <Mail className="w-3.5 h-3.5 mr-1 text-blue-400" /> Send Email
                  </SquareButton>
                </div>

                {/* Status Quick Transitions */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] text-gray-400 uppercase font-mono mr-1">Status:</span>

                  <button
                    onClick={() => updateQuoteStatus(quote.id, 'ACCEPTED')}
                    className="px-2 py-1 text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-800 transition-colors cursor-pointer"
                    title="Mark Accepted"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() => updateQuoteStatus(quote.id, 'REJECTED')}
                    className="px-2 py-1 text-[10px] font-mono font-bold bg-red-950 text-red-300 border border-red-500/50 hover:bg-red-800 transition-colors cursor-pointer"
                    title="Mark Rejected"
                  >
                    Reject
                  </button>

                  <button
                    onClick={() => updateQuoteStatus(quote.id, 'EXPIRED')}
                    className="px-2 py-1 text-[10px] font-mono font-bold bg-gray-900 text-gray-300 border border-gray-700 hover:bg-gray-800 transition-colors cursor-pointer"
                    title="Mark Expired"
                  >
                    Expire
                  </button>

                  <button
                    onClick={() => openAdvanceModal(quote)}
                    className="px-2 py-1 text-[10px] font-mono font-bold bg-purple-950 text-purple-200 border border-purple-500 hover:bg-purple-800 transition-colors cursor-pointer flex items-center gap-1"
                    title="Log Advance Payment"
                  >
                    <CreditCard className="w-3 h-3" /> Advance
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* EDIT QUOTE MODAL */}
      {editingQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#0B132B] border-2 border-[#D4AF37] p-6 max-w-2xl w-full text-[#F8F9FA] shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-3">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#F3E5AB]">
                  Edit Quotation Pricing - {editingQuote.quoteNumber}
                </h3>
                <p className="text-xs text-gray-300">{editingQuote.companyName}</p>
              </div>
              <button
                onClick={() => setEditingQuote(null)}
                className="text-gray-400 hover:text-[#D4AF37]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#F3E5AB] mb-2 uppercase font-mono">
                  Cashew Grade Line Rates (₹ / KG)
                </label>
                <div className="space-y-2">
                  {editedItems.map((it, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-12 gap-2 items-center bg-[#1C2541] p-3 border border-[#D4AF37]/30"
                    >
                      <div className="col-span-6 font-medium text-gray-200">
                        {it.productName} ({it.requestedQtyKg} KG)
                      </div>
                      <div className="col-span-3">
                        <label className="block text-[9px] text-gray-400">Rate / KG (₹)</label>
                        <input
                          type="number"
                          value={it.quotedUnitPricePerKg || ''}
                          onChange={(e) => handleUnitRateChange(idx, Number(e.target.value))}
                          className="w-full bg-[#0B132B] text-[#F3E5AB] border border-[#D4AF37]/50 p-1.5 font-mono text-xs focus:outline-none"
                        />
                      </div>
                      <div className="col-span-3 text-right font-mono text-[#D4AF37] font-bold">
                        ₹{((it.quotedUnitPricePerKg || 0) * it.requestedQtyKg).toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#F3E5AB] mb-1 uppercase font-mono">
                    Advance Deposit Required (%)
                  </label>
                  <select
                    value={editedAdvancePct}
                    onChange={(e) => setEditedAdvancePct(Number(e.target.value))}
                    className="w-full bg-[#1C2541] border border-[#D4AF37]/50 p-2 text-xs text-[#F8F9FA] focus:outline-none cursor-pointer"
                  >
                    <option value={20}>20% Advance</option>
                    <option value={25}>25% Advance (Standard)</option>
                    <option value={30}>30% Advance</option>
                    <option value={50}>50% Advance</option>
                    <option value={100}>100% Full Payment</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#F3E5AB] mb-1 uppercase font-mono">
                    Quote Validity Expiry Date
                  </label>
                  <input
                    type="date"
                    value={editedValidUntil}
                    onChange={(e) => setEditedValidUntil(e.target.value)}
                    className="w-full bg-[#1C2541] border border-[#D4AF37]/50 p-2 text-xs text-[#F3E5AB] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#F3E5AB] mb-1 uppercase font-mono">
                  Admin Remarks & Dispatch Terms
                </label>
                <textarea
                  rows={2}
                  value={editedAdminNotes}
                  onChange={(e) => setEditedAdminNotes(e.target.value)}
                  className="w-full bg-[#1C2541] border border-[#D4AF37]/50 p-2 text-xs text-[#F8F9FA] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <SquareButton variant="outline" type="button" onClick={() => setEditingQuote(null)}>
                  Cancel
                </SquareButton>
                <SquareButton variant="gold" type="submit">
                  <Save className="w-4 h-4 mr-1" /> Save & Issue Quote
                </SquareButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RECORD ADVANCE PAYMENT MODAL */}
      {advanceModalQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0B132B] border-2 border-purple-500 p-6 max-w-md w-full text-[#F8F9FA] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-purple-500/30 pb-2">
              <h3 className="font-serif font-bold text-base text-purple-300 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-purple-400" /> Record Advance Payment
              </h3>
              <button onClick={() => setAdvanceModalQuote(null)} className="text-gray-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRecordAdvance} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-300 mb-1">Quote Reference</label>
                <input
                  type="text"
                  disabled
                  value={`${advanceModalQuote.quoteNumber} (${advanceModalQuote.companyName})`}
                  className="w-full bg-[#1C2541] text-gray-400 p-2 border border-gray-700"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Advance Amount Received (₹)</label>
                <input
                  type="number"
                  value={advanceAmount}
                  onChange={(e) => setAdvanceAmount(Number(e.target.value))}
                  className="w-full bg-[#1C2541] text-emerald-400 font-mono font-bold p-2 border border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Bank Reference / UTR Number</label>
                <input
                  type="text"
                  value={advanceRef}
                  onChange={(e) => setAdvanceRef(e.target.value)}
                  placeholder="e.g. NEFT260724881"
                  className="w-full bg-[#1C2541] text-[#F3E5AB] font-mono p-2 border border-purple-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <SquareButton variant="outline" type="button" onClick={() => setAdvanceModalQuote(null)}>
                  Cancel
                </SquareButton>
                <SquareButton variant="gold" type="submit" className="bg-purple-700 border-purple-500 text-white">
                  Confirm Advance Payment
                </SquareButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EMAIL PREVIEW SIMULATION MODAL */}
      {emailModalQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0B132B] border-2 border-blue-500 p-6 max-w-xl w-full text-[#F8F9FA] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-blue-500/30 pb-2">
              <h3 className="font-serif font-bold text-base text-blue-300 flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-400" /> Send Quotation Email Notification
              </h3>
              <button onClick={() => setEmailModalQuote(null)} className="text-gray-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-white text-gray-900 p-4 rounded text-xs space-y-3 font-sans max-h-[60vh] overflow-y-auto">
              <div className="border-b pb-2">
                <div><strong>To:</strong> {emailModalQuote.email}</div>
                <div><strong>Subject:</strong> Formal B2B Cashew Quotation {emailModalQuote.quoteNumber} - V S N CASHEWS Mangalore</div>
              </div>

              <div className="space-y-2">
                <p>Dear {emailModalQuote.contactPerson},</p>
                <p>
                  Thank you for inquiring with V S N CASHEWS Mangalore. We are pleased to issue formal quotation <strong>{emailModalQuote.quoteNumber}</strong> for {emailModalQuote.companyName}.
                </p>

                <div className="bg-gray-50 p-2 border text-[11px] font-mono">
                  <div><strong>Total Quoted Amount:</strong> ₹{emailModalQuote.quotedGrandTotal?.toLocaleString('en-IN') || 'Pending'}</div>
                  <div><strong>Advance Payable (25%):</strong> ₹{emailModalQuote.advanceRequiredAmount?.toLocaleString('en-IN') || 'Pending'}</div>
                  <div><strong>Validity Date:</strong> {emailModalQuote.validUntil || '14 Days'}</div>
                </div>

                <p className="text-[11px] text-gray-600">
                  You can accept this quotation and pay the advance deposit via your B2B Wholesale Portal link.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <SquareButton variant="outline" onClick={() => setEmailModalQuote(null)}>
                Cancel
              </SquareButton>
              <SquareButton variant="gold" onClick={confirmSendEmail} className="bg-blue-600 border-blue-400 text-white">
                <Send className="w-4 h-4 mr-1" /> Dispatch Email Now
              </SquareButton>
            </div>
          </div>
        </div>
      )}

      {/* PDF MODAL */}
      {selectedQuoteForPdf && (
        <QuotePdfModal
          quote={selectedQuoteForPdf}
          onClose={() => setSelectedQuoteForPdf(null)}
        />
      )}

      {/* TAX INVOICE PRINT / VIEW MODAL */}
      {viewingGeneratedInvoice && (
        <TaxInvoicePrintView
          invoice={viewingGeneratedInvoice}
          onClose={() => setViewingGeneratedInvoice(null)}
        />
      )}
    </div>
  );
};
