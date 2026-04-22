import { BubbleLoader } from '@/shared/components/BubbleLoader';
import { CopyToClipboardButton } from '@/shared/components/CopyToClipboardButton';
import { styles } from './styles';

interface IProps {
  generatedResult?: string | null;
  isLoading?: boolean;
}

export const CreateApplicationResult = ({ generatedResult, isLoading }: IProps) => {
  if (isLoading) {
    return (
      <section className={styles.container}>
        <BubbleLoader modifiers='m-auto' />
      </section>
    );
  }

  if (!generatedResult) {
    return (
      <section className={styles.container}>
        <p className={styles.text}>Your personalized job application will appear here...</p>
      </section>
    );
  }

  return (
    <section className={styles.container}>
      <pre className={styles.text}>{generatedResult}</pre>
      <CopyToClipboardButton text={generatedResult} modifiers='mt-auto ml-auto' />
    </section>
  );
};
