import cn from 'classnames';

import { styles } from './styles';

interface IProps {
  modifiers?: string;
  label?: string;
}

export const BubbleLoader = ({ modifiers, label = 'Loading' }: IProps) => (
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
