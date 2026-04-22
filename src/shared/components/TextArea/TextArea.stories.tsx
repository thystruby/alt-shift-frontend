import { TextArea } from './index';
import type { Meta, StoryObj } from '@storybook/react-vite';


const meta = {
  title: 'Shared/Components/TextArea',
  component: TextArea,
  args: {
    label: 'Additional details',
    placeholder: 'Mention product analytics, React, and remote collaboration.',
    rows: 5,
  },
  decorators: [
    Story => (
      <div className='max-w-[520px]'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TextArea>;

export default meta;

type TStory = StoryObj<typeof meta>;

export const Default: TStory = {};

export const WithError: TStory = {
  args: {
    error: 'Add at least one useful detail',
  },
};
