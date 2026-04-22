import { useEffect, useState } from 'react';
import {
  applicationsIndexedDbPublisherSubscriber,
  applicationsIndexedDbStorage,
} from '@/shared/services/ApplicationsIndexedDbStorage';
import { APPLICATIONS_GOAL_COUNT } from '@/shared/constants/applications';

export const useGeneratedApplicationsCount = () => {
  const [applicationsCount, setApplicationsCount] = useState(0);
  const completedCount = Math.min(applicationsCount, APPLICATIONS_GOAL_COUNT);
  const isGoalReached = completedCount >= APPLICATIONS_GOAL_COUNT;

  useEffect(() => {
    let isCurrentRequest = true;

    const loadApplicationsCount = async () => {
      try {
        const count = await applicationsIndexedDbStorage.count();

        if (isCurrentRequest) {
          setApplicationsCount(count);
        }
      } catch {
        if (isCurrentRequest) {
          setApplicationsCount(0);
        }
      }
    };

    loadApplicationsCount();

    const unsubscribe = applicationsIndexedDbPublisherSubscriber.subscribe(() => {
      loadApplicationsCount();
    });

    return () => {
      isCurrentRequest = false;
      unsubscribe();
    };
  }, []);

  return { applicationsCount, completedCount, isGoalReached };
};
