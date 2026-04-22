import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { parseKeySkills } from '@/pages/CreateApplicationPage/utils';
import { createApplicationFormSchema } from '@/pages/CreateApplicationPage/validation';
import { appRoutes } from '@/router/constants/appRoutes';
import { applicationsIndexedDbStorage } from '@/shared/services/ApplicationsIndexedDbStorage';
import { googleGenAiTextGenerationService } from '@/shared/services/GoogleGenAiTextGenerationService';
import { buildApplicationTextPrompt, mapApplicationToFormValues } from './utils';
import type { ICreateApplicationFormValues } from '@/pages/CreateApplicationPage/types';
import type {
  IAiTextGenerationService,
  IApplicationsStorage,
  IGeneratedApplication,
} from '@/shared/types';
import type {
  IGenerateApplicationTextViaAIParams,
} from './types';

interface IUseCreateApplicationFormParams {
  applicationId?: string;
  defaultApplication?: IGeneratedApplication | null;
  onGenerated: (application: IGeneratedApplication) => void;
  storage?: IApplicationsStorage;
  textGenerationService?: IAiTextGenerationService;
}

const emptyDefaultValues: ICreateApplicationFormValues = {
  additionalDetails: '',
  company: '',
  jobTitle: '',
  keySkills: '',
};

export const useCreateApplicationForm = ({
  applicationId,
  defaultApplication,
  onGenerated,
  storage = applicationsIndexedDbStorage,
  textGenerationService = googleGenAiTextGenerationService,
}: IUseCreateApplicationFormParams) => {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm<ICreateApplicationFormValues>({
    defaultValues: emptyDefaultValues,
    mode: 'onChange',
    resolver: zodResolver(createApplicationFormSchema),
  });

  useEffect(() => {
    reset(defaultApplication ? mapApplicationToFormValues(defaultApplication) : emptyDefaultValues);
  }, [defaultApplication, reset]);

  const [
    jobTitleValue = '',
    companyValue = '',
    keySkillsValue = '',
    additionalDetailsValue = '',
  ] = useWatch({
    control,
    name: ['jobTitle', 'company', 'keySkills', 'additionalDetails'],
  });

  const clearSubmitError = () => {
    setSubmitError(null);
  };

  const generateApplicationTextViaAI = useCallback((
    params: IGenerateApplicationTextViaAIParams,
  ) => {
    const prompt = buildApplicationTextPrompt(params);

    return textGenerationService.generateText(prompt);
  }, [textGenerationService]);

  const submitForm = handleSubmit(async values => {
    clearSubmitError();
    const keySkills = parseKeySkills(values.keySkills);

    const application: IGeneratedApplication = {
      id: applicationId ?? crypto.randomUUID(),
      additionalDetails: values.additionalDetails,
      company: values.company,
      generatedResult: '',
      jobTitle: values.jobTitle,
      keySkills,
    };

    try {
      const generatedResult = await generateApplicationTextViaAI({
        additionalDetails: values.additionalDetails,
        company: values.company,
        jobTitle: values.jobTitle,
        keySkills,
      });

      const applicationWithGeneratedText: IGeneratedApplication = {
        ...application,
        generatedResult,
      };

      const savedApplication = applicationId
        ? await storage.updateById(applicationId, applicationWithGeneratedText)
        : await storage.add(applicationWithGeneratedText);

      onGenerated(savedApplication);

      if (!applicationId) {
        navigate(appRoutes.applications.getDetailsPath(savedApplication.id));
      }
    } catch {
      setSubmitError('Could not save the generated application. Try again.');
    }
  }, clearSubmitError);

  return {
    additionalDetailsValue,
    companyValue,
    errors,
    isSubmitting,
    jobTitleValue,
    keySkillsValue,
    register,
    submitError,
    submitForm,
  };
};
