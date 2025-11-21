
'use client';

import dynamic from 'next/dynamic';

// Dynamically import the AdminLoginPage with SSR turned off to prevent hydration errors.
const AdminLoginPage = dynamic(() => import('./AdminLoginPage'), { ssr: false });

export default function LoginPage() {
  return (
    <div 
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/image/background-img-admin.jpg')" }}
    >
      <AdminLoginPage />
    </div>
  );
}
