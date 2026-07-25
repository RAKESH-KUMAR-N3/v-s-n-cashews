'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Download, Share, CheckCircle2 } from 'lucide-react';
import { BeforeInstallPromptEvent, setupPwaInstallListener, isStandalonePwa } from '@/lib/pwa';

interface MobileSplashScreenProps {
  onContinue: () => void;
}

export const MobileSplashScreen: React.FC<MobileSplashScreenProps> = ({ onContinue }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIos, setIsIos] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  useEffect(() => {
    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    // PWA Install listener
    setupPwaInstallListener((e) => {
      setDeferredPrompt(e);
    });

    if (isStandalonePwa()) {
      setInstalledSuccess(true);
    }
  }, []);

  const handleInstallClick = async () => {
    if (isIos) {
      setShowIosGuide(!showIosGuide);
      return;
    }

    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setInstalledSuccess(true);
      }
      setDeferredPrompt(null);
    } else {
      alert('To install VSN Mobile App, tap your browser menu (⋮) and select "Add to Home screen" or "Install App".');
    }
  };

  // 10 background falling cashew particles configuration
  const fallingCashews = [
    { id: 1, left: '6%', delay: 0, duration: 7, size: 'text-xs' },
    { id: 2, left: '22%', delay: 1.5, duration: 8, size: 'text-sm' },
    { id: 3, left: '42%', delay: 3, duration: 6.5, size: 'text-xs' },
    { id: 4, left: '65%', delay: 0.8, duration: 9, size: 'text-sm' },
    { id: 5, left: '85%', delay: 2.2, duration: 7.5, size: 'text-xs' },
    { id: 6, left: '14%', delay: 4, duration: 8.5, size: 'text-xs' },
    { id: 7, left: '34%', delay: 0.5, duration: 7.2, size: 'text-sm' },
    { id: 8, left: '55%', delay: 3.5, duration: 9.5, size: 'text-xs' },
    { id: 9, left: '78%', delay: 1.8, duration: 6.8, size: 'text-xs' },
    { id: 10, left: '92%', delay: 4.5, duration: 8, size: 'text-sm' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[999999] bg-gradient-to-b from-[#060A17] via-[#0B132B] to-[#040711] text-[#F8F9FA] flex flex-col justify-between p-6 overflow-hidden max-w-[100vw]"
    >
      {/* BACKGROUND FLOATING CASHEW PIECES FLOW ANIMATION */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {fallingCashews.map((item) => (
          <motion.div
            key={item.id}
            initial={{ y: -40, opacity: 0, rotate: 0 }}
            animate={{
              y: ['0vh', '105vh'],
              opacity: [0, 0.4, 0.4, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              repeat: Infinity,
              duration: item.duration,
              delay: item.delay,
              ease: 'linear',
            }}
            style={{ left: item.left }}
            className={`absolute top-0 ${item.size} select-none opacity-40`}
          >
            🥜
          </motion.div>
        ))}
      </div>

      {/* Background Decorative Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#d4af3708_1px,transparent_1px),linear-gradient(to_bottom,#d4af3708_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

      {/* Spacer Top */}
      <div className="pt-4 z-10" />

      {/* Center 3D VSN Logo + Joined CASHEWS Text */}
      <div className="flex-1 flex flex-col items-center justify-center text-center my-auto z-10 px-4">
        <motion.div
          animate={{ y: [-8, 8, -8] }}
          transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
          className="flex flex-col items-center cursor-pointer"
          onClick={onContinue}
        >
          {/* Elevated 3D VSN Image */}
          <div className="relative">
            <div className="absolute inset-0 bg-[#D4AF37]/25 rounded-full blur-3xl scale-125 animate-pulse" />
            <img
              src="/assets/v-s-n-logo.png"
              alt="V S N Logo"
              className="w-52 sm:w-64 h-auto object-contain relative z-10 drop-shadow-[0_0_35px_rgba(212,175,55,0.8)]"
            />
          </div>

          {/* Joined CASHEWS Text directly attached under logo */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="-mt-3 z-20"
          >
            <span className="font-serif text-2xl sm:text-3xl font-black tracking-[0.25em] gold-gradient-text uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
              CASHEWS
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Floating Action Buttons (Elevated & Fully Visible) */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="space-y-4 z-10 pb-8 sm:pb-12 max-w-xs mx-auto w-full flex flex-col items-center"
      >
        {/* 1. CONTINUE TO STORE BUTTON */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          animate={{ y: [-3, 3, -3] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          onClick={onContinue}
          className="w-full bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#AA7C11] text-[#0B132B] font-extrabold text-sm uppercase tracking-widest py-3.5 px-6 shadow-[0_0_25px_rgba(212,175,55,0.5)] border border-[#F3E5AB] flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Continue to Store</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>

        {/* 2. INSTALL APP AS CLEAN ELEGANT TEXT LINK (Not a box card) */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleInstallClick}
          className="py-1 px-3 text-xs font-bold uppercase tracking-wider text-[#D4AF37] hover:text-[#F3E5AB] transition-colors flex items-center justify-center gap-1.5 cursor-pointer bg-transparent border-none"
        >
          {installedSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="underline underline-offset-4">App Installed</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5 text-[#D4AF37] animate-bounce" />
              <span className="underline underline-offset-4 decoration-[#D4AF37]/50 hover:decoration-[#F3E5AB]">
                Install VSN Mobile App
              </span>
            </>
          )}
        </motion.button>

        {/* iOS Install Helper */}
        <AnimatePresence>
          {showIosGuide && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-[#1C2541] border border-[#D4AF37]/50 p-3 text-[11px] text-gray-200 space-y-1 text-center w-full"
            >
              <div className="flex items-center justify-center gap-1.5 text-[#D4AF37] font-bold">
                <Share className="w-4 h-4" />
                <span>iPhone / iPad Installation:</span>
              </div>
              <p>1. Tap the <strong>Share</strong> icon in Safari bottom bar.</p>
              <p>2. Tap <strong>Add to Home Screen</strong>.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};
