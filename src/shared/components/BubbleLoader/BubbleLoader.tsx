import cn from 'classnames';

import { styles } from './styles';

interface IBubbleLoaderProps {
  modifiers?: string;
  label?: string;
}

export const BubbleLoader = ({ modifiers, label = 'Loading' }: IBubbleLoaderProps) => (
  <div
    aria-label={label}
    className={cn(styles.container, modifiers)}
    role='status'
  >
    <span aria-hidden='true' className={styles.scene}>
      <span className={styles.glow} />
      <span className={styles.bubble} />
    </span>
  </div>
);
