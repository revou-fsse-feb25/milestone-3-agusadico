import { Product } from '../types/type';
import { Category } from '../types/type';

export async function fetchProducts(offset: number = 0, limit: number = 20): Promise<Product[]>{
  try {
    const res = await fetch('https://api.escuelajs.co/api/v1/products?offset=0&limit=20');
    if (!res.ok) throw new Error('Failed to fetch products');
    return await res.json();
  } catch (error) {
    console.error('Error in fetchProducts:', error);
    throw error;
  }
}

export async function fetchProductById(id: string): Promise<Product> {
  try {
    const res = await fetch(`https://api.escuelajs.co/api/v1/products/${id}`);
    if (!res.ok) {
      const errorText = await res.text().catch(() => 'No error details available');
      
      // Check if this is an EntityNotFoundError
      if (res.status === 400 && errorText.includes('EntityNotFoundError')) {
        console.warn(`Product with ID ${id} not found, using fallback product`);
        // Instead of throwing an error, return a fallback product
        return {
          id: id,
          title: "Product Not Available",
          images: ["/images/logo-revoshop.jpg"],
          price: 0,
          description: "This product is no longer available."
        };
      }
      
      throw new Error(`Failed to fetch product: ${res.status} ${res.statusText}. ${errorText}`);
    }
    return await res.json();
  } catch (error) {
    console.error('Error in fetchProductById:', error);
    throw error;
  }
}

export async function fetchRelatedProducts(id: string): Promise<Product[]> {
  try {
    const res = await fetch(`https://api.escuelajs.co/api/v1/products/${id}/related`);
    if (!res.ok) throw new Error('Failed to fetch related products');
    return await res.json();
  } catch (error) {
    console.error('Error in fetchRelatedProducts:', error);
    return [];
  }
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch('https://api.escuelajs.co/api/v1/categories');
    if (!res.ok) throw new Error('Failed to fetch categories');
    return await res.json();
  } catch (error) {
    console.error('Error in fetchCategories:', error);
    throw error;
  }
}

export async function searchProductsByTitle(title: string): Promise<Product[]> {
  try {
    const res = await fetch(`https://api.escuelajs.co/api/v1/products/?title=${encodeURIComponent(title)}`);
    if (!res.ok) throw new Error('Failed to search products');
    return await res.json();
  } catch (error) {
    console.error('Error in searchProductsByTitle:', error);
    throw error;
  }
}

export async function fetchProductsByCategoryAndTitle(categoryId: number, title: string) {
  const res = await fetch(`https://api.escuelajs.co/api/v1/products/?categoryId=${categoryId}`);
  const products = await res.json();
  return products.filter((product: any) =>
    product.title.toLowerCase().includes(title.toLowerCase())
  );
}