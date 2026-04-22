import { forwardRef, memo } from 'react';
import cn from 'classnames';

import { styles } from './styles';
import type { InputHTMLAttributes } from 'react';

interface IProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  modifiers?: string;
}

const InputComponent = forwardRef<HTMLInputElement, IProps>(({
  error, label, modifiers, ...props
}, ref) => (
  <label className='flex w-full flex-col gap-s'>
    <span className='text-xs font-medium leading-[20px] text-neutral-400'>
      {label}
    </span>
    <input
      ref={ref}
      aria-invalid={Boolean(error)}
      className={cn(
        styles.input,
        {
          [styles.invalid]: Boolean(error),
        },
        modifiers,
      )}
      type='text'
      {...props}
    />
    {error && (
      <span className='text-sm leading-5 text-red-600' role='alert'>
        {error}
      </span>
    )}
  </label>
));

InputComponent.displayName = 'Input';

export const Input = memo(InputComponent);
