import { memo } from 'react';

interface IProps {
  completedClassName?: string;
  completedCount: number;
  incompletedClassName?: string;
  totalCount: number;
}

const defaultCompletedClassName = 'size-2 rounded bg-neutral-300';
const defaultIncompletedClassName = 'size-2 rounded bg-neutral-300/24';

export const ProgressDots = memo(({
  completedClassName = defaultCompletedClassName,
  completedCount,
  incompletedClassName = defaultIncompletedClassName,
  totalCount,
}: IProps) => (
  <>
    {Array.from({ length: totalCount }, (_, index) => {
      const isCompleted = index + 1 <= completedCount;

      return (
        <span
          key={index}
          className={isCompleted ? completedClassName : incompletedClassName}
        />
      );
    })}
  </>
));

ProgressDots.displayName = 'ProgressDots';
