'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Invoice,
  InvoiceItem,
  InvoicePaymentStatus,
  CompanyInvoiceDetails,
  CustomerInvoiceDetails,
  Order,
  Quotation
} from '@/types';

export const VSN_COMPANY_DETAILS: CompanyInvoiceDetails = {
  name: "V S N CASHEWS PRIVATE LIMITED",
  tagline: "Sovereign Grade Rajahmundry Cashew Nuts & Dry Fruits",
  address: "Plot No. 42, Morampudi Junction Industrial Zone",
  city: "Rajahmundry",
  state: "Andhra Pradesh",
  pincode: "533107",
  gstin: "37AABCV1234F1ZM",
  fssai: "11221334000567",
  email: "billing@vsncashews.com",
  phone: "+91 98450 12345",
  pan: "AABCV1234F",
  bankName: "HDFC Bank Ltd",
  accountName: "V S N CASHEWS PVT LTD",
  accountNumber: "50200088991234",
  ifscCode: "HDFC0000123",
  branch: "Rajahmundry Main Branch",
  upiId: "vsncashews@hdfcbank"
};

const DEFAULT_TERMS = [
  "Goods once sold will not be taken back unless damaged in transit and reported within 48 hours.",
  "Payment due within the agreed credit window as stated on the invoice.",
  "18% p.a. interest will be levied on payments delayed past the due date.",
  "Subject to Rajahmundry Jurisdiction only."
];

const INITIAL_INVOICES: Invoice[] = [
  {
    id: "inv-1001",
    invoiceNumber: "VSN-INV-2026-1001",
    referenceType: "QUOTE",
    referenceId: "VSN-QT-2026-8801",
    invoiceDate: "2026-07-20",
    dueDate: "2026-08-04",
    companyDetails: VSN_COMPANY_DETAILS,
    customerDetails: {
      name: "Suresh Rao",
      companyName: "Godavari Gourmet Sweets & Bakery",
      gstin: "37AABCP9876C1Z8",
      email: "orders@godavarigourmet.com",
      phone: "+91 98450 99887",
      address: "Main Road, Opp City Centre",
      city: "Rajahmundry",
      state: "Andhra Pradesh",
      pincode: "533101"
    },
    items: [
      {
        id: "item-1",
        description: "King Jumbo Cashews W-180 Vacuum Sealed",
        hsnCode: "08013200",
        quantity: 50,
        unit: "kg",
        unitPrice: 1700,
        gstRate: 5,
        taxableValue: 85000,
        cgstRate: 2.5,
        cgstAmount: 2125,
        sgstRate: 2.5,
        sgstAmount: 2125,
        igstRate: 0,
        igstAmount: 0,
        total: 89250
      }
    ],
    isInterstate: false,
    subtotal: 85000,
    totalTaxable: 85000,
    totalCgst: 2125,
    totalSgst: 2125,
    totalIgst: 0,
    totalTax: 4250,
    discount: 0,
    shippingCharge: 0,
    roundOff: 0,
    grandTotal: 89250,
    paymentStatus: "PAID",
    amountPaid: 89250,
    balanceDue: 0,
    paymentMethod: "CORPORATE_NEFT",
    paymentReference: "NEFT9988776655",
    paymentDate: "2026-07-21",
    notes: "Advance full payment received for 50kg bulk W-180 shipment.",
    termsAndConditions: DEFAULT_TERMS,
    createdAt: "2026-07-20T10:00:00.000Z",
    updatedAt: "2026-07-21T14:30:00.000Z"
  }
];

interface InvoiceContextType {
  invoices: Invoice[];
  createInvoice: (invoiceData: Partial<Invoice> & Omit<Invoice, 'id' | 'createdAt' | 'updatedAt' | 'invoiceNumber' | 'companyDetails'>) => Invoice;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  generateInvoiceFromOrder: (order: Order) => Invoice;
  generateInvoiceFromQuote: (quote: Quotation) => Invoice;
  getInvoiceById: (id: string) => Invoice | undefined;
  markInvoicePaid: (id: string, amount: number, method: string, reference?: string) => void;
  updatePaymentStatus: (
    id: string,
    status: InvoicePaymentStatus,
    amountPaid?: number,
    paymentMethod?: string,
    paymentReference?: string
  ) => void;
  sendEmailInvoice: (id: string, email: string, note?: string) => Promise<{ success: boolean; message?: string }>;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export const InvoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vsn_invoices');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse saved invoices:', e);
        }
      }
    }
    return INITIAL_INVOICES;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('vsn_invoices', JSON.stringify(invoices));
    }
  }, [invoices]);

  const createInvoice = (invoiceData: Partial<Invoice> & Omit<Invoice, 'id' | 'createdAt' | 'updatedAt' | 'invoiceNumber' | 'companyDetails'>): Invoice => {
    const now = new Date().toISOString();
    const today = new Date();
    const newInvoice: Invoice = {
      companyDetails: VSN_COMPANY_DETAILS,
      invoiceNumber: invoiceData.invoiceNumber || `VSN-INV-${today.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      ...invoiceData,
      id: `inv-${Date.now()}`,
      createdAt: now,
      updatedAt: now
    };
    setInvoices((prev) => [newInvoice, ...prev]);
    return newInvoice;
  };

  const updateInvoice = (id: string, updates: Partial<Invoice>) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, ...updates, updatedAt: new Date().toISOString() } : inv))
    );
  };

  const deleteInvoice = (id: string) => {
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));
  };

  const getInvoiceById = (id: string): Invoice | undefined => {
    return invoices.find((inv) => inv.id === id);
  };

  const markInvoicePaid = (id: string, amount: number, method: string, reference?: string) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id !== id) return inv;
        const newPaid = inv.amountPaid + amount;
        const balance = Math.max(0, inv.grandTotal - newPaid);
        const status: InvoicePaymentStatus = balance === 0 ? 'PAID' : 'PARTIALLY_PAID';
        return {
          ...inv,
          amountPaid: newPaid,
          balanceDue: balance,
          paymentStatus: status,
          paymentMethod: method,
          paymentReference: reference || inv.paymentReference,
          paymentDate: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString()
        };
      })
    );
  };

  const updatePaymentStatus = (
    id: string,
    status: InvoicePaymentStatus,
    amountPaid?: number,
    paymentMethod?: string,
    paymentReference?: string
  ) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id !== id) return inv;
        const paid = amountPaid !== undefined ? amountPaid : status === 'PAID' ? inv.grandTotal : inv.amountPaid;
        const balance = Math.max(0, inv.grandTotal - paid);
        return {
          ...inv,
          paymentStatus: status,
          amountPaid: paid,
          balanceDue: balance,
          paymentMethod: paymentMethod || inv.paymentMethod,
          paymentReference: paymentReference || inv.paymentReference,
          updatedAt: new Date().toISOString()
        };
      })
    );
  };

  const sendEmailInvoice = async (id: string, email: string, note?: string): Promise<{ success: boolean; message?: string }> => {
    await new Promise((res) => setTimeout(res, 800));
    return { success: true, message: `GST Invoice successfully dispatched to ${email}` };
  };

  const generateInvoiceFromOrder = (order: Order): Invoice => {
    const isInterstate = order.shippingAddress.state.toLowerCase() !== 'andhra pradesh';
    const items: InvoiceItem[] = order.items.map((item, idx) => {
      const total = item.price * item.quantity;
      const taxableValue = Math.round(total / 1.05);
      const taxAmount = total - taxableValue;
      return {
        id: `item-${idx + 1}`,
        description: `${item.product.name} (${item.weight})`,
        hsnCode: '08013200',
        quantity: item.quantity,
        unit: 'pack',
        unitPrice: item.price,
        gstRate: 5,
        taxableValue: taxableValue,
        cgstRate: isInterstate ? 0 : 2.5,
        cgstAmount: isInterstate ? 0 : Math.round(taxAmount / 2),
        sgstRate: isInterstate ? 0 : 2.5,
        sgstAmount: isInterstate ? 0 : Math.round(taxAmount / 2),
        igstRate: isInterstate ? 5 : 0,
        igstAmount: isInterstate ? taxAmount : 0,
        total: total
      };
    });

    const totalTaxable = items.reduce((s, i) => s + i.taxableValue, 0);
    const totalCgst = items.reduce((s, i) => s + i.cgstAmount, 0);
    const totalSgst = items.reduce((s, i) => s + i.sgstAmount, 0);
    const totalIgst = items.reduce((s, i) => s + i.igstAmount, 0);
    const totalTax = totalCgst + totalSgst + totalIgst;

    const today = new Date();
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + 15);

    const customerDetails: CustomerInvoiceDetails = {
      name: order.shippingAddress.fullName,
      companyName: order.companyName,
      gstin: order.gstin,
      email: order.shippingAddress.email || 'customer@vsncashews.com',
      phone: order.shippingAddress.phone,
      address: `${order.shippingAddress.street}${order.shippingAddress.landmark ? ', ' + order.shippingAddress.landmark : ''}`,
      city: order.shippingAddress.city,
      state: order.shippingAddress.state,
      pincode: order.shippingAddress.pincode
    };

    return createInvoice({
      invoiceNumber: `VSN-INV-${today.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      referenceType: 'ORDER',
      referenceId: order.orderNumber,
      invoiceDate: today.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      companyDetails: VSN_COMPANY_DETAILS,
      customerDetails,
      items,
      isInterstate,
      subtotal: totalTaxable,
      totalTaxable,
      totalCgst,
      totalSgst,
      totalIgst,
      totalTax,
      discount: order.discountAmount,
      shippingCharge: order.shippingFee,
      roundOff: 0,
      grandTotal: order.grandTotal,
      paymentStatus: order.paymentStatus === 'PAID' ? 'PAID' : 'UNPAID',
      amountPaid: order.paymentStatus === 'PAID' ? order.grandTotal : 0,
      balanceDue: order.paymentStatus === 'PAID' ? 0 : order.grandTotal,
      paymentMethod: order.paymentMethod,
      notes: `Invoice generated for Store Order #${order.orderNumber}`,
      termsAndConditions: DEFAULT_TERMS
    });
  };

  const generateInvoiceFromQuote = (quote: Quotation): Invoice => {
    const isInterstate = quote.state.toLowerCase() !== 'andhra pradesh';
    const items: InvoiceItem[] = quote.items.map((item, idx) => {
      const unitPrice = item.quotedUnitPricePerKg || 1600;
      const taxableValue = item.requestedQtyKg * unitPrice;
      const taxAmount = Math.round(taxableValue * 0.05);
      const total = taxableValue + taxAmount;
      return {
        id: `item-${idx + 1}`,
        description: `${item.productName} (${item.grade}) - Wholesale Bulk`,
        hsnCode: '08013200',
        quantity: item.requestedQtyKg,
        unit: 'kg',
        unitPrice: unitPrice,
        gstRate: 5,
        taxableValue: taxableValue,
        cgstRate: isInterstate ? 0 : 2.5,
        cgstAmount: isInterstate ? 0 : Math.round(taxAmount / 2),
        sgstRate: isInterstate ? 0 : 2.5,
        sgstAmount: isInterstate ? 0 : Math.round(taxAmount / 2),
        igstRate: isInterstate ? 5 : 0,
        igstAmount: isInterstate ? taxAmount : 0,
        total: total
      };
    });

    const totalTaxable = items.reduce((s, i) => s + i.taxableValue, 0);
    const totalCgst = items.reduce((s, i) => s + i.cgstAmount, 0);
    const totalSgst = items.reduce((s, i) => s + i.sgstAmount, 0);
    const totalIgst = items.reduce((s, i) => s + i.igstAmount, 0);
    const totalTax = totalCgst + totalSgst + totalIgst;
    const grandTotal = totalTaxable + totalTax;

    const today = new Date();
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + 14);

    const customerDetails: CustomerInvoiceDetails = {
      name: quote.contactPerson,
      companyName: quote.companyName,
      gstin: quote.gstin,
      email: quote.email,
      phone: quote.phone,
      address: quote.city,
      city: quote.city,
      state: quote.state,
      pincode: quote.pincode
    };

    const advancePaid = quote.advancePaidAmount || 0;
    const balanceDue = Math.max(0, grandTotal - advancePaid);
    const paymentStatus: InvoicePaymentStatus =
      advancePaid >= grandTotal ? 'PAID' : advancePaid > 0 ? 'PARTIALLY_PAID' : 'UNPAID';

    return createInvoice({
      invoiceNumber: `VSN-INV-${today.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      referenceType: 'QUOTE',
      referenceId: quote.quoteNumber,
      invoiceDate: today.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      companyDetails: VSN_COMPANY_DETAILS,
      customerDetails,
      items,
      isInterstate,
      subtotal: totalTaxable,
      totalTaxable,
      totalCgst,
      totalSgst,
      totalIgst,
      totalTax,
      discount: 0,
      shippingCharge: 0,
      roundOff: 0,
      grandTotal,
      paymentStatus,
      amountPaid: advancePaid,
      balanceDue,
      notes: `Tax Invoice generated for B2B Quotation #${quote.quoteNumber}`,
      termsAndConditions: DEFAULT_TERMS
    });
  };

  return (
    <InvoiceContext.Provider
      value={{
        invoices,
        createInvoice,
        updateInvoice,
        deleteInvoice,
        generateInvoiceFromOrder,
        generateInvoiceFromQuote,
        getInvoiceById,
        markInvoicePaid,
        updatePaymentStatus,
        sendEmailInvoice
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};

export const useInvoice = () => {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error('useInvoice must be used within an InvoiceProvider');
  }
  return context;
};
