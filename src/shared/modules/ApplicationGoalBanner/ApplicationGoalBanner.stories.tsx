import { MemoryRouter } from 'react-router-dom';
import { ApplicationGoalBanner } from './index';
import type { Meta, StoryObj } from '@storybook/react-vite';


const meta = {
  title: 'Shared/Modules/ApplicationGoalBanner',
  component: ApplicationGoalBanner,
  decorators: [
    Story => (
      <MemoryRouter>
        <div className='w-full max-w-[920px] bg-white p-2xl'>
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof ApplicationGoalBanner>;

export default meta;

type TStory = StoryObj<typeof meta>;

export const Default: TStory = {};
