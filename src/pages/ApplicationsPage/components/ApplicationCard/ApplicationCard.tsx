import { Link } from 'react-router-dom';
import { appRoutes } from '@/router/constants/appRoutes';
import { CopyToClipboardButton } from '@/shared/components/CopyToClipboardButton';
import { Button, EButtonSize, EButtonVariant } from '@/shared/components/Button';
import { TrashIcon } from '@/assets/icons';
import { applicationsIndexedDbStorage } from '@/shared/services/ApplicationsIndexedDbStorage';
import type { MouseEventHandler } from 'react';
import type { IGeneratedApplication } from '@/shared/types';

interface IApplicationCardProps {
  application: IGeneratedApplication;
}

export const ApplicationCard = ({ application }: IApplicationCardProps) => {
  const stopCardNavigation: MouseEventHandler<HTMLButtonElement> = event => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDelete: MouseEventHandler<HTMLButtonElement> = async event => {
    stopCardNavigation(event);

    try {
      if (!window.confirm('Delete this application?')) {
        return;
      }

      await applicationsIndexedDbStorage.deleteById(application.id);
    } catch {
      alert('Something went wront');
    }
  };

  return (
    <Link
      className='relative flex h-[240px] min-h-[240px] w-full flex-col justify-between overflow-hidden rounded-xl bg-neutral-900 p-2xl transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-300'
      to={appRoutes.applications.getDetailsPath(application.id)}
    >
      <div className='min-h-0 flex-1 overflow-hidden'>
        <p className='line-clamp-[7] whitespace-pre-line text-m leading-[28px] text-neutral-100'>
          {application.generatedResult}
        </p>
      </div>
      <div
        aria-hidden='true'
        className='pointer-events-none absolute inset-x-6 top-36 h-10 bg-gradient-to-b from-neutral-900/0 to-neutral-900'
      />
      <div className='relative flex w-full items-center justify-between gap-6 pt-m'>
        <Button
          variant={EButtonVariant.Text}
          size={EButtonSize.Text}
          onClick={handleDelete}
        >
          Delete
          <TrashIcon />
        </Button>
        <CopyToClipboardButton
          modifiers='p-0'
          onClick={stopCardNavigation}
          text={application.generatedResult}
        />
      </div>
    </Link>
  );
};
