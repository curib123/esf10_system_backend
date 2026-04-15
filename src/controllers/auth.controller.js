import * as AuthService from '../services/auth.service.js';
import { sendError } from '../utils/http.util.js';
import { getAuthenticatedUserId } from '../utils/request.util.js';

/* ============================
   REGISTER (RBAC-DRIVEN)
============================ */
export const register = async (req, res) => {
  try {
    const { email, password, fullName, roleIds } = req.body;

    const data = await AuthService.register({
      email,
      password,
      fullName,
      roleIds, // 👈 array of role IDs
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data,
    });
  } catch (error) {
    sendError(res, error, 'Failed to register user');
  }
};

/* ============================
   LOGIN
============================ */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const data = await AuthService.login({
      email,
      password,
    });

    res.json({
      success: true,
      message: 'Login successful',
      data,
    });
  } catch (error) {
    sendError(res, error, 'Failed to log in');
  }
};

/* ============================
   GET CURRENT USER (/me)
============================ */
export const me = async (req, res) => {
  try {
    const userId = getAuthenticatedUserId(req);

    const user = await AuthService.getMe(userId);

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    sendError(res, error, 'Failed to fetch current user');
  }
};
