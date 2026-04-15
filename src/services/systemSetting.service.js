import { db } from '../configs/db.config.js';
import { createHttpError } from '../utils/http.util.js';

export const getSystemSettingsService = async () =>
  db.systemSetting.findMany({
    orderBy: { key: 'asc' },
  });

export const getSystemSettingByKeyService = async (key) => {
  const setting = await db.systemSetting.findUnique({
    where: { key },
  });

  if (!setting) {
    throw createHttpError(404, 'System setting not found', 'SYSTEM_SETTING_NOT_FOUND');
  }

  return setting;
};

export const upsertSystemSettingService = async (key, value) =>
  db.systemSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });

export const bulkUpsertSystemSettingsService = async (settings) =>
  db.$transaction(
    settings.map((setting) =>
      db.systemSetting.upsert({
        where: { key: setting.key },
        update: { value: setting.value },
        create: {
          key: setting.key,
          value: setting.value,
        },
      })
    )
  );
