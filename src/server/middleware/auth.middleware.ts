import { Request, Response, NextFunction } from 'express';
import { userStore, UserRecord, SessionRecord, UserRole } from '../store/user.store';

export interface AuthenticatedRequest extends Request {
  user?: UserRecord;
  session?: SessionRecord;
}

/**
 * Extracts and verifies active session cookie or Bearer token
 */
export function authenticateSession(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  // 1. Extract session token from cookies or Authorization header
  let token = req.cookies?.vsn_cashews_session || req.cookies?.better_auth_session;

  if (!token && req.headers.authorization) {
    const parts = req.headers.authorization.split(' ');
    if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
      token = parts[1];
    }
  }

  if (token) {
    const sessionData = userStore.getSession(token);
    if (sessionData) {
      req.user = sessionData.user;
      req.session = sessionData.session;
    }
  }

  next();
}

/**
 * Requires an authenticated user session. Returns 401 if missing or invalid.
 */
export function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.user || !req.session) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized access. Active authenticated session is required.',
      code: 'UNAUTHORIZED',
    });
  }
  next();
}

/**
 * Enforces Role-Based Access Control (RBAC).
 * Returns 403 Forbidden if user role is insufficient.
 */
export function requireRole(allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized access.',
        code: 'UNAUTHORIZED',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Access forbidden. Role '${req.user.role}' lacks necessary permissions for this resource.`,
        code: 'FORBIDDEN_ROLE',
        requiredRoles: allowedRoles,
        currentRole: req.user.role,
      });
    }

    next();
  };
}
