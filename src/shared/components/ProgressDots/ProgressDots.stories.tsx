import { ProgressDots } from './index';
import type { Meta, StoryObj } from '@storybook/react-vite';


const meta = {
  title: 'Shared/Components/ProgressDots',
  component: ProgressDots,
  decorators: [
    Story => (
      <div className='inline-flex items-center gap-1 bg-white p-2xl'>
        <Story />
      </div>
    ),
  ],
  args: {
    completedCount: 2,
    totalCount: 5,
  },
} satisfies Meta<typeof ProgressDots>;

export default meta;

type TStory = StoryObj<typeof meta>;

export const Default: TStory = {};

export const Wide: TStory = {
  decorators: [
    Story => (
      <div className='inline-flex items-center gap-2 bg-white p-2xl'>
        <Story />
      </div>
    ),
  ],
  args: {
    completedClassName: 'h-2 w-8 rounded bg-neutral-300',
    incompletedClassName: 'h-2 w-8 rounded bg-neutral-300/24',
  },
};
