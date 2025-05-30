// src/app/checkout/success/__tests__/page.test.tsx

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import CheckoutSuccessPage from '@/app/checkout/success/page';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

// Mock Next.js Link component
jest.mock('next/link', () => {
  return function MockLink({ children, href, ...props }: any) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

describe('CheckoutSuccessPage', () => {
  const mockPush = jest.fn();
  const mockRouter = {
    push: mockPush,
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  describe('Authentication Tests', () => {
    it('should redirect to login when user is not authenticated', async () => {
      // Arrange
      (useSession as jest.Mock).mockReturnValue({
        data: null,
        status: 'unauthenticated',
      });

      // Act
      render(<CheckoutSuccessPage />);

      // Assert
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/login');
      });
    });

    it('should show loading state when redirecting unauthenticated user', () => {
      // Arrange
      (useSession as jest.Mock).mockReturnValue({
        data: null,
        status: 'loading',
      });

      // Act
      render(<CheckoutSuccessPage />);

      // Assert
      expect(screen.getByText('Redirecting to login...')).toBeInTheDocument();
    });

    it('should not redirect when user is authenticated', () => {
      // Arrange
      const mockSession = {
        user: {
          name: 'John Doe',
          email: 'john@example.com',
        },
      };
      (useSession as jest.Mock).mockReturnValue({
        data: mockSession,
        status: 'authenticated',
      });

      // Act
      render(<CheckoutSuccessPage />);

      // Assert
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  describe('UI Rendering Tests', () => {
    const mockSession = {
      user: {
        name: 'John Doe',
        email: 'john@example.com',
      },
    };

    beforeEach(() => {
      (useSession as jest.Mock).mockReturnValue({
        data: mockSession,
        status: 'authenticated',
      });
    });

    it('should render success message with user name', () => {
      // Act
      render(<CheckoutSuccessPage />);

      // Assert
      expect(screen.getByText('Order Placed Successfully!')).toBeInTheDocument();
      expect(screen.getByText(/Thank you for your purchase, John Doe/)).toBeInTheDocument();
    });

    it('should display user email in confirmation message', () => {
      // Act
      render(<CheckoutSuccessPage />);

      // Assert
      expect(screen.getByText(/A confirmation email has been sent to john@example.com/)).toBeInTheDocument();
    });

    it('should render success icon', () => {
      // Act
      render(<CheckoutSuccessPage />);

      // Assert
      const successIcon = screen.getByRole('img', { hidden: true });
      expect(successIcon).toBeInTheDocument();
      expect(successIcon).toHaveClass('text-green-500');
    });

    it('should render continue shopping button with correct link', () => {
      // Act
      render(<CheckoutSuccessPage />);

      // Assert
      const continueButton = screen.getByRole('link', { name: /continue shopping/i });
      expect(continueButton).toBeInTheDocument();
      expect(continueButton).toHaveAttribute('href', '/');
    });

    it('should apply correct CSS classes for styling', () => {
      // Act
      const { container } = render(<CheckoutSuccessPage />);

      // Assert
      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toHaveClass('min-h-screen', 'flex', 'items-center', 'justify-center');
      
      const successBackground = screen.getByText('Order Placed Successfully!').closest('div')?.previousElementSibling;
      expect(successBackground).toHaveClass('bg-green-50', 'rounded-full');
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing user name gracefully', () => {
      // Arrange
      const mockSession = {
        user: {
          email: 'john@example.com',
        },
      };
      (useSession as jest.Mock).mockReturnValue({
        data: mockSession,
        status: 'authenticated',
      });

      // Act
      render(<CheckoutSuccessPage />);

      // Assert
      expect(screen.getByText(/Thank you for your purchase,/)).toBeInTheDocument();
    });

    it('should handle missing user email gracefully', () => {
      // Arrange
      const mockSession = {
        user: {
          name: 'John Doe',
        },
      };
      (useSession as jest.Mock).mockReturnValue({
        data: mockSession,
        status: 'authenticated',
      });

      // Act
      render(<CheckoutSuccessPage />);

      // Assert
      expect(screen.getByText(/A confirmation email has been sent to/)).toBeInTheDocument();
    });

    it('should handle empty user object', () => {
      // Arrange
      const mockSession = {
        user: {},
      };
      (useSession as jest.Mock).mockReturnValue({
        data: mockSession,
        status: 'authenticated',
      });

      // Act
      render(<CheckoutSuccessPage />);

      // Assert
      expect(screen.getByText('Order Placed Successfully!')).toBeInTheDocument();
    });
  });

  describe('Accessibility Tests', () => {
    const mockSession = {
      user: {
        name: 'John Doe',
        email: 'john@example.com',
      },
    };

    beforeEach(() => {
      (useSession as jest.Mock).mockReturnValue({
        data: mockSession,
        status: 'authenticated',
      });
    });

    it('should have proper heading hierarchy', () => {
      // Act
      render(<CheckoutSuccessPage />);

      // Assert
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('Order Placed Successfully!');
    });

    it('should have accessible button/link', () => {
      // Act
      render(<CheckoutSuccessPage />);

      // Assert
      const button = screen.getByRole('link', { name: /continue shopping/i });
      expect(button).toBeInTheDocument();
    });

    it('should have proper ARIA attributes on SVG icon', () => {
      // Act
      render(<CheckoutSuccessPage />);

      // Assert
      const svgIcon = screen.getByRole('img', { hidden: true });
      expect(svgIcon).toBeInTheDocument();
    });
  });

  describe('Integration Tests', () => {
    it('should render complete success flow for authenticated user', async () => {
      // Arrange
      const mockSession = {
        user: {
          name: 'Jane Smith',
          email: 'jane@example.com',
        },
      };
      (useSession as jest.Mock).mockReturnValue({
        data: mockSession,
        status: 'authenticated',
      });

      // Act
      render(<CheckoutSuccessPage />);

      // Assert
      await waitFor(() => {
        expect(screen.getByText('Order Placed Successfully!')).toBeInTheDocument();
        expect(screen.getByText(/Thank you for your purchase, Jane Smith/)).toBeInTheDocument();
        expect(screen.getByText(/A confirmation email has been sent to jane@example.com/)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /continue shopping/i })).toBeInTheDocument();
        expect(mockPush).not.toHaveBeenCalled();
      });
    });

    it('should handle session loading state', () => {
      // Arrange
      (useSession as jest.Mock).mockReturnValue({
        data: null,
        status: 'loading',
      });

      // Act
      const { rerender } = render(<CheckoutSuccessPage />);

      // Assert initial loading state
      expect(screen.getByText('Redirecting to login...')).toBeInTheDocument();

      // Simulate session loaded
      (useSession as jest.Mock).mockReturnValue({
        data: { user: { name: 'John', email: 'john@example.com' } },
        status: 'authenticated',
      });

      rerender(<CheckoutSuccessPage />);

      expect(screen.getByText('Order Placed Successfully!')).toBeInTheDocument();
    });
  });
});