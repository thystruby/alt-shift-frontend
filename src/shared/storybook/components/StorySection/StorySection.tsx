import type { PropsWithChildren } from 'react';

interface IStorySectionProps {
  description?: string;
  title: string;
}

export const StorySection = ({
  children,
  description,
  title,
}: PropsWithChildren<IStorySectionProps>) => (
  <section className='flex w-full flex-col gap-2xl rounded-sm border border-neutral-200 bg-white p-2xl'>
    <div className='flex max-w-[680px] flex-col gap-s'>
      <h2 className='font-display text-m font-semibold leading-7 text-neutral-300'>
        {title}
      </h2>
      {description && (
        <p className='text-xs leading-5 text-neutral-100'>{description}</p>
      )}
    </div>
    {children}
  </section>
);
