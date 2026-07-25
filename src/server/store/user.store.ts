import { hashPassword, verifyPassword, generateToken, generateSessionId } from '../utils/security';

export type UserRole = 'USER' | 'ADMIN' | 'MANAGER';

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  phone?: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SessionRecord {
  id: string;
  userId: string;
  token: string;
  expiresAt: number; // timestamp in ms
  createdAt: string;
}

export interface ResetTokenRecord {
  token: string;
  email: string;
  expiresAt: number; // timestamp in ms
}

class UserStore {
  private users: Map<string, UserRecord> = new Map();
  private sessions: Map<string, SessionRecord> = new Map();
  private resetTokens: Map<string, ResetTokenRecord> = new Map();

  constructor() {
    this.seedDefaultAdmin();
  }

  private async seedDefaultAdmin() {
    const adminEmail = 'admin@vsncashews.com';
    if (!this.findByEmail(adminEmail)) {
      const defaultPasswordHash = await hashPassword('RoyalCashew2026!');
      const adminUser: UserRecord = {
        id: 'usr_admin_sovereign_001',
        name: 'V S N Royal Administrator',
        email: adminEmail,
        passwordHash: defaultPasswordHash,
        role: 'ADMIN',
        phone: '+919876543210',
        emailVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.users.set(adminUser.id, adminUser);
    }
  }

  findByEmail(email: string): UserRecord | undefined {
    const normalized = email.toLowerCase().trim();
    return Array.from(this.users.values()).find(
      (u) => u.email.toLowerCase() === normalized
    );
  }

  findById(id: string): UserRecord | undefined {
    return this.users.get(id);
  }

  async createUser(data: {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
    phone?: string;
  }): Promise<UserRecord> {
    const existing = this.findByEmail(data.email);
    if (existing) {
      throw new Error('A user with this email address already exists.');
    }

    const passwordHash = await hashPassword(data.password);
    const userId = `usr_${generateToken(12)}`;

    const newUser: UserRecord = {
      id: userId,
      name: data.name,
      email: data.email.toLowerCase().trim(),
      passwordHash,
      role: data.role || 'USER',
      phone: data.phone,
      emailVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.users.set(userId, newUser);
    return newUser;
  }

  async createSession(userId: string): Promise<SessionRecord> {
    const user = this.findById(userId);
    if (!user) {
      throw new Error('User not found for session creation.');
    }

    const token = generateSessionId();
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days

    const session: SessionRecord = {
      id: `sess_${generateToken(8)}`,
      userId,
      token,
      expiresAt,
      createdAt: new Date().toISOString(),
    };

    this.sessions.set(token, session);
    return session;
  }

  getSession(token: string): { session: SessionRecord; user: UserRecord } | null {
    const session = this.sessions.get(token);
    if (!session) return null;

    if (Date.now() > session.expiresAt) {
      this.sessions.delete(token);
      return null;
    }

    const user = this.findById(session.userId);
    if (!user) {
      this.sessions.delete(token);
      return null;
    }

    return { session, user };
  }

  invalidateSession(token: string): boolean {
    return this.sessions.delete(token);
  }

  async createPasswordResetToken(email: string): Promise<string> {
    const user = this.findByEmail(email);
    if (!user) {
      // Return a generated token anyway to prevent account enumeration, but don't store it
      return generateToken(32);
    }

    const token = generateToken(32);
    const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hour expiration

    this.resetTokens.set(token, {
      token,
      email: user.email,
      expiresAt,
    });

    return token;
  }

  async resetPasswordWithToken(token: string, newPassword: string): Promise<boolean> {
    const resetRecord = this.resetTokens.get(token);
    if (!resetRecord) return false;

    if (Date.now() > resetRecord.expiresAt) {
      this.resetTokens.delete(token);
      return false;
    }

    const user = this.findByEmail(resetRecord.email);
    if (!user) {
      this.resetTokens.delete(token);
      return false;
    }

    const newHash = await hashPassword(newPassword);
    user.passwordHash = newHash;
    user.updatedAt = new Date().toISOString();

    // Invalidate the reset token
    this.resetTokens.delete(token);

    // Invalidate all existing active sessions for security
    for (const [sessToken, sess] of this.sessions.entries()) {
      if (sess.userId === user.id) {
        this.sessions.delete(sessToken);
      }
    }

    return true;
  }

  toPublicUser(user: UserRecord) {
    const { passwordHash, ...publicData } = user;
    return publicData;
  }
}

export const userStore = new UserStore();
