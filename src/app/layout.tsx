import type { Metadata } from 'next';
import '@/index.css';
import { CartProvider } from '@/context/CartContext';
import { AppShell } from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'V S N CASHEWS | Premium Export-Grade Cashew Nuts Wholesale & Retail Hyderabad',
  description: 'Based in Kukatpally, Hyderabad. Buy 100% pure W180 King Jumbo, W240, W320, Ghee Roasted, & Saffron Honey Cashews. Fast nationwide shipping, GST invoices, & B2B bulk rates.',
  keywords: [
    'V S N CASHEWS',
    'Kukatpally Hyderabad cashews',
    'Hyderabad cashew wholesale',
    'W180 King Jumbo',
    'W240 cashews',
    'W320 cashews',
    'wholesale cashew supplier Telangana',
    'Ghee roasted cashews',
    'GST tax invoice cashews',
    'B2B dry fruit bulk'
  ],
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🥜</text></svg>',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <AppShell>{children}</AppShell>
        </CartProvider>
      </body>
    </html>
  );
}
