import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'quiet' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** icon element rendered before the label */
  icon?: ReactNode;
  /** icon element rendered after the label */
  iconAfter?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'secondary', size = 'md', icon, iconAfter, className, children, type = 'button', ...rest },
  ref,
) {
  return (
    <button ref={ref} type={type} className={cx(styles.button, styles[variant], styles[size], className)} {...rest}>
      {icon && <span className={styles.icon}>{icon}</span>}
      {children != null && <span className={styles.label}>{children}</span>}
      {iconAfter && <span className={styles.icon}>{iconAfter}</span>}
    </button>
  );
});

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** required accessible name */
  label: string;
  icon: ReactNode;
  variant?: 'ghost' | 'secondary' | 'primary';
  size?: ButtonSize;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, icon, variant = 'ghost', size = 'md', className, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      title={label}
      className={cx(styles.button, styles.iconOnly, styles[variant], styles[size], className)}
      {...rest}
    >
      <span className={styles.icon}>{icon}</span>
    </button>
  );
});
