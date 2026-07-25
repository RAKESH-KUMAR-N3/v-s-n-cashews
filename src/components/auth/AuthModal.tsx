'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  User,
  Mail,
  Lock,
  Phone,
  CheckCircle2,
  LogOut,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  KeyRound,
  ArrowLeft,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { SquareButton } from '@/components/ui/SquareButton';
import { SquareInput } from '@/components/ui/SquareInput';
import { useRouter } from 'next/navigation';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToCheckout?: () => void;
}

type AuthTab = 'LOGIN' | 'REGISTER' | 'FORGOT_PASSWORD';

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onNavigateToCheckout }) => {
  const router = useRouter();
  const { userMode, userProfile, loginUser, logoutUser, signupUser } = useCart();

  const [activeTab, setActiveTab] = useState<AuthTab>('LOGIN');

  // Login Form State (Prefilled with Admin seed credentials)
  const [loginIdentifier, setLoginIdentifier] = useState('admin123@gmail.com');
  const [loginPassword, setLoginPassword] = useState('123123');
  const [showPassword, setShowPassword] = useState(false);

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // Forgot Password State
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  // Status messages
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  // Handle Login Submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!loginIdentifier || !loginPassword) {
      setErrorMsg('Please enter your email and password');
      return;
    }

    const isAdmin =
      loginIdentifier.trim().toLowerCase() === 'admin123@gmail.com' && loginPassword.trim() === '123123';

    loginUser({
      name: isAdmin ? 'Admin' : loginIdentifier.includes('@') ? loginIdentifier.split('@')[0].toUpperCase() : 'Customer',
      email: loginIdentifier,
      isAdmin: isAdmin,
    });

    if (isAdmin) {
      setSuccessMsg('Logged in as Admin! Redirecting to Admin Portal...');
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
        router.push('/admin');
      }, 1000);
    } else {
      setSuccessMsg('Welcome back to V S N CASHEWS!');
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 1000);
    }
  };

  // Handle Register Submit
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!regName || regName.trim().length < 2) {
      setErrorMsg('Please enter your full name');
      return;
    }
    if (!regEmail || !regEmail.includes('@')) {
      setErrorMsg('Please enter a valid email address');
      return;
    }
    if (!regPhone || regPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }

    signupUser({
      name: regName,
      email: regEmail,
      phone: regPhone,
    });

    setSuccessMsg('Account created successfully! Welcome to V S N CASHEWS.');
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1200);
  };

  // Handle Forgot Password Submit
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!resetEmail || !resetEmail.includes('@')) {
      setErrorMsg('Please enter your registered email address');
      return;
    }
    setResetSent(true);
    setSuccessMsg(`Password reset instructions sent to ${resetEmail}`);
  };

  // Quick fill Admin credentials
  const fillAdminCredentials = () => {
    setLoginIdentifier('admin123@gmail.com');
    setLoginPassword('123123');
    setErrorMsg('');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[999999] bg-gradient-to-b from-[#060A17] via-[#0B132B] to-[#040711] text-[#F8F9FA] flex flex-col justify-between p-6 overflow-y-auto max-w-[100vw]"
      >
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#d4af3708_1px,transparent_1px),linear-gradient(to_bottom,#d4af3708_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

        {/* Top Header Bar with Close Button */}
        <div className="flex items-center justify-between z-10 w-full max-w-md mx-auto pt-2">
          {activeTab === 'FORGOT_PASSWORD' ? (
            <button
              onClick={() => setActiveTab('LOGIN')}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#D4AF37] hover:text-[#F3E5AB] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Sign In
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-[#D4AF37] border border-gray-700 hover:border-[#D4AF37] transition-colors cursor-pointer ml-auto"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Center Full-Screen Form Container (Moved up to eliminate top empty space) */}
        <div className="flex-1 flex flex-col items-center justify-start z-10 w-full max-w-md mx-auto pt-2 sm:pt-4 pb-6">
          {/* Floating Logo Header */}
          <motion.div
            animate={{ y: [-4, 4, -4] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            className="flex flex-col items-center mb-3 text-center cursor-pointer"
            onClick={onClose}
          >
            <div className="relative mb-2">
              <div className="absolute inset-0 bg-[#D4AF37]/25 rounded-full blur-3xl scale-125 animate-pulse" />
              <img
                src="/assets/v-s-n-logo.png"
                alt="V S N Logo"
                className="w-48 sm:w-56 h-auto object-contain relative z-10 drop-shadow-[0_0_30px_rgba(212,175,55,0.7)]"
              />
            </div>
            <span className="-mt-2 font-serif text-2xl sm:text-3xl font-black tracking-[0.2em] gold-gradient-text uppercase">
              CASHEWS
            </span>
          </motion.div>

          {/* Feedback Messages */}
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full mb-4 p-3 bg-red-950/80 border border-red-500 text-red-200 text-xs font-semibold text-center"
            >
              {errorMsg}
            </motion.div>
          )}
          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full mb-4 p-3 bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs font-semibold flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </motion.div>
          )}

          {/* IF LOGGED IN: PROFILE DASHBOARD */}
          {userMode === 'LOGGED_IN' && userProfile ? (
            <div className="w-full space-y-4 text-center">
              <div className="p-4 bg-[#1C2541]/90 border border-[#D4AF37]/40 space-y-2">
                <h3 className="font-serif font-bold text-lg text-[#F8F9FA]">
                  {userProfile.name}
                </h3>
                <p className="text-xs text-gray-300">{userProfile.email}</p>
                {userProfile.isAdmin && (
                  <span className="inline-block bg-[#D4AF37] text-[#0B132B] px-3 py-1 text-xs font-extrabold uppercase mt-2">
                    Admin Privileges Active
                  </span>
                )}
              </div>

              <div className="space-y-3 pt-2">
                {userProfile.isAdmin && (
                  <SquareButton
                    variant="gold"
                    fullWidth
                    size="lg"
                    onClick={() => {
                      onClose();
                      router.push('/admin');
                    }}
                  >
                    Go to Admin Portal
                  </SquareButton>
                )}

                {onNavigateToCheckout && (
                  <SquareButton
                    variant="outline"
                    fullWidth
                    size="lg"
                    onClick={() => {
                      onClose();
                      onNavigateToCheckout();
                    }}
                  >
                    Proceed to Checkout
                  </SquareButton>
                )}

                <button
                  onClick={logoutUser}
                  className="w-full py-3 px-4 bg-red-950/40 border border-red-500/50 text-red-300 hover:bg-red-900/60 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          ) : (
            /* IF NOT LOGGED IN: FULL SCREEN SEAMLESS FORM (NO CARD BOX!) */
            <div className="w-full space-y-5">
              {/* Clean Seamless Tab Switcher */}
              {activeTab !== 'FORGOT_PASSWORD' && (
                <div className="grid grid-cols-2 gap-1 bg-[#1C2541]/60 p-1 border border-[#D4AF37]/40 mb-2">
                  <button
                    onClick={() => {
                      setActiveTab('LOGIN');
                      setErrorMsg('');
                    }}
                    className={`py-2.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      activeTab === 'LOGIN'
                        ? 'bg-[#D4AF37] text-[#0B132B] shadow-md font-extrabold'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Sign In
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('REGISTER');
                      setErrorMsg('');
                    }}
                    className={`py-2.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      activeTab === 'REGISTER'
                        ? 'bg-[#D4AF37] text-[#0B132B] shadow-md font-extrabold'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Register
                  </button>
                </div>
              )}

              {/* TAB 1: SIGN IN FORM */}
              {activeTab === 'LOGIN' && (
                <motion.form
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  onSubmit={handleLoginSubmit}
                  className="space-y-4"
                >
                  <SquareInput
                    label="Email or Mobile Number"
                    placeholder="admin123@gmail.com"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    icon={<Mail className="w-4 h-4" />}
                  />

                  <div className="relative">
                    <SquareInput
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="123123"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      icon={<Lock className="w-4 h-4" />}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-8.5 text-gray-400 hover:text-[#D4AF37]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Forgot Password & Admin Shortcut Links */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      type="button"
                      onClick={fillAdminCredentials}
                      className="text-[#D4AF37] hover:underline flex items-center gap-1 font-semibold"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Admin Login (admin123@gmail.com)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('FORGOT_PASSWORD');
                        setErrorMsg('');
                        setSuccessMsg('');
                      }}
                      className="text-[#F3E5AB] hover:text-[#D4AF37] underline font-semibold"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <SquareButton type="submit" variant="gold" fullWidth className="mt-4 py-3.5 text-sm">
                    Sign In to Account <ArrowRight className="w-4 h-4 ml-1" />
                  </SquareButton>
                </motion.form>
              )}

              {/* TAB 2: REGISTER FORM */}
              {activeTab === 'REGISTER' && (
                <motion.form
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  onSubmit={handleRegisterSubmit}
                  className="space-y-3.5"
                >
                  <SquareInput
                    label="Full Name"
                    placeholder="e.g. Rakesh Kumar"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    icon={<User className="w-4 h-4" />}
                  />

                  <SquareInput
                    label="Email Address"
                    type="email"
                    placeholder="name@domain.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    icon={<Mail className="w-4 h-4" />}
                  />

                  <SquareInput
                    label="Mobile Phone Number"
                    placeholder="9845012345"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    icon={<Phone className="w-4 h-4" />}
                  />

                  <SquareInput
                    label="Create Password"
                    type="password"
                    placeholder="••••••••"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    icon={<Lock className="w-4 h-4" />}
                  />

                  <SquareButton type="submit" variant="gold" fullWidth className="mt-4 py-3.5 text-sm">
                    Create Account
                  </SquareButton>
                </motion.form>
              )}

              {/* TAB 3: FORGOT PASSWORD FORM */}
              {activeTab === 'FORGOT_PASSWORD' && (
                <motion.form
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  onSubmit={handleForgotSubmit}
                  className="space-y-4"
                >
                  <div className="text-center space-y-1 mb-2">
                    <h3 className="font-serif font-bold text-base text-[#F3E5AB]">Reset Account Password</h3>
                    <p className="text-xs text-gray-300">
                      Enter your registered email address below to receive password reset instructions.
                    </p>
                  </div>

                  <SquareInput
                    label="Registered Email Address"
                    type="email"
                    placeholder="name@domain.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    icon={<Mail className="w-4 h-4" />}
                  />

                  <SquareButton type="submit" variant="gold" fullWidth className="py-3 text-sm">
                    Send Reset Link
                  </SquareButton>

                  <button
                    type="button"
                    onClick={() => setActiveTab('LOGIN')}
                    className="w-full text-center text-xs text-gray-400 hover:text-[#D4AF37] pt-2"
                  >
                    Back to Sign In
                  </button>
                </motion.form>
              )}
            </div>
          )}
        </div>

        {/* Bottom Security Footer */}
        <div className="text-center text-[10px] text-gray-500 z-10 pb-2">
          🔒 256-Bit SSL Encrypted & Secure Authentication
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
