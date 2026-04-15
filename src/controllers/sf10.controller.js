import * as sf10Service from '../services/sf10.service.js';
import { sendError } from '../utils/http.util.js';
import { parsePositiveInt } from '../utils/request.util.js';

export const viewSf10 = async (req, res) => {
  try {
    const payload = await sf10Service.viewSf10Service(
      parsePositiveInt(req.params.studentId, 'studentId')
    );

    res.json({
      success: true,
      data: payload,
    });
  } catch (error) {
    sendError(res, error, 'Failed to fetch SF10');
  }
};

export const generateSf10 = async (req, res) => {
  try {
    const payload = await sf10Service.generateSf10Service(
      parsePositiveInt(req.params.studentId, 'studentId')
    );

    res.json({
      success: true,
      message: 'SF10 generated successfully',
      data: payload,
    });
  } catch (error) {
    sendError(res, error, 'Failed to generate SF10');
  }
};

export const exportSf10 = async (req, res) => {
  try {
    const payload = await sf10Service.exportSf10Service(
      parsePositiveInt(req.params.studentId, 'studentId')
    );

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="sf10-${payload.student.lrn}.json"`
    );

    res.status(200).send(JSON.stringify(payload, null, 2));
  } catch (error) {
    sendError(res, error, 'Failed to export SF10');
  }
};
