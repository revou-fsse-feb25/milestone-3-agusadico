import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CartClient from '../../components/CartClient';
import { useCart } from '../../providers/CartProvider';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// Mock the hooks
jest.mock('../../providers/CartProvider', () => ({
  useCart: jest.fn(),
}));

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('next/link', () => {
  return jest.fn(({ children, href }) => (
    <a href={href} data-testid="link-mock">
      {children}
    </a>
  ));
});

describe('CartClient', () => {
  const mockCartItems = [
    {
      id: '1',
      title: 'Test Product 1',
      price: 29.99,
      images: ['/test-image-1.jpg'],
      quantity: 2,
    },
    {
      id: '2',
      title: 'Test Product 2',
      price: 49.99,
      images: ['/test-image-2.jpg'],
      quantity: 1,
    },
  ];

  const mockRemoveFromCart = jest.fn();
  const mockUpdateQuantity = jest.fn();
  const mockSubtotal = 109.97; // 29.99*2 + 49.99*1
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    (useCart as jest.Mock).mockReturnValue({
      cartItems: mockCartItems,
      removeFromCart: mockRemoveFromCart,
      updateQuantity: mockUpdateQuantity,
      subtotal: mockSubtotal,
    });
    
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it('renders empty cart message when cart is empty', () => {
    (useCart as jest.Mock).mockReturnValue({
      cartItems: [],
      removeFromCart: mockRemoveFromCart,
      updateQuantity: mockUpdateQuantity,
      subtotal: 0,
    });
    
    render(<CartClient />);
    
    expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();
  });

  it('renders cart items when cart has items', () => {
    render(<CartClient />);
    
    // Check if product titles are displayed
    expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    expect(screen.getByText('Test Product 2')).toBeInTheDocument();
    
    // Check if prices are displayed
    expect(screen.getByText('$29.99')).toBeInTheDocument();
    expect(screen.getByText('$49.99')).toBeInTheDocument();
    
    // Check if quantities are displayed
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    
    // Check if subtotal is displayed
    expect(screen.getByText('$109.97')).toBeInTheDocument();
  });

  it('calls removeFromCart when remove button is clicked', async () => {
    const user = userEvent.setup();
    render(<CartClient />);
    
    const removeButtons = screen.getAllByText('×');
    await user.click(removeButtons[0]);
    
    expect(mockRemoveFromCart).toHaveBeenCalledWith('1');
  });

  it('calls updateQuantity when quantity buttons are clicked', async () => {
    const user = userEvent.setup();
    render(<CartClient />);
    
    const increaseButtons = screen.getAllByText('+');
    const decreaseButtons = screen.getAllByText('-');
    
    await user.click(increaseButtons[0]);
    expect(mockUpdateQuantity).toHaveBeenCalledWith('1', 3);
    
    await user.click(decreaseButtons[0]);
    expect(mockUpdateQuantity).toHaveBeenCalledWith('1', 1);
  });

  it('redirects to login when checkout button is clicked and user is not logged in', async () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
    });
    
    const user = userEvent.setup();
    render(<CartClient />);
    
    const checkoutButton = screen.getByText('Proceed to Checkout');
    await user.click(checkoutButton);
    
    expect(mockPush).toHaveBeenCalledWith('/login?callbackUrl=/checkout');
  });

  it('shows alert when checkout button is clicked and user is logged in', async () => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { name: 'Test User' } },
    });
    
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    
    const user = userEvent.setup();
    render(<CartClient />);
    
    const checkoutButton = screen.getByText('Proceed to Checkout');
    await user.click(checkoutButton);
    
    expect(alertMock).toHaveBeenCalledWith('Proceeding to checkout...');
    alertMock.mockRestore();
  });
});