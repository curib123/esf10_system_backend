// src/controllers/schoolYear.controller.js
import * as SchoolYearService from '../services/schoolYear.service.js';

export const create = async (req, res) => {
  const data = await SchoolYearService.createSchoolYear(req.body);
  res.status(201).json({ success: true, data });
};

export const findAll = async (req, res) => {
  const data = await SchoolYearService.getSchoolYears();
  res.json({ success: true, data });
};

export const findOne = async (req, res) => {
  const id = Number(req.params.id);
  const data = await SchoolYearService.getSchoolYearById(id);

  if (!data) {
    return res.status(404).json({ message: 'School year not found' });
  }

  res.json({ success: true, data });
};

export const update = async (req, res) => {
  const id = Number(req.params.id);
  const data = await SchoolYearService.updateSchoolYear(id, req.body);
  res.json({ success: true, data });
};

export const activate = async (req, res) => {
  const id = Number(req.params.id);
  const data = await SchoolYearService.activateSchoolYear(id);
  res.json({ success: true, data });
};

export const remove = async (req, res) => {
  try {
    const id = Number(req.params.id);
    await SchoolYearService.deleteSchoolYear(id);
    res.json({ success: true, message: 'School year deleted' });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
