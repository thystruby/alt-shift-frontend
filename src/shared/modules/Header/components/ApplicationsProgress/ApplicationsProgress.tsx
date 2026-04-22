import { memo, useCallback } from "react";
import { APPLICATIONS_GOAL_COUNT } from "@/shared/constants/applications";
import { useGeneratedApplicationsCount } from "@/shared/hooks/useGeneratedApplicationsCount";
import { CheckIcon } from "@/assets/icons";

export const ApplicationsProgress = memo(() => {
  const { applicationsCount, completedCount, isGoalReached } = useGeneratedApplicationsCount();

  const progressText = isGoalReached
    ? `${applicationsCount} applications generated`
    : `${completedCount}/${APPLICATIONS_GOAL_COUNT} applications generated`;
  
  const generateDots = useCallback(() => (
    <div
        aria-hidden='true'
        className='flex shrink-0 items-center gap-1'
        data-testid='header-progress-dots'
      >
      {Array.from({ length: APPLICATIONS_GOAL_COUNT }, (_, index) => {
        const className = index + 1 > completedCount ? 'size-2 rounded bg-neutral-300/24' : 'size-2 rounded bg-neutral-300';
        
        return <span key={index} className={className} />;
      })}
    </div>
  ), [completedCount]);

  return (
    <div>
      <div className='flex items-center gap-xl'>
        <p className='whitespace-nowrap text-center text-m leading-7 text-neutral-100'>
          {progressText}
        </p>
        {isGoalReached ? <CheckIcon className='size-7' /> : generateDots()}
      </div>
    </div>
  );
});

ApplicationsProgress.displayName = 'ApplicationsProgress';
