import crypto from 'node:crypto';

const SCRYPT_PARAMS = {
  N: 16384,
  r: 8,
  p: 1,
  keyLen: 64,
  saltLen: 32,
};

/**
 * Securely hashes a plain-text password using crypto.scrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(SCRYPT_PARAMS.saltLen).toString('hex');
    crypto.scrypt(
      password,
      salt,
      SCRYPT_PARAMS.keyLen,
      { N: SCRYPT_PARAMS.N, r: SCRYPT_PARAMS.r, p: SCRYPT_PARAMS.p },
      (err, derivedKey) => {
        if (err) return reject(err);
        resolve(`${salt}:${derivedKey.toString('hex')}`);
      }
    );
  });
}

/**
 * Timing-safe password verification
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  return new Promise((resolve) => {
    const parts = storedHash.split(':');
    if (parts.length !== 2) return resolve(false);

    const [salt, keyHex] = parts;
    const key = Buffer.from(keyHex, 'hex');

    crypto.scrypt(
      password,
      salt,
      SCRYPT_PARAMS.keyLen,
      { N: SCRYPT_PARAMS.N, r: SCRYPT_PARAMS.r, p: SCRYPT_PARAMS.p },
      (err, derivedKey) => {
        if (err) return resolve(false);
        resolve(crypto.timingSafeEqual(key, derivedKey));
      }
    );
  });
}

/**
 * Generate cryptographically secure random tokens (for reset tokens, sessions, etc.)
 */
export function generateToken(lengthInBytes: number = 32): string {
  return crypto.randomBytes(lengthInBytes).toString('hex');
}

/**
 * Generate secure session ID
 */
export function generateSessionId(): string {
  return `vsn_sess_${crypto.randomBytes(24).toString('hex')}`;
}
