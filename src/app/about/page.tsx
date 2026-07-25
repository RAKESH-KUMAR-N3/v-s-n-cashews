'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AboutView } from '@/components/views/AboutView';
import { ActiveView } from '@/config/site';

export default function AboutPage() {
  const router = useRouter();

  const handleNavigate = (view: ActiveView) => {
    if (view === 'home') router.push('/');
    else router.push(`/${view}`);
  };

  return <AboutView onNavigate={handleNavigate} />;
}
