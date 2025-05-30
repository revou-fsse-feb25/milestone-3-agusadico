import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AdminProductTable from "../../components/AdminProductTable";
import { Product } from "../../types/type";

// Use only the required fields for your Product & Category type.
// If your Product type accepts id as string or number, string is safest for testing.
const products: Product[] = [
  {
    id: "1",
    title: "Shirt",
    images: ["http://img.com/shirt.jpg"],
    price: 50,
    category: { id: 1, name: "Clothing", slug: "clothing", image: "clothing.jpg" },
    sizes: [],
    discount: 0,
    oldPrice: 0,
    rating: 0,
    description: "A nice shirt",
    slug: "shirt",
    updatedAt: ""
  },
  {
    id: "2",
    title: "Shoes",
    images: ["http://img.com/shoes.jpg"],
    price: 120.5,
    category: { id: 2, name: "Shoes", slug: "shoes", image: "shoes.jpg" },
    sizes: [],
    discount: 0,
    oldPrice: 0,
    rating: 0,
    description: "Cool shoes",
    slug: "shoes",
    updatedAt: ""
  }
];

describe("AdminProductTable", () => {
  let onEdit: jest.Mock, onDelete: jest.Mock;

  beforeEach(() => {
    onEdit = jest.fn();
    onDelete = jest.fn();
  });

  it("renders all table headers", () => {
    render(
      <AdminProductTable products={products} searchQuery="" onEdit={onEdit} onDelete={onDelete} />
    );
    ["ID", "Title", "Category", "Price", "Actions"].forEach(header =>
      expect(screen.getByText(header)).toBeInTheDocument()
    );
  });

  it("renders product details", () => {
    render(
      <AdminProductTable products={products} searchQuery="" onEdit={onEdit} onDelete={onDelete} />
    );
    expect(screen.getByText("Shirt")).toBeInTheDocument();
    expect(screen.getByText("Shoes")).toBeInTheDocument();
    // Use regex for currency (avoids locale/currency issues)
    expect(screen.getByText(/\$50(\.00)?/)).toBeInTheDocument();
    expect(screen.getByText(/\$120\.50/)).toBeInTheDocument();
    // If there are multiple products with same title, getAllByAltText returns array
    expect(screen.getByAltText("Shirt")).toHaveAttribute("src", "http://img.com/shirt.jpg");
    expect(screen.getByAltText("Shoes")).toHaveAttribute("src", "http://img.com/shoes.jpg");
    expect(screen.getAllByText("Clothing")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Shoes")[0]).toBeInTheDocument();
  });

  it("calls onEdit when Edit button clicked", () => {
    render(
      <AdminProductTable products={products} searchQuery="" onEdit={onEdit} onDelete={onDelete} />
    );
    // "Edit" button label can appear multiple times, getAllByRole is more robust
    const editButtons = screen.getAllByRole("button", { name: /Edit/i });
    fireEvent.click(editButtons[0]);
    expect(onEdit).toHaveBeenCalledWith(products[0]);
  });

  it("calls onDelete when Delete button clicked", () => {
    render(
      <AdminProductTable products={products} searchQuery="" onEdit={onEdit} onDelete={onDelete} />
    );
    const deleteButtons = screen.getAllByRole("button", { name: /Delete/i });
    fireEvent.click(deleteButtons[1]);
    expect(onDelete).toHaveBeenCalledWith(products[1].id);
  });

  it("shows 'No products available.' when products is empty", () => {
    render(
      <AdminProductTable products={[]} searchQuery="" onEdit={onEdit} onDelete={onDelete} />
    );
    expect(screen.getByText(/No products available./i)).toBeInTheDocument();
  });

  it("shows 'No products found matching your search.' for no search match", () => {
    render(
      <AdminProductTable products={products} searchQuery="nonexistent" onEdit={onEdit} onDelete={onDelete} />
    );
    expect(screen.getByText(/No products found matching your search./i)).toBeInTheDocument();
  });

  it("filters products by search query", () => {
    render(
      <AdminProductTable products={products} searchQuery="shirt" onEdit={onEdit} onDelete={onDelete} />
    );
    expect(screen.getByText("Shirt")).toBeInTheDocument();
    expect(screen.queryByText("Shoes")).toBeNull();
  });

  it("shows pagination controls", () => {
    render(
      <AdminProductTable products={products} searchQuery="" onEdit={onEdit} onDelete={onDelete} />
    );
    expect(screen.getByText("Previous")).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText(/Showing/)).toBeInTheDocument();
  });
});
