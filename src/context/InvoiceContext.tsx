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
  tagline: "Sovereign Grade Mangalore Cashew Nuts & Dry Fruits",
  address: "Plot No. 42, Baikampady Industrial Export Zone",
  city: "Mangalore",
  state: "Karnataka",
  pincode: "575011",
  gstin: "29AABCV1234F1ZM",
  fssai: "11221334000567",
  email: "billing@vsncashews.com",
  phone: "+91 824 240 8899",
  pan: "AABCV1234F",
  bankName: "HDFC Bank Ltd",
  accountName: "V S N CASHEWS PVT LTD",
  accountNumber: "50200088991234",
  ifscCode: "HDFC0000123",
  branch: "Mangalore Main Branch",
  upiId: "vsncashews@hdfcbank"
};

const DEFAULT_TERMS = [
  "Goods once sold will not be taken back unless damaged in transit and reported within 48 hours.",
  "Payment due within the agreed credit window as stated on the invoice.",
  "18% p.a. interest will be levied on payments delayed past the due date.",
  "Subject to Mangalore Jurisdiction only."
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
      name: "Suresh Prabhu",
      companyName: "Prabhu Gourmet Sweets & Bakery",
      gstin: "29AABCP9876C1Z8",
      email: "orders@prabhugourmet.com",
      phone: "+91 98450 99887",
      address: "M.G. Road, Opp City Centre Mall",
      city: "Mangalore",
      state: "Karnataka",
      pincode: "575001"
    },
    items: [
      {
        id: "item-1",
        description: "King Jumbo Cashews W-180 Vacuum Sealed",
        hsnCode: "08013200",
        quantity: 50,
        unit: "Kg",
        unitPrice: 1100,
        gstRate: 5,
        taxableValue: 55000,
        cgstRate: 2.5,
        cgstAmount: 1375,
        sgstRate: 2.5,
        sgstAmount: 1375,
        igstRate: 0,
        igstAmount: 0,
        total: 57750
      },
      {
        id: "item-2",
        description: "Scorched Wholes W-240 Premium Roasted",
        hsnCode: "08013200",
        quantity: 30,
        unit: "Kg",
        unitPrice: 920,
        gstRate: 5,
        taxableValue: 27600,
        cgstRate: 2.5,
        cgstAmount: 690,
        sgstRate: 2.5,
        sgstAmount: 690,
        igstRate: 0,
        igstAmount: 0,
        total: 28980
      }
    ],
    isInterstate: false,
    subtotal: 82600,
    totalTaxable: 82600,
    totalCgst: 2065,
    totalSgst: 2065,
    totalIgst: 0,
    totalTax: 4130,
    discount: 1000,
    shippingCharge: 500,
    roundOff: 0,
    grandTotal: 86230,
    paymentStatus: "PAID",
    amountPaid: 86230,
    balanceDue: 0,
    paymentMethod: "NEFT / RTGS Transfer",
    paymentReference: "HDFCN262019876",
    paymentDate: "2026-07-21",
    notes: "Advance 50% received earlier; balance settled via RTGS.",
    termsAndConditions: DEFAULT_TERMS,
    createdAt: "2026-07-20T10:30:00Z",
    updatedAt: "2026-07-21T14:20:00Z"
  },
  {
    id: "inv-1002",
    invoiceNumber: "VSN-INV-2026-1002",
    referenceType: "ORDER",
    referenceId: "ORD-2026-1001",
    invoiceDate: "2026-07-22",
    dueDate: "2026-07-29",
    companyDetails: VSN_COMPANY_DETAILS,
    customerDetails: {
      name: "Rahul Sharma",
      companyName: "Sharma Enterprises",
      gstin: "27AABCS5544K1Z2",
      email: "rahul.sharma@example.com",
      phone: "+91 98200 12345",
      address: "402 Royal Palms, Bandra West",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400050"
    },
    items: [
      {
        id: "item-3",
        description: "Gourmet Malabar Salted Roasted Cashews (500g Tin)",
        hsnCode: "08013200",
        quantity: 10,
        unit: "Packs",
        unitPrice: 850,
        gstRate: 5,
        taxableValue: 8500,
        cgstRate: 0,
        cgstAmount: 0,
        sgstRate: 0,
        sgstAmount: 0,
        igstRate: 5,
        igstAmount: 425,
        total: 8925
      }
    ],
    isInterstate: true,
    subtotal: 8500,
    totalTaxable: 8500,
    totalCgst: 0,
    totalSgst: 0,
    totalIgst: 425,
    totalTax: 425,
    discount: 0,
    shippingCharge: 150,
    roundOff: 0,
    grandTotal: 9075,
    paymentStatus: "UNPAID",
    amountPaid: 0,
    balanceDue: 9075,
    notes: "Interstate delivery to Mumbai via BlueDart Express.",
    termsAndConditions: DEFAULT_TERMS,
    createdAt: "2026-07-22T09:15:00Z",
    updatedAt: "2026-07-22T09:15:00Z"
  },
  {
    id: "inv-1003",
    invoiceNumber: "VSN-INV-2026-1003",
    referenceType: "QUOTE",
    referenceId: "VSN-QT-2026-8802",
    invoiceDate: "2026-07-23",
    dueDate: "2026-08-07",
    companyDetails: VSN_COMPANY_DETAILS,
    customerDetails: {
      name: "Anil Kapoor",
      companyName: "Kapoor Wholesale Foods",
      gstin: "36AABCK1122M1Z5",
      email: "anil@kapoorwholesale.in",
      phone: "+91 91000 88776",
      address: "Banjara Hills Road No. 12",
      city: "Hyderabad",
      state: "Telangana",
      pincode: "500034"
    },
    items: [
      {
        id: "item-4",
        description: "Splits LWP Grade Cashew Kernels (25kg Tin)",
        hsnCode: "08013200",
        quantity: 4,
        unit: "Tins",
        unitPrice: 18500,
        gstRate: 5,
        taxableValue: 74000,
        cgstRate: 0,
        cgstAmount: 0,
        sgstRate: 0,
        sgstAmount: 0,
        igstRate: 5,
        igstAmount: 3700,
        total: 77700
      }
    ],
    isInterstate: true,
    subtotal: 74000,
    totalTaxable: 74000,
    totalCgst: 0,
    totalSgst: 0,
    totalIgst: 3700,
    totalTax: 3700,
    discount: 1000,
    shippingCharge: 1200,
    roundOff: 0,
    grandTotal: 77900,
    paymentStatus: "PARTIALLY_PAID",
    amountPaid: 30000,
    balanceDue: 47900,
    paymentMethod: "UPI Transfer",
    paymentReference: "UPI2620556677",
    paymentDate: "2026-07-23",
    notes: "30,000 Advance paid; Balance ₹47,900 due on delivery.",
    termsAndConditions: DEFAULT_TERMS,
    createdAt: "2026-07-23T11:00:00Z",
    updatedAt: "2026-07-23T11:45:00Z"
  }
];

interface InvoiceContextType {
  invoices: Invoice[];
  createInvoice: (data: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt' | 'updatedAt' | 'companyDetails'>) => Invoice;
  updatePaymentStatus: (id: string, paymentStatus: InvoicePaymentStatus, amountPaid?: number, paymentMethod?: string, paymentReference?: string) => void;
  deleteInvoice: (id: string) => void;
  generateInvoiceFromOrder: (order: Order) => Invoice;
  generateInvoiceFromQuote: (quote: Quotation) => Invoice;
  sendEmailInvoice: (id: string, recipientEmail?: string) => Promise<{ success: boolean; message: string }>;
  getInvoiceById: (id: string) => Invoice | undefined;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'vsn_cashews_invoices_v2';

export const QuoteProvider: React.FC = ({ children }: any) => {
  return <>{children}</>;
};

export const InvoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load invoices from localStorage', e);
    }
    return INITIAL_INVOICES;
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(invoices));
    } catch (e) {
      console.error('Failed to persist invoices', e);
    }
  }, [invoices]);

  const generateNextInvoiceNumber = (): string => {
    const year = new Date().getFullYear();
    let maxNum = 1000;
    invoices.forEach(inv => {
      const match = inv.invoiceNumber.match(/VSN-INV-\d+-(\d+)/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) maxNum = num;
      }
    });
    return `VSN-INV-${year}-${maxNum + 1}`;
  };

  const createInvoice = (
    data: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt' | 'updatedAt' | 'companyDetails'>
  ): Invoice => {
    const newInv: Invoice = {
      ...data,
      id: `inv-${Date.now()}`,
      invoiceNumber: generateNextInvoiceNumber(),
      companyDetails: VSN_COMPANY_DETAILS,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      termsAndConditions: data.termsAndConditions || DEFAULT_TERMS
    };

    setInvoices(prev => [newInv, ...prev]);
    return newInv;
  };

  const updatePaymentStatus = (
    id: string,
    paymentStatus: InvoicePaymentStatus,
    amountPaid?: number,
    paymentMethod?: string,
    paymentReference?: string
  ) => {
    setInvoices(prev =>
      prev.map(inv => {
        if (inv.id !== id) return inv;
        const newPaid = amountPaid !== undefined ? amountPaid : inv.amountPaid;
        const newBalance = Math.max(0, inv.grandTotal - newPaid);
        let finalStatus = paymentStatus;

        if (newBalance === 0 && inv.grandTotal > 0) {
          finalStatus = 'PAID';
        } else if (newPaid > 0 && newBalance > 0) {
          finalStatus = 'PARTIALLY_PAID';
        }

        return {
          ...inv,
          paymentStatus: finalStatus,
          amountPaid: newPaid,
          balanceDue: newBalance,
          paymentMethod: paymentMethod || inv.paymentMethod,
          paymentReference: paymentReference || inv.paymentReference,
          paymentDate: newPaid > 0 ? new Date().toISOString().split('T')[0] : inv.paymentDate,
          updatedAt: new Date().toISOString()
        };
      })
    );
  };

  const deleteInvoice = (id: string) => {
    setInvoices(prev => prev.filter(inv => inv.id !== id));
  };

  const getInvoiceById = (id: string) => {
    return invoices.find(inv => inv.id === id || inv.invoiceNumber === id);
  };

  const generateInvoiceFromOrder = (order: Order): Invoice => {
    // Check if an invoice already exists for this order
    const existing = invoices.find(inv => inv.referenceType === 'ORDER' && inv.referenceId === order.id);
    if (existing) return existing;

    const isInterstate = order.shippingAddress.state.toLowerCase() !== 'karnataka';
    
    const items: InvoiceItem[] = order.items.map((item, idx) => {
      const price = item.price;
      const qty = item.quantity;
      const lineTotal = price * qty;
      const gstRate = 5; // Standard 5% GST for cashews
      
      // Calculate reverse or forward taxable value (assuming inclusive price)
      const taxableValue = Math.round((lineTotal / 1.05) * 100) / 100;
      const taxAmount = Math.round((lineTotal - taxableValue) * 100) / 100;
      
      const cgstRate = isInterstate ? 0 : 2.5;
      const sgstRate = isInterstate ? 0 : 2.5;
      const igstRate = isInterstate ? 5 : 0;

      const cgstAmount = isInterstate ? 0 : Math.round((taxAmount / 2) * 100) / 100;
      const sgstAmount = isInterstate ? 0 : Math.round((taxAmount / 2) * 100) / 100;
      const igstAmount = isInterstate ? taxAmount : 0;

      return {
        id: `item-${idx + 1}`,
        description: `${item.product.name} (${item.weight})`,
        hsnCode: "08013200",
        quantity: qty,
        unit: "Packs",
        unitPrice: price,
        gstRate,
        taxableValue,
        cgstRate,
        cgstAmount,
        sgstRate,
        sgstAmount,
        igstRate,
        igstAmount,
        total: lineTotal
      };
    });

    const subtotal = items.reduce((sum, item) => sum + item.taxableValue, 0);
    const totalCgst = items.reduce((sum, item) => sum + item.cgstAmount, 0);
    const totalSgst = items.reduce((sum, item) => sum + item.sgstAmount, 0);
    const totalIgst = items.reduce((sum, item) => sum + item.igstAmount, 0);
    const totalTax = totalCgst + totalSgst + totalIgst;
    const shippingCharge = order.shippingFee || 0;
    const discount = order.discountAmount || 0;
    const rawTotal = subtotal + totalTax + shippingCharge - discount;
    const grandTotal = Math.round(rawTotal);
    const roundOff = Math.round((grandTotal - rawTotal) * 100) / 100;

    const today = new Date().toISOString().split('T')[0];
    const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    return createInvoice({
      referenceType: 'ORDER',
      referenceId: order.id,
      invoiceDate: today,
      dueDate: dueDate,
      customerDetails: {
        name: order.shippingAddress.fullName,
        companyName: order.companyName,
        gstin: order.gstin,
        email: order.shippingAddress.email,
        phone: order.shippingAddress.phone,
        address: order.shippingAddress.street,
        city: order.shippingAddress.city,
        state: order.shippingAddress.state,
        pincode: order.shippingAddress.pincode
      },
      items,
      isInterstate,
      subtotal,
      totalTaxable: subtotal,
      totalCgst,
      totalSgst,
      totalIgst,
      totalTax,
      discount,
      shippingCharge,
      roundOff,
      grandTotal,
      paymentStatus: order.paymentStatus === 'PAID' ? 'PAID' : 'UNPAID',
      amountPaid: order.paymentStatus === 'PAID' ? grandTotal : 0,
      balanceDue: order.paymentStatus === 'PAID' ? 0 : grandTotal,
      paymentMethod: order.paymentMethod,
      paymentReference: order.paymentDetails?.neftRef || order.paymentDetails?.upiId || 'ONLINE_PAY',
      notes: `Tax invoice automatically generated for Online Order #${order.id}.`
    });
  };

  const generateInvoiceFromQuote = (quote: Quotation): Invoice => {
    const existing = invoices.find(inv => inv.referenceType === 'QUOTE' && inv.referenceId === quote.id);
    if (existing) return existing;

    const isInterstate = quote.state.toLowerCase() !== 'karnataka';

    const items: InvoiceItem[] = quote.items.map((item, idx) => {
      const qty = item.requestedQtyKg;
      const unitPrice = item.quotedUnitPricePerKg || 1000;
      const taxableValue = qty * unitPrice;
      const gstRate = 5;

      const cgstRate = isInterstate ? 0 : 2.5;
      const sgstRate = isInterstate ? 0 : 2.5;
      const igstRate = isInterstate ? 5 : 0;

      const cgstAmount = isInterstate ? 0 : Math.round(taxableValue * 0.025 * 100) / 100;
      const sgstAmount = isInterstate ? 0 : Math.round(taxableValue * 0.025 * 100) / 100;
      const igstAmount = isInterstate ? Math.round(taxableValue * 0.05 * 100) / 100 : 0;
      const itemTax = cgstAmount + sgstAmount + igstAmount;

      return {
        id: `quote-item-${idx + 1}`,
        description: `${item.productName} (${item.grade})`,
        hsnCode: "08013200",
        quantity: qty,
        unit: "Kg",
        unitPrice,
        gstRate,
        taxableValue,
        cgstRate,
        cgstAmount,
        sgstRate,
        sgstAmount,
        igstRate,
        igstAmount,
        total: taxableValue + itemTax
      };
    });

    const subtotal = items.reduce((sum, item) => sum + item.taxableValue, 0);
    const totalCgst = items.reduce((sum, item) => sum + item.cgstAmount, 0);
    const totalSgst = items.reduce((sum, item) => sum + item.sgstAmount, 0);
    const totalIgst = items.reduce((sum, item) => sum + item.igstAmount, 0);
    const totalTax = totalCgst + totalSgst + totalIgst;
    const rawTotal = subtotal + totalTax;
    const grandTotal = Math.round(rawTotal);
    const roundOff = Math.round((grandTotal - rawTotal) * 100) / 100;

    const paidAmt = quote.advancePaidAmount || 0;
    const balance = Math.max(0, grandTotal - paidAmt);
    let payStatus: InvoicePaymentStatus = 'UNPAID';
    if (balance === 0 && grandTotal > 0) payStatus = 'PAID';
    else if (paidAmt > 0) payStatus = 'PARTIALLY_PAID';

    const today = new Date().toISOString().split('T')[0];
    const dueDate = quote.validUntil || new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    return createInvoice({
      referenceType: 'QUOTE',
      referenceId: quote.id,
      invoiceDate: today,
      dueDate,
      customerDetails: {
        name: quote.contactPerson,
        companyName: quote.companyName,
        gstin: quote.gstin,
        email: quote.email,
        phone: quote.phone,
        address: `${quote.city}, ${quote.state}`,
        city: quote.city,
        state: quote.state,
        pincode: quote.pincode
      },
      items,
      isInterstate,
      subtotal,
      totalTaxable: subtotal,
      totalCgst,
      totalSgst,
      totalIgst,
      totalTax,
      discount: 0,
      shippingCharge: 0,
      roundOff,
      grandTotal,
      paymentStatus: payStatus,
      amountPaid: paidAmt,
      balanceDue: balance,
      notes: `Tax invoice issued against approved B2B Wholesale Quotation #${quote.quoteNumber}.`
    });
  };

  const sendEmailInvoice = async (id: string, recipientEmail?: string): Promise<{ success: boolean; message: string }> => {
    const inv = getInvoiceById(id);
    if (!inv) return { success: false, message: 'Invoice not found' };
    const emailTo = recipientEmail || inv.customerDetails.email;

    // Simulate sending email PDF dispatch
    await new Promise(r => setTimeout(r, 800));

    return {
      success: true,
      message: `Tax Invoice PDF #${inv.invoiceNumber} successfully emailed to ${emailTo} with official GST breakdown!`
    };
  };

  return (
    <InvoiceContext.Provider
      value={{
        invoices,
        createInvoice,
        updatePaymentStatus,
        deleteInvoice,
        generateInvoiceFromOrder,
        generateInvoiceFromQuote,
        sendEmailInvoice,
        getInvoiceById
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
