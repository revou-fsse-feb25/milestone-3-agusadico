import '../globals.css';
import { fetchProductById } from '../../services/shopServices';
import { fetchRelatedProducts } from '../../services/shopServices';
import { Product } from '../../types/type';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Image from 'next/image';
import QuantitySelector from "../../components/QuantitySelector";
import AddToCartButton from '../../components/AddToCartButton';
import Link from 'next/link';
import ShopCard from '../../components/ShopCard';
import ProductPriceQuantityClient from '../../components/ProductPriceQuantityClient';


async function ProductPage({ params, searchParams }: any) {
  const { id } = params;
  
  try {
    const product: Product = await fetchProductById(id);
    if (!product) return <div>Product not found</div>;
    
    const relatedProducts: Product[] = await fetchRelatedProducts(id);
    
    return (
      <div>
        <Navbar />
        <main className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 py-12 px-4">
        
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center">
            <div className="relative w-full flex justify-center">
              <img src={product.images?.[0] || '/images/placeholder.png'} alt={product.title} className="w-72 h-72 object-contain rounded-xl border" />
              <button className="absolute top-2 right-2 bg-white rounded-full p-2 shadow text-gray-400 hover:text-green-600 transition" title="Expand"><svg width="20" height="20" fill="none" stroke="currentColor"><circle cx="10" cy="10" r="9" strokeWidth="2"/><path d="M7 10h6M10 7v6" strokeWidth="2"/></svg></button>
            </div>
          </div>
        
          <div className="col-span-2 flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
              <p className="text-gray-600 mb-4">{product?.description || 'No description available'}</p>
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div><span className="font-bold">SKU: </span>{product.id}</div>
                <div><span className="font-bold">Category: </span> {product.category?.name}</div>
                <div><span className="font-bold">Tags: </span>{product.slug}</div>
                <div><span className="font-bold">Updated: </span>{product.updatedAt}</div>
              </div>
              <div className="flex items-center gap-4 text-sm text-yellow-600 mb-4">
                <div className="flex items-center gap-2"><span className="fa-solid fa-truck-fast"></span> Free worldwide shipping on all orders over $100</div>
                <div className="flex items-center gap-2"><span className="fa-solid fa-award"></span> Guaranteed 100% Product from official shop</div>
                <div className="flex items-center gap-2"><span className="fa-solid fa-rotate-left"></span> 1 Day Returns if you change your mind</div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <span>Share:</span>
                <a href="#"><span className="fa-brands fa-facebook"></span></a>
                <a href="#"><span className="fa-brands fa-instagram"></span></a>
                <a href="#"><span className="fa-brands fa-tiktok"></span></a>
                <a href="#"><span className="fa-brands fa-linkedin"></span></a>
              </div>
            </div>
           
            <div className="w-full md:w-80 bg-white border rounded-xl shadow p-6 flex flex-col gap-4 justify-center">
              <ProductPriceQuantityClient product={product} />
              <div className="flex items-center gap-2 mb-2">

              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex flex-col items-center">
                <span className="text-black font-semibold mb-2">Guaranteed Safe Checkout</span>
                <div className="flex gap-2">
                    <span className="fa-brands fa-paypal"></span>
                    <span className="fa-brands fa-cc-visa"></span>
                    <span className="fa-brands fa-cc-mastercard"></span>
                </div>
              </div>
            </div>
          </div>
        </main>

        <section className="max-w-7xl mx-auto px-4 pb-12">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">Related Products <span className="border-b-2 border-gray-200 flex-1"></span></h2>
          <div className="overflow-x-auto">
            <div className="flex gap-4">
              {relatedProducts.length > 0 ? (
                relatedProducts.slice(0, 10).map((item) => (
                  <div key={item.id} className="min-w-[220px] max-w-[240px]">
                    <ShopCard product={item} />
                  </div>
                ))
              ) : (
                <div className="text-gray-500">No related products found.</div>
              )}
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  } catch (error) {

    console.error('Error fetching product:', error);
    return (
      <div>
        <Navbar />
        <main className="max-w-7xl mx-auto py-12 px-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Product Not Found</h1>
            <p className="text-gray-700 mb-6">Sorry, we couldn't find the product you're looking for. It may have been removed or doesn't exist.</p>
            <Link href="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition">
              Return to Home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
}

export default ProductPage;

