'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ContactView } from '@/components/views/ContactView';
import { ActiveView } from '@/config/site';

export default function ContactPage() {
  const router = useRouter();

  const handleNavigate = (view: ActiveView) => {
    if (view === 'home') router.push('/');
    else router.push(`/${view}`);
  };

  return <ContactView onNavigate={handleNavigate} />;
}
