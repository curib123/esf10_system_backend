const DOMAIN_ERROR_MAP = {
  CURRICULUM_VERSION_NOT_ACTIVE: { status: 400, message: 'Curriculum version is not active' },
  DOCUMENT_FILE_REQUIRED: { status: 400, message: 'A document file or fileUrl is required' },
  DOCUMENT_NOT_FOUND: { status: 404, message: 'Document not found' },
  DUPLICATE_SUBJECT_PERIOD: { status: 409, message: 'Duplicate subject and grading period detected' },
  EMAIL_ALREADY_EXISTS: { status: 409, message: 'Email already exists' },
  EMPTY_GRADES_PAYLOAD: { status: 400, message: 'No grades were provided' },
  ENROLLMENT_NOT_ACTIVE: { status: 409, message: 'Enrollment is not active' },
  ENROLLMENT_NOT_FOUND: { status: 404, message: 'Enrollment not found' },
  FINAL_NOT_EDITABLE: { status: 409, message: 'Final grades are auto-computed and cannot be edited' },
  FORBIDDEN: { status: 403, message: 'You do not have permission to perform this action' },
  GRADE_LEVEL_NOT_ACTIVE: { status: 400, message: 'Grade level is not active' },
  INVALID_GRADE_PAYLOAD: { status: 400, message: 'Invalid grade payload structure' },
  INVALID_GRADE_VALUE: { status: 400, message: 'Grade must be a number between 0 and 100' },
  INVALID_GRADING_PERIOD: { status: 400, message: 'Invalid grading period' },
  INVALID_ID: { status: 400, message: 'Invalid identifier' },
  INVALID_UPLOAD_DRIVER: { status: 500, message: 'Invalid upload driver configuration' },
  INVALID_ENROLLMENT_FOR_STUDENT: { status: 400, message: 'Enrollment does not belong to the selected student' },
  INVALID_SECTION: { status: 400, message: 'Invalid section for the selected grade level and school year' },
  INVALID_SUBJECT_FOR_ENROLLMENT: { status: 400, message: 'Subject does not belong to this enrollment' },
  INVALID_OR_EXPIRED_TOKEN: { status: 401, message: 'Invalid or expired token' },
  NO_ACTIVE_SCHOOL_YEAR: { status: 400, message: 'No active school year found' },
  NOT_SECTION_ADVISER: { status: 403, message: 'Only the section adviser can perform this action' },
  SCHOOL_YEAR_NOT_ACTIVE: { status: 400, message: 'School year is not active' },
  SECTION_NOT_FOUND: { status: 404, message: 'Section not found' },
  STUDENT_NOT_FOUND: { status: 404, message: 'Student not found' },
  SYSTEM_SETTING_NOT_FOUND: { status: 404, message: 'System setting not found' },
  UNAUTHENTICATED: { status: 401, message: 'Unauthorized' },
  UPLOAD_ERROR: { status: 400, message: 'File upload failed' },
  USER_NOT_FOUND: { status: 404, message: 'User not found' },
};

export const createHttpError = (
  status,
  message,
  code = 'INTERNAL_SERVER_ERROR',
  details,
) => {
  const error = new Error(message);
  error.status = status;
  error.code = code;
  if (details !== undefined) {
    error.details = details;
  }
  return error;
};

export const normalizeError = (error, fallbackMessage = 'Internal Server Error') => {
  if (!error) {
    return createHttpError(500, fallbackMessage);
  }

  if (typeof error.status === 'number') {
    return createHttpError(
      error.status,
      error.message || fallbackMessage,
      error.code || 'INTERNAL_SERVER_ERROR',
      error.details,
    );
  }

  const domainError = DOMAIN_ERROR_MAP[error.code] || DOMAIN_ERROR_MAP[error.message];
  if (domainError) {
    return createHttpError(
      domainError.status,
      domainError.message,
      error.code || error.message,
      error.details,
    );
  }

  if (error.code === 'P2002') {
    return createHttpError(409, 'Resource already exists', 'UNIQUE_CONSTRAINT');
  }

  if (error.code === 'P2025') {
    return createHttpError(404, 'Record not found', 'RECORD_NOT_FOUND');
  }

  return createHttpError(
    500,
    error.message || fallbackMessage,
    error.code || 'INTERNAL_SERVER_ERROR',
    error.details,
  );
};

export const sendError = (res, error, fallbackMessage = 'Internal Server Error') => {
  const normalized = normalizeError(error, fallbackMessage);

  return res.status(normalized.status).json({
    success: false,
    message: normalized.message,
    code: normalized.code,
    ...(normalized.details ? { details: normalized.details } : {}),
  });
};
