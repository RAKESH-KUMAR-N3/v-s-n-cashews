'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BottomMobileNav } from '@/components/layout/BottomMobileNav';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { AuthModal } from '@/components/auth/AuthModal';
import { MobileSplashScreen } from '@/components/splash/MobileSplashScreen';
import { useCart } from '@/context/CartContext';
import { ActiveView } from '@/config/site';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSplash, setShowSplash] = useState(false);

  const { totalCartCount } = useCart();

  useEffect(() => {
    // 1. Prefetch all main Next.js routes for instant zero-delay navigation
    router.prefetch('/');
    router.prefetch('/products');
    router.prefetch('/about');
    router.prefetch('/contact');
    router.prefetch('/account');
    router.prefetch('/orders');
    router.prefetch('/checkout');

    // 2. Catch stale chunk load errors during dev/deploys and reload smoothly
    const handleChunkError = (e: ErrorEvent) => {
      if (e.message && (e.message.includes('Loading chunk') || e.message.includes('ChunkLoadError'))) {
        console.warn('[Next.js] Stale chunk detected, refreshing page...');
        window.location.reload();
      }
    };
    window.addEventListener('error', handleChunkError);

    // Check if on mobile view and splash has not been shown in this session
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      const dismissed = sessionStorage.getItem('vsn_mobile_splash_shown');
      if (!dismissed) {
        setShowSplash(true);
      }
    }

    return () => {
      window.removeEventListener('error', handleChunkError);
    };
  }, [router]);

  const handleSplashContinue = () => {
    sessionStorage.setItem('vsn_mobile_splash_shown', 'true');
    setShowSplash(false);
    // Open Login/Register Modal as requested
    setIsAuthModalOpen(true);
  };

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

  const isAdminPage = pathname === '/admin' || pathname?.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-[#0B132B] text-[#F8F9FA] selection:bg-[#D4AF37] selection:text-[#0B132B] pb-20 lg:pb-0 w-full overflow-x-clip">
      {/* Mobile Animated Splash Screen Overlay */}
      {showSplash && <MobileSplashScreen onContinue={handleSplashContinue} />}

      {/* Top Header (Hidden on Admin pages) */}
      {!isAdminPage && (
        <Header
          activeView={getActiveView()}
          onNavigate={handleNavigate}
          cartCount={totalCartCount}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      )}

      {/* Main Content Router */}
      <main className="flex-1">{children}</main>

      {/* Mobile Bottom Navigation Bar (Hidden while splash screen, Auth modal, or Admin page is active) */}
      {!showSplash && !isAuthModalOpen && !isAdminPage && (
        <BottomMobileNav
          activeView={getActiveView()}
          onNavigate={handleNavigate}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
        />
      )}

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

      {/* Footer (Hidden on Admin pages) */}
      {!isAdminPage && <Footer onNavigate={handleNavigate} />}
    </div>
  );
};
