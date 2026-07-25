import { Router, Response } from 'express';
import {
  AuthenticatedRequest,
  requireAuth,
  requireRole,
} from '../middleware/auth.middleware';

const router = Router();

/**
 * GET /api/protected/user/profile
 * Requires: Authenticated session (Role: USER, ADMIN, or MANAGER)
 */
router.get(
  '/user/profile',
  requireAuth,
  (req: AuthenticatedRequest, res: Response) => {
    return res.json({
      success: true,
      message: 'Access granted to Protected User Profile.',
      userProfile: {
        id: req.user?.id,
        name: req.user?.name,
        email: req.user?.email,
        role: req.user?.role,
        emailVerified: req.user?.emailVerified,
        createdAt: req.user?.createdAt,
      },
    });
  }
);

/**
 * GET /api/protected/admin/dashboard
 * Requires: Authenticated session AND 'ADMIN' Role
 */
router.get(
  '/admin/dashboard',
  requireAuth,
  requireRole(['ADMIN']),
  (req: AuthenticatedRequest, res: Response) => {
    return res.json({
      success: true,
      message: 'Access granted to Sovereign Royal Admin Dashboard.',
      adminData: {
        totalUsers: 1248,
        monthlyRevenue: '₹2,84,500',
        activeExportOrders: 34,
        factoryInventoryStatus: {
          W180_King: '4,500 kg',
          W210_Jumbo: '8,200 kg',
          W240_Large: '12,000 kg',
        },
      },
      accessedBy: {
        id: req.user?.id,
        name: req.user?.name,
        role: req.user?.role,
      },
    });
  }
);

/**
 * GET /api/protected/manager/inventory
 * Requires: Authenticated session AND 'ADMIN' or 'MANAGER' Role
 */
router.get(
  '/manager/inventory',
  requireAuth,
  requireRole(['ADMIN', 'MANAGER']),
  (req: AuthenticatedRequest, res: Response) => {
    return res.json({
      success: true,
      message: 'Access granted to Factory Inventory Management.',
      inventory: [
        { grade: 'W180 Royal Jumbo', stockKg: 4500, pricePerKg: 1450 },
        { grade: 'W210 Super Jumbo', stockKg: 8200, pricePerKg: 1280 },
        { grade: 'W240 Large Whole', stockKg: 12000, pricePerKg: 1100 },
      ],
    });
  }
);

export const protectedRoutes = router;
