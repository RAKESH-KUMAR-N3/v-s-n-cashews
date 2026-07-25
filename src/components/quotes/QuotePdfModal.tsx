'use client';

import React from 'react';
import { X, Printer, Download, Building2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Quotation } from '@/types';
import { SquareButton } from '@/components/ui/SquareButton';
import { SquareBadge } from '@/components/ui/SquareBadge';

interface QuotePdfModalProps {
  quote: Quotation;
  onClose: () => void;
}

export const QuotePdfModal: React.FC<QuotePdfModalProps> = ({ quote, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const calculatedSubtotal = quote.items.reduce((sum, item) => {
    const unitPrice = item.quotedUnitPricePerKg || 1600;
    return sum + item.requestedQtyKg * unitPrice;
  }, 0);

  const isInterstate = quote.state.toLowerCase() !== 'andhra pradesh';
  const gstRate = 0.05;
  const gstAmount = Math.round(calculatedSubtotal * gstRate);
  const grandTotal = calculatedSubtotal + gstAmount;

  return (
    <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0B132B] border-2 border-[#D4AF37] w-full max-w-3xl text-[#F8F9FA] shadow-2xl space-y-4 my-8">
        {/* Modal Controls Toolbar (Hidden on Print) */}
        <div className="flex items-center justify-between p-4 border-b border-[#D4AF37]/40 bg-[#1C2541] print:hidden">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="font-serif font-bold text-base text-[#F3E5AB]">
              B2B Official GST Quotation Document #{quote.quoteNumber}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <SquareButton variant="gold" size="sm" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-1" /> Print / Save PDF
            </SquareButton>

            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-white border border-gray-700 hover:border-[#D4AF37] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* PRINTABLE B2B QUOTATION SHEET */}
        <div id="printable-quote-document" className="p-6 sm:p-10 bg-white text-gray-900 font-sans space-y-6">
          {/* Header Banner */}
          <div className="flex justify-between items-start border-b pb-6">
            <div>
              <h1 className="font-serif font-black text-2xl text-amber-900 uppercase tracking-wider">
                V S N CASHEWS PRIVATE LIMITED
              </h1>
              <p className="text-xs text-amber-700 font-medium">
                Sovereign Grade Cashew Processors & Exporters
              </p>
              <p className="text-[10px] text-gray-600 mt-1 max-w-sm">
                Morampudi Junction, Rajahmundry, Andhra Pradesh - 533107, India
              </p>
              <p className="text-[10px] text-gray-600 font-mono mt-0.5">
                GSTIN: 37AAAFV1234F1Z9 | FSSAI Lic: 11221334000889 | IEC: 0708091122
              </p>
            </div>

            <div className="text-right">
              <span className="inline-block bg-amber-900 text-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-widest">
                OFFICIAL B2B QUOTATION
              </span>
              <div className="text-xs font-mono mt-2">
                <div>Quote No: <strong>{quote.quoteNumber}</strong></div>
                <div>Date: {new Date(quote.createdAt).toLocaleDateString()}</div>
                <div>Valid Until: {quote.validUntil || '14 Days from Issue'}</div>
              </div>
            </div>
          </div>

          {/* Client & Shipping Metadata */}
          <div className="grid grid-cols-2 gap-6 text-xs bg-amber-50/50 p-4 border border-amber-200">
            <div>
              <span className="font-bold font-mono text-amber-900 uppercase text-[10px] block">
                B2B BUYER DETAILS
              </span>
              <div className="font-bold text-sm text-gray-900 mt-0.5">{quote.companyName}</div>
              <div>Attn: {quote.contactPerson}</div>
              <div>Email: {quote.email}</div>
              <div>Phone: {quote.phone}</div>
              {quote.gstin && <div>GSTIN: {quote.gstin}</div>}
            </div>

            <div className="text-right font-mono">
              <span className="font-bold uppercase text-amber-900 text-[10px] block">
                DELIVERY DESTINATION
              </span>
              <div>City: {quote.city}</div>
              <div>State: {quote.state} - {quote.pincode}</div>
              <div>Dispatch Point: Rajahmundry Central Processing Unit</div>
              <div>Shipment Mode: Express Road Freight Container</div>
            </div>
          </div>

          {/* Line Items Table */}
          <div>
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-amber-900 text-white uppercase text-[10px] font-mono">
                  <th className="p-2.5">Item Description</th>
                  <th className="p-2.5 text-center">Grade</th>
                  <th className="p-2.5 text-center">Qty (Kg)</th>
                  <th className="p-2.5 text-right">Quoted Rate / Kg</th>
                  <th className="p-2.5 text-right">Taxable Total</th>
                </tr>
              </thead>
              <tbody className="divide-y border-b text-gray-800 font-mono">
                {quote.items.map((item, idx) => {
                  const unitPrice = item.quotedUnitPricePerKg || 1600;
                  const itemTotal = item.requestedQtyKg * unitPrice;
                  return (
                    <tr key={idx} className="hover:bg-amber-50/30">
                      <td className="p-2.5 font-bold font-sans">{item.productName}</td>
                      <td className="p-2.5 text-center">{item.grade}</td>
                      <td className="p-2.5 text-center">{item.requestedQtyKg} kg</td>
                      <td className="p-2.5 text-right">₹{unitPrice.toLocaleString('en-IN')}</td>
                      <td className="p-2.5 text-right font-bold">₹{itemTotal.toLocaleString('en-IN')}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Financial Calculation Summary */}
          <div className="flex justify-between items-start text-xs pt-2">
            <div className="max-w-md space-y-1.5 text-[11px] text-gray-600 bg-gray-50 p-3 border">
              <div className="font-bold text-gray-900 font-mono">PAYMENT TERMS & ADVANCE SCHEDULE</div>
              <div>• Advance Required for Order Locking: 25% (₹{(quote.advanceRequiredAmount || Math.round(grandTotal * 0.25)).toLocaleString('en-IN')})</div>
              <div>• Balance 75% payable prior to container dispatch from Rajahmundry.</div>
              {quote.adminNotes && <div className="text-amber-800 font-bold mt-1">Note: {quote.adminNotes}</div>}
            </div>

            <div className="w-56 font-mono text-xs space-y-1.5 text-right">
              <div className="flex justify-between">
                <span>Subtotal (Taxable):</span>
                <span>₹{calculatedSubtotal.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between">
                <span>{isInterstate ? 'IGST (5%):' : 'CGST + SGST (5%):'}</span>
                <span>₹{gstAmount.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between font-bold text-sm text-amber-950 pt-2 border-t border-amber-900">
                <span>Grand Total:</span>
                <span>₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Bank Account Details */}
          <div className="grid grid-cols-2 gap-4 text-[11px] font-mono bg-gray-50 p-3 border">
            <div>
              <div className="font-bold uppercase text-gray-900 mb-1">
                BANK TRANSFER (NEFT / RTGS) DETAILS
              </div>
              <div>Account Name: V S N CASHEWS PRIVATE LIMITED</div>
              <div>Bank Name: State Bank of India (SBI)</div>
              <div>Branch: Morampudi Junction Branch, Rajahmundry</div>
              <div>Account Number: 398822001144</div>
              <div>IFSC Code: SBIN0004561</div>
            </div>

            <div>
              <div className="font-bold uppercase text-gray-900 mb-1">
                TERMS & CONDITIONS
              </div>
              <ol className="list-decimal list-inside space-y-0.5 text-gray-600">
                <li>Quotes valid for 14 calendar days from date of issue.</li>
                <li>Dispatch commences within 48 hours of advance receipt.</li>
                <li>Weight measured at time of factory packaging in Rajahmundry.</li>
              </ol>
            </div>
          </div>

          {/* Signature Block */}
          <div className="flex justify-between items-end pt-6 border-t">
            <div className="text-[10px] text-gray-500">
              Computer Generated B2B Quotation Document • V S N CASHEWS
            </div>

            <div className="text-center">
              <div className="w-32 h-10 border-b border-dashed border-gray-400 mb-1 mx-auto flex items-end justify-center font-serif text-[10px] italic text-amber-800">
                [Authorized Stamp & Seal]
              </div>
              <div className="font-bold text-xs">V S N CASHEWS Wholesale Desk</div>
              <div className="text-[10px] text-gray-500">Rajahmundry, Andhra Pradesh</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
