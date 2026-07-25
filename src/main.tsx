import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';
import { QuoteProvider } from './context/QuoteContext';
import { InvoiceProvider } from './context/InvoiceContext';
import { NotificationProvider } from './context/NotificationContext';
import './index.css';

const rootEl = document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(
    <StrictMode>
      <NotificationProvider>
        <CartProvider>
          <OrderProvider>
            <QuoteProvider>
              <InvoiceProvider>
                <App />
              </InvoiceProvider>
            </QuoteProvider>
          </OrderProvider>
        </CartProvider>
      </NotificationProvider>
    </StrictMode>,
  );
}
