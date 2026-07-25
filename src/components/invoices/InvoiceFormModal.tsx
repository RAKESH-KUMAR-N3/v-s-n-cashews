import React, { useState } from 'react';
import { Plus, Trash2, X, Calculator, ShieldCheck, FileText } from 'lucide-react';
import { Invoice, InvoiceItem, InvoicePaymentStatus } from '@/types';
import { SquareButton } from '@/components/ui/SquareButton';
import { SquareInput } from '@/components/ui/SquareInput';
import { useInvoice, VSN_COMPANY_DETAILS } from '@/context/InvoiceContext';

interface InvoiceFormModalProps {
  existingInvoice?: Invoice;
  onClose: () => void;
  onSaveSuccess?: (invoice: Invoice) => void;
}

export const InvoiceFormModal: React.FC<InvoiceFormModalProps> = ({
  existingInvoice,
  onClose,
  onSaveSuccess
}) => {
  const { createInvoice, updatePaymentStatus } = useInvoice();

  const [customerName, setCustomerName] = useState(existingInvoice?.customerDetails.name || '');
  const [companyName, setCompanyName] = useState(existingInvoice?.customerDetails.companyName || '');
  const [gstin, setGstin] = useState(existingInvoice?.customerDetails.gstin || '');
  const [email, setEmail] = useState(existingInvoice?.customerDetails.email || '');
  const [phone, setPhone] = useState(existingInvoice?.customerDetails.phone || '');
  const [address, setAddress] = useState(existingInvoice?.customerDetails.address || '');
  const [city, setCity] = useState(existingInvoice?.customerDetails.city || 'Mangalore');
  const [state, setState] = useState(existingInvoice?.customerDetails.state || 'Karnataka');
  const [pincode, setPincode] = useState(existingInvoice?.customerDetails.pincode || '575001');

  const [isInterstate, setIsInterstate] = useState<boolean>(
    existingInvoice ? existingInvoice.isInterstate : state.toLowerCase() !== 'karnataka'
  );

  const [items, setItems] = useState<
    Array<{
      id: string;
      description: string;
      hsnCode: string;
      quantity: number;
      unit: string;
      unitPrice: number;
      gstRate: number;
    }>
  >(
    existingInvoice
      ? existingInvoice.items.map(item => ({
          id: item.id,
          description: item.description,
          hsnCode: item.hsnCode,
          quantity: item.quantity,
          unit: item.unit,
          unitPrice: item.unitPrice,
          gstRate: item.gstRate
        }))
      : [
          {
            id: 'item-1',
            description: 'King Jumbo Cashews W-180 Vacuum Sealed',
            hsnCode: '08013200',
            quantity: 10,
            unit: 'Kg',
            unitPrice: 1100,
            gstRate: 5
          }
        ]
  );

  const [shippingCharge, setShippingCharge] = useState<number>(existingInvoice?.shippingCharge || 0);
  const [discount, setDiscount] = useState<number>(existingInvoice?.discount || 0);
  const [notes, setNotes] = useState<string>(existingInvoice?.notes || 'GST Tax Invoice for wholesale cashew supply.');

  const [paymentStatus, setPaymentStatus] = useState<InvoicePaymentStatus>(
    existingInvoice?.paymentStatus || 'UNPAID'
  );
  const [amountPaid, setAmountPaid] = useState<number>(existingInvoice?.amountPaid || 0);
  const [paymentMethod, setPaymentMethod] = useState<string>(existingInvoice?.paymentMethod || 'UPI / NEFT');
  const [paymentReference, setPaymentReference] = useState<string>(existingInvoice?.paymentReference || '');

  const handleStateChange = (newVal: string) => {
    setState(newVal);
    if (newVal.trim().toLowerCase() !== 'karnataka') {
      setIsInterstate(true);
    } else {
      setIsInterstate(false);
    }
  };

  const addItemRow = () => {
    setItems(prev => [
      ...prev,
      {
        id: `item-${Date.now()}`,
        description: 'Roasted Salted Cashews W-240',
        hsnCode: '08013200',
        quantity: 5,
        unit: 'Kg',
        unitPrice: 950,
        gstRate: 5
      }
    ]);
  };

  const removeItemRow = (id: string) => {
    if (items.length === 1) return;
    setItems(prev => prev.filter(it => it.id !== id));
  };

  const updateItem = (id: string, field: string, value: any) => {
    setItems(prev =>
      prev.map(it => {
        if (it.id !== id) return it;
        return { ...it, [field]: value };
      })
    );
  };

  // Compute calculated line items & totals
  const processedItems: InvoiceItem[] = items.map(it => {
    const qty = Number(it.quantity) || 0;
    const price = Number(it.unitPrice) || 0;
    const taxableValue = qty * price;
    const gstRate = Number(it.gstRate) || 5;

    const cgstRate = isInterstate ? 0 : gstRate / 2;
    const sgstRate = isInterstate ? 0 : gstRate / 2;
    const igstRate = isInterstate ? gstRate : 0;

    const cgstAmount = isInterstate ? 0 : Math.round(taxableValue * (cgstRate / 100) * 100) / 100;
    const sgstAmount = isInterstate ? 0 : Math.round(taxableValue * (sgstRate / 100) * 100) / 100;
    const igstAmount = isInterstate ? Math.round(taxableValue * (igstRate / 100) * 100) / 100 : 0;
    const totalLineTax = cgstAmount + sgstAmount + igstAmount;

    return {
      id: it.id,
      description: it.description,
      hsnCode: it.hsnCode || '08013200',
      quantity: qty,
      unit: it.unit || 'Kg',
      unitPrice: price,
      gstRate,
      taxableValue,
      cgstRate,
      cgstAmount,
      sgstRate,
      sgstAmount,
      igstRate,
      igstAmount,
      total: taxableValue + totalLineTax
    };
  });

  const subtotal = processedItems.reduce((sum, item) => sum + item.taxableValue, 0);
  const totalCgst = processedItems.reduce((sum, item) => sum + item.cgstAmount, 0);
  const totalSgst = processedItems.reduce((sum, item) => sum + item.sgstAmount, 0);
  const totalIgst = processedItems.reduce((sum, item) => sum + item.igstAmount, 0);
  const totalTax = totalCgst + totalSgst + totalIgst;
  const rawGrandTotal = subtotal + totalTax + Number(shippingCharge) - Number(discount);
  const grandTotal = Math.max(0, Math.round(rawGrandTotal));
  const roundOff = Math.round((grandTotal - rawGrandTotal) * 100) / 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || items.length === 0) return;

    const today = new Date().toISOString().split('T')[0];
    const dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    let actualPaid = amountPaid;
    if (paymentStatus === 'PAID') {
      actualPaid = grandTotal;
    } else if (paymentStatus === 'UNPAID') {
      actualPaid = 0;
    }

    const created = createInvoice({
      referenceType: 'MANUAL',
      invoiceDate: today,
      dueDate,
      customerDetails: {
        name: customerName,
        companyName: companyName || undefined,
        gstin: gstin || undefined,
        email,
        phone,
        address,
        city,
        state,
        pincode
      },
      items: processedItems,
      isInterstate,
      subtotal,
      totalTaxable: subtotal,
      totalCgst,
      totalSgst,
      totalIgst,
      totalTax,
      discount: Number(discount) || 0,
      shippingCharge: Number(shippingCharge) || 0,
      roundOff,
      grandTotal,
      paymentStatus,
      amountPaid: actualPaid,
      balanceDue: Math.max(0, grandTotal - actualPaid),
      paymentMethod,
      paymentReference,
      notes
    });

    if (onSaveSuccess) onSaveSuccess(created);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm p-3 sm:p-6 flex justify-center items-start">
      <div className="bg-[#0B132B] border border-[#D4AF37] w-full max-w-3xl my-auto text-gray-100 shadow-2xl relative">
        <div className="p-4 bg-[#1C2541] border-b border-[#D4AF37]/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="font-serif font-bold text-base text-[#F3E5AB]">
              {existingInvoice ? `Edit Tax Invoice #${existingInvoice.invoiceNumber}` : 'Create Automatic GST Tax Invoice'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Customer & GST Info */}
          <div>
            <h4 className="text-xs font-mono uppercase text-[#D4AF37] tracking-wider mb-3 font-bold border-b border-[#D4AF37]/20 pb-1">
              Customer & B2B GST Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#F3E5AB] mb-1">
                  Customer / Contact Person Name *
                </label>
                <SquareInput
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                  placeholder="e.g. Rajesh Kumar"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[#F3E5AB] mb-1">
                  Company / Firm Name (Optional)
                </label>
                <SquareInput
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Mangalore Sweets & Bakers"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[#F3E5AB] mb-1">
                  Customer GSTIN (For ITC)
                </label>
                <SquareInput
                  type="text"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value.toUpperCase())}
                  placeholder="e.g. 29ABCDE1234F1Z5"
                  maxLength={15}
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[#F3E5AB] mb-1">
                  Email Address *
                </label>
                <SquareInput
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="billing@customer.com"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[#F3E5AB] mb-1">
                  Phone Number *
                </label>
                <SquareInput
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="+91 98450 12345"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[#F3E5AB] mb-1">
                  City *
                </label>
                <SquareInput
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[#F3E5AB] mb-1">
                  State *
                </label>
                <SquareInput
                  type="text"
                  value={state}
                  onChange={(e) => handleStateChange(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[#F3E5AB] mb-1">
                  Pincode *
                </label>
                <SquareInput
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-mono uppercase text-[#F3E5AB] mb-1">
                  Street Address *
                </label>
                <SquareInput
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  placeholder="Building, Street, Landmark"
                />
              </div>
            </div>

            <div className="mt-3 p-2 bg-[#1C2541] border border-[#D4AF37]/30 flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isInterstate}
                  onChange={(e) => setIsInterstate(e.target.checked)}
                  className="accent-[#D4AF37]"
                />
                <span className="font-mono text-[#F3E5AB]">
                  Interstate Supply (Apply 5% IGST instead of 2.5% CGST + 2.5% SGST)
                </span>
              </label>
              <span className="text-[10px] text-gray-400 font-mono">
                {isInterstate ? 'IGST Applicable' : 'CGST + SGST Applicable'}
              </span>
            </div>
          </div>

          {/* Line Items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-mono uppercase text-[#D4AF37] tracking-wider font-bold">
                Invoice Line Items
              </h4>
              <button
                type="button"
                onClick={addItemRow}
                className="text-xs font-mono text-[#D4AF37] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Item Row
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={item.id} className="p-3 bg-[#1C2541]/70 border border-[#D4AF37]/30 grid grid-cols-12 gap-2 text-xs">
                  <div className="col-span-12 sm:col-span-4">
                    <label className="block text-[10px] text-gray-400 font-mono mb-0.5">Description</label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      className="w-full bg-[#0B132B] border border-gray-700 p-1.5 text-xs text-white"
                      required
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-2">
                    <label className="block text-[10px] text-gray-400 font-mono mb-0.5">HSN Code</label>
                    <input
                      type="text"
                      value={item.hsnCode}
                      onChange={(e) => updateItem(item.id, 'hsnCode', e.target.value)}
                      className="w-full bg-[#0B132B] border border-gray-700 p-1.5 text-xs text-white font-mono text-center"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-2">
                    <label className="block text-[10px] text-gray-400 font-mono mb-0.5">Qty & Unit</label>
                    <div className="flex gap-1">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', Math.max(1, parseInt(e.target.value) || 0))}
                        className="w-full bg-[#0B132B] border border-gray-700 p-1.5 text-xs text-white font-mono text-right"
                      />
                      <input
                        type="text"
                        value={item.unit}
                        onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                        className="w-12 bg-[#0B132B] border border-gray-700 p-1.5 text-xs text-white text-center"
                      />
                    </div>
                  </div>

                  <div className="col-span-6 sm:col-span-2">
                    <label className="block text-[10px] text-gray-400 font-mono mb-0.5">Rate (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(item.id, 'unitPrice', Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-full bg-[#0B132B] border border-gray-700 p-1.5 text-xs text-white font-mono text-right"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-2 flex items-end justify-between gap-2">
                    <div className="flex-1">
                      <label className="block text-[10px] text-gray-400 font-mono mb-0.5">GST %</label>
                      <input
                        type="number"
                        value={item.gstRate}
                        onChange={(e) => updateItem(item.id, 'gstRate', parseFloat(e.target.value) || 5)}
                        className="w-full bg-[#0B132B] border border-gray-700 p-1.5 text-xs text-white font-mono text-center"
                      />
                    </div>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItemRow(item.id)}
                        className="p-2 text-rose-400 hover:text-rose-300 cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Charges & Discounts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-[#1C2541]/40 border border-[#D4AF37]/20">
            <div>
              <label className="block text-[11px] font-mono text-gray-300 mb-1">
                Freight / Delivery Charges (₹)
              </label>
              <input
                type="number"
                min="0"
                value={shippingCharge}
                onChange={(e) => setShippingCharge(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#0B132B] border border-gray-700 p-2 text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-gray-300 mb-1">
                Discount Concession (₹)
              </label>
              <input
                type="number"
                min="0"
                value={discount}
                onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#0B132B] border border-gray-700 p-2 text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-gray-300 mb-1">
                Payment Status
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as InvoicePaymentStatus)}
                className="w-full bg-[#0B132B] border border-gray-700 p-2 text-xs text-[#F3E5AB] font-bold font-mono"
              >
                <option value="UNPAID">UNPAID</option>
                <option value="PARTIALLY_PAID">PARTIALLY PAID</option>
                <option value="PAID">FULLY PAID</option>
              </select>
            </div>
          </div>

          {paymentStatus !== 'UNPAID' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-emerald-950/40 border border-emerald-500/40 text-xs">
              <div>
                <label className="block text-[10px] text-emerald-300 font-mono mb-1">Amount Paid (₹)</label>
                <input
                  type="number"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#0B132B] border border-emerald-700 p-1.5 text-xs text-emerald-200 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] text-emerald-300 font-mono mb-1">Payment Method</label>
                <input
                  type="text"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  placeholder="UPI / RTGS / Card"
                  className="w-full bg-[#0B132B] border border-emerald-700 p-1.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] text-emerald-300 font-mono mb-1">Transaction Ref / UTR</label>
                <input
                  type="text"
                  value={paymentReference}
                  onChange={(e) => setPaymentReference(e.target.value)}
                  placeholder="e.g. HDFCN26201..."
                  className="w-full bg-[#0B132B] border border-emerald-700 p-1.5 text-xs text-white font-mono"
                />
              </div>
            </div>
          )}

          {/* Automatic Calculation Preview */}
          <div className="p-4 bg-[#1C2541] border border-[#D4AF37]/50 font-mono text-xs space-y-1.5 text-gray-200">
            <div className="flex justify-between text-gray-400">
              <span>Subtotal Taxable:</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            {!isInterstate ? (
              <>
                <div className="flex justify-between text-gray-400">
                  <span>CGST (2.5%):</span>
                  <span>₹{totalCgst.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>SGST (2.5%):</span>
                  <span>₹{totalSgst.toLocaleString('en-IN')}</span>
                </div>
              </>
            ) : (
              <div className="flex justify-between text-gray-400">
                <span>IGST (5.0%):</span>
                <span>₹{totalIgst.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-400">
              <span>Total GST Tax:</span>
              <span>₹{totalTax.toLocaleString('en-IN')}</span>
            </div>
            <div className="border-t border-gray-700 pt-1 flex justify-between font-bold text-base text-[#D4AF37]">
              <span>Calculated Grand Total:</span>
              <span>₹{grandTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <SquareButton type="button" variant="outline" onClick={onClose} className="px-6 border-gray-600 text-gray-300">
              Cancel
            </SquareButton>
            <SquareButton type="submit" variant="gold" className="px-8 font-bold text-xs uppercase">
              Save & Issue Tax Invoice
            </SquareButton>
          </div>
        </form>
      </div>
    </div>
  );
};
