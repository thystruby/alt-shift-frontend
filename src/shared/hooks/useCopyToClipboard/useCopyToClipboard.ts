import { useCallback, useEffect, useRef, useState } from 'react';

const COPY_STATE_RESET_TIMEOUT = 3000;

export const useCopyToClipboard = () => {
  const [isCopied, setIsCopied] = useState(false);
  const resetTimerRef = useRef<number>();

  const clearResetTimer = useCallback(() => {
    if (!resetTimerRef.current) return;

    window.clearTimeout(resetTimerRef.current);
    resetTimerRef.current = undefined;
  }, []);

  const copyToClipboard = useCallback(async (text: string) => {
    if (!navigator.clipboard?.writeText) return false;

    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      clearResetTimer();
      resetTimerRef.current = window.setTimeout(() => {
        setIsCopied(false);
        resetTimerRef.current = undefined;
      }, COPY_STATE_RESET_TIMEOUT);

      return true;
    } catch {
      return false;
    }
  }, [clearResetTimer]);

  useEffect(() => clearResetTimer, [clearResetTimer]);

  return { copyToClipboard, isCopied };
};
