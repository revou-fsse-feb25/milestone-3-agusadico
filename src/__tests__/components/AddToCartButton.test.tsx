import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import AddToCartButton from '../../components/AddToCartButton';
import { useCart } from '../../providers/CartProvider';
import { Product } from '../../types/type';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock CartProvider
jest.mock('../../providers/CartProvider', () => ({
  useCart: jest.fn(),
}));

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

const mockPush = jest.fn();
const mockAddToCart = jest.fn();

describe('AddToCartButton Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    
    (useCart as jest.Mock).mockReturnValue({
      addToCart: mockAddToCart,
    });
  });

  describe('User interactions', () => {
    it('handles mouse click interaction', async () => {
      const user = userEvent.setup();
      render(<AddToCartButton product={mockProduct} />);
      
      // FIXED: Use correct text content instead of aria-label that doesn't exist in original component
      const button = screen.getByRole('button', { name: /add to cart/i });
      await user.click(button);
      
      expect(mockAddToCart).toHaveBeenCalledWith(mockProduct, 1);
      expect(mockPush).toHaveBeenCalledWith('/cart');
    });

    it('handles keyboard navigation (Tab and Enter)', async () => {
      const user = userEvent.setup();
      render(
        <div>
          <button>Previous Button</button>
          <AddToCartButton product={mockProduct} />
          <button>Next Button</button>
        </div>
      );
      
      // Tab to the AddToCartButton
      await user.tab();
      await user.tab();
      
      // FIXED: Use correct text content
      const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
      expect(addToCartButton).toHaveFocus();
      
      // Press Enter
      await user.keyboard('{Enter}');
      
      expect(mockAddToCart).toHaveBeenCalledWith(mockProduct, 1);
      expect(mockPush).toHaveBeenCalledWith('/cart');
    });

    it('handles keyboard navigation (Space key)', async () => {
      const user = userEvent.setup();
      render(<AddToCartButton product={mockProduct} />);
      
      // FIXED: Use correct text content
      const button = screen.getByRole('button', { name: /add to cart/i });
      button.focus();
      
      await user.keyboard(' ');
      
      expect(mockAddToCart).toHaveBeenCalledWith(mockProduct, 1);
      expect(mockPush).toHaveBeenCalledWith('/cart');
    });

    // FIXED: Removed disabled test since original component doesn't have disabled prop
    it('handles multiple rapid clicks', async () => {
      const user = userEvent.setup();
      render(<AddToCartButton product={mockProduct} />);
      
      const button = screen.getByRole('button', { name: /add to cart/i });
      
      // Click multiple times rapidly
      await user.click(button);
      await user.click(button);
      await user.click(button);
      
      expect(mockAddToCart).toHaveBeenCalledTimes(3);
      expect(mockPush).toHaveBeenCalledTimes(3);
    });
  });

  describe('Accessibility', () => {
    it('has proper button role and content', () => {
      render(<AddToCartButton product={mockProduct} />);
      
      const button = screen.getByRole('button', { name: /add to cart/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Add to Cart');
    });

    // FIXED: Removed tests for props that don't exist in original component
    it('has proper focus behavior', async () => {
      const user = userEvent.setup();
      render(<AddToCartButton product={mockProduct} />);
      
      const button = screen.getByRole('button', { name: /add to cart/i });
      
      await user.tab();
      expect(button).toHaveFocus();
    });

    it('provides screen reader friendly content', () => {
      render(<AddToCartButton product={mockProduct} />);
      
      const button = screen.getByRole('button', { name: /add to cart/i });
      const icon = button.querySelector('svg');
      
      // FIXED: Original component doesn't have aria-hidden
      expect(icon).toBeInTheDocument();
      expect(button).toHaveTextContent('Add to Cart');
    });
  });

  describe('Error Handling', () => {
    it('handles addToCart errors', async () => {
      // The component doesn't handle errors, so we should expect them to propagate
      mockAddToCart.mockImplementation(() => {
        throw new Error('Network error');
      });
      
      const user = userEvent.setup();
      render(<AddToCartButton product={mockProduct} />);
      
      const button = screen.getByRole('button', { name: /add to cart/i });
      
      // Change this to expect the error to be thrown
      await expect(user.click(button)).rejects.toThrow('Network error');
      expect(mockAddToCart).toHaveBeenCalledTimes(1);
    });
  
    it('handles router.push errors', async () => {
      mockPush.mockImplementation(() => {
        throw new Error('Navigation error');
      });
      
      const user = userEvent.setup();
      render(<AddToCartButton product={mockProduct} />);
      
      const button = screen.getByRole('button', { name: /add to cart/i });
      
      // Change this to expect the error to be thrown
      await expect(user.click(button)).rejects.toThrow('Navigation error');
      expect(mockAddToCart).toHaveBeenCalledTimes(1);
    });
  });

  describe('Performance', () => {
    // FIXED: Original component is not memoized, so it will re-render
    it('component re-renders when parent re-renders', () => {
      const TestComponent = ({ count }: { count: number }) => {
        return (
          <div>
            <span>Count: {count}</span>
            <AddToCartButton product={mockProduct} quantity={1} />
          </div>
        );
      };
      
      const { rerender } = render(<TestComponent count={1} />);
      
      // Re-render with different props
      rerender(<TestComponent count={2} />);
      
      // Component should still work after re-render
      const button = screen.getByRole('button', { name: /add to cart/i });
      expect(button).toBeInTheDocument();
      expect(screen.getByText('Count: 2')).toBeInTheDocument();
    });

    it('handles concurrent operations correctly', async () => {
      const user = userEvent.setup();
      render(<AddToCartButton product={mockProduct} />);
      
      const button = screen.getByRole('button', { name: /add to cart/i });
      
      // Start multiple operations concurrently
      const promises = [
        user.click(button),
        user.click(button),
        user.click(button)
      ];
      
      await Promise.all(promises);
      
      // All operations should complete
      expect(mockAddToCart).toHaveBeenCalledTimes(3);
      expect(mockPush).toHaveBeenCalledTimes(3);
    });
  });

  describe('Props handling', () => {
    it('uses default quantity when not provided', async () => {
      const user = userEvent.setup();
      render(<AddToCartButton product={mockProduct} />);
      
      const button = screen.getByRole('button', { name: /add to cart/i });
      await user.click(button);
      
      expect(mockAddToCart).toHaveBeenCalledWith(mockProduct, 1);
    });

    it('uses provided quantity', async () => {
      const user = userEvent.setup();
      render(<AddToCartButton product={mockProduct} quantity={5} />);
      
      const button = screen.getByRole('button', { name: /add to cart/i });
      await user.click(button);
      
      expect(mockAddToCart).toHaveBeenCalledWith(mockProduct, 5);
    });

    it('handles different product objects', async () => {
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

      const user = userEvent.setup();
      render(<AddToCartButton product={differentProduct} quantity={2} />);
      
      const button = screen.getByRole('button', { name: /add to cart/i });
      await user.click(button);
      
      expect(mockAddToCart).toHaveBeenCalledWith(differentProduct, 2);
    });
  });
});