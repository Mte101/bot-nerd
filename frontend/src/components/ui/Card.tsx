import { HTMLAttributes } from 'react';
import { clsx } from 'clsx';

function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx('rounded-xl border border-gray-200 bg-white shadow-sm', className)}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx('flex flex-col p-6 pb-4', className)} {...props} />;
}

function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={clsx('text-lg font-semibold text-gray-900', className)} {...props} />;
}

function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx('p-6 pt-0', className)} {...props} />;
}

function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx('flex items-center p-6 pt-0', className)} {...props} />;
}

export { Card, CardHeader, CardTitle, CardContent, CardFooter };
