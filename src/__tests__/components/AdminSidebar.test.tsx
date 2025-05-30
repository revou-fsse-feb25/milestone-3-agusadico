import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AdminSidebar from "../../components/AdminSidebar";

// Mock next/image, next/link, next-auth
jest.mock("next/image", () => (props: any) => <img alt={props.alt} {...props} />);
jest.mock("next/link", () => ({ children, ...props }: any) => <a {...props}>{children}</a>);

// Mock signOut from next-auth/react
const signOutMock = jest.fn();
jest.mock("next-auth/react", () => ({
  signOut: () => signOutMock()
}));

describe("AdminSidebar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders logo, title, and username", () => {
    render(<AdminSidebar userName="Agus" />);
    expect(screen.getByAltText("Logo")).toBeInTheDocument();
    expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
    expect(screen.getByText(/Welcome, Agus/)).toBeInTheDocument();
  });

  it("renders all sidebar links", () => {
    render(<AdminSidebar userName="Admin" />);
    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(screen.getByText("Users")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("Back to Home")).toBeInTheDocument();
  });

  it("navigates to admin/products/settings/home via links", () => {
    render(<AdminSidebar />);
    expect(screen.getByText("Products").closest("a")).toHaveAttribute("href", "/admin");
    expect(screen.getByText("Back to Home").closest("a")).toHaveAttribute("href", "/");
  });

  it("calls signOut when Sign Out button is clicked", async () => {
    render(<AdminSidebar />);
    const signOutBtn = screen.getByText(/Sign Out/i);
    fireEvent.click(signOutBtn);
    // Wait microtick for dynamic import
    await Promise.resolve();
    expect(signOutMock).toHaveBeenCalled();
  });
});
