import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import QuantitySelector from "../../components/QuantitySelector";

describe("QuantitySelector", () => {
  it("renders initial quantity of 1", () => {
    render(<QuantitySelector />);
    
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("+")).toBeInTheDocument();
    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("increases quantity when plus button is clicked", () => {
    render(<QuantitySelector />);
    
    const plusButton = screen.getByText("+");
    fireEvent.click(plusButton);
    
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("increases quantity multiple times", () => {
    render(<QuantitySelector />);
    
    const plusButton = screen.getByText("+");
    
    fireEvent.click(plusButton); // qty = 2
    expect(screen.getByText("2")).toBeInTheDocument();
    
    fireEvent.click(plusButton); // qty = 3
    expect(screen.getByText("3")).toBeInTheDocument();
    
    fireEvent.click(plusButton); // qty = 4
    expect(screen.getByText("4")).toBeInTheDocument();
  });

  it("decreases quantity when minus button is clicked", () => {
    render(<QuantitySelector />);
    
    const plusButton = screen.getByText("+");
    const minusButton = screen.getByText("-");
    
    // First increase to 3
    fireEvent.click(plusButton);
    fireEvent.click(plusButton);
    expect(screen.getByText("3")).toBeInTheDocument();
    
    // Then decrease to 2
    fireEvent.click(minusButton);
    expect(screen.getByText("2")).toBeInTheDocument();
    
    // Then decrease to 1
    fireEvent.click(minusButton);
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("does not decrease quantity below 1", () => {
    render(<QuantitySelector />);
    
    const minusButton = screen.getByText("-");
    
    // Try to decrease multiple times from initial value of 1
    fireEvent.click(minusButton);
    expect(screen.getByText("1")).toBeInTheDocument();
    
    fireEvent.click(minusButton);
    expect(screen.getByText("1")).toBeInTheDocument();
    
    fireEvent.click(minusButton);
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("handles mixed increase and decrease operations", () => {
    render(<QuantitySelector />);
    
    const plusButton = screen.getByText("+");
    const minusButton = screen.getByText("-");
    
    // Start at 1, increase to 5
    fireEvent.click(plusButton); // 2
    fireEvent.click(plusButton); // 3
    fireEvent.click(plusButton); // 4
    fireEvent.click(plusButton); // 5
    expect(screen.getByText("5")).toBeInTheDocument();
    
    // Decrease to 3
    fireEvent.click(minusButton); // 4
    fireEvent.click(minusButton); // 3
    expect(screen.getByText("3")).toBeInTheDocument();
    
    // Increase to 4
    fireEvent.click(plusButton); // 4
    expect(screen.getByText("4")).toBeInTheDocument();
    
    // Decrease to 1
    fireEvent.click(minusButton); // 3
    fireEvent.click(minusButton); // 2
    fireEvent.click(minusButton); // 1
    expect(screen.getByText("1")).toBeInTheDocument();
    
    // Try to go below 1
    fireEvent.click(minusButton);
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("applies correct CSS classes to container", () => {
    render(<QuantitySelector />);
    
    const container = screen.getByText("1").parentElement;
    expect(container).toHaveClass("flex", "items-center", "gap-2");
  });

  it("applies correct CSS classes to buttons", () => {
    render(<QuantitySelector />);
    
    const plusButton = screen.getByText("+");
    const minusButton = screen.getByText("-");
    
    expect(plusButton).toHaveClass("w-8", "h-8", "rounded", "border", "text-lg");
    expect(minusButton).toHaveClass("w-8", "h-8", "rounded", "border", "text-lg");
  });

  it("applies correct CSS classes to quantity display", () => {
    render(<QuantitySelector />);
    
    const quantityDisplay = screen.getByText("1");
    expect(quantityDisplay).toHaveClass("font-semibold");
  });

  it("maintains state independence across multiple instances", () => {
    const { rerender } = render(<QuantitySelector />);
    
    const plusButton = screen.getByText("+");
    fireEvent.click(plusButton);
    fireEvent.click(plusButton);
    expect(screen.getByText("3")).toBeInTheDocument();
    
    // Rerender should reset to initial state
    rerender(<QuantitySelector />);
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("handles rapid clicking correctly", () => {
    render(<QuantitySelector />);
    
    const plusButton = screen.getByText("+");
    const minusButton = screen.getByText("-");
    
    // Rapid increases
    for (let i = 0; i < 10; i++) {
      fireEvent.click(plusButton);
    }
    expect(screen.getByText("11")).toBeInTheDocument();
    
    // Rapid decreases
    for (let i = 0; i < 5; i++) {
      fireEvent.click(minusButton);
    }
    expect(screen.getByText("6")).toBeInTheDocument();
    
    // Try to go below 1 with rapid clicks
    for (let i = 0; i < 10; i++) {
      fireEvent.click(minusButton);
    }
    expect(screen.getByText("1")).toBeInTheDocument();
  });
});