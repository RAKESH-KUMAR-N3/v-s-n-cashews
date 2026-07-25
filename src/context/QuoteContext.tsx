'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Quotation, QuotationStatus, QuoteItem } from '@/types';
import { INITIAL_MOCK_QUOTES } from '@/data/mockQuotes';

const QUOTES_STORAGE_KEY = 'vsn_cashews_quotes_v1';

interface QuoteContextType {
  quotes: Quotation[];
  requestQuote: (data: {
    companyName: string;
    contactPerson: string;
    email: string;
    phone: string;
    gstin?: string;
    city: string;
    state: string;
    pincode: string;
    items: { productName: string; grade: string; requestedQtyKg: number }[];
    notes?: string;
  }) => Quotation;
  updateQuote: (
    quoteId: string,
    updatedData: Partial<Quotation> & { items?: QuoteItem[] }
  ) => void;
  updateQuoteStatus: (quoteId: string, status: QuotationStatus, adminNotes?: string) => void;
  recordAdvancePayment: (quoteId: string, amountPaid: number, paymentRef?: string) => void;
  getQuoteById: (quoteId: string) => Quotation | undefined;
  getQuotesForUser: (email: string) => Quotation[];
  deleteQuote: (quoteId: string) => void;
}

const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

export const QuoteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [quotes, setQuotes] = useState<Quotation[]>(() => {
    if (typeof window === 'undefined') return INITIAL_MOCK_QUOTES;
    try {
      const saved = localStorage.getItem(QUOTES_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load quotes from localStorage:', e);
    }
    return INITIAL_MOCK_QUOTES;
  });

  useEffect(() => {
    try {
      localStorage.setItem(QUOTES_STORAGE_KEY, JSON.stringify(quotes));
    } catch (e) {
      console.error('Failed to save quotes to localStorage:', e);
    }
  }, [quotes]);

  const requestQuote = (data: {
    companyName: string;
    contactPerson: string;
    email: string;
    phone: string;
    gstin?: string;
    city: string;
    state: string;
    pincode: string;
    items: { productName: string; grade: string; requestedQtyKg: number }[];
    notes?: string;
  }) => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newQuote: Quotation = {
      id: `qt-${Date.now()}`,
      quoteNumber: `VSN-QT-2026-${randomNum}`,
      companyName: data.companyName,
      contactPerson: data.contactPerson,
      email: data.email,
      phone: data.phone,
      gstin: data.gstin?.toUpperCase(),
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      items: data.items.map((item, idx) => ({
        id: `qti-${Date.now()}-${idx}`,
        productName: item.productName,
        grade: item.grade,
        requestedQtyKg: item.requestedQtyKg,
      })),
      notes: data.notes,
      status: 'REQUESTED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setQuotes((prev) => [newQuote, ...prev]);
    return newQuote;
  };

  const updateQuote = (
    quoteId: string,
    updatedData: Partial<Quotation> & { items?: QuoteItem[] }
  ) => {
    setQuotes((prev) =>
      prev.map((q) => {
        if (q.id === quoteId || q.quoteNumber === quoteId) {
          const newItems = updatedData.items || q.items;

          // Re-calculate totals if items or tax changes
          let subtotal = 0;
          newItems.forEach((it) => {
            if (it.quotedUnitPricePerKg && it.requestedQtyKg) {
              it.totalPrice = it.quotedUnitPricePerKg * it.requestedQtyKg;
              subtotal += it.totalPrice;
            }
          });

          const gst = Math.round(subtotal * 0.05); // 5% GST on wholesale cashews
          const grandTotal = subtotal + gst;
          const advPct = updatedData.advancePercentage ?? q.advancePercentage ?? 25;
          const advReq = Math.round((grandTotal * advPct) / 100);

          return {
            ...q,
            ...updatedData,
            items: newItems,
            quotedSubtotal: subtotal > 0 ? subtotal : q.quotedSubtotal,
            quotedGst: subtotal > 0 ? gst : q.quotedGst,
            quotedGrandTotal: subtotal > 0 ? grandTotal : q.quotedGrandTotal,
            advancePercentage: advPct,
            advanceRequiredAmount: advReq,
            updatedAt: new Date().toISOString(),
          };
        }
        return q;
      })
    );
  };

  const updateQuoteStatus = (quoteId: string, status: QuotationStatus, adminNotes?: string) => {
    setQuotes((prev) =>
      prev.map((q) => {
        if (q.id === quoteId || q.quoteNumber === quoteId) {
          return {
            ...q,
            status,
            adminNotes: adminNotes ?? q.adminNotes,
            updatedAt: new Date().toISOString(),
          };
        }
        return q;
      })
    );
  };

  const recordAdvancePayment = (quoteId: string, amountPaid: number, paymentRef?: string) => {
    setQuotes((prev) =>
      prev.map((q) => {
        if (q.id === quoteId || q.quoteNumber === quoteId) {
          return {
            ...q,
            status: 'ADVANCE_PAID',
            advancePaidAmount: (q.advancePaidAmount || 0) + amountPaid,
            adminNotes: paymentRef
              ? `Advance of ₹${amountPaid.toLocaleString('en-IN')} received (${paymentRef}). ${
                  q.adminNotes || ''
                }`
              : q.adminNotes,
            updatedAt: new Date().toISOString(),
          };
        }
        return q;
      })
    );
  };

  const getQuoteById = (quoteId: string) => {
    return quotes.find((q) => q.id === quoteId || q.quoteNumber === quoteId);
  };

  const getQuotesForUser = (email: string) => {
    if (!email) return quotes;
    const clean = email.toLowerCase().trim();
    return quotes.filter((q) => q.email.toLowerCase().includes(clean));
  };

  const deleteQuote = (quoteId: string) => {
    setQuotes((prev) => prev.filter((q) => q.id !== quoteId && q.quoteNumber !== quoteId));
  };

  return (
    <QuoteContext.Provider
      value={{
        quotes,
        requestQuote,
        updateQuote,
        updateQuoteStatus,
        recordAdvancePayment,
        getQuoteById,
        getQuotesForUser,
        deleteQuote,
      }}
    >
      {children}
    </QuoteContext.Provider>
  );
};

export const useQuotes = (): QuoteContextType => {
  const context = useContext(QuoteContext);
  if (!context) {
    throw new Error('useQuotes must be used within a QuoteProvider');
  }
  return context;
};
