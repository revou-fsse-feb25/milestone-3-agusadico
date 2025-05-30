import React from "react";
import { render, screen, waitFor } from "@testing-library/react";

// Mock dependencies
jest.mock("../components/Navbar", () => () => <nav data-testid="navbar" />);
jest.mock("../components/Footer", () => () => <footer data-testid="footer" />);
jest.mock("../components/ShopRow", () => ({ products, viewMode }: any) => (
  <div data-testid="shop-row">{viewMode} - {products.length} products</div>
));
jest.mock("next/image", () => (props: any) => <img alt={props.alt} {...props} />);

// Mock fetchProducts
const mockProducts = [
  { id: 1, title: "A", price: 100, images: ["/a.jpg"], category: {}, sizes: [], discount: 0, oldPrice: 0, rating: 0, description: '', slug: '', updatedAt: '' },
  { id: 2, title: "B", price: 200, images: ["/b.jpg"], category: {}, sizes: [], discount: 0, oldPrice: 0, rating: 0, description: '', slug: '', updatedAt: '' }
];

jest.mock("../services/shopServices", () => ({
  fetchProducts: jest.fn(),
}));

import Home from "../app/page";
import { fetchProducts } from "../services/shopServices";

describe("Home page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders hero section, navbar, footer, features, and shop row on success", async () => {
    (fetchProducts as jest.Mock).mockResolvedValue(mockProducts);

    // Need to await render for async server component
    render(<Home searchParams={{}} />);
    
    // Check hero/main section
    expect(await screen.findByRole("heading", { level: 1, name: /Anything You Want/i })).toBeInTheDocument();
    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
    expect(screen.getByText(/Featured Products/i)).toBeInTheDocument();

    // ShopRow
    expect(screen.getByTestId("shop-row")).toHaveTextContent("card - 2 products");

    // Features bar
    expect(screen.getByText("Free Shipping")).toBeInTheDocument();
    expect(screen.getByText("Support 24/7")).toBeInTheDocument();
  });

  it("renders ShopRow in list mode if view param is 'list'", async () => {
    (fetchProducts as jest.Mock).mockResolvedValue(mockProducts);
    render(<Home searchParams={{ view: "list" }} />);
    expect(await screen.findByTestId("shop-row")).toHaveTextContent("list - 2 products");
    expect(screen.getByText("List View")).toHaveClass("bg-yellow-400");
  });

  it("shows error if fetch fails", async () => {
    (fetchProducts as jest.Mock).mockRejectedValue(new Error("fail"));
    render(<Home searchParams={{}} />);
    expect(await screen.findByText("Failed to load products")).toBeInTheDocument();
  });
});
