import type { Metadata } from 'next';
import '@/index.css';
import { CartProvider } from '@/context/CartContext';
import { OrderProvider } from '@/context/OrderContext';
import { InvoiceProvider } from '@/context/InvoiceContext';
import { QuoteProvider } from '@/context/QuoteContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { AppShell } from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'V S N CASHEWS | Premium Export-Grade Cashew Nuts Wholesale & Retail Rajahmundry',
  description: 'Based in Rajahmundry, Andhra Pradesh. Buy 100% pure W180 King Jumbo, W240, W320, Ghee Roasted, & Saffron Honey Cashews. Fast nationwide shipping, GST invoices, & B2B bulk rates.',
  keywords: [
    'V S N CASHEWS',
    'Rajahmundry Andhra Pradesh cashews',
    'Rajahmundry cashew wholesale',
    'W180 King Jumbo',
    'W240 cashews',
    'W320 cashews',
    'wholesale cashew supplier Andhra Pradesh',
    'Ghee roasted cashews',
    'GST tax invoice cashews',
    'B2B dry fruit bulk'
  ],
  icons: {
    icon: '/assets/kaju-icon.png',
    shortcut: '/assets/kaju-icon.png',
    apple: '/assets/kaju-icon.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NotificationProvider>
          <CartProvider>
            <OrderProvider>
              <InvoiceProvider>
                <QuoteProvider>
                  <AppShell>{children}</AppShell>
                </QuoteProvider>
              </InvoiceProvider>
            </OrderProvider>
          </CartProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}
