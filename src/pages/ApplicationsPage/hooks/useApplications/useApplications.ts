import { useEffect, useState } from 'react';
import {
  applicationsIndexedDbPublisherSubscriber,
  applicationsIndexedDbStorage,
} from '@/shared/services/ApplicationsIndexedDbStorage';
import type { IApplicationsStorage, IGeneratedApplication } from '@/shared/types';

export const useApplications = (
  storage: IApplicationsStorage = applicationsIndexedDbStorage,
) => {
  const [applications, setApplications] = useState<IGeneratedApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCurrentRequest = true;

    const loadApplications = async () => {
      try {
        const savedApplications = await storage.getAll();

        if (isCurrentRequest) {
          setApplications(savedApplications);
          setIsLoading(false);
        }
      } catch {
        if (isCurrentRequest) {
          setApplications([]);
          setIsLoading(false);
        }
      }
    };

    loadApplications();

    const unsubscribe = applicationsIndexedDbPublisherSubscriber.subscribe(() => {
      loadApplications();
    });

    return () => {
      isCurrentRequest = false;
      unsubscribe();
    };
  }, [storage]);

  return {
    applications,
    isLoading,
  };
};
