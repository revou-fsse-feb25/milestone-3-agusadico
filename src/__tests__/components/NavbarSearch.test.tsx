import React from "react";
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import NavbarSearch from "../../components/NavbarSearch";

// Mock shopServices searchProductsByTitle
const mockSearch = jest.fn();
jest.mock("../../services/shopServices", () => ({
  searchProductsByTitle: (...args: any[]) => mockSearch(...args)
}));

// Mock debounce to be immediate for tests
jest.mock("../../hooks/useDebounce", () => ({
  useDebounce: (value: string) => value
}));

// Mock next/link
jest.mock("next/link", () => ({ children, href, ...props }: any) => (
  <a href={href} {...props}>{children}</a>
));

const productMock = {
  id: "1",
  title: "Test Product",
  images: ["https://example.com/p.jpg"],
  price: 123,
  oldPrice: 200
};

describe("NavbarSearch", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders input and button", () => {
    render(<NavbarSearch />);
    expect(screen.getByPlaceholderText(/search products/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
  });

  it("shows 'Product not found' on empty results after search", async () => {
    mockSearch.mockResolvedValue([]);
    render(<NavbarSearch />);
    const input = screen.getByPlaceholderText(/search products/i);

    fireEvent.change(input, { target: { value: "Nonexistent" } });
    // Wait for effect
    await waitFor(() => expect(screen.getByText(/product not found/i)).toBeInTheDocument());
  });

  it("renders search results if found", async () => {
    mockSearch.mockResolvedValue([productMock]);
    render(<NavbarSearch />);
    const input = screen.getByPlaceholderText(/search products/i);

    fireEvent.change(input, { target: { value: "Test" } });

    await waitFor(() => expect(screen.getByText("Test Product")).toBeInTheDocument());
    expect(screen.getByText("$123")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("src", "https://example.com/p.jpg");
    expect(screen.getByRole("link")).toHaveAttribute("href", "/1");
  });

  it("shows 'Typing...' button label when typing", () => {
    jest.useFakeTimers();
    render(<NavbarSearch />);
    const input = screen.getByPlaceholderText(/search products/i);
    fireEvent.change(input, { target: { value: "abc" } });
    expect(screen.getByRole("button")).toHaveTextContent(/typing/i);
    act(() => { jest.runAllTimers(); });
    jest.useRealTimers();
  });

  it("shows 'Searching...' when search is running", async () => {
    let searchPromise: Promise<any>;
    mockSearch.mockImplementation(() => {
      searchPromise = new Promise(res => setTimeout(() => res([productMock]), 200));
      return searchPromise;
    });
    render(<NavbarSearch />);
    const input = screen.getByPlaceholderText(/search products/i);

    fireEvent.change(input, { target: { value: "Test" } });

    await waitFor(() => expect(screen.getByRole("button")).toHaveTextContent(/searching/i));
    // Clean up timer
    await act(async () => {
      await searchPromise;
    });
  });

  it("disables button when searching or typing", () => {
    render(<NavbarSearch />);
    const input = screen.getByPlaceholderText(/search products/i);
    fireEvent.change(input, { target: { value: "hello" } });
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("resets results when input cleared", async () => {
    mockSearch.mockResolvedValue([productMock]);
    render(<NavbarSearch />);
    const input = screen.getByPlaceholderText(/search products/i);

    // Type, get results
    fireEvent.change(input, { target: { value: "Test" } });
    await waitFor(() => expect(screen.getByText("Test Product")).toBeInTheDocument());

    // Clear input
    fireEvent.change(input, { target: { value: "" } });
    expect(screen.queryByText("Test Product")).not.toBeInTheDocument();
    expect(screen.queryByText(/product not found/i)).not.toBeInTheDocument();
  });
});
