import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import CartClient from '../../components/CartClient';
import Link from 'next/link';

export default function CartPage() {
    return (
        <div className="bg-white min-h-screen font-sans">
            <Navbar />
            <div className="max-w-7xl mx-auto py-10 px-4">
                {/* <div className="mb-4 text-sm text-gray-500">
                    <Link href="/">Home</Link> &gt; <span className="text-green-700 font-semibold">Cart</span>
                </div> */}
                <CartClient />
            </div>
            <Footer />
        </div>
    );
}