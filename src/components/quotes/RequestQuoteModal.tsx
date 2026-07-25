import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Building2,
  User,
  Mail,
  Phone,
  FileText,
  Plus,
  Trash2,
  CheckCircle2,
  Send,
  Package,
  Sparkles,
  MapPin,
  Scale,
} from 'lucide-react';
import { useQuotes } from '@/context/QuoteContext';
import { useCart } from '@/context/CartContext';
import { SquareButton } from '@/components/ui/SquareButton';
import { SquareInput } from '@/components/ui/SquareInput';

interface RequestQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessNavigate?: () => void;
}

const AVAILABLE_GRADES = [
  { name: 'Royal King Jumbo Whole (W-180)', grade: 'W-180 Jumbo' },
  { name: 'Sovereign Super Whole (W-240)', grade: 'W-240 Super' },
  { name: 'Mangalore Choice Whole (W-320)', grade: 'W-320 Choice' },
  { name: 'Export Grade Whole (W-400)', grade: 'W-400 Export' },
  { name: 'Splits (JH / JK) Premium', grade: 'JH / JK Splits' },
  { name: 'Large White Pieces (LWP) Industrial', grade: 'LWP Industrial' },
  { name: 'Roasted Salted Cashews Bulk', grade: 'Roasted W-320' },
  { name: 'Pepper & Herb Spiced Cashews Bulk', grade: 'Spiced Gourmet' },
];

export const RequestQuoteModal: React.FC<RequestQuoteModalProps> = ({
  isOpen,
  onClose,
  onSuccessNavigate,
}) => {
  const { requestQuote } = useQuotes();
  const { userProfile } = useCart();

  // Business Details Form State
  const [companyName, setCompanyName] = useState(userProfile?.name ? `${userProfile.name} Traders` : '');
  const [contactPerson, setContactPerson] = useState(userProfile?.name || '');
  const [email, setEmail] = useState(userProfile?.email || '');
  const [phone, setPhone] = useState('9845012345');
  const [gstin, setGstin] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [state, setState] = useState('Karnataka');
  const [pincode, setPincode] = useState('560038');
  const [notes, setNotes] = useState('');

  // Items State (default 1 row)
  const [items, setItems] = useState<
    { productName: string; grade: string; requestedQtyKg: number }[]
  >([
    {
      productName: AVAILABLE_GRADES[0].name,
      grade: AVAILABLE_GRADES[0].grade,
      requestedQtyKg: 100,
    },
  ]);

  // Error & Success Message
  const [errorMsg, setErrorMsg] = useState('');
  const [createdQuoteNumber, setCreatedQuoteNumber] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        productName: AVAILABLE_GRADES[1].name,
        grade: AVAILABLE_GRADES[1].grade,
        requestedQtyKg: 100,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length === 1) return;
    setItems(items.filter((_, idx) => idx !== index));
  };

  const handleItemChange = (
    index: number,
    field: 'productName' | 'requestedQtyKg',
    value: string | number
  ) => {
    const updated = [...items];
    if (field === 'productName') {
      const selected = AVAILABLE_GRADES.find((g) => g.name === value);
      updated[index].productName = value as string;
      updated[index].grade = selected ? selected.grade : 'Custom Grade';
    } else if (field === 'requestedQtyKg') {
      updated[index].requestedQtyKg = Math.max(1, Number(value) || 1);
    }
    setItems(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!companyName.trim()) {
      setErrorMsg('Company / Business Name is required');
      return;
    }
    if (!contactPerson.trim()) {
      setErrorMsg('Contact Person Name is required');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Valid Email Address is required');
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      setErrorMsg('Valid 10-digit Phone Number is required');
      return;
    }

    const newQuote = requestQuote({
      companyName,
      contactPerson,
      email,
      phone,
      gstin: gstin.toUpperCase(),
      city,
      state,
      pincode,
      items,
      notes,
    });

    setCreatedQuoteNumber(newQuote.quoteNumber);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl bg-[#0B132B] border-2 border-[#D4AF37] p-6 sm:p-8 text-[#F8F9FA] shadow-[0_0_50px_rgba(212,175,55,0.25)] my-8 max-h-[90vh] overflow-y-auto"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-[#D4AF37] border border-gray-700 hover:border-[#D4AF37] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-[#D4AF37] bg-[#1C2541] text-[#D4AF37] mb-2">
              <Building2 className="w-6 h-6" />
            </div>
            <h2 className="font-serif font-black text-xl sm:text-2xl text-[#F3E5AB]">
              Request B2B Wholesale Quotation
            </h2>
            <p className="text-xs text-gray-300 mt-1">
              Direct factory pricing from Mangalore Orchards for bulk cashew procurement & corporate gifting.
            </p>
          </div>

          {/* SUCCESS SCREEN */}
          {createdQuoteNumber ? (
            <div className="text-center py-8 space-y-4 bg-[#1C2541]/90 border border-emerald-500/50 p-6">
              <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif font-bold text-xl text-[#F3E5AB]">
                Quotation Request Submitted!
              </h3>
              <p className="text-sm font-mono text-[#D4AF37] font-bold">
                Quote Reference ID: {createdQuoteNumber}
              </p>
              <p className="text-xs text-gray-300 max-w-md mx-auto">
                Our Mangalore Wholesale Desk will review your bulk volume specifications and generate a formal GST quote with custom volume pricing within 2 hours.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <SquareButton
                  variant="gold"
                  onClick={() => {
                    onClose();
                    onSuccessNavigate?.();
                  }}
                >
                  View Quotations Dashboard
                </SquareButton>
                <SquareButton variant="outline" onClick={onClose}>
                  Close Window
                </SquareButton>
              </div>
            </div>
          ) : (
            /* REQUEST FORM */
            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMsg && (
                <div className="p-3 bg-red-950/60 border border-red-500 text-red-200 text-xs font-semibold">
                  {errorMsg}
                </div>
              )}

              {/* SECTION 1: BUSINESS DETAILS */}
              <div className="space-y-3">
                <h3 className="text-xs font-serif font-bold text-[#F3E5AB] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#D4AF37]/30 pb-1">
                  <Building2 className="w-4 h-4 text-[#D4AF37]" /> Business & Contact Profile
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <SquareInput
                    label="Company / Firm Name *"
                    placeholder="e.g. Sovereign Exports Pvt Ltd"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    icon={<Building2 className="w-3.5 h-3.5" />}
                  />

                  <SquareInput
                    label="Contact Person Name *"
                    placeholder="e.g. Suresh Hegde"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    icon={<User className="w-3.5 h-3.5" />}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <SquareInput
                    label="Business Email Address *"
                    type="email"
                    placeholder="wholesale@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={<Mail className="w-3.5 h-3.5" />}
                  />

                  <SquareInput
                    label="Mobile / Phone Number *"
                    placeholder="9845012345"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    icon={<Phone className="w-3.5 h-3.5" />}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <SquareInput
                    label="GSTIN Number (Optional)"
                    placeholder="29AAAAA0000A1Z5"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value.toUpperCase())}
                    icon={<FileText className="w-3.5 h-3.5" />}
                  />

                  <SquareInput
                    label="City *"
                    placeholder="e.g. Bengaluru"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />

                  <SquareInput
                    label="Pincode *"
                    placeholder="560038"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                  />
                </div>
              </div>

              {/* SECTION 2: CASHEW QUANTITY & GRADE BREAKDOWN */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-1">
                  <h3 className="text-xs font-serif font-bold text-[#F3E5AB] uppercase tracking-wider flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-[#D4AF37]" /> Cashew Grade & Quantity Breakdown
                  </h3>

                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1 font-mono font-bold cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Grade Row
                  </button>
                </div>

                <div className="space-y-2">
                  {items.map((item, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-12 gap-2 items-center bg-[#1C2541] p-3 border border-[#D4AF37]/30"
                    >
                      <div className="col-span-7 sm:col-span-8">
                        <label className="block text-[10px] text-gray-400 uppercase mb-1">
                          Select Cashew Grade #{idx + 1}
                        </label>
                        <select
                          value={item.productName}
                          onChange={(e) => handleItemChange(idx, 'productName', e.target.value)}
                          className="w-full bg-[#0B132B] text-[#F8F9FA] text-xs border border-[#D4AF37]/50 py-2 px-2 focus:outline-none focus:border-[#D4AF37] cursor-pointer"
                        >
                          {AVAILABLE_GRADES.map((g) => (
                            <option key={g.name} value={g.name}>
                              {g.name} ({g.grade})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-span-4 sm:col-span-3">
                        <label className="block text-[10px] text-gray-400 uppercase mb-1">
                          Quantity (in KG)
                        </label>
                        <input
                          type="number"
                          min="1"
                          step="10"
                          value={item.requestedQtyKg}
                          onChange={(e) => handleItemChange(idx, 'requestedQtyKg', e.target.value)}
                          className="w-full bg-[#0B132B] text-[#F3E5AB] font-mono text-xs border border-[#D4AF37]/50 py-2 px-2 focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>

                      <div className="col-span-1 text-right pt-4">
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="p-1.5 text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
                            title="Remove Row"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 3: NOTES & PACKAGING SPECS */}
              <div className="space-y-2">
                <label className="block text-xs font-serif font-bold text-[#F3E5AB] uppercase">
                  Special Notes / Export Packaging Specs (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Requires 50kg vacuum tin packing, nitrogen flushing, custom corporate sleeve branding..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[#1C2541] border border-[#D4AF37]/40 text-[#F8F9FA] p-3 text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <SquareButton type="submit" variant="gold" fullWidth className="py-3 text-sm">
                <Send className="w-4 h-4 mr-2" /> Submit Quotation Request
              </SquareButton>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
