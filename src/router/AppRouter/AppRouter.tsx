import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { appRouterConfig } from '@/router/config/appRouterConfig';

const router = createBrowserRouter(appRouterConfig);

export const AppRouter = () => <RouterProvider router={router} />;
