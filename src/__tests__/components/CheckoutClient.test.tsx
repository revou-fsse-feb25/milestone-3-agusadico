import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCart } from '@/providers/CartProvider';
import CheckoutClient from '@/components/CheckoutClient';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

jest.mock('@/providers/CartProvider', () => ({
  useCart: jest.fn(),
}));

jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

// Mock implementations
const mockPush = jest.fn();
const mockClearCart = jest.fn();

const mockCartItems = [
  {
    id: 1,
    title: 'Test Product 1',
    price: 29.99,
    quantity: 2,
    images: ['https://example.com/image1.jpg'],
  },
  {
    id: 2,
    title: 'Test Product 2',
    price: 49.99,
    quantity: 1,
    images: ['https://example.com/image2.jpg'],
  },
];

const mockSession = {
  user: {
    name: 'John Doe',
    email: 'john.doe@example.com',
  },
};

describe('CheckoutClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  describe('Authentication and Cart State', () => {
    it('should redirect to login when no session exists', () => {
      // Arrange
      (useSession as jest.Mock).mockReturnValue({
        data: null,
      });
      (useCart as jest.Mock).mockReturnValue({
        cartItems: mockCartItems,
        subtotal: 109.97,
        clearCart: mockClearCart,
      });

      // Act
      render(<CheckoutClient />);

      // Assert
      expect(mockPush).toHaveBeenCalledWith('/login?callbackUrl=/checkout');
      expect(screen.getByText('Redirecting to login...')).toBeInTheDocument();
    });

    it('should show empty cart message when cart is empty', () => {
      // Arrange
      (useSession as jest.Mock).mockReturnValue({
        data: mockSession,
      });
      (useCart as jest.Mock).mockReturnValue({
        cartItems: [],
        subtotal: 0,
        clearCart: mockClearCart,
      });

      // Act
      render(<CheckoutClient />);

      // Assert
      expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
      expect(screen.getByText('Add some products to your cart before checking out.')).toBeInTheDocument();
      expect(screen.getByText('Continue Shopping')).toBeInTheDocument();
    });

    it('should render checkout form when user is authenticated and cart has items', () => {
      // Arrange
      (useSession as jest.Mock).mockReturnValue({
        data: mockSession,
      });
      (useCart as jest.Mock).mockReturnValue({
        cartItems: mockCartItems,
        subtotal: 109.97,
        clearCart: mockClearCart,
      });

      // Act
      render(<CheckoutClient />);

      // Assert
      expect(screen.getByText('Checkout')).toBeInTheDocument();
      expect(screen.getByText('Order Summary')).toBeInTheDocument();
      expect(screen.getByText('Shipping Details')).toBeInTheDocument();
    });
  });

  describe('Order Summary Display', () => {
    beforeEach(() => {
      (useSession as jest.Mock).mockReturnValue({
        data: mockSession,
      });
      (useCart as jest.Mock).mockReturnValue({
        cartItems: mockCartItems,
        subtotal: 109.97,
        clearCart: mockClearCart,
      });
    });

    it('should display all cart items in order summary', () => {
      // Act
      render(<CheckoutClient />);

      // Assert
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
      expect(screen.getByText('Test Product 2')).toBeInTheDocument();
      expect(screen.getByText('SKU: 1')).toBeInTheDocument();
      expect(screen.getByText('SKU: 2')).toBeInTheDocument();
    });

    it('should display correct prices and quantities', () => {
      // Act
      render(<CheckoutClient />);

      // Assert
      expect(screen.getByText('$29.99')).toBeInTheDocument();
      expect(screen.getByText('$49.99')).toBeInTheDocument();
      expect(screen.getByText('$59.98')).toBeInTheDocument(); // 29.99 * 2
      expect(screen.getByText('$109.97')).toBeInTheDocument(); // total
    });

    it('should display user information', () => {
      // Act
      render(<CheckoutClient />);

      // Assert
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
    });

    it('should use fallback image when product image is not available', () => {
      // Arrange
      const cartItemsWithoutImages = [
        {
          id: 1,
          title: 'Test Product',
          price: 29.99,
          quantity: 1,
          images: [],
        },
      ];

      (useCart as jest.Mock).mockReturnValue({
        cartItems: cartItemsWithoutImages,
        subtotal: 29.99,
        clearCart: mockClearCart,
      });

      // Act
      render(<CheckoutClient />);

      // Assert
      const productImage = screen.getByAltText('Test Product');
      expect(productImage).toHaveAttribute('src', '/images/logo-revoshop.jpg');
    });

    it('should handle undefined images array', () => {
      // Arrange
      const cartItemsWithUndefinedImages = [
        {
          id: 1,
          title: 'Test Product',
          price: 29.99,
          quantity: 1,
          images: undefined,
        },
      ];

      (useCart as jest.Mock).mockReturnValue({
        cartItems: cartItemsWithUndefinedImages,
        subtotal: 29.99,
        clearCart: mockClearCart,
      });

      // Act
      render(<CheckoutClient />);

      // Assert
      const productImage = screen.getByAltText('Test Product');
      expect(productImage).toHaveAttribute('src', '/images/logo-revoshop.jpg');
    });
  });

  describe('Shipping Form', () => {
    beforeEach(() => {
      (useSession as jest.Mock).mockReturnValue({
        data: mockSession,
      });
      (useCart as jest.Mock).mockReturnValue({
        cartItems: mockCartItems,
        subtotal: 109.97,
        clearCart: mockClearCart,
      });
    });

    it('should render all shipping form fields', () => {
      // Act
      render(<CheckoutClient />);

      // Assert
      expect(screen.getByLabelText('Address')).toBeInTheDocument();
      expect(screen.getByLabelText('City')).toBeInTheDocument();
      expect(screen.getByLabelText('State/Province')).toBeInTheDocument();
      expect(screen.getByLabelText('ZIP / Postal Code')).toBeInTheDocument();
      expect(screen.getByLabelText('Country')).toBeInTheDocument();
      expect(screen.getByLabelText('Phone Number')).toBeInTheDocument();
    });

    it('should update form fields when user types', () => {
      // Act
      render(<CheckoutClient />);
      
      const addressInput = screen.getByLabelText('Address');
      const cityInput = screen.getByLabelText('City');

      fireEvent.change(addressInput, { target: { value: '123 Main St' } });
      fireEvent.change(cityInput, { target: { value: 'New York' } });

      // Assert
      expect(addressInput).toHaveValue('123 Main St');
      expect(cityInput).toHaveValue('New York');
    });

    it('should handle all form field changes', () => {
      // Act
      render(<CheckoutClient />);

      const fields = [
        { label: 'Address', value: '123 Main St' },
        { label: 'City', value: 'New York' },
        { label: 'State/Province', value: 'NY' },
        { label: 'ZIP / Postal Code', value: '10001' },
        { label: 'Country', value: 'USA' },
        { label: 'Phone Number', value: '+1234567890' },
      ];

      fields.forEach(({ label, value }) => {
        const input = screen.getByLabelText(label);
        fireEvent.change(input, { target: { value } });
        expect(input).toHaveValue(value);
      });
    });

    it('should handle input change with different field names', () => {
      // Act
      render(<CheckoutClient />);

      // Test zipCode field specifically (since input name is "zipCode" but label is "ZIP / Postal Code")
      const zipInput = screen.getByLabelText('ZIP / Postal Code');
      fireEvent.change(zipInput, { target: { name: 'zipCode', value: '12345' } });
      expect(zipInput).toHaveValue('12345');

      // Test state field specifically  
      const stateInput = screen.getByLabelText('State/Province');
      fireEvent.change(stateInput, { target: { name: 'state', value: 'CA' } });
      expect(stateInput).toHaveValue('CA');
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      (useSession as jest.Mock).mockReturnValue({
        data: mockSession,
      });
      (useCart as jest.Mock).mockReturnValue({
        cartItems: mockCartItems,
        subtotal: 109.97,
        clearCart: mockClearCart,
      });
    });

    it('should show loading state during form submission', async () => {
      // Act
      render(<CheckoutClient />);
      
      // Fill out required form fields first
      fireEvent.change(screen.getByLabelText('Address'), { target: { value: '123 Main St' } });
      fireEvent.change(screen.getByLabelText('City'), { target: { value: 'New York' } });
      fireEvent.change(screen.getByLabelText('State/Province'), { target: { value: 'NY' } });
      fireEvent.change(screen.getByLabelText('ZIP / Postal Code'), { target: { value: '10001' } });
      fireEvent.change(screen.getByLabelText('Country'), { target: { value: 'USA' } });
      fireEvent.change(screen.getByLabelText('Phone Number'), { target: { value: '+1234567890' } });

      const submitButton = screen.getByText('Place Order');
      fireEvent.click(submitButton);

      // Assert loading state appears
      expect(screen.getByText('Processing...')).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });

    it('should complete order submission successfully', async () => {
      // Act
      render(<CheckoutClient />);
      
      // Fill out required form fields
      fireEvent.change(screen.getByLabelText('Address'), { target: { value: '123 Main St' } });
      fireEvent.change(screen.getByLabelText('City'), { target: { value: 'New York' } });
      fireEvent.change(screen.getByLabelText('State/Province'), { target: { value: 'NY' } });
      fireEvent.change(screen.getByLabelText('ZIP / Postal Code'), { target: { value: '10001' } });
      fireEvent.change(screen.getByLabelText('Country'), { target: { value: 'USA' } });
      fireEvent.change(screen.getByLabelText('Phone Number'), { target: { value: '+1234567890' } });

      const submitButton = screen.getByText('Place Order');
      fireEvent.click(submitButton);

      // Wait for async operations to complete
      await waitFor(() => {
        expect(mockClearCart).toHaveBeenCalled();
        expect(mockPush).toHaveBeenCalledWith('/checkout/success');
      }, { timeout: 2000 });
    });

    it('should handle form submission error', async () => {
      // Mock console.error to avoid noise in test output
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      // Mock clearCart to throw an error
      mockClearCart.mockImplementationOnce(() => {
        throw new Error('Network error');
      });

      // Act
      render(<CheckoutClient />);
      
      // Fill out form
      fireEvent.change(screen.getByLabelText('Address'), { target: { value: '123 Main St' } });
      fireEvent.change(screen.getByLabelText('City'), { target: { value: 'New York' } });
      fireEvent.change(screen.getByLabelText('State/Province'), { target: { value: 'NY' } });
      fireEvent.change(screen.getByLabelText('ZIP / Postal Code'), { target: { value: '10001' } });
      fireEvent.change(screen.getByLabelText('Country'), { target: { value: 'USA' } });
      fireEvent.change(screen.getByLabelText('Phone Number'), { target: { value: '+1234567890' } });

      const submitButton = screen.getByText('Place Order');
      fireEvent.click(submitButton);

      // Wait for error handling
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error placing order:', expect.any(Error));
      }, { timeout: 2000 });

      // Cleanup
      consoleSpy.mockRestore();
    });

    it('should prevent form submission with empty required fields', () => {
      // Act
      render(<CheckoutClient />);
      
      // Assert - form should not submit due to HTML5 validation
      expect(screen.getByLabelText('Address')).toBeRequired();
      expect(screen.getByLabelText('City')).toBeRequired();
      expect(screen.getByLabelText('State/Province')).toBeRequired();
      expect(screen.getByLabelText('ZIP / Postal Code')).toBeRequired();
      expect(screen.getByLabelText('Country')).toBeRequired();
      expect(screen.getByLabelText('Phone Number')).toBeRequired();
    });

    it('should call preventDefault on form submission', async () => {
      // Arrange
      render(<CheckoutClient />);
      
      // Fill out form
      fireEvent.change(screen.getByLabelText('Address'), { target: { value: '123 Main St' } });
      fireEvent.change(screen.getByLabelText('City'), { target: { value: 'New York' } });
      fireEvent.change(screen.getByLabelText('State/Province'), { target: { value: 'NY' } });
      fireEvent.change(screen.getByLabelText('ZIP / Postal Code'), { target: { value: '10001' } });
      fireEvent.change(screen.getByLabelText('Country'), { target: { value: 'USA' } });
      fireEvent.change(screen.getByLabelText('Phone Number'), { target: { value: '+1234567890' } });

      // Get the form element
      const form = screen.getByRole('form');
      
      // Spy on preventDefault
      const preventDefaultSpy = jest.fn();
      
      // Create a custom submit event
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      Object.defineProperty(submitEvent, 'preventDefault', {
        value: preventDefaultSpy,
        writable: false
      });

      // Trigger the submit event directly
      fireEvent(form, submitEvent);

      // Assert preventDefault was called
      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe('Navigation and Breadcrumbs', () => {
    beforeEach(() => {
      (useSession as jest.Mock).mockReturnValue({
        data: mockSession,
      });
      (useCart as jest.Mock).mockReturnValue({
        cartItems: mockCartItems,
        subtotal: 109.97,
        clearCart: mockClearCart,
      });
    });

    it('should display breadcrumb navigation', () => {
      // Act
      render(<CheckoutClient />);

      // Assert
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Cart')).toBeInTheDocument();
      expect(screen.getByText('Checkout')).toBeInTheDocument();
    });

    it('should have correct navigation links', () => {
      // Act
      render(<CheckoutClient />);

      // Assert
      const homeLink = screen.getByText('Home').closest('a');
      const cartLink = screen.getByText('Cart').closest('a');
      
      expect(homeLink).toHaveAttribute('href', '/');
      expect(cartLink).toHaveAttribute('href', '/cart');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle missing product prices gracefully', () => {
      // Arrange
      const cartItemsWithMissingPrice = [
        {
          id: 1,
          title: 'Test Product',
          price: undefined,
          quantity: 1,
          images: ['https://example.com/image1.jpg'],
        },
      ];

      (useSession as jest.Mock).mockReturnValue({
        data: mockSession,
      });
      (useCart as jest.Mock).mockReturnValue({
        cartItems: cartItemsWithMissingPrice,
        subtotal: 0,
        clearCart: mockClearCart,
      });

      // Act & Assert
      expect(() => render(<CheckoutClient />)).not.toThrow();
      
      // Should render with NaN handling
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    it('should handle missing user information gracefully', () => {
      // Arrange
      const sessionWithMissingInfo = {
        user: {
          name: undefined,
          email: undefined,
        },
      };

      (useSession as jest.Mock).mockReturnValue({
        data: sessionWithMissingInfo,
      });
      (useCart as jest.Mock).mockReturnValue({
        cartItems: mockCartItems,
        subtotal: 109.97,
        clearCart: mockClearCart,
      });

      // Act & Assert
      expect(() => render(<CheckoutClient />)).not.toThrow();
      expect(screen.getByText('User Information')).toBeInTheDocument();
    });

    it('should handle empty cart items array', () => {
      // Arrange
      (useSession as jest.Mock).mockReturnValue({
        data: mockSession,
      });
      (useCart as jest.Mock).mockReturnValue({
        cartItems: [],
        subtotal: 0,
        clearCart: mockClearCart,
      });

      // Act
      render(<CheckoutClient />);

      // Assert
      expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    });

    it('should handle cart items with null/undefined properties', () => {
      // Arrange
      const cartItemsWithNullProps = [
        {
          id: 1,
          title: null,
          price: 29.99,
          quantity: 1,
          images: null,
        },
      ];

      (useSession as jest.Mock).mockReturnValue({
        data: mockSession,
      });
      (useCart as jest.Mock).mockReturnValue({
        cartItems: cartItemsWithNullProps,
        subtotal: 29.99,
        clearCart: mockClearCart,
      });

      // Act & Assert
      expect(() => render(<CheckoutClient />)).not.toThrow();
    });

    it('should handle zero quantity items', () => {
      // Arrange
      const cartItemsWithZeroQuantity = [
        {
          id: 1,
          title: 'Test Product',
          price: 29.99,
          quantity: 0,
          images: ['https://example.com/image1.jpg'],
        },
      ];

      (useSession as jest.Mock).mockReturnValue({
        data: mockSession,
      });
      (useCart as jest.Mock).mockReturnValue({
        cartItems: cartItemsWithZeroQuantity,
        subtotal: 0,
        clearCart: mockClearCart,
      });

      // Act
      render(<CheckoutClient />);

      // Assert
      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument(); // quantity
      expect(screen.getByText('$0.00')).toBeInTheDocument(); // total for item
    });

    it('should handle negative prices', () => {
      // Arrange
      const cartItemsWithNegativePrice = [
        {
          id: 1,
          title: 'Test Product',
          price: -10.99,
          quantity: 1,
          images: ['https://example.com/image1.jpg'],
        },
      ];

      (useSession as jest.Mock).mockReturnValue({
        data: mockSession,
      });
      (useCart as jest.Mock).mockReturnValue({
        cartItems: cartItemsWithNegativePrice,
        subtotal: -10.99,
        clearCart: mockClearCart,
      });

      // Act
      render(<CheckoutClient />);

      // Assert
      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.getByText('$-10.99')).toBeInTheDocument();
    });

    it('should handle session with user but no user properties', () => {
      // Arrange
      const sessionWithoutUserProps = {
        user: {},
      };

      (useSession as jest.Mock).mockReturnValue({
        data: sessionWithoutUserProps,
      });
      (useCart as jest.Mock).mockReturnValue({
        cartItems: mockCartItems,
        subtotal: 109.97,
        clearCart: mockClearCart,
      });

      // Act & Assert
      expect(() => render(<CheckoutClient />)).not.toThrow();
      expect(screen.getByText('User Information')).toBeInTheDocument();
    });

    it('should handle price calculation with undefined price', () => {
      // Arrange
      const cartItemsWithUndefinedPrice = [
        {
          id: 1,
          title: 'Test Product',
          price: undefined,
          quantity: 2,
          images: ['https://example.com/image1.jpg'],
        },
      ];

      (useSession as jest.Mock).mockReturnValue({
        data: mockSession,
      });
      (useCart as jest.Mock).mockReturnValue({
        cartItems: cartItemsWithUndefinedPrice,
        subtotal: 0,
        clearCart: mockClearCart,
      });

      // Act
      render(<CheckoutClient />);

      // Assert
      expect(screen.getByText('Test Product')).toBeInTheDocument();
      // The component should handle undefined price gracefully
      const totalCell = screen.getByText('$NaN'); // This tests the actual behavior when price is undefined
      expect(totalCell).toBeInTheDocument();
    });
  });

  describe('Component Integration', () => {
    it('should properly integrate with cart provider', () => {
      // Arrange
      (useSession as jest.Mock).mockReturnValue({
        data: mockSession,
      });
      (useCart as jest.Mock).mockReturnValue({
        cartItems: mockCartItems,
        subtotal: 109.97,
        clearCart: mockClearCart,
      });

      // Act
      render(<CheckoutClient />);

      // Assert
      expect(useCart).toHaveBeenCalled();
      expect(screen.getByText('$109.97')).toBeInTheDocument();
    });

    it('should properly integrate with session provider', () => {
      // Arrange
      (useSession as jest.Mock).mockReturnValue({
        data: mockSession,
      });
      (useCart as jest.Mock).mockReturnValue({
        cartItems: mockCartItems,
        subtotal: 109.97,
        clearCart: mockClearCart,
      });

      // Act
      render(<CheckoutClient />);

      // Assert
      expect(useSession).toHaveBeenCalled();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('should properly integrate with router', () => {
      // Arrange
      (useSession as jest.Mock).mockReturnValue({
        data: null,
      });
      (useCart as jest.Mock).mockReturnValue({
        cartItems: mockCartItems,
        subtotal: 109.97,
        clearCart: mockClearCart,
      });

      // Act
      render(<CheckoutClient />);

      // Assert
      expect(useRouter).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith('/login?callbackUrl=/checkout');
    });
  });

  describe('Loading State Management', () => {
    beforeEach(() => {
      (useSession as jest.Mock).mockReturnValue({
        data: mockSession,
      });
      (useCart as jest.Mock).mockReturnValue({
        cartItems: mockCartItems,
        subtotal: 109.97,
        clearCart: mockClearCart,
      });
    });

    it('should handle loading state toggle correctly', async () => {
      // Act
      render(<CheckoutClient />);
      
      // Fill form
      fireEvent.change(screen.getByLabelText('Address'), { target: { value: '123 Main St' } });
      fireEvent.change(screen.getByLabelText('City'), { target: { value: 'New York' } });
      fireEvent.change(screen.getByLabelText('State/Province'), { target: { value: 'NY' } });
      fireEvent.change(screen.getByLabelText('ZIP / Postal Code'), { target: { value: '10001' } });
      fireEvent.change(screen.getByLabelText('Country'), { target: { value: 'USA' } });
      fireEvent.change(screen.getByLabelText('Phone Number'), { target: { value: '+1234567890' } });

      // Submit form
      const submitButton = screen.getByText('Place Order');
      fireEvent.click(submitButton);

      // Check loading state is active
      expect(screen.getByText('Processing...')).toBeInTheDocument();
      expect(submitButton).toBeDisabled();

      // Wait for completion
      await waitFor(() => {
        expect(mockClearCart).toHaveBeenCalled();
      }, { timeout: 2000 });
    });
  });

  describe('Form Validation', () => {
    beforeEach(() => {
      (useSession as jest.Mock).mockReturnValue({
        data: mockSession,
      });
      (useCart as jest.Mock).mockReturnValue({
        cartItems: mockCartItems,
        subtotal: 109.97,
        clearCart: mockClearCart,
      });
    });

    it('should have proper input types and attributes', () => {
      // Act
      render(<CheckoutClient />);

      // Assert
      expect(screen.getByLabelText('Address')).toHaveAttribute('type', 'text');
      expect(screen.getByLabelText('City')).toHaveAttribute('type', 'text');
      expect(screen.getByLabelText('State/Province')).toHaveAttribute('type', 'text');
      expect(screen.getByLabelText('ZIP / Postal Code')).toHaveAttribute('type', 'text');
      expect(screen.getByLabelText('Country')).toHaveAttribute('type', 'text');
      expect(screen.getByLabelText('Phone Number')).toHaveAttribute('type', 'tel');
    });

    it('should have proper form structure', () => {
      // Act
      render(<CheckoutClient />);

      // Assert
      const form = screen.getByRole('form');
      expect(form).toBeInTheDocument();
      expect(form.tagName).toBe('FORM');
    });
  });
});