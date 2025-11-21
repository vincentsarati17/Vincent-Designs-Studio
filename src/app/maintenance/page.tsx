
import { Wrench } from 'lucide-react';

export default function MaintenancePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-4">
        <Wrench className="h-16 w-16 text-primary mb-4" />
        <h1 className="font-headline text-4xl font-bold">Under Maintenance</h1>
        <p className="mt-4 text-lg text-muted-foreground">
            Our site is currently undergoing scheduled maintenance. We'll be back shortly.
        </p>
        <p className="text-muted-foreground">
            Thank you for your patience!
        </p>
    </div>
  );
}
