import { Button, EButtonSize, EButtonVariant } from './index';
import type { Meta, StoryObj } from '@storybook/react-vite';


const meta = {
  title: 'Shared/Components/Button',
  component: Button,
  args: {
    children: 'Create New',
  },
  argTypes: {
    size: {
      control: 'select',
      options: Object.values(EButtonSize),
    },
    variant: {
      control: 'select',
      options: Object.values(EButtonVariant),
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

type TStory = StoryObj<typeof meta>;

export const Primary: TStory = {
  args: {
    variant: EButtonVariant.Primary,
  },
};

export const Outline: TStory = {
  args: {
    variant: EButtonVariant.Outline,
  },
};

export const Text: TStory = {
  args: {
    size: EButtonSize.Text,
    variant: EButtonVariant.Text,
  },
};

export const Loading: TStory = {
  args: {
    isLoading: true,
  },
};
