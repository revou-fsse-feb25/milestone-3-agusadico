import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { jest } from '@jest/globals';
import NavbarClient from "../../components/NavbarClient";

// Define types for better TypeScript support
interface MockImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
}

interface MockLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface MockResponse {
  ok: boolean;
  json: () => Promise<any>;
}

// Mock Next.js components
jest.mock("next/image", () => {
  return function MockImage({ src, alt, width, height }: MockImageProps) {
    return <img src={src} alt={alt} width={width} height={height} data-testid="navbar-logo" />;
  };
});

jest.mock("next/link", () => {
  return function MockLink({ href, children, ...props }: MockLinkProps) {
    return <a href={href} {...props}>{children}</a>;
  };
});

// Mock child components
jest.mock("../../components/NavbarSearch", () => {
  return function MockNavbarSearch() {
    return <div data-testid="navbar-search">Search Component</div>;
  };
});

jest.mock("../../components/NavbarAuthWrapper", () => {
  return function MockNavbarAuthWrapper() {
    return <div data-testid="navbar-auth">Auth Component</div>;
  };
});

// Mock fetch globally with proper typing
const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;
global.fetch = mockFetch;

describe("NavbarClient", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("Initial Render", () => {
    it("renders without crashing", () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => []
      } as any);
      
      const { container } = render(<NavbarClient />);
      expect(container).toBeInTheDocument();
    });

    it("renders logo with correct attributes", () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => []
      } as any);

      render(<NavbarClient />);
      
      const logo = screen.getByTestId("navbar-logo");
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute("src", "/images/logo-revoshop.jpg");
      expect(logo).toHaveAttribute("alt", "Logo");
      expect(logo).toHaveAttribute("width", "120");
      expect(logo).toHaveAttribute("height", "40");
    });

    it("renders navigation links", () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => []
      } as any);

      render(<NavbarClient />);
      
      expect(screen.getByText("Home")).toBeInTheDocument();
      expect(screen.getByText("Shop")).toBeInTheDocument();
      expect(screen.getByText("About")).toBeInTheDocument();
      expect(screen.getByText("FAQ")).toBeInTheDocument();
      expect(screen.getByText("Contact")).toBeInTheDocument();
    });

    it("renders promotional elements", () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => []
      } as any);

      render(<NavbarClient />);
      
      expect(screen.getByText(/Weekly Discount 30%!/)).toBeInTheDocument();
      expect(screen.getByText(/Hotline Number: \+62812 3456 7890/)).toBeInTheDocument();
    });

    it("renders child components", () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => []
      } as any);

      render(<NavbarClient />);
      
      expect(screen.getByTestId("navbar-search")).toBeInTheDocument();
      expect(screen.getByTestId("navbar-auth")).toBeInTheDocument();
    });
  });

  describe("Categories Functionality", () => {
    it("fetches categories on mount", async () => {
      const mockCategories: Category[] = [
        { id: 1, name: "Electronics", slug: "electronics" },
        { id: 2, name: "Clothing", slug: "clothing" }
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCategories
      } as any);

      render(<NavbarClient />);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/categories');
      });
    });

    it("displays categories in dropdown", async () => {
      const mockCategories: Category[] = [
        { id: 1, name: "Electronics", slug: "electronics" },
        { id: 2, name: "Clothing", slug: "clothing" }
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCategories
      } as any);

      render(<NavbarClient />);

      await waitFor(() => {
        expect(screen.getByText("Electronics")).toBeInTheDocument();
        expect(screen.getByText("Clothing")).toBeInTheDocument();
      });
    });

    it("handles category fetch error gracefully", async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      render(<NavbarClient />);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch categories:', expect.any(Error));
      });

      consoleSpy.mockRestore();
    });

    it("sets empty categories array on fetch error", async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      render(<NavbarClient />);

      await waitFor(() => {
        // Categories dropdown should still render but be empty
        const categoryButton = screen.getByText("All Categories");
        expect(categoryButton).toBeInTheDocument();
      });

      consoleSpy.mockRestore();
    });

    it("renders category links with correct href", async () => {
      const mockCategories: Category[] = [
        { id: 1, name: "Electronics", slug: "electronics" },
        { id: 2, name: "Clothing", slug: "clothing" }
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCategories
      } as any);

      render(<NavbarClient />);

      await waitFor(() => {
        const electronicsLink = screen.getByRole('link', { name: "Electronics" });
        expect(electronicsLink).toHaveAttribute('href', '#category-electronics');
        
        const clothingLink = screen.getByRole('link', { name: "Clothing" });
        expect(clothingLink).toHaveAttribute('href', '#category-clothing');
      });
    });
  });

  describe("Interactive Elements", () => {
    it("renders category dropdown button with correct structure", () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => []
      } as any);

      render(<NavbarClient />);
      
      const categoryButton = screen.getByText("All Categories");
      expect(categoryButton).toBeInTheDocument();
      expect(categoryButton.closest('button')).toBeInTheDocument();
    });

    it("renders mobile hamburger menu", () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => []
      } as any);

      render(<NavbarClient />);
      
      const hamburgerElements = screen.getAllByText('', { selector: '.fa-bars' });
      expect(hamburgerElements.length).toBeGreaterThan(0);
      const hamburgerContainer = hamburgerElements[0].closest('div');
      expect(hamburgerContainer).toBeInTheDocument();
    });

    it("renders cart link", () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => []
      } as any);

      render(<NavbarClient />);
      
      const cartLinks = screen.getAllByRole('link');
      const cartLinkElement = cartLinks.find(link => link.getAttribute('href') === '/cart');
      expect(cartLinkElement).toBeDefined();
      expect(cartLinkElement).toHaveAttribute('href', '/cart');
    });
  });

  describe("Responsive Design Elements", () => {
    it("renders elements with correct responsive classes", () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => []
      } as any);

      render(<NavbarClient />);
      
      // Check for hidden mobile elements
      const categorySection = screen.getByText("All Categories").closest('div');
      expect(categorySection).toHaveClass('hidden', 'md:block');
      
      // Check for mobile-only hamburger
      const hamburgerElements = screen.getAllByText('', { selector: '.fa-bars' });
      const hamburger = hamburgerElements[0].closest('div');
      expect(hamburger).toHaveClass('md:hidden');
    });

    it("renders search bar with responsive classes", () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => []
      } as any);

      render(<NavbarClient />);
      
      const searchContainer = screen.getByTestId("navbar-search").closest('div');
      expect(searchContainer).toHaveClass('hidden', 'md:flex');
    });

    it("renders right icons with responsive classes", () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => []
      } as any);

      render(<NavbarClient />);
      
      const authWrapper = screen.getByTestId("navbar-auth").closest('div');
      expect(authWrapper).toHaveClass('hidden', 'md:flex');
    });
  });

  describe("Navigation Links", () => {
    it("renders home link with active styling", () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => []
      } as Response);

      render(<NavbarClient />);
      
      const homeLink = screen.getByRole('link', { name: /Home/ });
      expect(homeLink).toHaveAttribute('href', '/');
      expect(homeLink).toHaveClass('text-yellow-500', 'font-semibold');
    });

    it("renders about and faq links with correct hrefs", () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => []
      } as Response);

      render(<NavbarClient />);
      
      const aboutLink = screen.getByRole('link', { name: 'About' });
      expect(aboutLink).toHaveAttribute('href', '/about');
      
      const faqLink = screen.getByRole('link', { name: 'FAQ' });
      expect(faqLink).toHaveAttribute('href', '/faq');
    });

    it("renders shop and contact links", () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => []
      } as Response);

      render(<NavbarClient />);
      
      const shopLink = screen.getByRole('link', { name: /Shop/ });
      expect(shopLink).toHaveAttribute('href', '#');
      
      const contactLink = screen.getByRole('link', { name: 'Contact' });
      expect(contactLink).toHaveAttribute('href', '#');
    });
  });

  describe("Component Structure", () => {
    it("renders main navigation wrapper", () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => []
      } as any);

      render(<NavbarClient />);
      
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
      expect(nav).toHaveClass('max-w-7xl', 'mx-auto', 'px-6');
    });

    it("renders lower navigation section", () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => []
      } as any);

      const { container } = render(<NavbarClient />);
      
      const lowerNav = container.querySelector('.bg-gray-100');
      expect(lowerNav).toBeInTheDocument();
      expect(lowerNav).toHaveClass('hidden', 'md:flex');
    });
  });
});