import React from 'react';
import { render } from '@testing-library/react';
import RootLayout from '../../app/layout';

// Mock the providers
jest.mock('../../providers/SessionProvider', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="session-provider">{children}</div>
  ),
}));

jest.mock('../../providers/CartProvider', () => ({
  __esModule: true,
  CartProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="cart-provider">{children}</div>
  ),
}));

// Mock the fonts
jest.mock('next/font/google', () => ({
  Geist: () => ({
    variable: 'mock-geist-sans',
    subsets: ['latin'],
  }),
  Geist_Mono: () => ({
    variable: 'mock-geist-mono',
    subsets: ['latin'],
  }),
}));

// Mock metadata
jest.mock('next', () => ({
  __esModule: true,
}));

describe('RootLayout', () => {
  const mockChildren = <div data-testid="children-content">Test Content</div>;

  it('renders the layout with correct structure', () => {
    const { container, getByTestId } = render(
      <RootLayout>{mockChildren}</RootLayout>
    );

    // Check if the HTML structure is correct
    expect(container.querySelector('html')).toBeInTheDocument();
    expect(container.querySelector('body')).toBeInTheDocument();
    
    // Check if the providers are rendered
    expect(getByTestId('session-provider')).toBeInTheDocument();
    expect(getByTestId('cart-provider')).toBeInTheDocument();
    
    // Check if the children are rendered
    expect(getByTestId('children-content')).toBeInTheDocument();
  });

  it('applies the correct font classes', () => {
    const { container } = render(
      <RootLayout>{mockChildren}</RootLayout>
    );
    
    const body = container.querySelector('body');
    expect(body).toHaveClass('mock-geist-sans');
    expect(body).toHaveClass('mock-geist-mono');
    expect(body).toHaveClass('antialiased');
  });

  it('sets the correct language attribute', () => {
    const { container } = render(
      <RootLayout>{mockChildren}</RootLayout>
    );
    
    const html = container.querySelector('html');
    expect(html).toHaveAttribute('lang', 'en');
  });
});