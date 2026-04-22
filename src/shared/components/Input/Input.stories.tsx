import { Input } from './index';
import type { Meta, StoryObj } from '@storybook/react-vite';


const meta = {
  title: 'Shared/Components/Input',
  component: Input,
  args: {
    label: 'Company',
    placeholder: 'Acme Inc.',
  },
  decorators: [
    Story => (
      <div className='max-w-[420px]'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;

type TStory = StoryObj<typeof meta>;

export const Default: TStory = {};

export const WithError: TStory = {
  args: {
    error: 'Company is required',
  },
};
