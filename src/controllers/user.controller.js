import * as userService from '../services/user.service.js';

/* =========================
   GET USERS
========================= */
export const getUsers = async (req, res) => {
  try {
    const result = await userService.getUsers(req.query);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   GET USER
========================= */
export const getUser = async (req, res) => {
  try {
    const user = await userService.getUserById(Number(req.params.id));

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   UPDATE USER
========================= */
export const updateUser = async (req, res) => {
  try {
    const userId = Number(req.params.id);

    const user = await userService.updateUser(userId, req.body);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      data: user,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};


/* =========================
   DELETE USER
========================= */
export const deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(Number(req.params.id));
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/* =========================
   ASSIGN ROLES
========================= */
export const assignRoles = async (req, res) => {
  try {
    await userService.assignRoles(
      Number(req.params.id),
      req.body.roleIds
    );

    res.json({ success: true, message: 'Roles updated' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/* =========================
   TOGGLE ACTIVE STATUS
========================= */
export const toggleUserActive = async (req, res) => {
  try {
    const user = await userService.toggleUserActive(
      Number(req.params.id)
    );

    res.json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'}`,
      data: user,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};
