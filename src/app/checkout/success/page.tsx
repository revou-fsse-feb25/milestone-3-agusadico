'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function CheckoutSuccessPage() {
  const { data: session } = useSession();
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (!session) {
      router.push('/login');
    }
  }, [session, router]);

  if (!session) {
    return <div className="text-center py-10">Redirecting to login...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="bg-green-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Order Placed Successfully!</h2>
        
        <p className="mt-2 text-center text-md text-gray-600">
          Thank you for your purchase, {session.user?.name}. Your order has been received and is being processed.
        </p>
        
        <div className="mt-6">
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm text-gray-500">A confirmation email has been sent to {session.user?.email}</p>
          </div>
        </div>
        
        <div className="mt-6">
          <Link href="/" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-black bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}