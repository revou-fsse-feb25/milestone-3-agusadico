import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import CheckoutClient from '@/components/CheckoutClient';

export default function CheckoutPage() {
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