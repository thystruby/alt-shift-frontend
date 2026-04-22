import { ApplicationsProgress } from './index';
import type { Meta, StoryObj } from '@storybook/react-vite';


const meta = {
  title: 'Shared/Modules/Header/ApplicationsProgress',
  component: ApplicationsProgress,
  decorators: [
    Story => (
      <div className='inline-flex bg-white p-2xl'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ApplicationsProgress>;

export default meta;

type TStory = StoryObj<typeof meta>;

export const Default: TStory = {};
