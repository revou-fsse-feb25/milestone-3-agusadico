import Image from "next/image";
import ShopRow from '../components/ShopRow';
import { fetchProducts } from '../services/shopServices';
import { Product } from '../types/type';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

//export default async function Home({ searchParams }: { searchParams: { view?: string } }) {
export default async function Home({ searchParams }: any) {
  let products: Product[] = [];
  let error = '';
  try {
    products = await fetchProducts();
  } catch {
    error = 'Failed to load products';
  }

  if (error) return <div>{error}</div>;
  const viewMode = searchParams.view === 'list' ? 'list' : 'card';
  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Navigation Bar */}
      <Navbar />
      {/* Main Content */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 p-4">
        {/* Hero Section */}
        <section
          className="md:col-span-2 bg-white rounded-xl shadow-lg p-8 flex flex-col justify-between min-h-[350px] relative overflow-hidden bg-cover bg-right"
          style={{ backgroundImage: "url('/images/promo-main-gadget.jpg')" }}
        >
          <span className="absolute top-6 left-6 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-bold">100% Original Product</span>
          <h1 className="mt-12 text-4xl font-extrabold text-black leading-tight">Anything You Want<br /><span className="text-yellow-600 font-bold">All Right Here</span></h1>
          <div className="mt-4 text-4xl font-bold text-gray-700">up to 40% off</div>
          <button className="mt-4 bg-yellow-400 text-black px-6 py-2 rounded-full font-semibold hover:bg-yellow-600 w-max">Shop Now</button>
          {/* Example food image */}
          {/* <Image src="/food-hero.jpg" alt="Fresh Organic Food" width={320} height={180} className="absolute right-4 bottom-4 rounded-xl shadow-md" /> */}
        </section>
        {/* Right Side Cards */}
        <div className="flex flex-col gap-6">
          <div
            className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-start bg-cover bg-center relative"
            style={{ backgroundImage: "url('/images/promo-shirt.jpg')" }}
          >
            <span className="text-gray-600 text-xs bg-white bg-opacity-80 px-2 rounded">Premium Shirt</span>
            <span className="text-gray-400 text-xs mb-2 bg-white bg-opacity-80 px-2 rounded">Crafted for Class</span>
            <span className="text-lg font-bold text-red-600 mb-2 bg-white bg-opacity-80 px-2 rounded">up to 70% off</span>
            <button className="bg-yellow-400 text-black px-4 py-1 rounded-full font-semibold hover:bg-orange-400">Shop Now</button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-100 rounded-xl p-4 flex flex-col items-start bg-cover bg-center relative aspect-[4/5]"
            style={{ backgroundImage: "url('/images/promo-sepatu.jpg')" }}>
              <span className="text-red-600 font-semibold mb-2">Shoes Promo</span>
              <span className="text-gray-400 text-xs mb-2 bg-white bg-opacity-80 px-2 rounded">All Shoes Disc. 25%</span>
              <button className="bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-semibold hover:bg-orange-400 mb-6">Shop Now</button>
            </div>
            <div className="bg-yellow-100 rounded-xl p-4 flex flex-col items-start bg-cover bg-center relative aspect-[4/5]"
            style={{ backgroundImage: "url('/images/promo-gadget.jpg')" }}>
              <span className="text-red-600 font-semibold mb-2">Gadget Promo</span>
              <span className="bg-red-400 text-white px-2 py-0.5 rounded-full text-xs font-bold mb-2">15% OFF</span>
              <button className="bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-semibold hover:bg-orange-400 mb-6">Shop Now</button>
            </div>
          </div>
        </div>
      </main>

    {/* Products Section */}
    <section className="mt-12 rounded-xl px-8 py-10 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Featured Products</h2>
      <div className="mb-4 flex gap-2">
        <a href="?view=card" className={`px-4 py-2 rounded ${viewMode === 'card' ? 'bg-yellow-400 text-black' : 'bg-gray-200'}`}>Card View</a>
        <a href="?view=list" className={`px-4 py-2 rounded ${viewMode === 'list' ? 'bg-yellow-400 text-black' : 'bg-gray-200'}`}>List View</a>
      </div>
      <ShopRow products={products} viewMode={viewMode} />
    </section>

      {/* Footer Features Bar */}
      <div className="bg-[#ffde3d] text-black py-6 grid grid-cols-2 md:grid-cols-5 gap-4 mt-12 items-center">
        <div className="flex flex-row items-center justify-center gap-3">
          <span className="fa-solid fa-truck-fast"></span>
          <div>
            <div className="font-bold text-sm">Free Shipping</div>
            <div className="text-xs text-gray-800">Orders $50 or more</div>
          </div>
        </div>
        <div className="flex flex-row items-center justify-center gap-3">
          <span className="fa-solid fa-sack-dollar"></span>
          <div>
            <div className="font-bold text-sm">Save Money</div>
            <div className="text-xs text-gray-800">At lowest price</div>
          </div>
        </div>
        <div className="flex flex-row items-center justify-center gap-3">
          <span className="fa-solid fa-award"></span>
          <div>
            <div className="font-bold text-sm">100% Warranty</div>
            <div className="text-xs text-gray-800">Any Time Return Product</div>
          </div>
        </div>
        <div className="flex flex-row items-center justify-center gap-3">
          <span className="fa-solid fa-tags"></span>
          <div>
            <div className="font-bold text-sm">Best Deal Offer</div>
            <div className="text-xs text-gray-800">Grab Your Gear and Go</div>
          </div>
        </div>
        <div className="flex flex-row items-center justify-center gap-3">
          <span className="fa-solid fa-headset"></span>
          <div>
            <div className="font-bold text-sm">Support 24/7</div>
            <div className="text-xs text-gray-800">Contact us 24 hours a day</div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <Footer />
    </div>
  );
}
