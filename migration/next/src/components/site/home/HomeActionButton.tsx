import Link from 'next/link';
import type { ReactNode } from 'react';

type HomeActionButtonProps = {
  children: ReactNode;
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  compact?: boolean;
  onDark?: boolean;
};

export function HomeActionButton({
  children,
  href,
  type = 'button',
  disabled = false,
  compact = false,
  onDark = false,
}: HomeActionButtonProps) {
  const className = [
    'kemz-action',
    compact ? 'kemz-action--compact' : '',
    onDark ? 'kemz-action--on-dark' : '',
  ]
    .filter(Boolean)
    .join(' ');

  if (href) {
    return (
      <Link href={href} className={className}>
        <span>{children}</span>
        <span aria-hidden="true">→</span>
      </Link>
    );
  }

  return (
    <button type={type} className={className} disabled={disabled}>
      <span>{children}</span>
      <span aria-hidden="true">→</span>
    </button>
  );
}
