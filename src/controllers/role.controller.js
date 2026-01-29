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
  try {
    const id = Number(req.params.id);

    const role = await RoleService.delete(id);

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found',
      });
    }

    res.json({
      success: true,
      message: 'Role deleted',
      data: {
        id: role.id,
        name: role.name,
        deletedAt: role.deletedAt,
      },
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const setRolePermissions = async (req, res) => {
  const roleId = Number(req.params.id);
  const { permissionIds } = req.body;

  await RoleService.setPermissions(roleId, permissionIds);

  res.json({ success: true, message: 'Permissions updated' });
};
