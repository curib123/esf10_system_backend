import * as userService from '../services/user.service.js';
import { sendError } from '../utils/http.util.js';
import { parsePositiveInt } from '../utils/request.util.js';

/* =========================
   GET USERS
========================= */
export const getUsers = async (req, res) => {
  try {
    const result = await userService.getUsers(req.query);
    res.json({ success: true, ...result });
  } catch (err) {
    sendError(res, err, 'Failed to fetch users');
  }
};

/* =========================
   GET USER
========================= */
export const getUser = async (req, res) => {
  try {
    const user = await userService.getUserById(parsePositiveInt(req.params.id, 'userId'));

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({ success: true, data: user });
  } catch (err) {
    sendError(res, err, 'Failed to fetch user');
  }
};

/* =========================
   UPDATE USER (INFO + PASSWORD + ROLES)
========================= */
export const updateUser = async (req, res) => {
  try {
    const userId = parsePositiveInt(req.params.id, 'userId');

    const user = await userService.updateUser(userId, req.body);

    res.json({
      success: true,
      message: 'User updated successfully',
      data: user,
    });
  } catch (err) {
    sendError(res, err, 'Failed to update user');
  }
};

/* =========================
   DELETE USER (SOFT DELETE)
========================= */
export const deleteUser = async (req, res) => {
  try {
    const userId = parsePositiveInt(req.params.id, 'userId');

    const user = await userService.deleteUser(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      message: 'User deleted',
      data: {
        id: user.id,
        email: user.email,
        deletedAt: user.deletedAt,
      },
    });
  } catch (err) {
    sendError(res, err, 'Failed to delete user');
  }
};


/* =========================
   TOGGLE ACTIVE STATUS
========================= */
export const toggleUserActive = async (req, res) => {
  try {
    const user = await userService.toggleUserActive(
      parsePositiveInt(req.params.id, 'userId')
    );

    res.json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'}`,
      data: user,
    });
  } catch (err) {
    sendError(res, err, 'Failed to toggle user status');
  }
};
