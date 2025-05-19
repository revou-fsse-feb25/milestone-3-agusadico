import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function FaqPage() {
  return (
    <div>
      <Navbar />
      <main className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-4">Frequently Asked Questions (FAQ)</h1>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">What is RevoShop?</h2>
          <p>RevoShop is Indonesia's leading online shop, offering a wide range of products and a seamless shopping experience.</p>
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">How do I place an order?</h2>
          <p>Simply browse our products, add items to your cart, and proceed to checkout. Follow the instructions to complete your purchase.</p>
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">What payment methods are accepted?</h2>
          <p>We accept various payment methods including credit cards, PayPal, and bank transfers.</p>
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">How can I contact customer support?</h2>
          <p>You can reach us at support@revoshop.com or via our contact page for any assistance.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}