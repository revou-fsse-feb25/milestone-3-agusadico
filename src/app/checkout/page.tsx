'use client';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import CheckoutClient from '@/components/CheckoutClient';

export default function CheckoutPage() {
  // Move the function inside the component
  const handleSomething = () => {
    if (typeof window !== 'undefined') {
      // Now it's safe to use location
      window.location.href = '/some-path';
    }
  };
  
  return (
    <div className="bg-white min-h-screen font-sans">
      <Navbar />
      <div className="max-w-7xl mx-auto py-10 px-4">
        <CheckoutClient />
      </div>
      <Footer />
    </div>
  );
}