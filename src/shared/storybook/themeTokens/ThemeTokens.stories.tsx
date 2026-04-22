
import globalCss from '@/styles/global.css?raw';
import { StorySection } from '@/shared/storybook/components/StorySection';
import { getThemeTokens } from '@/shared/storybook/themeTokens';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties } from 'react';

type TColorTokenStyle = CSSProperties & {
  '--story-color-token': string;
};

type TTextTokenStyle = CSSProperties & {
  '--story-text-token': string;
};

const colorTokens = getThemeTokens(globalCss, '--color-');
const textTokens = getThemeTokens(globalCss, '--text-');

const meta = {
  title: 'Design Tokens/Theme',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;

type TStory = StoryObj<typeof meta>;

export const Colors: TStory = {
  render: () => (
    <main className='min-h-screen bg-neutral-700 p-2xl text-neutral-300'>
      <StorySection
        description='Color tokens are parsed from src/styles/global.css @theme --color-* variables.'
        title='Colors'
      >
        <div className='grid gap-xl sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {colorTokens.map(token => {
            const tokenStyle: TColorTokenStyle = {
              '--story-color-token': token.value,
            };

            return (
              <article
                className='overflow-hidden rounded-sm border border-neutral-200 bg-white'
                key={token.name}
              >
                <div
                  className='h-[112px] bg-[var(--story-color-token)]'
                  style={tokenStyle}
                />
                <div className='flex flex-col gap-xs p-xl'>
                  <h3 className='text-xs font-semibold leading-5 text-neutral-300'>
                    {token.name}
                  </h3>
                  <p className='text-xs leading-5 text-neutral-100'>
                    {token.value}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </StorySection>
    </main>
  ),
};

export const Typography: TStory = {
  render: () => (
    <main className='min-h-screen bg-neutral-700 p-2xl text-neutral-300'>
      <StorySection
        description='Text tokens are parsed from src/styles/global.css @theme --text-* variables.'
        title='Typography'
      >
        <div className='grid gap-xl'>
          {textTokens.map(token => {
            const tokenStyle: TTextTokenStyle = {
              '--story-text-token': token.value,
            };

            return (
              <article
                className='grid gap-xl rounded-sm border border-neutral-200 bg-white p-xl md:grid-cols-[160px_1fr]'
                key={token.name}
              >
                <div className='flex flex-col gap-xs'>
                  <h3 className='text-xs font-semibold leading-5 text-neutral-300'>
                    {token.name}
                  </h3>
                  <p className='text-xs leading-5 text-neutral-100'>
                    {token.value}
                  </p>
                </div>
                <p
                  className='font-display leading-tight text-neutral-300'
                  style={tokenStyle}
                >
                  <span className='text-[length:var(--story-text-token)]'>
                    The quick cover letter preview
                  </span>
                </p>
              </article>
            );
          })}
        </div>
      </StorySection>
    </main>
  ),
};
