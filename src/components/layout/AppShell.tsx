'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BottomMobileNav } from '@/components/layout/BottomMobileNav';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { AuthModal } from '@/components/auth/AuthModal';
import { PwaInstallPrompt } from '@/components/pwa/PwaInstallPrompt';
import { useCart } from '@/context/CartContext';
import { ActiveView } from '@/config/site';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { totalCartCount } = useCart();

  // Map pathname to ActiveView
  const getActiveView = (): ActiveView => {
    if (pathname === '/products') return 'products';
    if (pathname === '/about') return 'about';
    if (pathname === '/contact') return 'contact';
    if (pathname === '/admin') return 'admin';
    if (pathname === '/checkout') return 'checkout';
    if (pathname === '/orders') return 'orders';
    if (pathname === '/quotes') return 'quotes';
    if (pathname === '/invoices') return 'invoices';
    return 'home';
  };

  const handleNavigate = (view: ActiveView) => {
    switch (view) {
      case 'products':
        router.push('/products');
        break;
      case 'about':
        router.push('/about');
        break;
      case 'contact':
        router.push('/contact');
        break;
      case 'admin':
        router.push('/admin');
        break;
      case 'checkout':
        router.push('/checkout');
        break;
      case 'orders':
        router.push('/orders');
        break;
      case 'quotes':
        router.push('/quotes');
        break;
      case 'invoices':
        router.push('/invoices');
        break;
      default:
        router.push('/');
        break;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B132B] text-[#F8F9FA] selection:bg-[#D4AF37] selection:text-[#0B132B] pb-20 lg:pb-0">
      {/* Top Header */}
      <Header
        activeView={getActiveView()}
        onNavigate={handleNavigate}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Main Content Router */}
      <main className="flex-1">{children}</main>

      {/* Mobile Bottom Navigation Bar */}
      <BottomMobileNav
        activeView={getActiveView()}
        onNavigate={handleNavigate}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedToCheckout={() => handleNavigate('checkout')}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onNavigateToCheckout={() => handleNavigate('checkout')}
      />

      {/* PWA Prompt */}
      <PwaInstallPrompt />

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
};
