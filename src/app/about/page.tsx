import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function AboutPage() {
  return (
    <div>
      <Navbar />
      <main className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-4">About Us</h1>
        <p className="mb-4">Welcome to RevoShop! We are committed to providing the best online shopping experience in Indonesia. Our platform offers a wide range of products, competitive prices, and excellent customer service.</p>
        <p className="mb-4">Our mission is to make shopping easy, enjoyable, and accessible for everyone. Thank you for choosing us as your trusted online shop!</p>
        <p className="text-gray-500">Contact us: support@revoshop.com</p>
      </main>
      <Footer />
    </div>
  );
}