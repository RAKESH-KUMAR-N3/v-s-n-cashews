'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  User,
  Mail,
  Phone,
  Lock,
  Sparkles,
  Building2,
  CheckCircle2,
  LogOut,
  ShieldCheck,
  Crown,
  KeyRound,
  ArrowRight,
  Gift,
  FileText,
  MapPin,
  ShoppingBag,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { SquareButton } from '@/components/ui/SquareButton';
import { SquareInput } from '@/components/ui/SquareInput';
import { SquareBadge } from '@/components/ui/SquareBadge';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToCheckout?: () => void;
}

type AuthTab = 'LOGIN' | 'REGISTER' | 'PRESETS';

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onNavigateToCheckout }) => {
  const { userMode, userProfile, loginUser, logoutUser, signupUser } = useCart();

  const [activeTab, setActiveTab] = useState<AuthTab>('LOGIN');

  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('nrakeshkumar36@gmail.com');
  const [loginPassword, setLoginPassword] = useState('• • • • • • • •');
  const [useOtp, setUseOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regCompany, setRegCompany] = useState('');
  const [regGstin, setRegGstin] = useState('');
  const [isB2B, setIsB2B] = useState(false);

  // Status messages
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  // Handle Login Submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (useOtp) {
      if (!otpSent) {
        if (!loginIdentifier || loginIdentifier.length < 5) {
          setErrorMsg('Please enter a valid mobile number or email address');
          return;
        }
        setOtpSent(true);
        setSuccessMsg('Verification OTP sent to your registered mobile number: 8899');
        return;
      }

      if (otpCode.trim() !== '8899' && otpCode.trim().length < 4) {
        setErrorMsg('Please enter valid 4-digit OTP (Try demo OTP: 8899)');
        return;
      }
    } else {
      if (!loginIdentifier || !loginPassword) {
        setErrorMsg('Please enter email/phone and password');
        return;
      }
    }

    // Perform Login
    loginUser({
      name: loginIdentifier.includes('@') ? loginIdentifier.split('@')[0].toUpperCase() : 'RAKESH KUMAR',
      email: loginIdentifier.includes('@') ? loginIdentifier : 'nrakeshkumar36@gmail.com',
    });

    setSuccessMsg('Welcome back to V S N CASHEWS Royal Club!');
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1000);
  };

  // Handle Register Submit
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!regName || regName.trim().length < 2) {
      setErrorMsg('Full Name is required');
      return;
    }
    if (!regEmail || !regEmail.includes('@')) {
      setErrorMsg('Valid Email is required');
      return;
    }
    if (!regPhone || regPhone.length < 10) {
      setErrorMsg('Valid 10-digit phone number is required');
      return;
    }

    signupUser({
      name: regName,
      email: regEmail,
      phone: regPhone,
      companyName: isB2B ? regCompany : undefined,
      gstin: isB2B ? regGstin : undefined,
    });

    setSuccessMsg('Royal Club Account created successfully! 5% Patron Discount unlocked.');
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1200);
  };

  // Preset quick logins
  const handlePresetLogin = (preset: 'PATRON' | 'WHOLESALE' | 'ESTATE') => {
    if (preset === 'PATRON') {
      loginUser({
        name: 'Rakesh Kumar',
        email: 'nrakeshkumar36@gmail.com',
        isRoyalMember: true,
        memberDiscountPercent: 5,
      });
    } else if (preset === 'WHOLESALE') {
      loginUser({
        name: 'Sovereign Exports Pvt Ltd',
        email: 'wholesale@vsncashews.com',
        isRoyalMember: true,
        memberDiscountPercent: 10,
      });
    } else {
      loginUser({
        name: 'Mangalore Estate Manager',
        email: 'estate@vsncashews.com',
        isRoyalMember: true,
        memberDiscountPercent: 12,
      });
    }

    setSuccessMsg(`Logged in as ${preset} Account`);
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 800);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-lg bg-[#0B132B] border-2 border-[#D4AF37] p-6 sm:p-8 text-[#F8F9FA] shadow-[0_0_50px_rgba(212,175,55,0.25)] overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-[#D4AF37] border border-gray-700 hover:border-[#D4AF37] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-[#D4AF37] bg-[#1C2541] text-[#D4AF37] mb-2">
              <Crown className="w-6 h-6" />
            </div>
            <h2 className="font-serif font-black text-xl sm:text-2xl text-[#F3E5AB]">
              {userMode === 'LOGGED_IN' ? 'Royal Patron Account' : 'V S N Sovereign Portal'}
            </h2>
            <p className="text-xs text-gray-300 mt-1">
              {userMode === 'LOGGED_IN'
                ? 'Welcome back to Mangalore Cashew Privilege Club'
                : 'Sign in or register to unlock instant 5% member savings & fast checkout'}
            </p>
          </div>

          {/* Feedback Messages */}
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-950/60 border border-red-500 text-red-200 text-xs font-semibold">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-950/60 border border-emerald-500 text-emerald-200 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              {successMsg}
            </div>
          )}

          {/* IF LOGGED IN: SHOW PROFILE DASHBOARD */}
          {userMode === 'LOGGED_IN' && userProfile ? (
            <div className="space-y-6">
              <div className="p-4 bg-[#1C2541] border border-[#D4AF37]/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#F8F9FA]">
                      {userProfile.name}
                    </h3>
                    <p className="text-xs text-gray-300 font-mono">{userProfile.email}</p>
                  </div>
                  <SquareBadge variant="gold" className="text-xs flex items-center gap-1">
                    <Crown className="w-3 h-3" /> Royal Member
                  </SquareBadge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-[#D4AF37]/20 text-gray-300">
                  <div>
                    <span className="block text-[10px] text-gray-400 uppercase">Patron Privilege</span>
                    <strong className="text-[#F3E5AB]">{userProfile.memberDiscountPercent}% Automatic Savings</strong>
                  </div>
                  <div>
                    <span className="block text-[10px] text-gray-400 uppercase">Delivery Privilege</span>
                    <strong className="text-emerald-400">Free Priority Air &gt; ₹1,999</strong>
                  </div>
                </div>
              </div>

              {/* Action Links */}
              <div className="space-y-2">
                {onNavigateToCheckout && (
                  <SquareButton
                    variant="gold"
                    fullWidth
                    onClick={() => {
                      onClose();
                      onNavigateToCheckout();
                    }}
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Proceed directly to Checkout
                  </SquareButton>
                )}

                <button
                  onClick={logoutUser}
                  className="w-full py-2.5 px-4 bg-red-950/40 border border-red-500/50 text-red-300 hover:bg-red-900/60 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" /> Sign Out of Account
                </button>
              </div>
            </div>
          ) : (
            /* IF NOT LOGGED IN: SHOW LOGIN / REGISTER / PRESETS TABS */
            <div>
              {/* Tab Selector */}
              <div className="grid grid-cols-3 gap-1 bg-[#1C2541] p-1 border border-[#D4AF37]/30 mb-5 text-xs font-mono">
                <button
                  onClick={() => {
                    setActiveTab('LOGIN');
                    setErrorMsg('');
                  }}
                  className={`py-2 text-center uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === 'LOGIN'
                      ? 'bg-[#D4AF37] text-[#0B132B] font-bold'
                      : 'text-gray-300 hover:text-[#D4AF37]'
                  }`}
                >
                  Sign In
                </button>

                <button
                  onClick={() => {
                    setActiveTab('REGISTER');
                    setErrorMsg('');
                  }}
                  className={`py-2 text-center uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === 'REGISTER'
                      ? 'bg-[#D4AF37] text-[#0B132B] font-bold'
                      : 'text-gray-300 hover:text-[#D4AF37]'
                  }`}
                >
                  Register
                </button>

                <button
                  onClick={() => {
                    setActiveTab('PRESETS');
                    setErrorMsg('');
                  }}
                  className={`py-2 text-center uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === 'PRESETS'
                      ? 'bg-[#D4AF37] text-[#0B132B] font-bold'
                      : 'text-gray-300 hover:text-[#D4AF37]'
                  }`}
                >
                  Quick Demo
                </button>
              </div>

              {/* TAB 1: LOGIN FORM */}
              {activeTab === 'LOGIN' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <SquareInput
                    label="Mobile Number or Email Address"
                    placeholder="e.g. 9845012345 or user@domain.com"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    icon={<Mail className="w-3.5 h-3.5" />}
                  />

                  {useOtp ? (
                    <div>
                      {otpSent ? (
                        <SquareInput
                          label="Enter 4-Digit SMS OTP"
                          placeholder="e.g. 8899"
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
                          icon={<KeyRound className="w-3.5 h-3.5" />}
                        />
                      ) : (
                        <p className="text-xs text-amber-300 bg-amber-950/30 p-2 border border-amber-500/30">
                          Click "Send SMS OTP" below to receive a instant security code on your phone.
                        </p>
                      )}
                    </div>
                  ) : (
                    <SquareInput
                      label="Account Password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      icon={<Lock className="w-3.5 h-3.5" />}
                    />
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-300">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={useOtp}
                        onChange={(e) => {
                          setUseOtp(e.target.checked);
                          setOtpSent(false);
                        }}
                        className="accent-[#D4AF37]"
                      />
                      <span>Login with SMS OTP</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => alert('Password reset link dispatched to registered email')}
                      className="text-[#D4AF37] hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <SquareButton type="submit" variant="gold" fullWidth className="mt-2">
                    {useOtp ? (otpSent ? 'Verify OTP & Sign In' : 'Send SMS OTP') : 'Sign In to Account'}
                  </SquareButton>
                </form>
              )}

              {/* TAB 2: REGISTER FORM */}
              {activeTab === 'REGISTER' && (
                <form onSubmit={handleRegisterSubmit} className="space-y-3">
                  <SquareInput
                    label="Full Name"
                    placeholder="e.g. Rakesh Kumar"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    icon={<User className="w-3.5 h-3.5" />}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <SquareInput
                      label="Email Address"
                      type="email"
                      placeholder="e.g. name@domain.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      icon={<Mail className="w-3.5 h-3.5" />}
                    />

                    <SquareInput
                      label="Mobile Phone"
                      placeholder="e.g. 9845012345"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      icon={<Phone className="w-3.5 h-3.5" />}
                    />
                  </div>

                  <SquareInput
                    label="Create Password"
                    type="password"
                    placeholder="At least 6 characters"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    icon={<Lock className="w-3.5 h-3.5" />}
                  />

                  {/* B2B Wholesale Option */}
                  <div className="pt-1">
                    <label className="flex items-center gap-2 text-xs text-[#F3E5AB] cursor-pointer font-semibold">
                      <input
                        type="checkbox"
                        checked={isB2B}
                        onChange={(e) => setIsB2B(e.target.checked)}
                        className="accent-[#D4AF37]"
                      />
                      <span>Register as Wholesale / Corporate Business Account?</span>
                    </label>

                    {isB2B && (
                      <div className="mt-2 p-3 bg-[#1C2541] border border-[#D4AF37]/30 space-y-2">
                        <SquareInput
                          label="Company / Firm Name"
                          placeholder="e.g. V S N Enterprises"
                          value={regCompany}
                          onChange={(e) => setRegCompany(e.target.value)}
                          icon={<Building2 className="w-3.5 h-3.5" />}
                        />
                        <SquareInput
                          label="GSTIN Number (Optional)"
                          placeholder="29AAAAA0000A1Z5"
                          value={regGstin}
                          onChange={(e) => setRegGstin(e.target.value.toUpperCase())}
                          icon={<FileText className="w-3.5 h-3.5" />}
                        />
                      </div>
                    )}
                  </div>

                  <SquareButton type="submit" variant="gold" fullWidth className="mt-3">
                    Create Royal Club Account
                  </SquareButton>
                </form>
              )}

              {/* TAB 3: PRESET DEMO PROFILES */}
              {activeTab === 'PRESETS' && (
                <div className="space-y-3 text-xs">
                  <p className="text-gray-300">
                    Select a pre-configured profile to test different customer authorization levels instantly:
                  </p>

                  <button
                    type="button"
                    onClick={() => handlePresetLogin('PATRON')}
                    className="w-full p-3 bg-[#1C2541] hover:bg-[#1C2541]/80 border border-[#D4AF37]/40 text-left transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <div>
                      <h4 className="font-serif font-bold text-[#F3E5AB] group-hover:text-[#D4AF37]">
                        Rakesh Kumar (Retail Royal Patron)
                      </h4>
                      <p className="text-gray-300 text-[11px]">nrakeshkumar36@gmail.com • 5% Automatic Patron Savings</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePresetLogin('WHOLESALE')}
                    className="w-full p-3 bg-[#1C2541] hover:bg-[#1C2541]/80 border border-[#D4AF37]/40 text-left transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <div>
                      <h4 className="font-serif font-bold text-[#F3E5AB] group-hover:text-[#D4AF37]">
                        Sovereign Exports (Corporate B2B Buyer)
                      </h4>
                      <p className="text-gray-300 text-[11px]">GSTIN Verified • 10% Wholesale Volume Discount</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePresetLogin('ESTATE')}
                    className="w-full p-3 bg-[#1C2541] hover:bg-[#1C2541]/80 border border-[#D4AF37]/40 text-left transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <div>
                      <h4 className="font-serif font-bold text-[#F3E5AB] group-hover:text-[#D4AF37]">
                        Mangalore Estate Manager
                      </h4>
                      <p className="text-gray-300 text-[11px]">Direct Orchard Access • 12% Privilege Tier</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
                  </button>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
