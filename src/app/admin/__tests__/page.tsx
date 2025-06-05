// This is a test-friendly version of the admin page
// The 'use client' directive is intentionally omitted for testing
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Product } from '../../../types/type';
import Link from 'next/link';
import AdminSidebar from '../../../components/AdminSidebar';
import AdminProductForm from '../../../components/AdminProductForm';
import AdminProductTable from '../../../components/AdminProductTable';

type Category = {
  id: number;
  name: string;
  image: string;
};

// Loading component
export const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
  </div>
);

// Unauthorized access component
export const UnauthorizedAccess = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="max-w-md mx-auto text-center">
      <div className="mb-4">
        <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
      <p className="text-gray-600 mb-6">
        You don't have permission to access this admin area. Please contact an administrator if you believe this is an error.
      </p>
      <Link 
        href="/" 
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Return to Home
      </Link>
    </div>
  </div>
);

// Export the main component without the 'use client' directive for testing
export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    title: '',
    price: '',
    category: '',
    images: [''],
    description: ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Authentication and authorization check
  useEffect(() => {
    if (status === 'loading') return; // Still loading
    
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    
    // Check if user has admin role
    if (session?.user && (session.user as any).role !== 'admin') {
      // User is authenticated but not an admin
      return;
    }
  }, [session, status, router]);

  useEffect(() => {
    // Only fetch data if user is authenticated and is admin
    if (status === 'authenticated' && session?.user && (session.user as any).role === 'admin') {
      // Fetch products
      setLoading(true);
      fetch('https://api.escuelajs.co/api/v1/products')
        .then(res => res.json())
        .then(data => {
          setProducts(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching products:', err);
          setLoading(false);
        });
        
      // Fetch categories
      fetch('https://api.escuelajs.co/api/v1/categories')
        .then(res => res.json())
        .then(setCategories)
        .catch(err => console.error('Error fetching categories:', err));
    }
  }, [session, status]);

  // Show loading spinner while checking authentication
  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  // Show unauthorized access if user is not admin
  if (status === 'authenticated' && session?.user && (session.user as any).role !== 'admin') {
    return <UnauthorizedAccess />;
  }

  // If not authenticated, the useEffect will redirect to login, but show loading in the meantime
  if (status === 'unauthenticated') {
    return <LoadingSpinner />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = (product: Product) => {
    setForm({
      title: product.title || '',
      price: product.price?.toString() || '',
      category: product.category?.id?.toString() || '',
      images: Array.isArray(product.images) ? product.images : [''],
      description: product.description || ''
    });
    setEditingId(product.id?.toString() || null);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (editingId) {
        // Edit product
        const updatedProduct = {
          title: form.title,
          price: Number(form.price),
          description: form.description,
          categoryId: Number(form.category),
          images: Array.isArray(form.images) ? form.images.filter(img => img && img.trim() !== '') : [form.images]
        };
        
        const res = await fetch(`https://api.escuelajs.co/api/v1/products/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedProduct),
        });
        
        if (res.ok) {
          const updated = await res.json();
          setProducts(prev => 
            prev.map(p => p.id?.toString() === editingId ? { ...p, ...updated } : p)
          );
          resetForm();
        } else {
          const errorData = await res.json();
          console.error('Failed to update product:', errorData);
          alert('Failed to update product. Please try again.');
        }
      } else {
        // Create new product
        const productPrice = Number(form.price);
        const categoryId = Number(form.category);
        
        if (isNaN(productPrice) || productPrice <= 0) {
          alert('Please enter a valid price greater than 0');
          setLoading(false);
          return;
        }
        
        if (isNaN(categoryId) || categoryId < 1 || categoryId > 5) {
          alert('Please select a valid category (1-5)');
          setLoading(false);
          return;
        }
        
        const imageUrl = Array.isArray(form.images) && form.images[0] && form.images[0].trim() !== '' 
          ? form.images.filter(img => img && img.trim() !== '')
          : ['https://placehold.co/600x400'];
        
        // Generate a unique title to avoid slug conflicts
        const generateUniqueTitle = (baseTitle: string) => {
          const timestamp = Date.now();
          const randomNum = Math.floor(Math.random() * 1000);
          return baseTitle ? `${baseTitle}-${randomNum}` : `Product-${timestamp}`;
        };
        
        const uniqueTitle = generateUniqueTitle(form.title);
        
        const newProductData = {
          title: uniqueTitle,
          price: productPrice,
          description: form.description || 'No description provided',
          categoryId: categoryId,
          images: imageUrl
        };
        
        console.log('Sending product data:', newProductData);
        
        const response = await fetch('https://api.escuelajs.co/api/v1/products/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newProductData),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('API Error:', errorData);
          alert(`Failed to create product: ${errorData.message || 'Unknown error'}`);
          setLoading(false);
          return;
        }
        
        try {
          const newProduct = await response.json();
          console.log('API response:', newProduct);
          
          // Fetch the complete product data to ensure we have all fields
          const completeProductResponse = await fetch(`https://api.escuelajs.co/api/v1/products/${newProduct.id}`);
          if (completeProductResponse.ok) {
            const completeProduct = await completeProductResponse.json();
            setProducts(prev => [completeProduct, ...prev]);
          } else {
            // If we can't fetch the complete product, use what we have
            setProducts(prev => [newProduct, ...prev]);
          }
          
          resetForm();
          alert('Product created successfully!');
        } catch (parseError) {
          console.error('Error parsing API response:', parseError);
          
          // If we can't parse the response, refresh the product list
          refreshProducts();
          resetForm();
          alert('Product may have been created. Refreshing product list...');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Add this new function to refresh products
  const refreshProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://api.escuelajs.co/api/v1/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error refreshing products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const res = await fetch(`https://api.escuelajs.co/api/v1/products/${id}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        setProducts(prev => prev.filter(product => product.id?.toString() !== id.toString()));
      } else {
        alert('Failed to delete product. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product. Please try again.');
    }
  };

  const resetForm = () => {
    setForm({
      title: '',
      price: '',
      category: '',
      images: [''],
      description: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  const filteredProducts = products.filter(product =>
    product.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Add this missing function
  const handleImageChange = (value: string) => {
    setForm(prev => ({
      ...prev,
      images: [value]
    }));
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar userName={session?.user?.name ?? undefined} />
      
      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Product Management</h2>
          <button 
            onClick={() => { 
              resetForm();
              setShowForm(true);
            }}
            className="bg-yellow-400 hover:bg-orange-400 text-black px-4 py-2 rounded-md flex items-center"
          >
            <span className="mr-1">+</span> Add New Product
          </button>
        </div>
        
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products by title or category..."
              className="w-full border border-gray-300 rounded-md py-2 px-4 pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Form (conditionally rendered) */}
        {(editingId || showForm) && (
          <AdminProductForm
            form={form}
            categories={categories}
            editingId={editingId}
            loading={loading}
            onSubmit={handleSubmit}
            onChange={handleChange}
            onCancel={resetForm}
            onImageChange={handleImageChange}
          />
        )}
        
        {/* Products Table */}
        <AdminProductTable 
          products={products}
          searchQuery={searchQuery}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}