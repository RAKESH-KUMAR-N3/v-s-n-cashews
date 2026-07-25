'use client';

import React, { useState } from 'react';
import {
  FileText,
  Search,
  Printer,
  Download,
  Mail,
  ArrowLeft,
  Building2,
  CheckCircle,
  CreditCard,
  ShieldCheck,
  Receipt
} from 'lucide-react';
import { Invoice } from '@/types';
import { SquareButton } from '@/components/ui/SquareButton';
import { SquareInput } from '@/components/ui/SquareInput';
import { useInvoice } from '@/context/InvoiceContext';
import { TaxInvoicePrintView } from './TaxInvoicePrintView';

interface CustomerInvoicesViewProps {
  onBackToCatalog?: () => void;
}

export const CustomerInvoicesView: React.FC<CustomerInvoicesViewProps> = ({
  onBackToCatalog
}) => {
  const { invoices } = useInvoice();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const filteredInvoices = invoices.filter(inv => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      inv.invoiceNumber.toLowerCase().includes(q) ||
      inv.customerDetails.email.toLowerCase().includes(q) ||
      inv.customerDetails.phone.includes(q) ||
      inv.customerDetails.name.toLowerCase().includes(q) ||
      (inv.customerDetails.companyName && inv.customerDetails.companyName.toLowerCase().includes(q)) ||
      (inv.customerDetails.gstin && inv.customerDetails.gstin.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Top Banner */}
      <div className="bg-[#1C2541] border border-[#D4AF37]/40 p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {onBackToCatalog && (
              <button
                onClick={onBackToCatalog}
                className="text-[#D4AF37] hover:underline text-xs font-mono flex items-center gap-1 cursor-pointer mr-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            )}
            <span className="text-[10px] font-mono uppercase bg-[#D4AF37] text-[#0B132B] px-2 py-0.5 font-bold">
              GST Tax Receipts Portal
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#F3E5AB]">
            Customer Tax Invoices & ITC Claims
          </h1>
          <p className="text-xs text-gray-300 mt-1 max-w-2xl leading-relaxed">
            Access official GST tax receipts, download PDF invoices for Input Tax Credit (ITC) claiming, check payment status, and review wholesale transaction records from V S N CASHEWS.
          </p>
        </div>

        <div className="p-3 bg-[#0B132B] border border-[#D4AF37]/30 text-right font-mono text-xs hidden sm:block">
          <div className="text-gray-400">GSTIN: <span className="text-[#F3E5AB] font-bold">29AABCV1234F1ZM</span></div>
          <div className="text-gray-400">FSSAI Lic: <span className="text-emerald-400">11221334000567</span></div>
        </div>
      </div>

      {/* Lookup Bar */}
      <div className="bg-[#1C2541]/80 border border-[#D4AF37]/40 p-4 shadow-lg space-y-2">
        <label className="block text-xs font-mono uppercase text-[#F3E5AB] font-bold">
          Look Up Your Tax Invoices
        </label>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
          <SquareInput
            type="text"
            placeholder="Enter Invoice #, Email Address, Phone Number or Company GSTIN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>
        <p className="text-[11px] text-gray-400 font-mono">
          Tip: Enter your billing email (e.g., <span className="text-[#D4AF37]">rahul.sharma@example.com</span>) or company GSTIN to view all past invoices.
        </p>
      </div>

      {/* Invoices Grid / List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-mono text-gray-400 px-1">
          <span>Found {filteredInvoices.length} Tax Invoice(s)</span>
          <span className="text-[#D4AF37]">100% Tax Compliant</span>
        </div>

        {filteredInvoices.length === 0 ? (
          <div className="bg-[#1C2541]/40 border border-[#D4AF37]/30 p-12 text-center text-gray-400 font-mono space-y-3">
            <Receipt className="w-10 h-10 mx-auto text-gray-500 opacity-60" />
            <div className="text-sm text-[#F3E5AB]">No Tax Invoices Found</div>
            <p className="text-xs max-w-md mx-auto text-gray-400">
              Please check your search term or contact our billing desk at <strong className="text-white">billing@vsncashews.com</strong> with your order reference.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredInvoices.map((inv) => (
              <div
                key={inv.id}
                className="bg-[#1C2541] border border-[#D4AF37]/40 p-5 hover:border-[#D4AF37] transition-all flex flex-col justify-between space-y-4 shadow-lg"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 border-b border-[#D4AF37]/20 pb-2 mb-3">
                    <div>
                      <span className="text-[10px] font-mono text-[#D4AF37] font-bold block uppercase">
                        Tax Invoice Number
                      </span>
                      <h3 className="font-serif font-bold text-lg text-white">
                        {inv.invoiceNumber}
                      </h3>
                    </div>

                    <span
                      className={`px-2.5 py-1 text-[10px] font-mono font-bold uppercase border ${
                        inv.paymentStatus === 'PAID'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                          : inv.paymentStatus === 'PARTIALLY_PAID'
                          ? 'bg-amber-950 text-amber-300 border-amber-500'
                          : 'bg-rose-950 text-rose-300 border-rose-500'
                      }`}
                    >
                      {inv.paymentStatus.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs font-mono text-gray-300">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Billed To:</span>
                      <span className="text-white font-bold text-right">
                        {inv.customerDetails.companyName || inv.customerDetails.name}
                      </span>
                    </div>

                    {inv.customerDetails.gstin && (
                      <div className="flex justify-between text-emerald-400">
                        <span>GSTIN (ITC):</span>
                        <span>{inv.customerDetails.gstin}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span className="text-gray-400">Invoice Date:</span>
                      <span>{inv.invoiceDate}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-400">Taxable Value:</span>
                      <span>₹{inv.totalTaxable.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex justify-between text-sky-300">
                      <span>GST Tax (5%):</span>
                      <span>₹{inv.totalTax.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex justify-between text-sm font-bold text-[#D4AF37] border-t border-gray-700 pt-1.5 mt-2">
                      <span>Invoice Total:</span>
                      <span>₹{inv.grandTotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-[#D4AF37]/20">
                  <SquareButton
                    variant="gold"
                    onClick={() => setSelectedInvoice(inv)}
                    className="flex-1 py-2 text-xs font-bold uppercase"
                  >
                    <Printer className="w-3.5 h-3.5 mr-1.5" /> View / Print Invoice
                  </SquareButton>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedInvoice && (
        <TaxInvoicePrintView
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
};
