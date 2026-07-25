'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AccountView } from '@/components/views/AccountView';
import { AuthModal } from '@/components/auth/AuthModal';

export default function AccountPage() {
  const router = useRouter();
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <>
      <AccountView
        onNavigate={(view) => {
          if (view === 'home') router.push('/');
          else router.push(`/${view}`);
        }}
        onOpenAuthModal={() => setIsAuthOpen(true)}
      />
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onNavigateToCheckout={() => router.push('/checkout')}
      />
    </>
  );
}
