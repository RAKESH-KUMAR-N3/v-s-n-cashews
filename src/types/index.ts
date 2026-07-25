export type CashewGrade = 'W-180' | 'W-240' | 'W-320' | 'Splits' | 'Gourmet Flavored' | 'Royal Gift Box';

export type CashewWeight = '250g' | '500g' | '1kg' | '2kg Pack' | '5kg Master Box';

export interface ProductSEO {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  canonicalUrl?: string;
}

export interface ProductVariant {
  id: string;
  weight: CashewWeight;
  price: number;
  stockQuantity: number;
  inStock: boolean;
  skuOverride?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  grade: CashewGrade;
  origin: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  inStock: boolean;
  stockQuantity: number;
  weights: CashewWeight[];
  variants?: ProductVariant[];
  selectedWeight?: CashewWeight;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  rating: number;
  reviewCount: number;
  category: string;
  seo?: ProductSEO;
  nutritionalInfo?: {
    protein: string;
    healthyFats: string;
    calories: string;
    dietaryFiber: string;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  weight: CashewWeight;
  quantity: number;
  price: number;
}

export interface SavedItem {
  id: string;
  productId: string;
  product: Product;
  weight: CashewWeight;
  price: number;
  savedAt: string;
}

export type ShippingMethod = 'STANDARD' | 'EXPRESS_AIR';

export type CartUserMode = 'GUEST' | 'LOGGED_IN';

export interface CartUserProfile {
  id: string;
  name: string;
  email: string;
  isRoyalMember: boolean;
  memberDiscountPercent: number;
  isAdmin?: boolean;
}

export type AddressLabel = 'Home' | 'Office' | 'Estate' | 'Gifting' | 'Other';

export interface Address {
  id: string;
  label: AddressLabel;
  fullName: string;
  phone: string;
  email: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  isDefault?: boolean;
}

export interface BillingDetails {
  sameAsShipping: boolean;
  fullName: string;
  phone: string;
  email: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  companyName?: string;
  gstin?: string;
}

export type PaymentMethodType = 'UPI' | 'CARD' | 'NETBANKING' | 'COD' | 'CORPORATE_NEFT';

export interface ShippingAddress {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  subtotal: number;
  gstAmount: number;
  discountAmount: number;
  shippingFee: number;
  codFee: number;
  grandTotal: number;
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethodType;
  paymentDetails?: {
    upiId?: string;
    cardLast4?: string;
    bankName?: string;
    neftRef?: string;
  };
  shippingAddress: Address;
  billingAddress: BillingDetails;
  gstin?: string;
  companyName?: string;
  status: 'PENDING' | 'CONFIRMED' | 'PACKED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
  createdAt: string;
  estimatedDelivery: string;
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: 'USER' | 'ADMIN';
}

export interface CouponCode {
  code: string;
  discountPercentage: number;
  minOrderAmount: number;
}

export type QuotationStatus = 'REQUESTED' | 'QUOTED' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED' | 'ADVANCE_PAID';

export interface QuoteItem {
  id: string;
  productName: string;
  grade: string;
  requestedQtyKg: number;
  quotedUnitPricePerKg?: number;
  totalPrice?: number;
}

export interface Quotation {
  id: string;
  quoteNumber: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  gstin?: string;
  city: string;
  state: string;
  pincode: string;
  items: QuoteItem[];
  notes?: string;
  status: QuotationStatus;
  quotedSubtotal?: number;
  quotedGst?: number;
  quotedGrandTotal?: number;
  advancePercentage?: number;
  advanceRequiredAmount?: number;
  advancePaidAmount?: number;
  validUntil?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyInvoiceDetails {
  name: string;
  tagline?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  gstin: string;
  fssai: string;
  email: string;
  phone: string;
  pan?: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  ifscCode: string;
  branch: string;
  upiId: string;
}

export interface CustomerInvoiceDetails {
  name: string;
  companyName?: string;
  gstin?: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  pan?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  hsnCode: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  gstRate: number;
  taxableValue: number;
  cgstRate: number;
  cgstAmount: number;
  sgstRate: number;
  sgstAmount: number;
  igstRate: number;
  igstAmount: number;
  total: number;
}

export type InvoicePaymentStatus = 'UNPAID' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE' | 'CANCELLED';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  referenceType?: 'ORDER' | 'QUOTE' | 'MANUAL';
  referenceId?: string;
  invoiceDate: string;
  dueDate: string;
  companyDetails: CompanyInvoiceDetails;
  customerDetails: CustomerInvoiceDetails;
  items: InvoiceItem[];
  isInterstate: boolean;
  subtotal: number;
  totalTaxable: number;
  totalCgst: number;
  totalSgst: number;
  totalIgst: number;
  totalTax: number;
  discount: number;
  shippingCharge: number;
  roundOff: number;
  grandTotal: number;
  paymentStatus: InvoicePaymentStatus;
  amountPaid: number;
  balanceDue: number;
  paymentMethod?: string;
  paymentReference?: string;
  paymentDate?: string;
  notes?: string;
  termsAndConditions?: string[];
  createdAt: string;
  updatedAt: string;
}
