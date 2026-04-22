import { memo } from 'react';
import { Link } from 'react-router-dom';
import { appRoutes } from '@/router/constants/appRoutes';
import { LogoIcon, HomeIcon } from '@/assets/icons';
import { ApplicationsProgress } from './components/ApplicationsProgress';

export const Header = memo(() => (
  <header className='flex w-full flex-col items-start justify-between gap-xl lg:flex-row lg:items-center'>
    <Link to={appRoutes.applications.list} className='flex shrink-0 items-center gap-6'>
      <LogoIcon />
    </Link>
    <div className='flex shrink-0 items-center justify-end gap-2xl'>
      <ApplicationsProgress />
      <Link
        className='hidden size-[40px] shrink-0 items-center justify-center rounded-sm border border-neutral-500 bg-white hover:text-neutral-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-300 sm:inline-flex'
        to={appRoutes.applications.list}
      >
        <HomeIcon />
      </Link>
    </div>
  </header>
));

Header.displayName = 'Header';
