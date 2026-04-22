import cn from 'classnames';

export const styles = {
  container: cn(
    'flex size-[320px] max-w-full items-center justify-center overflow-hidden',
    'bg-neutral-900',
  ),
  scene: 'relative size-[160px] animate-[bubble-loader_1600ms_ease-in-out_infinite]',
  glow: 'absolute inset-0 rounded-full bg-neutral-0 blur-[40px]',
  bubble: cn(
    'absolute inset-[40px] rounded-full',
    'bg-[radial-gradient(circle_at_74%_22%,#fff_0%,rgb(255_255_255_/_0.16)_100%),radial-gradient(circle_at_0%_0%,#fff_0%,#d0d5dd_100%)]',
    'shadow-[inset_0_-2px_32px_rgb(16_24_40_/_0.08)]',
  ),
};
