import { PermissionService } from '../services/permission.service.js';

export const getPermissions = async (req, res) => {
  const permissions = await PermissionService.findAll();

  res.json({
    success: true,
    data: permissions,
  });
};
