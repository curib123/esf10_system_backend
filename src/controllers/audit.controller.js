import * as auditService from '../services/audit.service.js';
import { sendError } from '../utils/http.util.js';

export const listAuditLogs = async (req, res) => {
  try {
    const result = await auditService.listAuditLogsService(req.query);

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    sendError(res, error, 'Failed to fetch audit logs');
  }
};

export const exportAuditLogs = async (req, res) => {
  try {
    const csv = await auditService.exportAuditLogsService(req.query);

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="audit-logs-${new Date().toISOString().slice(0, 10)}.csv"`
    );

    res.status(200).send(csv);
  } catch (error) {
    sendError(res, error, 'Failed to export audit logs');
  }
};
