import Link from 'next/link';
import { FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-4 rounded-full bg-muted p-4">
        <FileQuestion className="h-8 w-8 text-muted-foreground" aria-hidden />
      </div>
      <h1 className="mb-2 text-lg font-semibold text-foreground">Page not found</h1>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground">
        The page you are looking for does not exist or may have been moved.
      </p>
      <Button asChild>
        <Link href="/">Return home</Link>
      </Button>
    </div>
  );
}
