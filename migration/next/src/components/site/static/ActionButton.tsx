import Link from '@/components/site/PublicLink';
import type { ReactNode } from 'react';

type Props = {
  to?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  compact?: boolean;
  onDark?: boolean;
  className?: string;
  children: ReactNode;
};

export function ActionButton({
  to,
  type = 'button',
  disabled = false,
  compact = false,
  onDark = false,
  className = '',
  children,
}: Props) {
  const classes = [
    'kemz-action',
    compact ? 'kemz-action--compact' : '',
    onDark ? 'kemz-action--on-dark' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (to) {
    return (
      <Link href={to} className={classes}>
        <span>{children}</span>
        <span aria-hidden="true">→</span>
      </Link>
    );
  }

  return (
    <button type={type} className={classes} disabled={disabled}>
      <span>{children}</span>
      <span aria-hidden="true">→</span>
    </button>
  );
}
