import * as Icons from '@/assets/icons';
import { StorySection } from '@/shared/storybook/components/StorySection';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentType, SVGProps } from 'react';

type TIconComponent = ComponentType<SVGProps<SVGSVGElement>>;

const iconEntries = Object.entries(Icons) as [string, TIconComponent][];

const meta = {
  title: 'Design Tokens/Icons',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;

type TStory = StoryObj<typeof meta>;

export const AllIcons: TStory = {
  render: () => (
    <main className='min-h-screen bg-neutral-700 p-2xl text-neutral-300'>
      <StorySection
        description='Icons are imported from src/assets/icons/index.ts and rendered on a neutral gray background.'
        title='Icons'
      >
        <div className='grid gap-xl sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {iconEntries.map(([name, IconComponent]) => {
            const iconClassName = name === 'LogoIcon'
              ? 'h-auto w-[180px]'
              : 'size-8';

            return (
              <article
                className='overflow-hidden rounded-sm border border-neutral-600 bg-neutral-600'
                key={name}
              >
                <div className='flex h-[128px] items-center justify-center bg-neutral-500 p-xl'>
                  <IconComponent className={iconClassName} />
                </div>
                <div className='p-xl'>
                  <h3 className='text-xs font-semibold leading-5 text-neutral-300'>
                    {name}
                  </h3>
                </div>
              </article>
            );
          })}
        </div>
      </StorySection>
    </main>
  ),
};
