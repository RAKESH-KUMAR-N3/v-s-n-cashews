'use client';

import React, { useState, useEffect } from 'react';
import { Download, Sparkles, X, Share, Smartphone, WifiOff } from 'lucide-react';
import { SquareButton } from '@/components/ui/SquareButton';
import { setupPwaInstallListener, BeforeInstallPromptEvent, isStandalonePwa } from '@/lib/pwa';

export const PwaInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Check if app is already running as standalone PWA
    if (isStandalonePwa()) return;

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    // Setup Chrome/Android install listener
    setupPwaInstallListener((e) => {
      setDeferredPrompt(e);
      setIsVisible(true);
    });

    // Show iOS prompt if iOS and not standalone
    if (isIosDevice && !(window.navigator as any).standalone) {
      const dismissed = localStorage.getItem('vsn_ios_pwa_dismissed');
      if (!dismissed) {
        setIsVisible(true);
      }
    }

    // Network status listeners
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (!navigator.onLine) {
      setIsOffline(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      console.log('[PWA] User accepted the install prompt');
    }
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  const handleDismissIos = () => {
    localStorage.setItem('vsn_ios_pwa_dismissed', 'true');
    setIsVisible(false);
  };

  return (
    <>
      {/* OFFLINE WARNING TOAST BANNER */}
      {isOffline && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-amber-600 text-black px-4 py-2 font-mono text-xs font-bold text-center flex items-center justify-center gap-2 shadow-lg animate-fade-in">
          <WifiOff className="w-4 h-4 animate-bounce" />
          <span>Working Offline: Saved catalog & cart items remain fully accessible!</span>
        </div>
      )}

      {/* INSTALL APP BANNER */}
      {isVisible && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 z-40 max-w-sm bg-[#0B132B] border-2 border-[#D4AF37] p-4 text-[#F8F9FA] shadow-[0_0_25px_rgba(212,175,55,0.3)] animate-slide-up">
          <div className="flex items-start justify-between gap-3">
            <div className="p-2 border border-[#D4AF37] bg-[#1C2541] text-[#D4AF37]">
              {isIos ? <Smartphone className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-serif font-bold tracking-wider text-[#F3E5AB]">
                Install V S N CASHEWS App
              </h4>
              <p className="text-[11px] text-gray-300 mt-1">
                {isIos
                  ? 'Add to Home Screen for fast offline catalog browsing & one-tap wholesale orders.'
                  : 'Install our royal Mangalore mobile app for offline access and direct shipment updates.'}
              </p>
            </div>
            <button
              onClick={isIos ? handleDismissIos : () => setIsVisible(false)}
              className="text-gray-400 hover:text-[#D4AF37]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {isIos ? (
            <div className="mt-3 bg-[#1C2541] border border-gray-700 p-2.5 text-[10px] font-mono text-amber-200 flex items-center gap-2">
              <Share className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>Tap <strong>Share</strong> icon in Safari, then select <strong>Add to Home Screen</strong>.</span>
            </div>
          ) : (
            <div className="mt-3 flex gap-2">
              <SquareButton variant="gold" size="sm" fullWidth onClick={handleInstallClick}>
                <Download className="w-3.5 h-3.5 mr-1" /> Install App
              </SquareButton>
              <SquareButton variant="ghost" size="sm" onClick={() => setIsVisible(false)}>
                Later
              </SquareButton>
            </div>
          )}
        </div>
      )}
    </>
  );
};
