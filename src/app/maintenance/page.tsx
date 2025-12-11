
export default function MaintenancePage() {
  const MaintenanceIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
        <path fill="#d98b1a" fillRule="evenodd" d="M13.29 4.008a2 2 0 0 0-3.473 0L1.264 18.977A2 2 0 0 0 3 21.969h17.107a2 2 0 0 0 1.737-2.992zm-2.377 7.597l-.769 1.539l-1.538.77l-1.539-1.54c-.2.89.048 2.13.77 3.078c.983.756 2.193 1.011 3.076.769l3.51 3.331q.997.882 1.996-.117q1.06-1.06 0-2.121q-3.243-3.183-3.198-3.4c.242-.884-.013-2.094-.77-3.078c-.948-.721-2.188-.97-3.076-.769z" clipRule="evenodd"/>
    </svg>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-4">
        <MaintenanceIcon className="h-16 w-16 mb-4" />
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
