import { CopyToClipboardButton } from './index';
import type { Meta, StoryObj } from '@storybook/react-vite';


const meta = {
  title: 'Shared/Components/CopyToClipboardButton',
  component: CopyToClipboardButton,
  args: {
    text: 'Frontend developer cover letter draft',
  },
} satisfies Meta<typeof CopyToClipboardButton>;

export default meta;

type TStory = StoryObj<typeof meta>;

export const Default: TStory = {};
