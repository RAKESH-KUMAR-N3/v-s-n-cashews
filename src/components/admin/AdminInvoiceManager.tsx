import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Printer,
  Mail,
  CheckCircle,
  CreditCard,
  Building2,
  Trash2,
  Edit,
  Eye,
  Download,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { Invoice, InvoicePaymentStatus } from '@/types';
import { SquareButton } from '@/components/ui/SquareButton';
import { SquareInput } from '@/components/ui/SquareInput';
import { SquareBadge } from '@/components/ui/SquareBadge';
import { useInvoice } from '@/context/InvoiceContext';
import { TaxInvoicePrintView } from '@/components/invoices/TaxInvoicePrintView';
import { InvoiceFormModal } from '@/components/invoices/InvoiceFormModal';
import { InvoiceEmailModal } from '@/components/invoices/InvoiceEmailModal';

export const AdminInvoiceManager: React.FC = () => {
  const { invoices, updatePaymentStatus, deleteInvoice } = useInvoice();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | InvoicePaymentStatus>('ALL');

  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [emailingInvoice, setEmailingInvoice] = useState<Invoice | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Payment Recording Modal State
  const [recordingPaymentFor, setRecordingPaymentFor] = useState<Invoice | null>(null);
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMethod, setPayMethod] = useState<string>('NEFT / RTGS Transfer');
  const [payRef, setPayRef] = useState<string>('');

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customerDetails.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inv.customerDetails.companyName && inv.customerDetails.companyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (inv.customerDetails.gstin && inv.customerDetails.gstin.toLowerCase().includes(searchTerm.toLowerCase())) ||
      inv.customerDetails.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || inv.paymentStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate Metrics
  const totalInvoicesCount = invoices.length;
  const totalInvoicedValue = invoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
  const totalCollectedRevenue = invoices.reduce((sum, inv) => sum + inv.amountPaid, 0);
  const totalPendingBalance = invoices.reduce((sum, inv) => sum + inv.balanceDue, 0);
  const totalGstCollected = invoices.reduce((sum, inv) => sum + inv.totalTax, 0);

  const handleOpenRecordPayment = (inv: Invoice) => {
    setRecordingPaymentFor(inv);
    setPayAmount(inv.balanceDue);
    setPayMethod('NEFT / RTGS Transfer');
    setPayRef(`REF-${Date.now().toString().slice(-6)}`);
  };

  const handleSavePaymentRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recordingPaymentFor) return;

    const newAmountPaid = recordingPaymentFor.amountPaid + Number(payAmount);
    updatePaymentStatus(
      recordingPaymentFor.id,
      newAmountPaid >= recordingPaymentFor.grandTotal ? 'PAID' : 'PARTIALLY_PAID',
      newAmountPaid,
      payMethod,
      payRef
    );

    setRecordingPaymentFor(null);
  };

  return (
    <div className="space-y-6">
      {/* Header & Create Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D4AF37]/30 pb-4">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#F3E5AB] flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#D4AF37]" /> GST Tax Invoice & Billing Console
          </h2>
          <p className="text-xs text-gray-300 mt-1">
            Automatic GST invoice generation, status tracking, printable tax receipts & e-mail dispatch
          </p>
        </div>

        <SquareButton
          variant="gold"
          onClick={() => setShowCreateModal(true)}
          className="py-2.5 px-5 font-bold text-xs uppercase"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Issue New Tax Invoice
        </SquareButton>
      </div>

      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
        <div className="p-4 bg-[#1C2541] border border-[#D4AF37]/40">
          <div className="text-[11px] text-gray-400 uppercase tracking-wider">Total Invoices</div>
          <div className="text-xl font-bold text-[#F3E5AB] mt-1">{totalInvoicesCount}</div>
          <div className="text-[10px] text-gray-400 mt-0.5">Vol: ₹{totalInvoicedValue.toLocaleString('en-IN')}</div>
        </div>

        <div className="p-4 bg-[#1C2541] border border-emerald-500/40">
          <div className="text-[11px] text-emerald-400 uppercase tracking-wider">Payments Settled</div>
          <div className="text-xl font-bold text-emerald-300 mt-1">₹{totalCollectedRevenue.toLocaleString('en-IN')}</div>
          <div className="text-[10px] text-emerald-400/80 mt-0.5">Cleared Collections</div>
        </div>

        <div className="p-4 bg-[#1C2541] border border-amber-500/40">
          <div className="text-[11px] text-amber-400 uppercase tracking-wider">Outstanding Receivables</div>
          <div className="text-xl font-bold text-amber-300 mt-1">₹{totalPendingBalance.toLocaleString('en-IN')}</div>
          <div className="text-[10px] text-amber-400/80 mt-0.5">Pending Collections</div>
        </div>

        <div className="p-4 bg-[#1C2541] border border-sky-500/40">
          <div className="text-[11px] text-sky-400 uppercase tracking-wider">Total GST Tax Liability</div>
          <div className="text-xl font-bold text-sky-300 mt-1">₹{totalGstCollected.toLocaleString('en-IN')}</div>
          <div className="text-[10px] text-sky-400/80 mt-0.5">5% GST Collection</div>
        </div>
      </div>

      {/* Search & Status Filters */}
      <div className="flex flex-col sm:flex-row gap-3 bg-[#1C2541] p-3 border border-[#D4AF37]/30">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <SquareInput
            type="text"
            placeholder="Search by Invoice #, Customer, GSTIN or Company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#D4AF37]" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-[#0B132B] border border-[#D4AF37]/40 text-xs text-[#F3E5AB] p-2 focus:outline-none font-mono"
          >
            <option value="ALL">All Statuses</option>
            <option value="PAID">Paid Only</option>
            <option value="UNPAID">Unpaid Only</option>
            <option value="PARTIALLY_PAID">Partially Paid</option>
            <option value="OVERDUE">Overdue</option>
          </select>
        </div>
      </div>

      {/* Invoices List Table */}
      <div className="border border-[#D4AF37]/40 bg-[#1C2541]/40 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#1C2541] border-b border-[#D4AF37]/40 text-[#F3E5AB] font-mono text-[11px] uppercase tracking-wider">
              <th className="p-3">Invoice #</th>
              <th className="p-3">Customer & GSTIN</th>
              <th className="p-3">Date / Due</th>
              <th className="p-3 text-right">Taxable & GST</th>
              <th className="p-3 text-right">Grand Total</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D4AF37]/20">
            {filteredInvoices.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-400 font-mono">
                  No tax invoices found matching criteria.
                </td>
              </tr>
            ) : (
              filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-[#1C2541] transition-colors">
                  <td className="p-3 font-mono font-bold text-[#F3E5AB]">
                    <div>{inv.invoiceNumber}</div>
                    {inv.referenceId && (
                      <span className="text-[10px] text-gray-400 block font-normal">
                        Ref {inv.referenceType}: {inv.referenceId}
                      </span>
                    )}
                  </td>

                  <td className="p-3">
                    <div className="font-bold text-white">
                      {inv.customerDetails.companyName || inv.customerDetails.name}
                    </div>
                    {inv.customerDetails.companyName && (
                      <div className="text-gray-400 text-[11px]">Contact: {inv.customerDetails.name}</div>
                    )}
                    {inv.customerDetails.gstin ? (
                      <div className="text-[10px] text-emerald-400 font-mono">GSTIN: {inv.customerDetails.gstin}</div>
                    ) : (
                      <div className="text-[10px] text-gray-500 font-mono">Unregistered Retail</div>
                    )}
                  </td>

                  <td className="p-3 font-mono text-gray-300">
                    <div>{inv.invoiceDate}</div>
                    <div className="text-[10px] text-gray-400">Due: {inv.dueDate}</div>
                  </td>

                  <td className="p-3 text-right font-mono text-gray-300">
                    <div>Taxable: ₹{inv.totalTaxable.toLocaleString('en-IN')}</div>
                    <div className="text-[10px] text-sky-300">GST (5%): ₹{inv.totalTax.toLocaleString('en-IN')}</div>
                  </td>

                  <td className="p-3 text-right font-mono font-bold text-[#D4AF37] text-sm">
                    ₹{inv.grandTotal.toLocaleString('en-IN')}
                  </td>

                  <td className="p-3 text-center">
                    <span
                      className={`inline-block px-2.5 py-1 font-mono font-bold text-[10px] uppercase border ${
                        inv.paymentStatus === 'PAID'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                          : inv.paymentStatus === 'PARTIALLY_PAID'
                          ? 'bg-amber-950 text-amber-300 border-amber-500'
                          : 'bg-rose-950 text-rose-300 border-rose-500'
                      }`}
                    >
                      {inv.paymentStatus.replace('_', ' ')}
                    </span>
                    {inv.balanceDue > 0 && (
                      <span className="block text-[10px] font-mono text-rose-300 mt-1">
                        Due: ₹{inv.balanceDue.toLocaleString('en-IN')}
                      </span>
                    )}
                  </td>

                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => setViewingInvoice(inv)}
                        className="p-1.5 bg-[#0B132B] border border-[#D4AF37]/50 text-[#F3E5AB] hover:bg-[#D4AF37] hover:text-[#0B132B] transition-all cursor-pointer"
                        title="View / Print Tax Invoice"
                      >
                        <Printer className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setEmailingInvoice(inv)}
                        className="p-1.5 bg-[#0B132B] border border-[#D4AF37]/50 text-[#F3E5AB] hover:bg-[#D4AF37] hover:text-[#0B132B] transition-all cursor-pointer"
                        title="Email PDF Invoice to Customer"
                      >
                        <Mail className="w-4 h-4" />
                      </button>

                      {inv.paymentStatus !== 'PAID' && (
                        <button
                          onClick={() => handleOpenRecordPayment(inv)}
                          className="p-1.5 bg-emerald-950 border border-emerald-500 text-emerald-300 hover:bg-emerald-500 hover:text-[#0B132B] transition-all cursor-pointer"
                          title="Record Payment Entry"
                        >
                          <CreditCard className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => deleteInvoice(inv.id)}
                        className="p-1.5 bg-rose-950/60 border border-rose-500/50 text-rose-300 hover:bg-rose-600 hover:text-white transition-all cursor-pointer"
                        title="Delete Invoice"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Record Payment Modal */}
      {recordingPaymentFor && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm p-4 flex items-center justify-center">
          <div className="bg-[#0B132B] border border-[#D4AF37] w-full max-w-md p-6 shadow-2xl relative text-gray-100">
            <h3 className="font-serif font-bold text-lg text-[#F3E5AB] mb-1">
              Record Payment Receipt
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              Update payment status for Tax Invoice #{recordingPaymentFor.invoiceNumber}
            </p>

            <form onSubmit={handleSavePaymentRecord} className="space-y-4 font-mono text-xs">
              <div className="p-3 bg-[#1C2541] border border-[#D4AF37]/30 space-y-1">
                <div className="flex justify-between text-gray-300">
                  <span>Grand Total:</span>
                  <span>₹{recordingPaymentFor.grandTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-emerald-400">
                  <span>Already Settled:</span>
                  <span>₹{recordingPaymentFor.amountPaid.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-amber-300 font-bold border-t border-gray-700 pt-1">
                  <span>Current Outstanding Due:</span>
                  <span>₹{recordingPaymentFor.balanceDue.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div>
                <label className="block text-[#F3E5AB] uppercase mb-1">Payment Received Amount (₹)</label>
                <SquareInput
                  type="number"
                  value={payAmount}
                  onChange={(e) => setPayAmount(parseFloat(e.target.value) || 0)}
                  required
                  max={recordingPaymentFor.balanceDue}
                />
              </div>

              <div>
                <label className="block text-[#F3E5AB] uppercase mb-1">Payment Mode</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value)}
                  className="w-full bg-[#1C2541] border border-[#D4AF37]/40 p-2 text-xs text-white"
                >
                  <option value="NEFT / RTGS Transfer">NEFT / RTGS Bank Transfer</option>
                  <option value="UPI Direct Payment">UPI Direct Payment</option>
                  <option value="Cheque Deposit">Cheque Deposit</option>
                  <option value="Cash Payment">Cash Payment</option>
                </select>
              </div>

              <div>
                <label className="block text-[#F3E5AB] uppercase mb-1">Bank Reference / UTR Number</label>
                <SquareInput
                  type="text"
                  value={payRef}
                  onChange={(e) => setPayRef(e.target.value)}
                  placeholder="e.g. UTR20260724889"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <SquareButton
                  type="button"
                  variant="outline"
                  onClick={() => setRecordingPaymentFor(null)}
                  className="flex-1 border-gray-600 text-gray-300"
                >
                  Cancel
                </SquareButton>
                <SquareButton type="submit" variant="gold" className="flex-1 py-2 font-bold text-xs">
                  Save Receipt Entry
                </SquareButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Viewing Printable Modal */}
      {viewingInvoice && (
        <TaxInvoicePrintView
          invoice={viewingInvoice}
          onClose={() => setViewingInvoice(null)}
          onRecordPaymentClick={() => {
            const target = viewingInvoice;
            setViewingInvoice(null);
            handleOpenRecordPayment(target);
          }}
        />
      )}

      {/* Creating Invoice Modal */}
      {showCreateModal && (
        <InvoiceFormModal
          onClose={() => setShowCreateModal(false)}
          onSaveSuccess={(inv) => {
            setViewingInvoice(inv);
          }}
        />
      )}

      {/* Editing Invoice Modal */}
      {editingInvoice && (
        <InvoiceFormModal
          existingInvoice={editingInvoice}
          onClose={() => setEditingInvoice(null)}
        />
      )}

      {/* Emailing Invoice Modal */}
      {emailingInvoice && (
        <InvoiceEmailModal
          invoice={emailingInvoice}
          onClose={() => setEmailingInvoice(null)}
        />
      )}
    </div>
  );
};
