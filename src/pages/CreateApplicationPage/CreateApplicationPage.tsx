import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { appRoutes } from '@/router/constants/appRoutes';
import { applicationsIndexedDbStorage } from '@/shared/services/ApplicationsIndexedDbStorage';
import { ApplicationGoalBanner } from '@/shared/modules/ApplicationGoalBanner';
import { Header } from '@/shared/modules/Header';
import { CreateApplicationForm } from './components/CreateApplicationForm';
import { CreateApplicationResult } from './components/CreateApplicationResult';
import { useCreateApplicationForm } from './components/CreateApplicationForm/hooks/useCreateApplicationForm';
import type { IGeneratedApplication } from '@/shared/types';

export const CreateApplicationPage = () => {
  const { id: applicationId } = useParams();
  const navigate = useNavigate();

  const [generatedApplication, setGeneratedApplication] =
    useState<IGeneratedApplication | null>(null);

  const {
    additionalDetailsValue,
    companyValue,
    errors,
    isSubmitting,
    jobTitleValue,
    keySkillsValue,
    register,
    submitError,
    submitForm,
  } = useCreateApplicationForm({
    applicationId,
    defaultApplication: generatedApplication,
    onGenerated: setGeneratedApplication,
  });

  const handleCreateApplicationClick = useCallback(() => {
    setGeneratedApplication(null);
  }, []);

  useEffect(() => {
    if (!applicationId) {
      return;
    }

    let isCurrentRequest = true;

    const loadApplication = async () => {
      const application = await applicationsIndexedDbStorage.getById(applicationId);

      if (isCurrentRequest) {
        if (!application) {
          navigate(appRoutes.applications.create, { replace: true });

          return;
        }

        setGeneratedApplication(application ?? null);
      }
    };

    loadApplication();

    return () => {
      isCurrentRequest = false;
    };
  }, [applicationId, navigate]);

  return (
    <main className='page-wrapper'>
      <div className='page-container gap-3xl'>
        <Header />
        <section className='grid w-full gap-3xl lg:grid-cols-[1fr_1fr]'>
          <CreateApplicationForm
            applicationId={applicationId}
            additionalDetailsValue={additionalDetailsValue}
            companyValue={companyValue}
            errors={errors}
            isSubmitting={isSubmitting}
            jobTitleValue={jobTitleValue}
            keySkillsValue={keySkillsValue}
            register={register}
            submitError={submitError}
            submitForm={submitForm}
          />
          <CreateApplicationResult
            generatedResult={generatedApplication?.generatedResult}
            isLoading={isSubmitting}
          />
        </section>
        {applicationId && <ApplicationGoalBanner onClick={handleCreateApplicationClick} />}
      </div>
    </main>
  );
};
