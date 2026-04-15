import { z } from 'zod';

const positiveInt = z.coerce.number().int().positive();

const optionalPositiveInt = positiveInt.optional();

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[A-Z]/, 'Password must include an uppercase letter')
  .regex(/[a-z]/, 'Password must include a lowercase letter')
  .regex(/[0-9]/, 'Password must include a number');

const nonEmptyString = z.string().trim().min(1, 'This field is required');

const positiveIntParam = z.object({
  id: positiveInt,
});

const enrollmentIdParam = z.object({
  enrollmentId: positiveInt,
});

export const authLoginSchema = z.object({
  email: z.string().trim().email('A valid email address is required'),
  password: z.string().min(1, 'Password is required'),
});

export const authRegisterSchema = z.object({
  email: z.string().trim().email('A valid email address is required'),
  password: passwordSchema,
  fullName: nonEmptyString,
  roleIds: z.array(positiveInt).min(1, 'At least one role is required'),
});

export const userIdParamSchema = positiveIntParam;

export const userListQuerySchema = z.object({
  page: positiveInt.optional(),
  limit: positiveInt.max(100, 'limit must not exceed 100').optional(),
  search: z.string().trim().min(1).optional(),
  isActive: z.enum(['true', 'false']).optional(),
  sortBy: z.enum(['createdAt', 'email', 'fullName', 'isActive']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export const userUpdateBodySchema = z
  .object({
    email: z.string().trim().email('A valid email address is required').optional(),
    password: passwordSchema.optional(),
    fullName: nonEmptyString.optional(),
    isActive: z.boolean().optional(),
    roleIds: z.array(positiveInt).min(1, 'roleIds cannot be empty').optional(),
  })
  .refine(
    (value) => Object.keys(value).length > 0,
    { message: 'At least one field must be provided' }
  );

export const enrollmentListQuerySchema = z.object({
  page: positiveInt.optional(),
  limit: positiveInt.max(50, 'limit must not exceed 50').optional(),
  schoolYearId: optionalPositiveInt,
  gradeLevelId: optionalPositiveInt,
  status: z.enum(['ACTIVE', 'COMPLETED', 'IMPORTED']).optional(),
  sectionId: optionalPositiveInt,
  q: z.string().trim().min(1).optional(),
});

export const enrollmentIdParamSchema = positiveIntParam;

export const enrollmentCreateBodySchema = z.object({
  studentId: positiveInt,
  schoolYearId: positiveInt,
  curriculumVersionId: positiveInt,
  gradeLevelId: positiveInt,
  sectionId: optionalPositiveInt,
});

export const enrollmentUpdateBodySchema = z
  .object({
    sectionId: positiveInt,
  })
  .strict()
  .refine(
    (value) => Object.keys(value).length > 0,
    { message: 'At least one field must be provided' }
  );

export const gradesEnrollmentIdParamSchema = enrollmentIdParam;

export const gradesSummaryQuerySchema = z.object({
  sectionId: positiveInt,
  subjectId: positiveInt,
  period: z.enum(['Q1', 'Q2', 'Q3', 'Q4']),
});

export const gradesUpsertBodySchema = z.object({
  grades: z.array(
    z.object({
      subjectId: positiveInt,
      period: z.enum(['Q1', 'Q2', 'Q3', 'Q4']),
      value: z.number().min(0).max(100),
    })
  ).min(1, 'At least one grade is required'),
});
