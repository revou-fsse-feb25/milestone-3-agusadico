export type Product = {
  id: string;
  title: string;
  images: string[];
  price: number;
  category?: Category;
  sizes?: string[];
  discount?: number;
  oldPrice?: number;
  rating?: number;
  description?: string;
  slug?: string; // <-- Add this
  updatedAt?: string; // <-- And this
  // Add any other fields your product uses
};
export interface Category {
  id: number;
  name: string;
  slug: string;
  image: string;
}