import { Router, Response } from 'express';
import { toNodeHandler } from 'better-auth/node';
import { auth } from '../../lib/auth';
import { userStore } from '../store/user.store';
import { verifyPassword } from '../utils/security';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../validators/auth.validator';
import { AuthenticatedRequest, requireAuth } from '../middleware/auth.middleware';

const router = Router();

/**
 * Cookie options for secure session handling
 */
const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/',
});

/**
 * POST /api/auth/register
 * Features: Validation, Password Hashing, Role Assignment, Session & Secure Cookies
 */
router.post('/register', async (req: AuthenticatedRequest, res: Response) => {
  try {
    // 1. Validation
    const parseResult = registerSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed for registration input.',
        details: parseResult.error.flatten().fieldErrors,
      });
    }

    const { name, email, password, role, phone } = parseResult.data;

    // 2. Check existing user
    if (userStore.findByEmail(email)) {
      return res.status(409).json({
        success: false,
        error: 'An account with this email address already exists.',
      });
    }

    // 3. Create user (Password is hashed securely inside store using scrypt)
    const user = await userStore.createUser({
      name,
      email,
      password,
      role,
      phone,
    });

    // 4. Create active session & set secure HttpOnly cookie
    const session = await userStore.createSession(user.id);
    res.cookie('vsn_cashews_session', session.token, getCookieOptions());

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      user: userStore.toPublicUser(user),
      session: {
        id: session.id,
        expiresAt: new Date(session.expiresAt).toISOString(),
      },
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Internal server error during registration.',
    });
  }
});

/**
 * POST /api/auth/login
 * Features: Validation, Password Verification, Session Creation, Secure Cookies
 */
router.post('/login', async (req: AuthenticatedRequest, res: Response) => {
  try {
    // 1. Validation
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed for login credentials.',
        details: parseResult.error.flatten().fieldErrors,
      });
    }

    const { email, password } = parseResult.data;

    // 2. Lookup user
    const user = userStore.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password credentials.',
      });
    }

    // 3. Verify password hash using timing-safe scrypt
    const isPasswordValid = await verifyPassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password credentials.',
      });
    }

    // 4. Create session & set secure cookie
    const session = await userStore.createSession(user.id);
    res.cookie('vsn_cashews_session', session.token, getCookieOptions());

    return res.json({
      success: true,
      message: 'Authentication successful.',
      user: userStore.toPublicUser(user),
      session: {
        id: session.id,
        expiresAt: new Date(session.expiresAt).toISOString(),
      },
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Internal server error during login.',
    });
  }
});

/**
 * POST /api/auth/logout
 * Features: Active Session Invalidation & Cookie Clearing
 */
router.post('/logout', (req: AuthenticatedRequest, res: Response) => {
  const token = req.cookies?.vsn_cashews_session || req.cookies?.better_auth_session;

  if (token) {
    userStore.invalidateSession(token);
  }

  res.clearCookie('vsn_cashews_session', { path: '/' });
  res.clearCookie('better_auth_session', { path: '/' });

  return res.json({
    success: true,
    message: 'Logged out successfully.',
  });
});

/**
 * POST /api/auth/forgot-password
 * Features: Validation, Cryptographically Secure Token Generation, Email Dispatch Simulation
 */
router.post('/forgot-password', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const parseResult = forgotPasswordSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed.',
        details: parseResult.error.flatten().fieldErrors,
      });
    }

    const { email } = parseResult.data;
    const resetToken = await userStore.createPasswordResetToken(email);

    // Simulated secure email notification output for development/audit logs
    console.log(`[PASSWORD RESET EMAIL SIMULATION] Reset Link for ${email}:`);
    console.log(`http://localhost:3000/reset-password?token=${resetToken}`);

    return res.json({
      success: true,
      message:
        'If an account exists with that email, a password reset link has been dispatched.',
      debugResetToken: process.env.NODE_ENV !== 'production' ? resetToken : undefined,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Error processing password reset request.',
    });
  }
});

/**
 * POST /api/auth/reset-password
 * Features: Token Verification, Expiration Check, Password Re-Hashing & Session Invalidation
 */
router.post('/reset-password', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const parseResult = resetPasswordSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed for password reset.',
        details: parseResult.error.flatten().fieldErrors,
      });
    }

    const { token, newPassword } = parseResult.data;

    const success = await userStore.resetPasswordWithToken(token, newPassword);
    if (!success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired password reset token.',
      });
    }

    return res.json({
      success: true,
      message: 'Password reset successfully. Please log in with your new credentials.',
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Error resetting password.',
    });
  }
});

/**
 * GET /api/auth/me
 * Features: Returns Current Authenticated User & Session Expiry
 */
router.get('/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  return res.json({
    success: true,
    user: req.user ? userStore.toPublicUser(req.user) : null,
    session: req.session
      ? {
          id: req.session.id,
          expiresAt: new Date(req.session.expiresAt).toISOString(),
        }
      : null,
  });
});

/**
 * Better Auth Native Catch-All Integration Handler
 */
router.all('/better-auth/*', async (req, res) => {
  try {
    return toNodeHandler(auth.handler)(req, res);
  } catch (err) {
    return res.status(500).json({ error: 'Better Auth handler error.' });
  }
});

export const authRoutes = router;
