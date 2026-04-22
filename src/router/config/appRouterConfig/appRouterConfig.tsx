import { Suspense, lazy } from 'react';
import { ApplicationsPage } from '@/pages/ApplicationsPage';
import { appRoutes } from '@/router/constants/appRoutes';
import { BubbleLoader } from '@/shared/components/BubbleLoader';

const CreateApplicationPage = lazy(() =>
  import('@/pages/CreateApplicationPage').then(module => ({
    default: module.CreateApplicationPage,
  })),
);

export const appRouterConfig = [
  {
    path: appRoutes.applications.list,
    element: <ApplicationsPage />,
  },
  {
    path: appRoutes.applications.create,
    element: (
      <Suspense fallback={<BubbleLoader modifiers='w-screen h-screen' />}>
        <CreateApplicationPage />
      </Suspense>
    ),
  },
  {
    path: appRoutes.applications.details,
    element: (
      <Suspense fallback={<BubbleLoader modifiers='w-screen h-screen' />}>
        <CreateApplicationPage />
      </Suspense>
    ),
  },
];
