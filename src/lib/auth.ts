import { betterAuth } from 'better-auth';

const authSecret =
  process.env.BETTER_AUTH_SECRET ||
  'vsn_cashews_royal_sovereign_secret_key_32_chars_minimum';
const authUrl = process.env.BETTER_AUTH_URL || 'http://localhost:3000';

export const auth = betterAuth({
  secret: authSecret,
  baseURL: authUrl,
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    autoSignIn: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  advanced: {
    cookiePrefix: 'vsn_cashews',
    useSecureCookies: process.env.NODE_ENV === 'production',
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'USER',
        required: true,
      },
      phone: {
        type: 'string',
        required: false,
      },
    },
  },
});

export type AuthSession = typeof auth.$Infer.Session;
