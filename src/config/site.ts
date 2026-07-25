export type ActiveView = 'home' | 'products' | 'about' | 'contact' | 'admin' | 'checkout' | 'orders' | 'quotes' | 'invoices' | 'account' | 'notifications';

export const SITE_CONFIG = {
  name: "V S N CASHEWS",
  tagline: "The Sovereign Grade Premium Cashew Nuts & Dry Fruits",
  description: "Experience royal freshness with hand-sorted W-180 King Cashews, roasted gourmet flavors, and bespoke wholesale hampers direct from Rajahmundry, Andhra Pradesh.",
  url: process.env.VITE_APP_URL || "https://vsncashews.com",
  currencySymbol: "₹",
  currencyCode: "INR",
  contact: {
    phone: "+91 98450 12345",
    whatsapp: "+91 98450 12345",
    email: "orders@vsncashews.com",
    address: "V S N Cashews, Main Estate Road, Morampudi Junction, Rajahmundry, Andhra Pradesh 533107, India",
    workingHours: "Monday – Saturday: 8:30 AM – 7:30 PM (IST)",
  },
  social: {
    instagram: "https://instagram.com/vsncashews",
    facebook: "https://facebook.com/vsncashews",
    youtube: "https://youtube.com/c/vsncashews",
  },
  originStory: "Based in Rajahmundry, Andhra Pradesh, V S N CASHEWS selects only premium export-grade raw cashew nuts. Each nut undergoes 7-stage quality grading, gentle humidity drying, and vacuum sealing to ensure uncompromised crunch, butteriness, and royal taste.",
  navigation: [
    { label: "Home", view: "home" as ActiveView },
    { label: "Products", view: "products" as ActiveView },
    { label: "About", view: "about" as ActiveView },
    { label: "Contact", view: "contact" as ActiveView },
    { label: "Admin", view: "admin" as ActiveView },
  ],
  trustBadges: [
    { title: "100% Handpicked", desc: "Grade W-180 Jumbo Kernels" },
    { title: "Rajahmundry Direct", desc: "Express Dispatch in 24 Hours" },
    { title: "Vacuum Sealed", desc: "Nitrogen Flushed Freshness Lock" },
    { title: "Secure Checkout", desc: "256-bit Encrypted Checkout" }
  ]
};
