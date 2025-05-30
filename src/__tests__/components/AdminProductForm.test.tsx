import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AdminProductForm from "../../components/AdminProductForm";

const mockCategories = [
  { id: 1, name: "Clothing", image: "" },
  { id: 2, name: "Shoes", image: "" }
];

const mockForm = {
  title: "",
  price: "",
  category: "",
  images: [],
  description: ""
};

const filledForm = {
  title: "Jacket",
  price: "129.99",
  category: "1",
  images: ["http://img.com/jacket.jpg"],
  description: "A nice jacket"
};

describe("AdminProductForm", () => {
  let props: any;

  beforeEach(() => {
    props = {
      form: { ...mockForm },
      categories: mockCategories,
      editingId: null,
      loading: false,
      onSubmit: jest.fn((e) => { e.preventDefault(); return Promise.resolve(); }),
      onChange: jest.fn(),
      onCancel: jest.fn(),
      onImageChange: jest.fn()
    };
  });

  it("renders add mode correctly", () => {
    render(<AdminProductForm {...props} />);
    expect(screen.getByText(/Add New Product/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Add Product/i })).toBeInTheDocument();
  });

  it("renders edit mode correctly", () => {
    props.editingId = "123";
    render(<AdminProductForm {...props} />);
    expect(screen.getByText(/Edit Product/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Update Product/i })).toBeInTheDocument();
  });

  it("renders all form fields", () => {
    render(<AdminProductForm {...props} />);
    expect(screen.getByPlaceholderText(/Title/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Price/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Image URL/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Description/i)).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("renders category options", () => {
    render(<AdminProductForm {...props} />);
    const select = screen.getByRole("combobox");
    expect(select.children.length).toBe(1 + mockCategories.length); // default + categories
    expect(screen.getByText("Clothing")).toBeInTheDocument();
    expect(screen.getByText("Shoes")).toBeInTheDocument();
  });

  it("calls onChange when input changes", () => {
    render(<AdminProductForm {...props} />);
    const titleInput = screen.getByPlaceholderText(/Title/i);
    fireEvent.change(titleInput, { target: { value: "T-shirt" } });
    expect(props.onChange).toHaveBeenCalled();
  });

  it("calls onImageChange when image url changes", () => {
    render(<AdminProductForm {...props} />);
    const imageInput = screen.getByPlaceholderText(/Image URL/i);
    fireEvent.change(imageInput, { target: { value: "http://img.com/shirt.jpg" } });
    expect(props.onImageChange).toHaveBeenCalledWith("http://img.com/shirt.jpg");
  });

  it("calls onSubmit when form is submitted", () => {
    render(<AdminProductForm {...props} />);
    const form = screen.getByRole("form") || screen.getByTestId("form");
    fireEvent.submit(form);
    expect(props.onSubmit).toHaveBeenCalled();
  });

  it("calls onCancel when cancel button clicked", () => {
    render(<AdminProductForm {...props} />);
    const cancelBtn = screen.getByRole("button", { name: /Cancel/i });
    fireEvent.click(cancelBtn);
    expect(props.onCancel).toHaveBeenCalled();
  });

  it("disables buttons and shows processing when loading", () => {
    props.loading = true;
    props.form = { ...filledForm };
    render(<AdminProductForm {...props} />);
    const submitBtn = screen.getByRole("button", { name: /Processing... Product/i });
    const cancelBtn = screen.getByRole("button", { name: /Cancel/i });
    expect(submitBtn).toBeDisabled();
    expect(cancelBtn).toBeDisabled();
  });
});
