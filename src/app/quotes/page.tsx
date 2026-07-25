'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CustomerQuotesView } from '@/components/quotes/CustomerQuotesView';

export default function QuotesPage() {
  const router = useRouter();

  return (
    <CustomerQuotesView onBackToCatalog={() => router.push('/products')} />
  );
}
