// __tests__/app/checkout/page.test.tsx
import { render, screen } from '@testing-library/react';
import CheckoutPage from '../../../app/checkout/page';

// Mock the imported components
jest.mock('../../../components/Navbar', () => {
  function MockNavbar() {
    return <nav data-testid="navbar">Navbar Component</nav>;
  }
  MockNavbar.displayName = 'Navbar';
  return MockNavbar;
});

jest.mock('../../../components/Footer', () => {
  function MockFooter() {
    return <footer data-testid="footer">Footer Component</footer>;
  }
  MockFooter.displayName = 'Footer';
  return MockFooter;
});

jest.mock('@/components/CheckoutClient', () => {
  function MockCheckoutClient() {
    return <div data-testid="checkout-client">CheckoutClient Component</div>;
  }
  MockCheckoutClient.displayName = 'CheckoutClient';
  return MockCheckoutClient;
});

describe('CheckoutPage Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders checkout page with all components', () => {
    render(<CheckoutPage />);
    
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('checkout-client')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  test('applies correct CSS classes to root container', () => {
    const { container } = render(<CheckoutPage />);
    const rootDiv = container.firstElementChild;
    
    expect(rootDiv).toHaveClass('bg-white');
    expect(rootDiv).toHaveClass('min-h-screen');
    expect(rootDiv).toHaveClass('font-sans');
  });

  test('renders main element with correct attributes', () => {
    render(<CheckoutPage />);
    const mainElement = screen.getByRole('main');
    
    expect(mainElement).toBeInTheDocument();
    expect(mainElement).toHaveAttribute('role', 'main');
    expect(mainElement).toHaveClass('max-w-7xl', 'mx-auto', 'py-10', 'px-4');
  });

  test('checkout client is contained within main element', () => {
    render(<CheckoutPage />);
    const checkoutClient = screen.getByTestId('checkout-client');
    const mainElement = screen.getByRole('main');
    
    expect(mainElement).toContainElement(checkoutClient);
  });

  test('components are rendered in correct order', () => {
    const { container } = render(<CheckoutPage />);
    const rootDiv = container.firstElementChild as HTMLElement;
    const children = Array.from(rootDiv.children);
    
    expect(children).toHaveLength(3);
    expect(children[0]).toHaveAttribute('data-testid', 'navbar');
    expect(children[1].tagName.toLowerCase()).toBe('main');
    expect(children[2]).toHaveAttribute('data-testid', 'footer');
  });

  test('function component returns valid React element', () => {
    const result = CheckoutPage();
    
    expect(result).toBeDefined();
    expect(result.type).toBe('div');
    expect(result.props).toBeDefined();
    expect(result.props.className).toBe('bg-white min-h-screen font-sans');
  });

  test('main content area has proper styling', () => {
    render(<CheckoutPage />);
    const mainElement = screen.getByRole('main');
    const classes = mainElement.className.split(' ');
    
    expect(classes).toContain('max-w-7xl');
    expect(classes).toContain('mx-auto');
    expect(classes).toContain('py-10');
    expect(classes).toContain('px-4');
  });

  test('navbar renders before main content', () => {
    render(<CheckoutPage />);
    const navbar = screen.getByTestId('navbar');
    const mainElement = screen.getByRole('main');
    
    expect(navbar.compareDocumentPosition(mainElement) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  test('footer renders after main content', () => {
    render(<CheckoutPage />);
    const footer = screen.getByTestId('footer');
    const mainElement = screen.getByRole('main');
    
    expect(mainElement.compareDocumentPosition(footer) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  test('component structure matches expected layout', () => {
    const { container } = render(<CheckoutPage />);
    
    // Should have root div containing navbar, main, and footer
    expect(container.children).toHaveLength(1);
    
    const rootElement = container.firstElementChild as HTMLElement;
    expect(rootElement.tagName.toLowerCase()).toBe('div');
    expect(rootElement.children).toHaveLength(3);
  });

  test('component renders without throwing errors', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => render(<CheckoutPage />)).not.toThrow();
    expect(consoleSpy).not.toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });

  test('all text content is rendered correctly', () => {
    render(<CheckoutPage />);
    
    expect(screen.getByText('Navbar Component')).toBeInTheDocument();
    expect(screen.getByText('CheckoutClient Component')).toBeInTheDocument();
    expect(screen.getByText('Footer Component')).toBeInTheDocument();
  });

  test('DOM structure is semantically correct', () => {
    render(<CheckoutPage />);
    
    // Should have semantic elements
    expect(screen.getByRole('navigation')).toBeInTheDocument(); // nav element
    expect(screen.getByRole('main')).toBeInTheDocument(); // main element
    expect(screen.getByRole('contentinfo')).toBeInTheDocument(); // footer element
  });
});

// Test the default export specifically
describe('CheckoutPage Default Export', () => {
  test('default export is a function', () => {
    expect(typeof CheckoutPage).toBe('function');
  });

  test('function has correct name', () => {
    expect(CheckoutPage.name).toBe('CheckoutPage');
  });

  test('function returns JSX when called', () => {
    const element = CheckoutPage();
    expect(element).toHaveProperty('type');
    expect(element).toHaveProperty('props');
  });
});