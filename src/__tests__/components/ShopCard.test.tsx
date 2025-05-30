import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ShopCard from '../../components/ShopCard';
import { Product } from '../../types/type';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

const mockProduct: Product = {
  id: '1',
  title: 'Test Product',
  images: ['/test-image.jpg'],
  price: 29.99,
  category: { id: 1, name: 'electronics', slug: 'electronics', image: '' },
  sizes: [],
  discount: 0,
  oldPrice: 0,
  rating: 0,
  description: 'Test product description',
  slug: 'test-product',
  updatedAt: '',
};

describe('ShopCard Component', () => {
  describe('Rendering', () => {
    it('renders the product information correctly', () => {
      render(<ShopCard product={mockProduct} />);
      
      // Check product image
      const image = screen.getByAltText('Test Product');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', '/test-image.jpg');
      
      // Check product title
      expect(screen.getByText('Test Product')).toBeInTheDocument();
      
      // Check product price
      expect(screen.getByText('$29.99')).toBeInTheDocument();
      
      // Check buttons
      expect(screen.getByText('Add to Cart')).toBeInTheDocument();
      expect(screen.getByText('View Detail')).toBeInTheDocument();
    });
    
    it('renders the favorite button with initial state', () => {
      render(<ShopCard product={mockProduct} />);
      
      // Initially the favorite button should show the empty heart
      const favoriteButton = screen.getByRole('button', { name: 'Add to favorite' });
      expect(favoriteButton).toBeInTheDocument();
      expect(favoriteButton).toHaveTextContent('♡');
      expect(favoriteButton).toHaveClass('text-gray-400');
    });
  });
  
  describe('User Interactions', () => {
    it('toggles favorite state when favorite button is clicked', async () => {
      const user = userEvent.setup();
      render(<ShopCard product={mockProduct} />);
      
      const favoriteButton = screen.getByRole('button', { name: 'Add to favorite' });
      
      // Initial state: empty heart
      expect(favoriteButton).toHaveTextContent('♡');
      expect(favoriteButton).toHaveClass('text-gray-400');
      
      // Click to favorite
      await user.click(favoriteButton);
      
      // After click: filled heart
      expect(favoriteButton).toHaveTextContent('♥');
      expect(favoriteButton).toHaveClass('text-red-500');
      
      // Click again to unfavorite
      await user.click(favoriteButton);
      
      // Back to initial state
      expect(favoriteButton).toHaveTextContent('♡');
      expect(favoriteButton).toHaveClass('text-gray-400');
    });
    
    it('has a working "View Detail" link', () => {
      render(<ShopCard product={mockProduct} />);
      
      const detailLink = screen.getByText('View Detail');
      expect(detailLink).toHaveAttribute('href', '/1');
    });
    
    it('handles keyboard navigation correctly', async () => {
      const user = userEvent.setup();
      render(<ShopCard product={mockProduct} />);
      
      // Tab to the favorite button
      await user.tab();
      const favoriteButton = screen.getByRole('button', { name: 'Add to favorite' });
      expect(favoriteButton).toHaveFocus();
      
      // Press Enter to toggle favorite
      await user.keyboard('{Enter}');
      expect(favoriteButton).toHaveTextContent('♥');
      expect(favoriteButton).toHaveClass('text-red-500');
    });
  });
  
  describe('Accessibility', () => {
    it('has proper button roles and aria-labels', () => {
      render(<ShopCard product={mockProduct} />);
      
      // Check favorite button has proper aria-label
      const favoriteButton = screen.getByRole('button', { name: 'Add to favorite' });
      expect(favoriteButton).toHaveAttribute('aria-label', 'Add to favorite');
      
      // Check Add to Cart button is accessible
      const addToCartButton = screen.getByText('Add to Cart');
      expect(addToCartButton).toBeInTheDocument();
      expect(addToCartButton.tagName).toBe('BUTTON');
    });
    
    it('has proper focus indicators', async () => {
      const user = userEvent.setup();
      render(<ShopCard product={mockProduct} />);
      
      // Tab to the favorite button
      await user.tab();
      const favoriteButton = screen.getByRole('button', { name: 'Add to favorite' });
      expect(favoriteButton).toHaveFocus();
      
      // Tab to the Add to Cart button
      await user.tab();
      const addToCartButton = screen.getByText('Add to Cart');
      expect(addToCartButton).toHaveFocus();
      
      // Tab to the View Detail link
      await user.tab();
      const viewDetailLink = screen.getByText('View Detail');
      expect(viewDetailLink).toHaveFocus();
    });
  });
  
  describe('Performance', () => {
    it('renders with different product data', () => {
      const differentProduct: Product = {
        id: '2',
        title: 'Different Product',
        images: ['/different-image.jpg'],
        price: 49.99,
        category: { id: 2, name: 'clothing', slug: 'clothing', image: '' },
        sizes: [],
        discount: 0,
        oldPrice: 0,
        rating: 0,
        description: 'Different product description',
        slug: 'different-product',
        updatedAt: '',
      };
      
      const { rerender } = render(<ShopCard product={mockProduct} />);
      
      // Initial render with mockProduct
      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.getByText('$29.99')).toBeInTheDocument();
      
      // Re-render with differentProduct
      rerender(<ShopCard product={differentProduct} />);
      
      // Should update to show new product
      expect(screen.getByText('Different Product')).toBeInTheDocument();
      expect(screen.getByText('$49.99')).toBeInTheDocument();
    });
  });
});