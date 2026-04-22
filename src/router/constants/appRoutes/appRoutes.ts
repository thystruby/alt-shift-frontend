import { generatePath } from 'react-router-dom';

const applicationsCreatePath = '/applications/create';
const applicationDetailsPath = `${applicationsCreatePath}/:id`;

export const appRoutes = {
  applications: {
    create: applicationsCreatePath,
    details: applicationDetailsPath,
    getDetailsPath: (id: string) => generatePath(applicationDetailsPath, { id }),
    list: '/',
  },
} as const;
