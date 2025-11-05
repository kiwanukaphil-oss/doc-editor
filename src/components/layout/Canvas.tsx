import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface CanvasProps {
  children: ReactNode;
  className?: string;
}

export default function Canvas({ children, className }: CanvasProps) {
  return (
    <main
      className={cn(
        'flex-1 overflow-y-auto bg-gray-100',
        'flex justify-center',
        className
      )}
    >
      <div className="w-full max-w-[1200px] px-8 py-8">
        {/* Document Paper */}
        <div className="bg-white min-h-[calc(100vh-8rem)] rounded-lg shadow-sm p-12">
          {children}
        </div>
      </div>
    </main>
  );
}
