import { useNavigate } from 'react-router-dom';
import { appRoutes } from '@/router/constants/appRoutes';
import { ApplicationGoalBanner } from '@/shared/modules/ApplicationGoalBanner';
import { Button, EButtonSize } from '@/shared/components/Button';
import { PlusIcon } from '@/assets/icons';
import { Header } from '@/shared/modules/Header';
import { useApplications } from './hooks/useApplications';
import { ApplicationCard } from './components/ApplicationCard';
import type { IApplicationsStorage } from '@/shared/types';

interface IApplicationsPageProps {
  storage?: IApplicationsStorage;
}

export const ApplicationsPage = ({ storage }: IApplicationsPageProps) => {
  const navigate = useNavigate();
  const { applications, isLoading } = useApplications(storage);
  const hasApplications = !isLoading && applications.length > 0;

  return (
    <main className='page-wrapper'>
      <div className='page-container gap-8'>
        <Header />
        <section className='flex w-full flex-col gap-12'>
          <div className='flex w-full flex-col gap-6'>
            <div className='flex w-full flex-col items-start gap-[10px] border-b border-neutral-200 pb-xl lg:flex-row lg:items-center lg:justify-between lg:gap-6'>
              <h1 className='font-display text-lg font-semibold leading-[60px] tracking-[-2%] text-neutral-300 lg:text-xl'>
                Applications
              </h1>
              <Button 
                size={EButtonSize.Small}
                onClick={() => { navigate(appRoutes.applications.create); }}
              >
                <PlusIcon />
                Create New
              </Button>
            </div>
            {hasApplications && (
              <div className='grid w-full grid-cols-1 gap-x-4 gap-y-6 md:grid-cols-2'>
                {applications.map(application => (
                  <ApplicationCard application={application} key={application.id} />
                ))}
              </div>
            )}
          </div>
          {!isLoading && <ApplicationGoalBanner />}
        </section>
      </div>
    </main>
  );
};
