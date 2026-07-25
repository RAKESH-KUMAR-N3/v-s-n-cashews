'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CustomerInvoicesView } from '@/components/invoices/CustomerInvoicesView';

export default function InvoicesPage() {
  const router = useRouter();

  return (
    <CustomerInvoicesView onBackToCatalog={() => router.push('/products')} />
  );
}
