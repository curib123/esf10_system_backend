import * as systemSettingService from '../services/systemSetting.service.js';
import { sendError } from '../utils/http.util.js';

export const listSystemSettings = async (_req, res) => {
  try {
    const settings = await systemSettingService.getSystemSettingsService();

    res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    sendError(res, error, 'Failed to fetch system settings');
  }
};

export const getSystemSetting = async (req, res) => {
  try {
    const setting = await systemSettingService.getSystemSettingByKeyService(req.params.key);

    res.json({
      success: true,
      data: setting,
    });
  } catch (error) {
    sendError(res, error, 'Failed to fetch system setting');
  }
};

export const upsertSystemSetting = async (req, res) => {
  try {
    const setting = await systemSettingService.upsertSystemSettingService(
      req.params.key,
      req.body.value
    );

    res.json({
      success: true,
      message: 'System setting saved successfully',
      data: setting,
    });
  } catch (error) {
    sendError(res, error, 'Failed to save system setting');
  }
};

export const bulkUpsertSystemSettings = async (req, res) => {
  try {
    const settings = await systemSettingService.bulkUpsertSystemSettingsService(req.body.settings);

    res.json({
      success: true,
      message: 'System settings saved successfully',
      data: settings,
    });
  } catch (error) {
    sendError(res, error, 'Failed to save system settings');
  }
};
