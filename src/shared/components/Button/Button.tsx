import { forwardRef, memo } from 'react';
import cn from 'classnames';
import { LoadingIcon } from '@/assets/icons';
import { EButtonSize, EButtonVariant } from './types';
import { styles } from './styles';
import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  modifiers?: string;
  size?: EButtonSize;
  variant?: EButtonVariant;
}

type TProps = PropsWithChildren<IProps>;

const ButtonComponent = forwardRef<HTMLButtonElement, TProps>(({
  type = 'button',
  children,
  disabled,
  isLoading,
  modifiers,
  size = EButtonSize.Default,
  variant = EButtonVariant.Primary,
  ...props
}, ref) => (
  <button
    ref={ref}
    aria-busy={isLoading}
    className={cn(
      styles.base,
      styles.sizes[size],
      styles.variants[variant],
      { [styles.loading]: isLoading },
      modifiers,
    )}
    disabled={disabled || isLoading}
    type={type}
    {...props}
  >
    {isLoading ? (
      <>
        <LoadingIcon className='size-2xl animate-spin' />
        <span className='sr-only'>{children}</span>
      </>
    ) : children}
  </button>
));

ButtonComponent.displayName = 'Button';

export const Button = memo(ButtonComponent);
