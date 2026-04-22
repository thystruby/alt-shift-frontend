import { memo } from 'react';
import { CopyIcon } from '@/assets/icons';
import { useCopyToClipboard } from '@/shared/hooks/useCopyToClipboard';
import { Button, EButtonSize, EButtonVariant } from '../Button';
import type { MouseEventHandler } from 'react';

interface IProps {
  text: string;
  modifiers?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export const CopyToClipboardButton = memo(({
  text, modifiers, onClick,
}: IProps) => {
  const { copyToClipboard, isCopied } = useCopyToClipboard();

  return (
    <Button
      variant={EButtonVariant.Text}
      size={EButtonSize.Text}
      onClick={event => {
        onClick?.(event);
        copyToClipboard(text);
      }}
      modifiers={modifiers}
    >
      {isCopied ? 'Copied' : 'Copy to clipboard'}
      <CopyIcon />
    </Button>
  );
});

CopyToClipboardButton.displayName = 'CopyToClipboardButton';
