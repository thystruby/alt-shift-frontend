import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { appRoutes } from '@/router/constants/appRoutes';
import { APPLICATIONS_GOAL_COUNT } from '@/shared/constants/applications';
import { Button } from '@/shared/components/Button';
import { PlusIcon } from '@/assets/icons';
import { useGeneratedApplicationsCount } from '../../hooks/useGeneratedApplicationsCount';

interface IApplicationGoalBannerProps {
  onClick?: () => void;
}

export const ApplicationGoalBanner = (props: IApplicationGoalBannerProps) => {
  const { onClick } = props;
  const navigate = useNavigate();
  const { completedCount, isGoalReached } = useGeneratedApplicationsCount();
  const progressText = `${completedCount} out of ${APPLICATIONS_GOAL_COUNT}`;

  const handleCreateApplicationClick = () => {
    onClick?.();
    navigate(appRoutes.applications.create);
  };

  const renderProgressDots = useCallback(() => (
    Array.from({ length: APPLICATIONS_GOAL_COUNT }, (_, index) => {
      const className = index + 1 > completedCount ? 'h-2 w-8 rounded bg-neutral-300/24' : 'h-2 w-8 rounded bg-neutral-300';

      return <span className={className} key={index} />;
    })
  ), [completedCount]);

  if (isGoalReached) return null;

  return (
    <section className='flex w-full flex-col items-center overflow-hidden rounded-md bg-green-500 p-4xl sm:px-16'>
      <div className='flex flex-col items-center gap-8 max-w-[480px]'>
        <div className='flex flex-col items-center gap-xl text-center'>
          <h2 className='font-display text-lg font-semibold leading-[44px] tracking-[-2%] text-neutral-300'>
            Hit your goal
          </h2>
          <p className='text-m leading-[28px] text-neutral-100'>
            Generate and send out couple more job applications today to get
            hired faster
          </p>
          <Button
            modifiers='min-w-[190px]'
            onClick={handleCreateApplicationClick}
          >
            <PlusIcon />
            Create New
          </Button>
        </div>
        <div className='flex flex-col items-center gap-2'>
          <div
            aria-hidden='true'
            className='flex items-start gap-2'
            data-testid='goal-progress-bars'
          >
            {renderProgressDots()}
          </div>
          <p className='text-center text-m leading-[28px] text-neutral-100'>
            {progressText}
          </p>
        </div>
      </div>
    </section>
  );
};
