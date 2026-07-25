export type ActiveView = 'home' | 'products' | 'about' | 'contact' | 'admin' | 'checkout' | 'orders' | 'quotes' | 'invoices';

export const SITE_CONFIG = {
  name: "V S N CASHEWS",
  tagline: "The Sovereign Grade Premium Cashew Nuts & Dry Fruits",
  description: "Experience royal freshness with hand-sorted W-180 King Cashews, roasted gourmet flavors, and bespoke gift hampers direct from Kukatpally, Hyderabad.",
  url: process.env.VITE_APP_URL || "https://vsncashews.com",
  currencySymbol: "₹",
  currencyCode: "INR",
  contact: {
    phone: "+91 98450 12345",
    whatsapp: "+91 98450 12345",
    email: "orders@vsncashews.com",
    address: "V S N Cashews, Main Road, Phase 1, Kukatpally, Hyderabad, Telangana 500072, India",
    workingHours: "Monday – Saturday: 8:30 AM – 7:30 PM (IST)",
  },
  social: {
    instagram: "https://instagram.com/vsncashews",
    facebook: "https://facebook.com/vsncashews",
    youtube: "https://youtube.com/c/vsncashews",
  },
  originStory: "Based in Kukatpally, Hyderabad, V S N CASHEWS selects only premium grade raw cashew nuts. Each nut undergoes 7-stage quality grading, gentle humidity drying, and vacuum sealing to ensure uncompromised crunch, butteriness, and royal taste.",
  navigation: [
    { label: "Home", view: "home" as ActiveView },
    { label: "Products", view: "products" as ActiveView },
    { label: "About", view: "about" as ActiveView },
    { label: "Contact", view: "contact" as ActiveView },
    { label: "Admin", view: "admin" as ActiveView },
  ],
  trustBadges: [
    { title: "100% Handpicked", desc: "Grade W-180 Jumbo Kernels" },
    { title: "Hyderabad Direct", desc: "Express Dispatch in 24 Hours" },
    { title: "Vacuum Sealed", desc: "Nitrogen Flushed Freshness Lock" },
    { title: "Razorpay Protected", desc: "256-bit Encrypted Checkout" }
  ]
};
