import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
// Make sure this import is correct
//import AdminDashboard from "../../../app/admin/page";
import AdminDashboard from "../../../app/admin/__tests__/page";

// Mock next-auth
const mockUseSession = jest.fn();
jest.mock("next-auth/react", () => ({
  useSession: mockUseSession
}));

// Mock next/navigation
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush })
}));

// Mock subcomponents with proper implementations
jest.mock("../../../components/AdminSidebar", () => {
  return function MockAdminSidebar({ userName }: { userName?: string }) {
    return <aside data-testid="sidebar">Sidebar - {userName}</aside>;
  };
});

jest.mock("../../../components/AdminProductForm", () => {
  return function MockAdminProductForm(props: any) {
    return (
      <form data-testid="product-form" onSubmit={props.onSubmit}>
        <input
          data-testid="title-input"
          placeholder="Title"
          value={props.form?.title || ''}
          onChange={e => props.onChange && props.onChange({ 
            target: { name: "title", value: e.target.value } 
          })}
          name="title"
        />
        <input
          data-testid="price-input"
          placeholder="Price"
          value={props.form?.price || ''}
          onChange={e => props.onChange && props.onChange({ 
            target: { name: "price", value: e.target.value } 
          })}
          name="price"
          type="number"
        />
        <select
          data-testid="category-select"
          value={props.form?.category || ''}
          onChange={e => props.onChange && props.onChange({ 
            target: { name: "category", value: e.target.value } 
          })}
          name="category"
        >
          <option value="">Select Category</option>
          {props.categories?.map((cat: any) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <textarea
          data-testid="description-input"
          placeholder="Description"
          value={props.form?.description || ''}
          onChange={e => props.onChange && props.onChange({ 
            target: { name: "description", value: e.target.value } 
          })}
          name="description"
        />
        <input
          data-testid="image-input"
          placeholder="Image URL"
          value={props.form?.images?.[0] || ''}
          onChange={e => props.onImageChange && props.onImageChange(e.target.value)}
        />
        <button type="submit" data-testid="submit-button">
          {props.editingId ? 'Update' : 'Save'}
        </button>
        <button type="button" onClick={props.onCancel} data-testid="cancel-button">
          Cancel
        </button>
      </form>
    );
  };
});

jest.mock("../../../components/AdminProductTable", () => {
  return function MockAdminProductTable(props: any) {
    const filteredProducts = props.products?.filter((product: any) =>
      product.title?.toLowerCase().includes(props.searchQuery?.toLowerCase() || '') ||
      product.category?.name?.toLowerCase().includes(props.searchQuery?.toLowerCase() || '')
    ) || [];

    return (
      <div data-testid="product-table">
        {filteredProducts.length === 0 ? (
          <div data-testid="no-products">No products found</div>
        ) : (
          filteredProducts.map((p: any) => (
            <div key={p.id} data-testid={`product-${p.id}`}>
              <span data-testid={`product-title-${p.id}`}>{p.title}</span>
              <span data-testid={`product-price-${p.id}`}>${p.price}</span>
              <button 
                onClick={() => props.onEdit && props.onEdit(p)}
                data-testid={`edit-button-${p.id}`}
              >
                Edit
              </button>
              <button 
                onClick={() => props.onDelete && props.onDelete(p.id)}
                data-testid={`delete-button-${p.id}`}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    );
  };
});

jest.mock("next/link", () => ({ children, ...props }: any) => <a {...props}>{children}</a>);

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock window.confirm
const mockConfirm = jest.fn();
global.confirm = mockConfirm;

// Mock alert
const mockAlert = jest.fn();
global.alert = mockAlert;

// Mock console.error to avoid cluttering test output
const mockConsoleError = jest.fn();
global.console.error = mockConsoleError;

const mockProducts = [
  { 
    id: 1, 
    title: "Mock Product", 
    images: ["image1.jpg"], 
    price: 100, 
    category: { id: 1, name: "Electronics" }, 
    description: "A mock product"
  },
  { 
    id: 2, 
    title: "Another Product", 
    images: ["image2.jpg"], 
    price: 200, 
    category: { id: 2, name: "Clothing" }, 
    description: "Another mock product"
  }
];

const mockCategories = [
  { id: 1, name: "Electronics", image: "cat1.jpg" },
  { id: 2, name: "Clothing", image: "cat2.jpg" }
];

describe("AdminDashboard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockClear();
    mockConfirm.mockClear();
    mockAlert.mockClear();
    mockPush.mockClear();
    mockConsoleError.mockClear();
  });

  describe("Authentication States", () => {
    it("shows loading spinner when status is loading", () => {
      mockUseSession.mockReturnValue({ status: "loading" });
      render(<AdminDashboard />);
      
      expect(screen.getByRole('status') || document.querySelector('.animate-spin')).toBeInTheDocument();
    });

    it("redirects to login if unauthenticated", async () => {
      mockUseSession.mockReturnValue({ status: "unauthenticated" });
      render(<AdminDashboard />);
      
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/login');
      });
    });

    it("shows unauthorized if authenticated but not admin", () => {
      mockUseSession.mockReturnValue({ 
        status: "authenticated", 
        data: { user: { name: "User", role: "user" } } 
      });
      render(<AdminDashboard />);
      
      expect(screen.getByText(/access denied/i)).toBeInTheDocument();
      expect(screen.getByText(/return to home/i)).toBeInTheDocument();
    });
  });

  describe("Admin Dashboard - Main Functionality", () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({ 
        status: "authenticated", 
        data: { user: { name: "Admin", role: "admin" } } 
      });
    });

    it("renders dashboard for authenticated admin", async () => {
      mockFetch
        .mockResolvedValueOnce({ ok: true, json: async () => mockProducts })
        .mockResolvedValueOnce({ ok: true, json: async () => mockCategories });

      render(<AdminDashboard />);
      
      await waitFor(() => {
        expect(screen.getByTestId("sidebar")).toBeInTheDocument();
      });
      
      expect(screen.getByText(/product management/i)).toBeInTheDocument();
      expect(screen.getByText(/add new product/i)).toBeInTheDocument();
      expect(screen.getByTestId("product-table")).toBeInTheDocument();
      
      await waitFor(() => {
        expect(screen.getByText("Mock Product")).toBeInTheDocument();
      });
    });

    it("handles API fetch errors gracefully", async () => {
      mockFetch
        .mockRejectedValueOnce(new Error("Products fetch failed"))
        .mockResolvedValueOnce({ ok: true, json: async () => mockCategories });

      render(<AdminDashboard />);
      
      await waitFor(() => {
        expect(mockConsoleError).toHaveBeenCalledWith('Error fetching products:', expect.any(Error));
      });
    });

    it("handles empty products list", async () => {
      mockFetch
        .mockResolvedValueOnce({ ok: true, json: async () => [] })
        .mockResolvedValueOnce({ ok: true, json: async () => mockCategories });

      render(<AdminDashboard />);
      
      await waitFor(() => {
        expect(screen.getByTestId("no-products")).toBeInTheDocument();
      });
    });
  });

  describe("Product Form Operations", () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({ 
        status: "authenticated", 
        data: { user: { name: "Admin", role: "admin" } } 
      });
      mockFetch
        .mockResolvedValueOnce({ ok: true, json: async () => mockProducts })
        .mockResolvedValueOnce({ ok: true, json: async () => mockCategories });
    });

    it("opens product form on 'Add New Product' click", async () => {
      render(<AdminDashboard />);
      
      await waitFor(() => screen.getByTestId("product-table"));
      
      fireEvent.click(screen.getByText(/add new product/i));
      expect(screen.getByTestId("product-form")).toBeInTheDocument();
    });

    it("handles form input changes", async () => {
      render(<AdminDashboard />);
      
      await waitFor(() => screen.getByTestId("product-table"));
      
      fireEvent.click(screen.getByText(/add new product/i));
      
      // Test title change
      const titleInput = screen.getByTestId("title-input");
      fireEvent.change(titleInput, { target: { value: "New Product" } });
      expect(titleInput).toHaveValue("New Product");
      
      // Test price change
      const priceInput = screen.getByTestId("price-input");
      fireEvent.change(priceInput, { target: { value: "150" } });
      expect(priceInput).toHaveValue("150");
      
      // Test category change
      const categorySelect = screen.getByTestId("category-select");
      fireEvent.change(categorySelect, { target: { value: "1" } });
      expect(categorySelect).toHaveValue("1");
      
      // Test description change
      const descriptionInput = screen.getByTestId("description-input");
      fireEvent.change(descriptionInput, { target: { value: "Product description" } });
      expect(descriptionInput).toHaveValue("Product description");
    });

    it("handles product creation successfully", async () => {
      const newProduct = { id: 3, title: "New Product-123", price: 150 };
      
      mockFetch
        .mockResolvedValueOnce({ ok: true, json: async () => mockProducts })
        .mockResolvedValueOnce({ ok: true, json: async () => mockCategories })
        .mockResolvedValueOnce({ ok: true, json: async () => newProduct })
        .mockResolvedValueOnce({ ok: true, json: async () => newProduct });

      render(<AdminDashboard />);
      
      await waitFor(() => screen.getByTestId("product-table"));
      
      // Open form
      fireEvent.click(screen.getByText(/add new product/i));
      
      // Fill form
      fireEvent.change(screen.getByTestId("title-input"), { 
        target: { value: "New Product" } 
      });
      fireEvent.change(screen.getByTestId("price-input"), { 
        target: { value: "150" } 
      });
      fireEvent.change(screen.getByTestId("category-select"), { 
        target: { value: "1" } 
      });
      fireEvent.change(screen.getByTestId("description-input"), { 
        target: { value: "Description" } 
      });
      
      // Submit form
      fireEvent.click(screen.getByTestId("submit-button"));
      
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          'https://api.escuelajs.co/api/v1/products/',
          expect.objectContaining({
            method: "POST",
            headers: { "Content-Type": "application/json" }
          })
        );
      });
    });

    it("handles invalid price input", async () => {
      render(<AdminDashboard />);
      
      await waitFor(() => screen.getByTestId("product-table"));
      
      fireEvent.click(screen.getByText(/add new product/i));
      
      // Fill form with invalid price
      fireEvent.change(screen.getByTestId("title-input"), { 
        target: { value: "New Product" } 
      });
      fireEvent.change(screen.getByTestId("price-input"), { 
        target: { value: "-10" } 
      });
      fireEvent.change(screen.getByTestId("category-select"), { 
        target: { value: "1" } 
      });
      
      fireEvent.click(screen.getByTestId("submit-button"));
      
      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith('Please enter a valid price greater than 0');
      });
    });

    it("handles invalid category input", async () => {
      render(<AdminDashboard />);
      
      await waitFor(() => screen.getByTestId("product-table"));
      
      fireEvent.click(screen.getByText(/add new product/i));
      
      // Fill form with invalid category
      fireEvent.change(screen.getByTestId("title-input"), { 
        target: { value: "New Product" } 
      });
      fireEvent.change(screen.getByTestId("price-input"), { 
        target: { value: "100" } 
      });
      fireEvent.change(screen.getByTestId("category-select"), { 
        target: { value: "10" } 
      });
      
      fireEvent.click(screen.getByTestId("submit-button"));
      
      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith('Please select a valid category (1-5)');
      });
    });

    it("cancels product form", async () => {
      render(<AdminDashboard />);
      
      await waitFor(() => screen.getByTestId("product-table"));
      
      fireEvent.click(screen.getByText(/add new product/i));
      expect(screen.getByTestId("product-form")).toBeInTheDocument();
      
      fireEvent.click(screen.getByTestId("cancel-button"));
      expect(screen.queryByTestId("product-form")).not.toBeInTheDocument();
    });
  });

  describe("Product Edit Operations", () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({ 
        status: "authenticated", 
        data: { user: { name: "Admin", role: "admin" } } 
      });
      mockFetch
        .mockResolvedValueOnce({ ok: true, json: async () => mockProducts })
        .mockResolvedValueOnce({ ok: true, json: async () => mockCategories });
    });

    it("opens edit form with product data", async () => {
      render(<AdminDashboard />);
      
      await waitFor(() => screen.getByText("Mock Product"));
      
      fireEvent.click(screen.getByTestId("edit-button-1"));
      
      expect(screen.getByTestId("product-form")).toBeInTheDocument();
      expect(screen.getByTestId("title-input")).toHaveValue("Mock Product");
      expect(screen.getByTestId("price-input")).toHaveValue("100");
    });

    it("updates product successfully", async () => {
      const updatedProduct = { ...mockProducts[0], title: "Updated Product" };
      
      mockFetch
        .mockResolvedValueOnce({ ok: true, json: async () => mockProducts })
        .mockResolvedValueOnce({ ok: true, json: async () => mockCategories })
        .mockResolvedValueOnce({ ok: true, json: async () => updatedProduct });

      render(<AdminDashboard />);
      
      await waitFor(() => screen.getByText("Mock Product"));
      
      fireEvent.click(screen.getByTestId("edit-button-1"));
      
      fireEvent.change(screen.getByTestId("title-input"), { 
        target: { value: "Updated Product" } 
      });
      
      fireEvent.click(screen.getByTestId("submit-button"));
      
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          'https://api.escuelajs.co/api/v1/products/1',
          expect.objectContaining({
            method: "PUT",
            headers: { "Content-Type": "application/json" }
          })
        );
      });
    });
  });

  describe("Product Delete Operations", () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({ 
        status: "authenticated", 
        data: { user: { name: "Admin", role: "admin" } } 
      });
      mockFetch
        .mockResolvedValueOnce({ ok: true, json: async () => mockProducts })
        .mockResolvedValueOnce({ ok: true, json: async () => mockCategories });
    });

    it("cancels delete when user clicks cancel", async () => {
      mockConfirm.mockReturnValueOnce(false);
      
      render(<AdminDashboard />);
      
      await waitFor(() => screen.getByText("Mock Product"));
      
      fireEvent.click(screen.getByTestId("delete-button-1"));
      
      expect(mockConfirm).toHaveBeenCalledWith("Are you sure you want to delete this product?");
      expect(screen.getByText("Mock Product")).toBeInTheDocument();
    });

    it("deletes product when user confirms", async () => {
      mockConfirm.mockReturnValueOnce(true);
      mockFetch
        .mockResolvedValueOnce({ ok: true, json: async () => mockProducts })
        .mockResolvedValueOnce({ ok: true, json: async () => mockCategories })
        .mockResolvedValueOnce({ ok: true });
      
      render(<AdminDashboard />);
      
      await waitFor(() => screen.getByText("Mock Product"));
      
      fireEvent.click(screen.getByTestId("delete-button-1"));
      
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          'https://api.escuelajs.co/api/v1/products/1',
          { method: "DELETE" }
        );
      });
    });

    it("handles delete error", async () => {
      mockConfirm.mockReturnValueOnce(true);
      mockFetch
        .mockResolvedValueOnce({ ok: true, json: async () => mockProducts })
        .mockResolvedValueOnce({ ok: true, json: async () => mockCategories })
        .mockRejectedValueOnce(new Error("Delete failed"));
      
      render(<AdminDashboard />);
      
      await waitFor(() => screen.getByText("Mock Product"));
      
      fireEvent.click(screen.getByTestId("delete-button-1"));
      
      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith("Error deleting product. Please try again.");
      });
    });
  });

  describe("Search Functionality", () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({ 
        status: "authenticated", 
        data: { user: { name: "Admin", role: "admin" } } 
      });
      mockFetch
        .mockResolvedValueOnce({ ok: true, json: async () => mockProducts })
        .mockResolvedValueOnce({ ok: true, json: async () => mockCategories });
    });

    it("filters products by search term", async () => {
      render(<AdminDashboard />);
      
      await waitFor(() => screen.getByText("Mock Product"));
      
      const searchInput = screen.getByPlaceholderText(/search products/i);
      fireEvent.change(searchInput, { target: { value: "Mock" } });
      
      expect(screen.getByText("Mock Product")).toBeInTheDocument();
      expect(screen.queryByText("Another Product")).not.toBeInTheDocument();
    });

    it("shows all products when search is cleared", async () => {
      render(<AdminDashboard />);
      
      await waitFor(() => screen.getByText("Mock Product"));
      
      const searchInput = screen.getByPlaceholderText(/search products/i);
      
      // Search
      fireEvent.change(searchInput, { target: { value: "Mock" } });
      expect(screen.queryByText("Another Product")).not.toBeInTheDocument();
      
      // Clear search
      fireEvent.change(searchInput, { target: { value: "" } });
      
      await waitFor(() => {
        expect(screen.getByText("Mock Product")).toBeInTheDocument();
        expect(screen.getByText("Another Product")).toBeInTheDocument();
      });
    });

    it("shows no results when search has no matches", async () => {
      render(<AdminDashboard />);
      
      await waitFor(() => screen.getByText("Mock Product"));
      
      const searchInput = screen.getByPlaceholderText(/search products/i);
      fireEvent.change(searchInput, { target: { value: "NonExistent" } });
      
      expect(screen.getByTestId("no-products")).toBeInTheDocument();
    });
  });

  describe("Image Change Handler", () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({ 
        status: "authenticated", 
        data: { user: { name: "Admin", role: "admin" } } 
      });
      mockFetch
        .mockResolvedValueOnce({ ok: true, json: async () => mockProducts })
        .mockResolvedValueOnce({ ok: true, json: async () => mockCategories });
    });

    it("handles image URL changes", async () => {
      render(<AdminDashboard />);
      
      await waitFor(() => screen.getByTestId("product-table"));
      
      fireEvent.click(screen.getByText(/add new product/i));
      
      const imageInput = screen.getByTestId("image-input");
      fireEvent.change(imageInput, { target: { value: "https://example.com/image.jpg" } });
      
      expect(imageInput).toHaveValue("https://example.com/image.jpg");
    });
  });

  describe("Error Handling", () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({ 
        status: "authenticated", 
        data: { user: { name: "Admin", role: "admin" } } 
      });
    });

    it("handles product creation API error", async () => {
      mockFetch
        .mockResolvedValueOnce({ ok: true, json: async () => mockProducts })
        .mockResolvedValueOnce({ ok: true, json: async () => mockCategories })
        .mockResolvedValueOnce({ ok: false, json: async () => ({ message: "Creation failed" }) });

      render(<AdminDashboard />);
      
      await waitFor(() => screen.getByTestId("product-table"));
      
      fireEvent.click(screen.getByText(/add new product/i));
      
      fireEvent.change(screen.getByTestId("title-input"), { 
        target: { value: "New Product" } 
      });
      fireEvent.change(screen.getByTestId("price-input"), { 
        target: { value: "100" } 
      });
      fireEvent.change(screen.getByTestId("category-select"), { 
        target: { value: "1" } 
      });
      
      fireEvent.click(screen.getByTestId("submit-button"));
      
      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith("Failed to create product: Creation failed");
      });
    });

    it("handles product update API error", async () => {
      mockFetch
        .mockResolvedValueOnce({ ok: true, json: async () => mockProducts })
        .mockResolvedValueOnce({ ok: true, json: async () => mockCategories })
        .mockResolvedValueOnce({ ok: false, json: async () => ({ message: "Update failed" }) });

      render(<AdminDashboard />);
      
      await waitFor(() => screen.getByText("Mock Product"));
      
      fireEvent.click(screen.getByTestId("edit-button-1"));
      fireEvent.click(screen.getByTestId("submit-button"));
      
      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith("Failed to update product. Please try again.");
      });
    });
  });
});