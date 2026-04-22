import type { ICreateApplicationFormValues } from '@/pages/CreateApplicationPage/types';
import type { IGeneratedApplication } from '@/shared/types';

export const mapApplicationToFormValues = (
  application: IGeneratedApplication,
): ICreateApplicationFormValues => ({
  additionalDetails: application.additionalDetails,
  company: application.company,
  jobTitle: application.jobTitle,
  keySkills: application.keySkills.join(', '),
});
