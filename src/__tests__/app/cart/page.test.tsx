import { render, screen } from '@testing-library/react';
import CartPage from '../../../app/cart/page';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import CartClient from '../../../components/CartClient';

// Mock the components used in CartPage
jest.mock('../../../components/Navbar', () => {
  return jest.fn(() => <div data-testid="navbar-mock">Navbar Mock</div>);
});

jest.mock('../../../components/Footer', () => {
  return jest.fn(() => <div data-testid="footer-mock">Footer Mock</div>);
});

jest.mock('../../../components/CartClient', () => {
  return jest.fn(() => <div data-testid="cart-client-mock">CartClient Mock</div>);
});

jest.mock('next/link', () => {
  return jest.fn(({ children, href }) => (
    <a href={href} data-testid="link-mock">
      {children}
    </a>
  ));
});

describe('CartPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the cart page with all components', () => {
    render(<CartPage />);
    
    // Check if the main container is rendered
    const mainContainer = screen.getByTestId('cart-page-container');
    expect(mainContainer).toBeInTheDocument();
    expect(mainContainer).toHaveClass('bg-white min-h-screen font-sans');
    
    // Check if all components are rendered
    expect(screen.getByTestId('navbar-mock')).toBeInTheDocument();
    expect(screen.getByTestId('cart-client-mock')).toBeInTheDocument();
    expect(screen.getByTestId('footer-mock')).toBeInTheDocument();
  });

  it('renders the content container with proper styling', () => {
    render(<CartPage />);
    
    const contentContainer = screen.getByTestId('content-container');
    expect(contentContainer).toBeInTheDocument();
    expect(contentContainer).toHaveClass('max-w-7xl mx-auto py-10 px-4');
  });
});