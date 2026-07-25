import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import { CartProvider } from './context/CartContext.tsx';
import { OrderProvider } from './context/OrderContext.tsx';
import { QuoteProvider } from './context/QuoteContext.tsx';
import { InvoiceProvider } from './context/InvoiceContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <CartProvider>
        <OrderProvider>
          <QuoteProvider>
            <InvoiceProvider>
              <App />
            </InvoiceProvider>
          </QuoteProvider>
        </OrderProvider>
      </CartProvider>
    </HelmetProvider>
  </StrictMode>,
);
