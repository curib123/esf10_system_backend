import * as documentService from '../services/document.service.js';
import { sendError } from '../utils/http.util.js';
import { parsePositiveInt } from '../utils/request.util.js';

export const createDocument = async (req, res) => {
  try {
    const document = await documentService.createDocumentService({
      studentId: Number(req.body.studentId),
      enrollmentId: req.body.enrollmentId ? Number(req.body.enrollmentId) : undefined,
      type: req.body.type,
      file: req.file,
      fileUrl: req.body.fileUrl,
    });

    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      data: document,
    });
  } catch (error) {
    sendError(res, error, 'Failed to upload document');
  }
};

export const listDocuments = async (req, res) => {
  try {
    const result = await documentService.getDocumentsService({
      ...req.query,
      includeDeleted: req.query.includeDeleted === 'true',
    });

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    sendError(res, error, 'Failed to fetch documents');
  }
};

export const getDocument = async (req, res) => {
  try {
    const document = await documentService.getDocumentByIdService(
      parsePositiveInt(req.params.id, 'documentId')
    );

    res.json({
      success: true,
      data: document,
    });
  } catch (error) {
    sendError(res, error, 'Failed to fetch document');
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const document = await documentService.deleteDocumentService(
      parsePositiveInt(req.params.id, 'documentId')
    );

    res.json({
      success: true,
      message: 'Document deleted successfully',
      data: document,
    });
  } catch (error) {
    sendError(res, error, 'Failed to delete document');
  }
};
