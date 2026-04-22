import { BubbleLoader } from './index';
import type { Meta, StoryObj } from '@storybook/react-vite';


const meta = {
  title: 'Shared/Components/BubbleLoader',
  component: BubbleLoader,
  args: {
    label: 'Loading generated application',
  },
} satisfies Meta<typeof BubbleLoader>;

export default meta;

type TStory = StoryObj<typeof meta>;

export const Default: TStory = {};
