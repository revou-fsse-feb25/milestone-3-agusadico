import { render, act } from '@testing-library/react';
import { CartProvider, useCart } from '../../providers/CartProvider';
import { Product } from '../../types/type';

// Test component that uses the cart context
const TestComponent = () => {
  const { cartItems, addToCart, removeFromCart, updateQuantity, clearCart, subtotal } = useCart();
  
  return (
    <div>
      <div data-testid="cart-count">{cartItems.length}</div>
      <div data-testid="subtotal">{subtotal}</div>
      <button data-testid="add-item" onClick={() => addToCart(mockProduct, 1)}>Add</button>
      <button data-testid="remove-item" onClick={() => removeFromCart('1')}>Remove</button>
      <button data-testid="update-quantity" onClick={() => updateQuantity('1', 3)}>Update</button>
      <button data-testid="clear-cart" onClick={clearCart}>Clear</button>
    </div>
  );
};

// Mock product
const mockProduct: Product = {
  id: '1',
  title: 'Test Product',
  images: ['test.jpg'],
  price: 99.99,
  category: { id: 1, name: 'Test Category', slug: 'test-category', image: 'category.jpg' }
};

describe('CartProvider', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  test('provides cart functionality', () => {
    const { getByTestId } = render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
    
    // Initial state
    expect(getByTestId('cart-count').textContent).toBe('0');
    expect(getByTestId('subtotal').textContent).toBe('0');
    
    // Add item to cart
    act(() => {
      getByTestId('add-item').click();
    });
    
    expect(getByTestId('cart-count').textContent).toBe('1');
    expect(getByTestId('subtotal').textContent).toBe('99.99');
    
    // Update quantity
    act(() => {
      getByTestId('update-quantity').click();
    });
    
    expect(getByTestId('cart-count').textContent).toBe('1');
    expect(getByTestId('subtotal').textContent).toBe('299.97'); // 99.99 * 3
    
    // Remove item
    act(() => {
      getByTestId('remove-item').click();
    });
    
    expect(getByTestId('cart-count').textContent).toBe('0');
    expect(getByTestId('subtotal').textContent).toBe('0');
    
    // Add item again and clear cart
    act(() => {
      getByTestId('add-item').click();
    });
    
    expect(getByTestId('cart-count').textContent).toBe('1');
    
    act(() => {
      getByTestId('clear-cart').click();
    });
    
    expect(getByTestId('cart-count').textContent).toBe('0');
  });

  test('loads cart from localStorage', () => {
    // Setup localStorage with a cart
    const storedCart = [{
      id: '1',
      title: 'Test Product',
      price: 99.99,
      images: ['test.jpg'],
      quantity: 2
    }];
    
    window.localStorage.setItem('cart', JSON.stringify(storedCart));
    
    const { getByTestId } = render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
    
    // Check if cart was loaded from localStorage
    expect(getByTestId('cart-count').textContent).toBe('1');
    expect(getByTestId('subtotal').textContent).toBe('199.98'); // 99.99 * 2
  });
});