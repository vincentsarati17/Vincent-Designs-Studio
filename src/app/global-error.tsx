'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // In a real application, you would initialize an error monitoring service here.
    // For example, using Sentry:
    //
    // import * as Sentry from "@sentry/nextjs";
    // Sentry.captureException(error);
    //
    // Make sure to install the necessary packages and configure them
    // with your DSN in your environment variables.
    console.error(error);
  }, [error]);

  const handleReset = () => {
    try {
      // The `reset` function is not guaranteed to work for all errors,
      // especially server-side ones. A hard reload is a more reliable fallback.
      window.location.reload();
    } catch (e) {
      // If window is not defined (e.g., in a weird edge case),
      // we can try to call the original reset.
      reset();
    }
  };

  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-4">
            <h1 className="font-headline text-4xl font-bold">Something went wrong!</h1>
            <p className="mt-4 text-lg text-muted-foreground">
                We're sorry, but an unexpected error occurred. Please try again.
            </p>
            <Button onClick={handleReset} className="mt-8">
                Try again
            </Button>
        </div>
      </body>
    </html>
  );
}
