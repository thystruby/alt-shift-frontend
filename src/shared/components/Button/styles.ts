import cn from 'classnames';

import { EButtonSize, EButtonVariant } from './types';

export const styles = {
  base: cn(
    'inline-flex shrink-0 items-center justify-center overflow-hidden',
    'rounded-sm font-semibold shadow-button transition-colors',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
    'focus-visible:outline-green-300',
    'disabled:cursor-not-allowed cursor-pointer',
  ),
  loading: 'px-xl py-xl',
  sizes: {
    [EButtonSize.Default]: 'gap-l p-xl text-m leading-[28px]',
    [EButtonSize.Small]: 'gap-m px-1xl py-m text-s leading-[24px] min-h-[44px]',
    [EButtonSize.Text]: 'gap-m p-0 text-s leading-[24px]',
  },
  variants: {
    [EButtonVariant.Primary]: cn(
      'bg-green-300 text-neutral-0',
      'hover:border-green-400 hover:bg-green-400',
      'disabled:border-neutral-500 disabled:bg-neutral-500 disabled:text-neutral-600',
    ),
    [EButtonVariant.Outline]: cn(
      'border border-neutral-500 bg-white text-neutral-400',
      'hover:bg-neutral-700',
      'disabled:border-neutral-200 disabled:text-neutral-100',
    ),
    [EButtonVariant.Text]: cn(
      'gap-m text-s leading-[24px] border border-transparent bg-transparent text-s leading-[24px]',
      'text-neutral-800 shadow-none hover:opacity-50',
      'disabled:text-neutral-100 transition-opacity duration-200',
    ),
  },
};
