'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CustomerOrderHistoryView } from '@/components/orders/CustomerOrderHistoryView';

export default function OrdersPage() {
  const router = useRouter();

  return (
    <CustomerOrderHistoryView onBackToCatalog={() => router.push('/products')} />
  );
}
