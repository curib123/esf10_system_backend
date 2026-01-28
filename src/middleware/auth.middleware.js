import { verifyToken } from '../utils/jwt.util.js';

/* ============================
   AUTHENTICATE (JWT)
============================ */
export const authenticate = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
  }

  try {
    const token = header.split(' ')[1];
    const payload = verifyToken(token);

    /*
      payload structure:
      {
        userId,
        roles: [],
        permissions: []
      }
    */
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};

/* ============================
   AUTHORIZE BY ROLE
============================ */
export const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    const roles = req.user?.roles || [];

    const allowed = allowedRoles.some(role =>
      roles.includes(role)
    );

    if (!allowed) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: insufficient role',
      });
    }

    next();
  };
};

/* ============================
   AUTHORIZE BY PERMISSION
============================ */
export const authorizePermission = (...requiredPermissions) => {
  return (req, res, next) => {
    const permissions = req.user?.permissions || [];

    const allowed = requiredPermissions.every(permission =>
      permissions.includes(permission)
    );

    if (!allowed) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: insufficient permissions',
      });
    }

    next();
  };
};
