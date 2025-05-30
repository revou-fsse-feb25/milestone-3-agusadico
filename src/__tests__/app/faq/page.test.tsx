// src/app/faq/__tests__/page.test.tsx
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FaqPage from '../../../app/faq/page';

// Mock the components since they're imported from other files
jest.mock('../../../components/NavbarClient', () => {
  return function MockNavbarClient() {
    return <nav data-testid="navbar">Navbar</nav>;
  };
});

jest.mock('../../../components/Footer', () => {
  return function MockFooter() {
    return <footer data-testid="footer">Footer</footer>;
  };
});

describe('FaqPage', () => {
  beforeEach(() => {
    render(<FaqPage />);
  });

  // Test 1: Component renders without crashing
  it('should render without crashing', () => {
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  // Test 2: Main heading is present
  it('should display the main FAQ heading', () => {
    const mainHeading = screen.getByRole('heading', { level: 1 });
    expect(mainHeading).toBeInTheDocument();
    expect(mainHeading).toHaveTextContent('Frequently Asked Questions (FAQ)');
  });

  // Test 3: All FAQ questions are present
  it('should display all FAQ questions', () => {
    const expectedQuestions = [
      'What is RevoShop?',
      'How do I place an order?',
      'What payment methods are accepted?',
      'How can I contact customer support?'
    ];

    expectedQuestions.forEach(question => {
      expect(screen.getByText(question)).toBeInTheDocument();
    });
  });

  // Test 4: All FAQ answers are present
  it('should display all FAQ answers', () => {
    const expectedAnswers = [
      'RevoShop is Indonesia\'s leading online shop, offering a wide range of products and a seamless shopping experience.',
      'Simply browse our products, add items to your cart, and proceed to checkout. Follow the instructions to complete your purchase.',
      'We accept various payment methods including credit cards, PayPal, and bank transfers.',
      'You can reach us at support@revoshop.com or via our contact page for any assistance.'
    ];

    expectedAnswers.forEach(answer => {
      expect(screen.getByText(answer)).toBeInTheDocument();
    });
  });

  // Test 5: NavbarClient component is rendered
  it('should render the NavbarClient component', () => {
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  // Test 6: Footer component is rendered
  it('should render the Footer component', () => {
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  // Test 7: Main content has proper structure
  it('should have proper main content structure', () => {
    const main = screen.getByRole('main');
    expect(main).toHaveClass('max-w-4xl', 'mx-auto', 'py-12', 'px-4');
  });

  // Test 8: FAQ sections have proper heading levels
  it('should have proper heading hierarchy', () => {
    const h1 = screen.getByRole('heading', { level: 1 });
    const h2Elements = screen.getAllByRole('heading', { level: 2 });
    
    expect(h1).toBeInTheDocument();
    expect(h2Elements).toHaveLength(4);
  });

  // Test 9: Contact email is present
  it('should display the support email', () => {
    expect(screen.getByText(/support@revoshop\.com/)).toBeInTheDocument();
  });

  // Test 10: Page layout structure
  it('should have the correct page layout structure', () => {
    const pageContainer = screen.getByRole('main').parentElement;
    expect(pageContainer).toContainElement(screen.getByTestId('navbar'));
    expect(pageContainer).toContainElement(screen.getByRole('main'));
    expect(pageContainer).toContainElement(screen.getByTestId('footer'));
  });

  // Test 11: Main heading styling
  it('should apply correct styling to main heading', () => {
    const mainHeading = screen.getByRole('heading', { level: 1 });
    expect(mainHeading).toHaveClass('text-3xl', 'font-bold', 'mb-4');
  });

  // Test 12: FAQ sections styling
  it('should apply correct styling to FAQ sections', () => {
    const faqSections = screen.getByRole('main').querySelectorAll('.mb-6');
    expect(faqSections).toHaveLength(5); // 4 FAQ items + main heading
  });

  // Test 13: Accessibility - headings structure
  it('should have accessible heading structure', () => {
    const headings = screen.getAllByRole('heading');
    expect(headings[0]).toHaveAttribute('aria-level', '1');
    
    // Check that h2 elements come after h1
    const h2Elements = screen.getAllByRole('heading', { level: 2 });
    h2Elements.forEach(h2 => {
      expect(h2).toHaveClass('text-xl', 'font-semibold', 'mb-2');
    });
  });

  // Test 14: Content sections structure
  it('should structure FAQ content properly', () => {
    const mainContent = screen.getByRole('main');
    const faqSections = mainContent.querySelectorAll('div.mb-6');
    
    // Should have main title div + 4 FAQ sections
    expect(faqSections).toHaveLength(5);
  });

  // Test 15: Static export configuration (metadata test)
  it('should be configured for static export', () => {
    // This tests the export configuration exists
    // In a real scenario, you'd test the actual Next.js config
    const FaqPageModule = require('../page');
    expect(FaqPageModule.dynamic).toBe('force-static');
    expect(FaqPageModule.revalidate).toBe(false);
  });
});

// Integration test for the complete page
describe('FaqPage Integration', () => {
  it('should render complete page with all components', () => {
    const { container } = render(<FaqPage />);
    
    // Check overall structure
    expect(container.firstChild).toHaveClass(); // Has div wrapper
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    
    // Check content completeness
    expect(screen.getAllByRole('heading')).toHaveLength(5); // 1 h1 + 4 h2
    expect(screen.getByText(/RevoShop is Indonesia's leading/)).toBeInTheDocument();
  });
});

// Snapshot test
describe('FaqPage Snapshot', () => {
  it('should match snapshot', () => {
    const { container } = render(<FaqPage />);
    expect(container.firstChild).toMatchSnapshot();
  });
});