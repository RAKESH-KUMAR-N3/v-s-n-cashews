import React from 'react';
import { Printer, Download, X, Building2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Quotation } from '@/types';
import { SITE_CONFIG } from '@/config/site';
import { SquareButton } from '@/components/ui/SquareButton';

interface QuotePdfModalProps {
  quote: Quotation;
  onClose: () => void;
}

export const QuotePdfModal: React.FC<QuotePdfModalProps> = ({ quote, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const subtotal = quote.quotedSubtotal || 0;
  const gst = quote.quotedGst || 0;
  const grandTotal = quote.quotedGrandTotal || 0;
  const advanceReq = quote.advanceRequiredAmount || 0;
  const balanceAmount = grandTotal - (quote.advancePaidAmount || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="relative w-full max-w-4xl bg-white text-gray-900 p-6 sm:p-10 rounded shadow-2xl space-y-6 my-6 print:m-0 print:shadow-none print:w-full print:max-w-none max-h-[92vh] overflow-y-auto">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="flex items-center justify-between border-b pb-4 print:hidden">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-gray-600">
            <Building2 className="w-4 h-4 text-[#D4AF37]" /> Printable B2B Quotation Document
          </div>

          <div className="flex items-center gap-2">
            <SquareButton
              variant="gold"
              size="sm"
              onClick={handlePrint}
              className="bg-[#0B132B] hover:bg-[#1C2541] text-[#D4AF37] border-[#D4AF37]"
            >
              <Printer className="w-4 h-4 mr-1" /> Print / Save as PDF
            </SquareButton>

            <button
              onClick={onClose}
              className="p-1 text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE QUOTATION SHEET CONTENT */}
        <div className="space-y-6 font-sans text-xs text-gray-800 printable-area">
          {/* Header Banner */}
          <div className="flex justify-between items-start border-b-2 border-gray-900 pb-4">
            <div>
              <h1 className="font-serif font-black text-2xl text-gray-900 uppercase tracking-wide">
                V S N CASHEWS
              </h1>
              <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700">
                Sovereign Grade Cashew Processors & Exporters
              </p>
              <p className="text-[10px] text-gray-600 mt-1 max-w-sm">
                Baikampady Industrial Area, Mangalore, Karnataka - 575011, India
              </p>
              <p className="text-[10px] text-gray-600 font-mono mt-0.5">
                GSTIN: 29AAAFV1234F1Z9 | FSSAI Lic: 11221334000889 | IEC: 0708091122
              </p>
            </div>

            <div className="text-right">
              <div className="inline-block px-3 py-1 bg-gray-900 text-amber-300 font-serif font-bold uppercase tracking-wider text-xs mb-2">
                FORMAL B2B QUOTATION
              </div>
              <div className="font-mono text-sm font-bold text-gray-900">{quote.quoteNumber}</div>
              <div className="text-[10px] text-gray-500">
                Date: {new Date(quote.createdAt).toLocaleDateString('en-IN')}
              </div>
              {quote.validUntil && (
                <div className="text-[10px] font-bold text-amber-800">
                  Valid Until: {new Date(quote.validUntil).toLocaleDateString('en-IN')}
                </div>
              )}
            </div>
          </div>

          {/* Customer & Business Details Box */}
          <div className="grid grid-cols-2 gap-4 border p-3 bg-gray-50 text-[11px]">
            <div className="space-y-1">
              <div className="font-bold text-gray-900 uppercase border-b pb-1 font-mono">
                CUSTOMER / BUYER DETAILS
              </div>
              <div className="font-bold text-sm text-gray-900">{quote.companyName}</div>
              <div>Contact Person: {quote.contactPerson}</div>
              <div>Email: {quote.email}</div>
              <div>Phone: {quote.phone}</div>
              <div>
                Location: {quote.city}, {quote.state} - {quote.pincode}
              </div>
              {quote.gstin && (
                <div className="font-mono font-bold text-amber-900 mt-1">
                  GSTIN: {quote.gstin}
                </div>
              )}
            </div>

            <div className="space-y-1 border-l pl-4">
              <div className="font-bold text-gray-900 uppercase border-b pb-1 font-mono">
                FACTORY DISPATCH & TERMS
              </div>
              <div>Dispatch Point: Mangalore Central Processing Unit</div>
              <div>HSN Code: 08013100 (Cashew Nuts Fresh/Dried)</div>
              <div>GST Tax Rate: 5% (CGST 2.5% + SGST 2.5% / IGST 5%)</div>
              <div>Advance Payment: {quote.advancePercentage || 25}% Deposit Required</div>
              <div>Packaging: Vacuum Sealed 10kg Master Tins / 50kg Export Drums</div>
            </div>
          </div>

          {/* Line Items Table */}
          <div>
            <table className="w-full text-left border text-xs">
              <thead className="bg-gray-900 text-amber-300 font-mono text-[10px] uppercase">
                <tr>
                  <th className="p-2 border">#</th>
                  <th className="p-2 border">Cashew Description & Grade</th>
                  <th className="p-2 border text-center">HSN</th>
                  <th className="p-2 border text-right">Quantity (KG)</th>
                  <th className="p-2 border text-right">Rate (₹/KG)</th>
                  <th className="p-2 border text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y text-gray-800 font-mono text-[11px]">
                {quote.items.map((it, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="p-2 border text-center">{idx + 1}</td>
                    <td className="p-2 border font-sans font-medium">
                      {it.productName}
                      <span className="block text-[10px] text-gray-500 font-mono">
                        Grade Code: {it.grade}
                      </span>
                    </td>
                    <td className="p-2 border text-center">08013100</td>
                    <td className="p-2 border text-right font-bold">{it.requestedQtyKg} KG</td>
                    <td className="p-2 border text-right">
                      {it.quotedUnitPricePerKg
                        ? `₹${it.quotedUnitPricePerKg.toLocaleString('en-IN')}`
                        : 'Under Review'}
                    </td>
                    <td className="p-2 border text-right font-bold">
                      {it.totalPrice
                        ? `₹${it.totalPrice.toLocaleString('en-IN')}`
                        : 'Under Review'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Calculation Box */}
          <div className="flex justify-end">
            <div className="w-full max-w-xs border text-xs divide-y bg-gray-50">
              <div className="flex justify-between p-2">
                <span className="font-mono text-gray-600">Subtotal Amount:</span>
                <span className="font-mono font-bold">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between p-2">
                <span className="font-mono text-gray-600">GST @ 5%:</span>
                <span className="font-mono font-bold">₹{gst.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-900 text-amber-300 font-bold">
                <span className="font-mono">Grand Total (Incl. GST):</span>
                <span className="font-mono text-sm">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between p-2 bg-amber-50 text-amber-900 font-bold">
                <span>Advance Required ({quote.advancePercentage || 25}%):</span>
                <span className="font-mono">₹{advanceReq.toLocaleString('en-IN')}</span>
              </div>
              {quote.advancePaidAmount ? (
                <div className="flex justify-between p-2 bg-purple-50 text-purple-900 font-bold">
                  <span>Advance Paid:</span>
                  <span className="font-mono">₹{quote.advancePaidAmount.toLocaleString('en-IN')}</span>
                </div>
              ) : null}
              <div className="flex justify-between p-2">
                <span className="font-mono text-gray-600">Balance on Dispatch:</span>
                <span className="font-mono font-bold text-gray-900">
                  ₹{balanceAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Bank Details & Terms */}
          <div className="grid grid-cols-2 gap-4 border p-3 text-[10px] bg-gray-50">
            <div>
              <div className="font-bold font-mono uppercase text-gray-900 mb-1">
                RTGS / NEFT BANK PAYMENT DETAILS
              </div>
              <div>Account Name: V S N CASHEWS PRIVATE LIMITED</div>
              <div>Bank Name: State Bank of India (SBI)</div>
              <div>Branch: Baikampady Industrial Area Branch, Mangalore</div>
              <div>Account Number: 398822001144</div>
              <div>IFSC Code: SBIN0004561</div>
            </div>

            <div>
              <div className="font-bold font-mono uppercase text-gray-900 mb-1">
                TERMS & CONDITIONS
              </div>
              <ol className="list-decimal list-inside space-y-0.5 text-gray-600">
                <li>Quotes valid for 14 calendar days from date of issue.</li>
                <li>Dispatch commences within 48 hours of advance receipt.</li>
                <li>Weight measured at time of factory packaging in Mangalore.</li>
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
              <div className="text-[10px] text-gray-500">Mangalore, Karnataka</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
