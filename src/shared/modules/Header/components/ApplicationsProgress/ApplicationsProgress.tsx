import { memo } from 'react';
import { CheckIcon } from '@/assets/icons';
import { ProgressDots } from '@/shared/components/ProgressDots';
import { APPLICATIONS_GOAL_COUNT } from '@/shared/constants/applications';
import { useGeneratedApplicationsCount } from '@/shared/hooks/useGeneratedApplicationsCount';

export const ApplicationsProgress = memo(() => {
  const { applicationsCount, completedCount, isGoalReached } = useGeneratedApplicationsCount();

  const progressText = isGoalReached
    ? `${applicationsCount} applications generated`
    : `${completedCount}/${APPLICATIONS_GOAL_COUNT} applications generated`;

  return (
    <div>
      <div className='flex items-center gap-xl'>
        <p className='whitespace-nowrap text-center text-m leading-7 text-neutral-100'>
          {progressText}
        </p>
        {isGoalReached ? (
          <CheckIcon className='size-7' />
        ) : (
          <div
            aria-hidden='true'
            className='flex shrink-0 items-center gap-1'
          >
            <ProgressDots
              completedCount={completedCount}
              totalCount={APPLICATIONS_GOAL_COUNT}
            />
          </div>
        )}
      </div>
    </div>
  );
});

ApplicationsProgress.displayName = 'ApplicationsProgress';
