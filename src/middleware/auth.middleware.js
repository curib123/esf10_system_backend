import { verifyToken } from '../utils/jwt.util.js';

export const authenticate = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const token = header.split(' ')[1];
    req.user = verifyToken(token);
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user?.roles) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const allowed = roles.some(r =>
      req.user.roles.includes(r)
    );

    if (!allowed) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  };
};
