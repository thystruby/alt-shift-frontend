import { MemoryRouter } from 'react-router-dom';
import { Header } from './index';
import type { Meta, StoryObj } from '@storybook/react-vite';


const meta = {
  title: 'Shared/Modules/Header',
  component: Header,
  decorators: [
    Story => (
      <MemoryRouter>
        <div className='w-full max-w-[1120px] bg-white p-2xl'>
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof Header>;

export default meta;

type TStory = StoryObj<typeof meta>;

export const Default: TStory = {};
