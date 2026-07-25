import React, { useState } from 'react';
import { Mail, CheckCircle, Send, X, AlertCircle } from 'lucide-react';
import { Invoice } from '@/types';
import { SquareButton } from '@/components/ui/SquareButton';
import { SquareInput } from '@/components/ui/SquareInput';
import { useInvoice } from '@/context/InvoiceContext';

interface InvoiceEmailModalProps {
  invoice: Invoice;
  onClose: () => void;
}

export const InvoiceEmailModal: React.FC<InvoiceEmailModalProps> = ({
  invoice,
  onClose
}) => {
  const { sendEmailInvoice } = useInvoice();
  const [recipientEmail, setRecipientEmail] = useState(invoice.customerDetails.email);
  const [subject, setSubject] = useState(`Tax Invoice #${invoice.invoiceNumber} from V S N CASHEWS PRIVATE LIMITED`);
  const [customNote, setCustomNote] = useState(
    `Dear ${invoice.customerDetails.name},\n\nPlease find attached the official GST Tax Invoice #${invoice.invoiceNumber} for your recent order of total ₹${invoice.grandTotal.toLocaleString('en-IN')}.\n\nThank you for choosing V S N CASHEWS.\n\nWarm regards,\nFinance & Accounts Team\nV S N CASHEWS PRIVATE LIMITED`
  );
  const [isSending, setIsSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ success: boolean; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientEmail) return;

    setIsSending(true);
    setStatusMessage(null);

    const result = await sendEmailInvoice(invoice.id, recipientEmail);
    setIsSending(false);

    if (result.success) {
      setStatusMessage({ success: true, text: result.message });
      setTimeout(() => {
        onClose();
      }, 2000);
    } else {
      setStatusMessage({ success: false, text: result.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm p-4 flex items-center justify-center">
      <div className="bg-[#0B132B] border border-[#D4AF37] w-full max-w-lg p-6 shadow-2xl relative text-gray-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-[#1C2541] border border-[#D4AF37]/50">
            <Mail className="w-6 h-6 text-[#D4AF37]" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-[#F3E5AB]">
              Email Tax Invoice Document
            </h3>
            <p className="text-xs text-gray-400">
              Send PDF invoice copy with GST breakdown directly to customer
            </p>
          </div>
        </div>

        {statusMessage && (
          <div
            className={`p-3 mb-4 border text-xs font-mono flex items-center gap-2 ${
              statusMessage.success
                ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                : 'bg-rose-950/80 border-rose-500/50 text-rose-300'
            }`}
          >
            {statusMessage.success ? (
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-[#F3E5AB] mb-1">
              Recipient Email Address *
            </label>
            <SquareInput
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              required
              placeholder="customer@company.com"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[#F3E5AB] mb-1">
              Email Subject
            </label>
            <SquareInput
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[#F3E5AB] mb-1">
              Message / Cover Note
            </label>
            <textarea
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              rows={5}
              className="w-full bg-[#1C2541] border border-[#D4AF37]/40 p-2.5 text-xs text-gray-200 focus:outline-none focus:border-[#D4AF37] font-mono leading-relaxed"
            />
          </div>

          <div className="p-3 bg-[#1C2541]/50 border border-[#D4AF37]/20 text-[11px] text-gray-300 font-mono flex justify-between items-center">
            <span>Attachment:</span>
            <span className="text-[#D4AF37] font-bold">
              Tax_Invoice_{invoice.invoiceNumber}.pdf (GST Compliant)
            </span>
          </div>

          <div className="flex gap-3 pt-2">
            <SquareButton
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-600 text-gray-300"
            >
              Cancel
            </SquareButton>

            <SquareButton
              type="submit"
              variant="gold"
              disabled={isSending}
              className="flex-1 py-2.5 font-bold text-xs uppercase"
            >
              {isSending ? (
                'Dispatching Email...'
              ) : (
                <>
                  <Send className="w-4 h-4 mr-1.5 inline" /> Send Invoice Email
                </>
              )}
            </SquareButton>
          </div>
        </form>
      </div>
    </div>
  );
};
