import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ShopRow from '../../components/ShopRow';
import { Product } from '../../types/type';

// Mock ShopCard component
jest.mock('../../components/ShopCard', () => {
  return function MockShopCard({ product }: { product: Product }) {
    return <div data-testid="shop-card">{product.title}</div>;
  };
});

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

const mockProducts: Product[] = [
  {
    id: '1',
    title: 'Test Product 1',
    images: ['/test-image-1.jpg'],
    price: 29.99,
    category: { id: 1, name: 'electronics', slug: 'electronics', image: '' },
    sizes: [],
    discount: 0,
    oldPrice: 0,
    rating: 0,
    description: 'Test product description 1',
    slug: 'test-product-1',
    updatedAt: '',
  },
  {
    id: '2',
    title: 'Test Product 2',
    images: ['/test-image-2.jpg'],
    price: 39.99,
    category: { id: 2, name: 'clothing', slug: 'clothing', image: '' },
    sizes: [],
    discount: 0,
    oldPrice: 0,
    rating: 0,
    description: 'Test product description 2',
    slug: 'test-product-2',
    updatedAt: '',
  },
];

describe('ShopRow Component', () => {
  describe('Card View Mode', () => {
    it('renders products in a grid layout', () => {
      render(<ShopRow products={mockProducts} viewMode="card" />);
      
      // Check grid container
      const gridContainer = screen.getByText('Test Product 1').closest('div');
      expect(gridContainer).toHaveClass('grid', 'grid-cols-2', 'md:grid-cols-4', 'gap-6');
      
      // Check ShopCard components are rendered
      const shopCards = screen.getAllByTestId('shop-card');
      expect(shopCards).toHaveLength(2);
      expect(shopCards[0]).toHaveTextContent('Test Product 1');
      expect(shopCards[1]).toHaveTextContent('Test Product 2');
    });
    
    it('renders empty grid when no products are provided', () => {
      render(<ShopRow products={[]} viewMode="card" />);
      
      const gridContainer = screen.getByRole('generic');
      expect(gridContainer).toHaveClass('grid');
      expect(gridContainer.children).toHaveLength(0);
    });
  });
  
  describe('List View Mode', () => {
    it('renders products in a list layout', () => {
      render(<ShopRow products={mockProducts} viewMode="list" />);
      
      // Check list container
      const element = screen.getByText('Test Product 1').closest('div');
      const listContainer = element?.parentElement;
      if (!listContainer) throw new Error('List container not found');
      expect(listContainer).toHaveClass('flex', 'flex-col', 'gap-4');
      
      // Check product items
      const productItems = screen.getAllByText(/Test Product \d/);
      expect(productItems).toHaveLength(2);
      expect(productItems[0]).toHaveTextContent('Test Product 1');
      expect(productItems[1]).toHaveTextContent('Test Product 2');
      
      // Check prices
      expect(screen.getByText('$29.99')).toBeInTheDocument();
      expect(screen.getByText('$39.99')).toBeInTheDocument();
      
      // Check buttons and links
      const addToCartButtons = screen.getAllByText('Add to Cart');
      expect(addToCartButtons).toHaveLength(2);
      
      const viewDetailLinks = screen.getAllByText('View Detail');
      expect(viewDetailLinks).toHaveLength(2);
      expect(viewDetailLinks[0]).toHaveAttribute('href', '/1');
      expect(viewDetailLinks[1]).toHaveAttribute('href', '/2');
    });
    
    it('renders empty list when no products are provided', () => {
      render(<ShopRow products={[]} viewMode="list" />);
      
      const listContainer = screen.getByRole('generic');
      expect(listContainer).toHaveClass('flex', 'flex-col');
      expect(listContainer.children).toHaveLength(0);
    });
    
    it('renders product images correctly', () => {
      render(<ShopRow products={mockProducts} viewMode="list" />);
      
      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(2);
      expect(images[0]).toHaveAttribute('src', '/test-image-1.jpg');
      expect(images[0]).toHaveAttribute('alt', 'Test Product 1');
      expect(images[1]).toHaveAttribute('src', '/test-image-2.jpg');
      expect(images[1]).toHaveAttribute('alt', 'Test Product 2');
    });
  });
  
  describe('User Interactions', () => {
    it('has working View Detail links in list mode', async () => {
      render(<ShopRow products={mockProducts} viewMode="list" />);
      
      const viewDetailLinks = screen.getAllByText('View Detail');
      expect(viewDetailLinks[0]).toHaveAttribute('href', '/1');
      expect(viewDetailLinks[1]).toHaveAttribute('href', '/2');
    });
    
    it('handles keyboard navigation correctly in list mode', async () => {
      const user = userEvent.setup();
      render(<ShopRow products={mockProducts} viewMode="list" />);
      
      // Tab to the first Add to Cart button
      await user.tab(); // First focusable element
      
      const firstAddToCartButton = screen.getAllByText('Add to Cart')[0];
      expect(firstAddToCartButton).toHaveFocus();
      
      // Tab to the first View Detail link
      await user.tab();
      const firstViewDetailLink = screen.getAllByText('View Detail')[0];
      expect(firstViewDetailLink).toHaveFocus();
    });
  });
});