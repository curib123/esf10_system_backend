import { PermissionService } from '../services/permission.service.js';

export const createPermission = async (req, res) => {
  const { code, description } = req.body;

  const permission = await PermissionService.create({
    code,
    description,
  });

  res.status(201).json({ success: true, data: permission });
};

export const getPermissions = async (req, res) => {
  const permissions = await PermissionService.findAll();
  res.json({ success: true, data: permissions });
};

export const updatePermission = async (req, res) => {
  const id = Number(req.params.id);
  const permission = await PermissionService.update(id, req.body);

  res.json({ success: true, data: permission });
};

export const deletePermission = async (req, res) => {
  const id = Number(req.params.id);
  await PermissionService.delete(id);

  res.json({ success: true, message: 'Permission deleted' });
};
