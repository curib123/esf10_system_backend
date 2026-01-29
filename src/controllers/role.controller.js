import { RoleService } from '../services/role.service.js';

export const createRole = async (req, res) => {
  const { name, description } = req.body;

  const role = await RoleService.create({ name, description });

  res.status(201).json({ success: true, data: role });
};

export const getRoles = async (req, res) => {
  const roles = await RoleService.findAll();
  res.json({ success: true, data: roles });
};

export const updateRole = async (req, res) => {
  const id = Number(req.params.id);
  const role = await RoleService.update(id, req.body);

  res.json({ success: true, data: role });
};

export const deleteRole = async (req, res) => {
  const id = Number(req.params.id);
  await RoleService.delete(id);

  res.json({ success: true, message: 'Role deleted' });
};

export const setRolePermissions = async (req, res) => {
  const roleId = Number(req.params.id);
  const { permissionIds } = req.body;

  await RoleService.setPermissions(roleId, permissionIds);

  res.json({ success: true, message: 'Permissions updated' });
};
