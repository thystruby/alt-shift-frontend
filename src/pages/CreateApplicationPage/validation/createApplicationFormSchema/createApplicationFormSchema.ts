import { z } from 'zod';

export const CREATE_APPLICATION_FIELD_LIMITS = {
  additionalDetails: 1200,
  company: 100,
  jobTitle: 100,
  keySkills: 100,
} as const;

export const createApplicationFormSchema = z.object({
  jobTitle: z
    .string()
    .trim()
    .min(1, 'Job title is required.')
    .max(
      CREATE_APPLICATION_FIELD_LIMITS.jobTitle,
      `Job title must be ${CREATE_APPLICATION_FIELD_LIMITS.jobTitle} characters or fewer.`,
    ),
  company: z
    .string()
    .trim()
    .min(1, 'Company is required.')
    .max(
      CREATE_APPLICATION_FIELD_LIMITS.company,
      `Company must be ${CREATE_APPLICATION_FIELD_LIMITS.company} characters or fewer.`,
    ),
  keySkills: z
    .string()
    .trim()
    .min(1, 'Skills are required.')
    .max(
      CREATE_APPLICATION_FIELD_LIMITS.keySkills,
      `Skills must be ${CREATE_APPLICATION_FIELD_LIMITS.keySkills} characters or fewer.`,
    ),
  additionalDetails: z
    .string()
    .trim()
    .min(1, 'Additional details are required.')
    .max(
      CREATE_APPLICATION_FIELD_LIMITS.additionalDetails,
      [
        'Additional details must be',
        `${CREATE_APPLICATION_FIELD_LIMITS.additionalDetails} characters or fewer.`,
      ].join(' '),
    ),
});
