import * as AuthService from '../services/auth.service.js';

export const register = async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    const data = await AuthService.register({
      email,
      password,
      fullName,
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

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
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

/* ============================
   GET ME
============================ */
export const me = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await AuthService.getMe(userId);

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};