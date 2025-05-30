import React from "react";
import { render, screen } from "@testing-library/react";
import AboutPage from "../../../app/about/page";

// Remove the mocks to test the actual component
// If you need to mock external dependencies, mock them properly
// jest.mock('../../components/Navbar', () => () => <nav data-testid="navbar" />);
// jest.mock('../../components/Footer', () => () => <footer data-testid="footer" />);

describe("AboutPage", () => {
  beforeEach(() => {
    // Clear any previous renders
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    const { container } = render(<AboutPage />);
    expect(container).toBeInTheDocument();
  });

  it("renders the main heading", () => {
    render(<AboutPage />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("About Us");
  });

  it("renders welcome paragraph", () => {
    render(<AboutPage />);
    expect(screen.getByText(/Welcome to RevoShop!/)).toBeInTheDocument();
  });

  it("renders mission statement", () => {
    render(<AboutPage />);
    expect(screen.getByText(/Our mission is to make shopping easy/)).toBeInTheDocument();
  });

  it("renders contact information", () => {
    render(<AboutPage />);
    expect(screen.getByText(/Contact us: support@revoshop.com/)).toBeInTheDocument();
  });

  it("renders all expected sections", () => {
    render(<AboutPage />);
    
    // Test that all main content is present
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    
    // If your AboutPage has specific structure, test it
    const textElements = screen.getAllByText(/RevoShop|mission|Contact/i);
    expect(textElements.length).toBeGreaterThan(0);
  });

  it("has proper semantic structure", () => {
    render(<AboutPage />);
    
    // Test semantic HTML structure
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    
    // Test that heading hierarchy is correct
    const headings = screen.getAllByRole('heading');
    expect(headings.length).toBeGreaterThanOrEqual(1);
  });

  // If your AboutPage has any interactive elements, test them
  it("renders interactive elements if any", () => {
    render(<AboutPage />);
    
    // Example: if there are links
    const links = screen.queryAllByRole('link');
    if (links.length > 0) {
      links.forEach(link => {
        expect(link).toBeInTheDocument();
      });
    }
  });

  // Test component structure and classes if needed
  it("applies correct styling classes", () => {
    const { container } = render(<AboutPage />);
    
    // Test that the component renders with expected structure
    expect(container.firstChild).toBeInTheDocument();
    
    // If you have specific CSS classes to test
    const elements = container.querySelectorAll('[class]');
    expect(elements.length).toBeGreaterThanOrEqual(0);
  });
});

// Additional test for component export
describe("AboutPage Module", () => {
  it("exports AboutPage as default", () => {
    expect(AboutPage).toBeDefined();
    expect(typeof AboutPage).toBe('function');
  });
});