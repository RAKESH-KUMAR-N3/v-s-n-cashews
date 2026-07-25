import React, { useRef, useState } from 'react';
import {
  Printer,
  Download,
  Mail,
  CheckCircle,
  CreditCard,
  Building2,
  FileText,
  X,
  Phone,
  ShieldCheck,
  QrCode,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { Invoice } from '@/types';
import { SquareButton } from '@/components/ui/SquareButton';
import { SquareBadge } from '@/components/ui/SquareBadge';
import { useInvoice } from '@/context/InvoiceContext';
import { InvoiceEmailModal } from './InvoiceEmailModal';

interface TaxInvoicePrintViewProps {
  invoice: Invoice;
  onClose?: () => void;
  onRecordPaymentClick?: () => void;
}

// Convert numbers to words (Indian Numbering System)
function numberToIndianWords(num: number): string {
  if (num === 0) return "Zero Rupees Only";
  
  const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
  const b = ['', '', 'Twenty ', 'Thirty ', 'Forty ', 'Fifty ', 'Sixty ', 'Seventy ', 'Eighty ', 'Ninety '];

  function inWords(n: number): string {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + a[n % 10];
    if (n < 1000) return a[Math.floor(n / 100)] + 'Hundred ' + inWords(n % 100);
    if (n < 100000) return inWords(Math.floor(n / 1000)) + 'Thousand ' + inWords(n % 1000);
    if (n < 10000000) return inWords(Math.floor(n / 100000)) + 'Lakh ' + inWords(n % 100000);
    return inWords(Math.floor(n / 10000000)) + 'Crore ' + inWords(n % 10000000);
  }

  const integerPart = Math.floor(Math.abs(num));
  const decimalPart = Math.round((Math.abs(num) - integerPart) * 100);
  
  let result = inWords(integerPart).trim() + " Rupees";
  if (decimalPart > 0) {
    result += " and " + inWords(decimalPart).trim() + " Paise";
  }
  return result + " Only";
}

export const TaxInvoicePrintView: React.FC<TaxInvoicePrintViewProps> = ({
  invoice,
  onClose,
  onRecordPaymentClick
}) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    // Trigger window print as PDF save or simulate high-res document export
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
    window.print();
  };

  const isInterstate = invoice.isInterstate;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm p-2 sm:p-4 md:p-6 flex justify-center">
      <div className="bg-[#0B132B] border border-[#D4AF37]/50 w-full max-w-4xl text-gray-100 flex flex-col my-auto shadow-2xl rounded-none">
        {/* Action Header bar (Hidden during printing) */}
        <div className="p-4 bg-[#1C2541] border-b border-[#D4AF37]/30 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#D4AF37]" />
            <div>
              <h2 className="font-serif font-bold text-base text-[#F3E5AB]">
                Tax Invoice #{invoice.invoiceNumber}
              </h2>
              <p className="text-xs text-gray-400">
                Official GST Compliance Document & Receipt
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <SquareButton variant="gold" onClick={handlePrint} className="py-2 text-xs font-bold">
              <Printer className="w-4 h-4 mr-1.5" /> Print / Save PDF
            </SquareButton>

            <SquareButton variant="outline" onClick={handleDownloadPdf} className="py-2 text-xs font-bold border-[#D4AF37]/50 text-[#F3E5AB]">
              <Download className="w-4 h-4 mr-1.5" /> Download Document
            </SquareButton>

            <SquareButton variant="outline" onClick={() => setShowEmailModal(true)} className="py-2 text-xs font-bold border-[#D4AF37]/50 text-[#F3E5AB]">
              <Mail className="w-4 h-4 mr-1.5" /> Email Customer
            </SquareButton>

            {onRecordPaymentClick && invoice.paymentStatus !== 'PAID' && (
              <SquareButton variant="gold" onClick={onRecordPaymentClick} className="py-2 text-xs font-bold text-[#0B132B]">
                <CreditCard className="w-4 h-4 mr-1.5" /> Record Payment
              </SquareButton>
            )}

            {onClose && (
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white transition-colors cursor-pointer border border-transparent hover:border-[#D4AF37]/40"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {downloadSuccess && (
          <div className="bg-emerald-950/80 border-b border-emerald-500/50 p-2 text-center text-xs text-emerald-300 font-mono print:hidden">
            <CheckCircle className="w-4 h-4 inline mr-1 text-emerald-400" />
            Invoice print dialog opened! Select "Save as PDF" to download high-resolution GST invoice.
          </div>
        )}

        {/* Printable Tax Invoice Sheet */}
        <div
          ref={printRef}
          className="p-6 sm:p-10 bg-white text-gray-900 font-sans print:p-0 print:m-0 print:text-black print:bg-white overflow-x-auto"
          id="tax-invoice-sheet"
        >
          {/* Header Block */}
          <div className="border-b-2 border-gray-900 pb-4 mb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-gray-900 text-[#D4AF37] px-2 py-0.5 font-serif font-black text-sm tracking-wider uppercase">
                    V S N CASHEWS
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-gray-600 border border-gray-400 px-1.5 py-0.5">
                    ESTD 1988
                  </span>
                </div>
                <h1 className="font-serif text-lg font-extrabold text-gray-900 uppercase tracking-tight">
                  {invoice.companyDetails.name}
                </h1>
                <p className="text-xs text-gray-600 font-medium">
                  {invoice.companyDetails.address}, {invoice.companyDetails.city}, {invoice.companyDetails.state} - {invoice.companyDetails.pincode}
                </p>
                <div className="text-[11px] text-gray-700 mt-1 space-x-3 font-mono">
                  <span><strong>GSTIN:</strong> {invoice.companyDetails.gstin}</span>
                  <span><strong>FSSAI:</strong> {invoice.companyDetails.fssai}</span>
                  <span><strong>PAN:</strong> {invoice.companyDetails.pan}</span>
                </div>
                <div className="text-[11px] text-gray-600 space-x-3 mt-0.5">
                  <span>Email: {invoice.companyDetails.email}</span>
                  <span>Phone: {invoice.companyDetails.phone}</span>
                </div>
              </div>

              <div className="text-right sm:self-start border-l-2 sm:border-l-0 sm:border-r-0 border-gray-900 pl-4 sm:pl-0">
                <div className="inline-block bg-gray-900 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 mb-2">
                  TAX INVOICE
                </div>
                <div className="text-xs space-y-1 font-mono">
                  <div><span className="text-gray-600">Invoice No:</span> <strong className="text-gray-900">{invoice.invoiceNumber}</strong></div>
                  <div><span className="text-gray-600">Invoice Date:</span> {invoice.invoiceDate}</div>
                  <div><span className="text-gray-600">Payment Due:</span> {invoice.dueDate}</div>
                  {invoice.referenceId && (
                    <div><span className="text-gray-600">Ref {invoice.referenceType}:</span> <strong>{invoice.referenceId}</strong></div>
                  )}
                  <div>
                    <span className="text-gray-600">Supply State:</span> {invoice.companyDetails.state} (Code: 29)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Billed To & Shipped To Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 bg-gray-50 border border-gray-300 mb-4 text-xs">
            <div>
              <h3 className="font-bold text-gray-900 uppercase tracking-wider text-[11px] border-b border-gray-300 pb-1 mb-1.5 flex items-center justify-between">
                <span>BILLED TO (RECIPIENT)</span>
                {invoice.customerDetails.gstin && (
                  <span className="text-[10px] text-emerald-800 font-mono font-bold bg-emerald-100 px-1">GST REGISTERED</span>
                )}
              </h3>
              <div className="font-bold text-sm text-gray-900">
                {invoice.customerDetails.companyName || invoice.customerDetails.name}
              </div>
              {invoice.customerDetails.companyName && (
                <div className="text-gray-700">Attn: {invoice.customerDetails.name}</div>
              )}
              <div className="text-gray-600 mt-1">{invoice.customerDetails.address}</div>
              <div className="text-gray-600">{invoice.customerDetails.city}, {invoice.customerDetails.state} - {invoice.customerDetails.pincode}</div>
              <div className="mt-1 space-y-0.5 font-mono text-[11px]">
                {invoice.customerDetails.gstin && (
                  <div><strong>GSTIN:</strong> {invoice.customerDetails.gstin}</div>
                )}
                <div><strong>Phone:</strong> {invoice.customerDetails.phone}</div>
                <div><strong>Email:</strong> {invoice.customerDetails.email}</div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 uppercase tracking-wider text-[11px] border-b border-gray-300 pb-1 mb-1.5">
                PAYMENT STATUS & TAX TYPE
              </h3>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Status:</span>
                  <span
                    className={`font-bold px-2 py-0.5 text-xs font-mono uppercase ${
                      invoice.paymentStatus === 'PAID'
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-400'
                        : invoice.paymentStatus === 'PARTIALLY_PAID'
                        ? 'bg-amber-100 text-amber-900 border border-amber-400'
                        : 'bg-rose-100 text-rose-900 border border-rose-400'
                    }`}
                  >
                    {invoice.paymentStatus.replace('_', ' ')}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Tax Mechanism:</span>{' '}
                  <strong className="font-mono text-gray-900">
                    {isInterstate ? 'IGST (Interstate Supply)' : 'CGST + SGST (Intrastate Supply)'}
                  </strong>
                </div>
                {invoice.paymentReference && (
                  <div className="font-mono text-[11px]">
                    <span className="text-gray-600">Payment Ref:</span> {invoice.paymentReference} ({invoice.paymentMethod || 'Online'})
                  </div>
                )}
                {invoice.paymentDate && (
                  <div className="font-mono text-[11px]">
                    <span className="text-gray-600">Payment Date:</span> {invoice.paymentDate}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-gray-900 mb-4 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-900 text-white font-mono text-[10px] uppercase tracking-wider">
                  <th className="p-2 border-r border-gray-700 text-center w-8">#</th>
                  <th className="p-2 border-r border-gray-700">Item Description</th>
                  <th className="p-2 border-r border-gray-700 text-center">HSN</th>
                  <th className="p-2 border-r border-gray-700 text-right">Qty</th>
                  <th className="p-2 border-r border-gray-700 text-right">Rate (₹)</th>
                  <th className="p-2 border-r border-gray-700 text-right">Taxable (₹)</th>
                  {!isInterstate ? (
                    <>
                      <th className="p-2 border-r border-gray-700 text-right">CGST</th>
                      <th className="p-2 border-r border-gray-700 text-right">SGST</th>
                    </>
                  ) : (
                    <th className="p-2 border-r border-gray-700 text-right">IGST</th>
                  )}
                  <th className="p-2 text-right">Total (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300">
                {invoice.items.map((item, idx) => (
                  <tr key={item.id || idx} className="hover:bg-gray-50 text-[11px]">
                    <td className="p-2 border-r border-gray-300 text-center font-mono">{idx + 1}</td>
                    <td className="p-2 border-r border-gray-300 font-medium text-gray-900">
                      {item.description}
                    </td>
                    <td className="p-2 border-r border-gray-300 text-center font-mono">{item.hsnCode}</td>
                    <td className="p-2 border-r border-gray-300 text-right font-mono font-bold">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="p-2 border-r border-gray-300 text-right font-mono">
                      ₹{item.unitPrice.toLocaleString('en-IN')}
                    </td>
                    <td className="p-2 border-r border-gray-300 text-right font-mono font-bold">
                      ₹{item.taxableValue.toLocaleString('en-IN')}
                    </td>
                    {!isInterstate ? (
                      <>
                        <td className="p-2 border-r border-gray-300 text-right font-mono text-gray-700">
                          {item.cgstRate}%<br />₹{item.cgstAmount.toLocaleString('en-IN')}
                        </td>
                        <td className="p-2 border-r border-gray-300 text-right font-mono text-gray-700">
                          {item.sgstRate}%<br />₹{item.sgstAmount.toLocaleString('en-IN')}
                        </td>
                      </>
                    ) : (
                      <td className="p-2 border-r border-gray-300 text-right font-mono text-gray-700">
                        {item.igstRate}%<br />₹{item.igstAmount.toLocaleString('en-IN')}
                      </td>
                    )}
                    <td className="p-2 text-right font-mono font-bold text-gray-900">
                      ₹{item.total.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tax Breakdown & Calculations Footer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-xs">
            {/* HSN Summary & Bank details */}
            <div className="space-y-3">
              <div className="p-2.5 bg-gray-50 border border-gray-300">
                <h4 className="font-bold text-gray-900 uppercase text-[10px] tracking-wider mb-1">
                  HSN / SAC TAX SUMMARY
                </h4>
                <table className="w-full text-[10px] font-mono border-collapse">
                  <thead>
                    <tr className="bg-gray-200 border-b border-gray-400">
                      <th className="p-1 text-left">HSN</th>
                      <th className="p-1 text-right">Taxable</th>
                      {!isInterstate ? (
                        <>
                          <th className="p-1 text-right">CGST</th>
                          <th className="p-1 text-right">SGST</th>
                        </>
                      ) : (
                        <th className="p-1 text-right">IGST</th>
                      )}
                      <th className="p-1 text-right">Tax Amt</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="p-1 font-bold">08013200</td>
                      <td className="p-1 text-right">₹{invoice.totalTaxable.toLocaleString('en-IN')}</td>
                      {!isInterstate ? (
                        <>
                          <td className="p-1 text-right">₹{invoice.totalCgst.toLocaleString('en-IN')}</td>
                          <td className="p-1 text-right">₹{invoice.totalSgst.toLocaleString('en-IN')}</td>
                        </>
                      ) : (
                        <td className="p-1 text-right">₹{invoice.totalIgst.toLocaleString('en-IN')}</td>
                      )}
                      <td className="p-1 text-right font-bold">₹{invoice.totalTax.toLocaleString('en-IN')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Bank Account Details for NEFT/RTGS */}
              <div className="p-2.5 border border-gray-300 bg-amber-50/50 flex gap-3 items-center">
                <div className="flex-1 text-[11px]">
                  <h4 className="font-bold text-gray-900 uppercase text-[10px] tracking-wider mb-0.5 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-amber-800" /> COMPANY BANK REMITTANCE DETAILS
                  </h4>
                  <div className="font-mono text-gray-800 space-y-0.5">
                    <div>Bank: <strong>{invoice.companyDetails.bankName}</strong> ({invoice.companyDetails.branch})</div>
                    <div>Account Name: <strong>{invoice.companyDetails.accountName}</strong></div>
                    <div>Account No: <strong className="text-gray-900">{invoice.companyDetails.accountNumber}</strong></div>
                    <div>IFSC Code: <strong>{invoice.companyDetails.ifscCode}</strong></div>
                  </div>
                </div>
                <div className="text-center border-l border-gray-300 pl-3">
                  <QrCode className="w-12 h-12 text-gray-800 mx-auto" />
                  <span className="text-[9px] font-mono text-gray-600 block mt-0.5">UPI: {invoice.companyDetails.upiId}</span>
                </div>
              </div>
            </div>

            {/* Total Calculations Block */}
            <div className="p-3 bg-gray-50 border border-gray-900 text-xs font-mono space-y-1.5 self-start">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal (Taxable Value):</span>
                <span>₹{invoice.subtotal.toLocaleString('en-IN')}</span>
              </div>

              {!isInterstate ? (
                <>
                  <div className="flex justify-between text-gray-700">
                    <span>CGST Total (2.5%):</span>
                    <span>+ ₹{invoice.totalCgst.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>SGST Total (2.5%):</span>
                    <span>+ ₹{invoice.totalSgst.toLocaleString('en-IN')}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between text-gray-700">
                  <span>IGST Total (5.0%):</span>
                  <span>+ ₹{invoice.totalIgst.toLocaleString('en-IN')}</span>
                </div>
              )}

              {invoice.shippingCharge > 0 && (
                <div className="flex justify-between text-gray-700">
                  <span>Freight & Handling:</span>
                  <span>+ ₹{invoice.shippingCharge.toLocaleString('en-IN')}</span>
                </div>
              )}

              {invoice.discount > 0 && (
                <div className="flex justify-between text-emerald-800 font-bold">
                  <span>Trade Discount / Concession:</span>
                  <span>- ₹{invoice.discount.toLocaleString('en-IN')}</span>
                </div>
              )}

              {invoice.roundOff !== 0 && (
                <div className="flex justify-between text-gray-500 text-[10px]">
                  <span>Round Off:</span>
                  <span>{invoice.roundOff > 0 ? '+' : ''}₹{invoice.roundOff.toFixed(2)}</span>
                </div>
              )}

              <div className="border-t-2 border-gray-900 pt-1.5 flex justify-between font-extrabold text-sm text-gray-900">
                <span>GRAND TOTAL (INCL. GST):</span>
                <span>₹{invoice.grandTotal.toLocaleString('en-IN')}</span>
              </div>

              <div className="border-t border-gray-300 pt-1 flex justify-between text-emerald-900 font-bold text-[11px]">
                <span>Amount Settled / Paid:</span>
                <span>₹{invoice.amountPaid.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between text-rose-900 font-bold text-[11px] bg-rose-50 p-1 border border-rose-200">
                <span>BALANCE OUTSTANDING:</span>
                <span>₹{invoice.balanceDue.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Amount in Words */}
          <div className="p-2 bg-gray-100 border border-gray-400 mb-4 text-xs font-mono">
            <strong className="text-gray-900 uppercase">Amount in Words:</strong>{' '}
            <span className="italic font-bold text-gray-800">{numberToIndianWords(invoice.grandTotal)}</span>
          </div>

          {/* Terms & Declaration & Signature Block */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-400 pt-3 text-[10px] text-gray-700">
            <div>
              <h5 className="font-bold uppercase text-gray-900 mb-1">TERMS & CONDITIONS:</h5>
              <ol className="list-decimal list-inside space-y-0.5 leading-tight">
                {invoice.termsAndConditions?.map((term, i) => (
                  <li key={i}>{term}</li>
                ))}
              </ol>
            </div>

            <div className="text-right flex flex-col justify-between h-full pt-2">
              <div className="font-bold text-gray-900">
                For {invoice.companyDetails.name}
              </div>
              <div className="my-4">
                <div className="inline-block border border-dashed border-gray-400 p-2 text-center text-[9px] text-gray-500 font-mono">
                  [OFFICIAL DIGITAL SEAL & SIGNATURE]
                </div>
              </div>
              <div className="font-bold text-gray-900 uppercase border-t border-gray-400 pt-1 inline-block self-end">
                AUTHORISED SIGNATORY
              </div>
            </div>
          </div>
        </div>
      </div>

      {showEmailModal && (
        <InvoiceEmailModal
          invoice={invoice}
          onClose={() => setShowEmailModal(false)}
        />
      )}
    </div>
  );
};
