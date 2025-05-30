import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ProductPriceQuantityClient from "../../components/ProductPriceQuantityClient";

// Mock AddToCartButton - fix the import path
jest.mock("../../components/AddToCartButton", () => ({ product, quantity }: any) => (
  <button data-testid="add-to-cart" data-product={product.id} data-quantity={quantity}>
    Add To Cart
  </button>
));

const mockProduct = {
  id: "1",
  title: "Test Product",
  images: ["img.jpg"],
  price: 100,
  category: { id: 1, name: "Clothing", slug: "clothing", image: "clothing.jpg" },
  sizes: [],
  discount: 0,
  oldPrice: 0,
  rating: 0,
  description: "Test product description",
  slug: "test-product",
  updatedAt: new Date().toISOString()
};

describe("ProductPriceQuantityClient", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders initial price and quantity", () => {
    render(<ProductPriceQuantityClient product={mockProduct} />);
    
    expect(screen.getByText("$100.00")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("+")).toBeInTheDocument();
    expect(screen.getByText("-")).toBeInTheDocument();
    expect(screen.getByTestId("add-to-cart")).toBeInTheDocument();
  });

  it("increases quantity when plus button is clicked", () => {
    render(<ProductPriceQuantityClient product={mockProduct} />);
    
    const plusButton = screen.getByText("+");
    fireEvent.click(plusButton);
    
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("$200.00")).toBeInTheDocument();
    expect(screen.getByTestId("add-to-cart").getAttribute("data-quantity")).toBe("2");
  });

  it("decreases quantity when minus button is clicked", () => {
    render(<ProductPriceQuantityClient product={mockProduct} />);
    
    const plusButton = screen.getByText("+");
    const minusButton = screen.getByText("-");
    
    // First increase to 3
    fireEvent.click(plusButton);
    fireEvent.click(plusButton);
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("$300.00")).toBeInTheDocument();
    
    // Then decrease to 2
    fireEvent.click(minusButton);
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("$200.00")).toBeInTheDocument();
  });

  it("does not decrease quantity below 1", () => {
    render(<ProductPriceQuantityClient product={mockProduct} />);
    
    const minusButton = screen.getByText("-");
    
    // Try to decrease below 1
    fireEvent.click(minusButton);
    fireEvent.click(minusButton);
    fireEvent.click(minusButton);
    
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("$100.00")).toBeInTheDocument();
  });

  it("updates total price correctly based on quantity", () => {
    render(<ProductPriceQuantityClient product={mockProduct} />);
    
    const plusButton = screen.getByText("+");
    
    // Test multiple quantity increases
    fireEvent.click(plusButton); // qty = 2
    expect(screen.getByText("$200.00")).toBeInTheDocument();
    
    fireEvent.click(plusButton); // qty = 3
    expect(screen.getByText("$300.00")).toBeInTheDocument();
    
    fireEvent.click(plusButton); // qty = 4
    expect(screen.getByText("$400.00")).toBeInTheDocument();
  });

  it("passes correct product and updated quantity to AddToCartButton", () => {
    render(<ProductPriceQuantityClient product={mockProduct} />);
    
    const plusButton = screen.getByText("+");
    fireEvent.click(plusButton);
    fireEvent.click(plusButton); // quantity = 3
    
    const addToCartButton = screen.getByTestId("add-to-cart");
    expect(addToCartButton.getAttribute("data-product")).toBe("1");
    expect(addToCartButton.getAttribute("data-quantity")).toBe("3");
  });

  it("handles different product prices", () => {
    const expensiveProduct = { ...mockProduct, price: 250 };
    render(<ProductPriceQuantityClient product={expensiveProduct} />);
    
    expect(screen.getByText("$250.00")).toBeInTheDocument();
    
    const plusButton = screen.getByText("+");
    fireEvent.click(plusButton);
    
    expect(screen.getByText("$500.00")).toBeInTheDocument();
  });

  it("applies correct CSS classes to buttons", () => {
    render(<ProductPriceQuantityClient product={mockProduct} />);
    
    const plusButton = screen.getByText("+");
    const minusButton = screen.getByText("-");
    
    expect(plusButton).toHaveClass("px-3", "py-1", "rounded-full", "border", "border-yellow-500");
    expect(minusButton).toHaveClass("px-3", "py-1", "rounded-full", "border", "border-yellow-500");
  });
});