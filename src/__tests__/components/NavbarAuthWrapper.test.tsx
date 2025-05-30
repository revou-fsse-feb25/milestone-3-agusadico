import React from "react";
import { render, screen } from "@testing-library/react";
import NavbarAuthWrapper from "../../components/NavbarAuthWrapper";

// Mock NavbarAuthClient first
jest.mock("../../components/NavbarAuthClient", () => {
  return function MockNavbarAuthClient() {
    return <nav data-testid="auth-navbar">AuthNavbarMock</nav>;
  };
});

// Mock next/dynamic to return the component directly
jest.mock("next/dynamic", () => {
  return function mockDynamic(importFunc: () => Promise<any>) {
    // Return a component that renders the imported component synchronously
    return function DynamicComponent(props: any) {
      const Component = require("../../components/NavbarAuthClient").default;
      return <Component {...props} />;
    };
  };
});

describe("NavbarAuthWrapper", () => {
  it("renders NavbarAuthClient via dynamic import", () => {
    render(<NavbarAuthWrapper />);
    expect(screen.getByTestId("auth-navbar")).toBeInTheDocument();
    expect(screen.getByText("AuthNavbarMock")).toBeInTheDocument();
  });

  it("exports default function", () => {
    // This test ensures the default export is covered
    expect(typeof NavbarAuthWrapper).toBe("function");
  });
});