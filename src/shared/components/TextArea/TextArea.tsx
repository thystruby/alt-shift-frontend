import { forwardRef, memo } from 'react';
import cn from 'classnames';

import { styles } from './styles';
import type { TextareaHTMLAttributes } from 'react';

interface IProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string | boolean;
  modifiers?: string;
}

const TextAreaComponent = forwardRef<HTMLTextAreaElement, IProps>(({
  error, label, modifiers, ...props
}, ref) => {
  const shouldShowErrorMessage = typeof error === 'string';

  return (
    <label className='flex w-full flex-col gap-s'>
      <span className='text-xs font-medium leading-[20px] text-neutral-400'>
        {label}
      </span>
      <textarea
        ref={ref}
        aria-invalid={Boolean(error)}
        className={cn(
          styles.input,
          {
            [styles.invalid]: Boolean(error),
          },
          modifiers,
        )}
        {...props}
      />
      {error && shouldShowErrorMessage && (
        <span className='text-sm leading-5 text-red-600' role='alert'>
          {error}
        </span>
      )}
    </label>
  );
});

TextAreaComponent.displayName = 'TextArea';

export const TextArea = memo(TextAreaComponent);
