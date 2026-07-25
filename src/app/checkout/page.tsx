'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CheckoutView } from '@/components/views/CheckoutView';

export default function CheckoutPage() {
  const router = useRouter();

  return (
    <CheckoutView onBackToCatalog={() => router.push('/products')} />
  );
}
