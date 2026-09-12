import { HTMLAttributes } from 'react';
import { clsx } from 'clsx';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'success' | 'destructive' | 'warning';
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variant === 'default' && 'bg-blue-100 text-blue-800',
        variant === 'secondary' && 'bg-gray-100 text-gray-800',
        variant === 'success' && 'bg-green-100 text-green-800',
        variant === 'destructive' && 'bg-red-100 text-red-800',
        variant === 'warning' && 'bg-yellow-100 text-yellow-800',
        className
      )}
      {...props}
    />
  );
}

export { Badge };
