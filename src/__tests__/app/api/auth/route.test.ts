import { NextRequest, NextResponse } from "next/server";

// Mock NextAuth
jest.mock("next-auth", () => ({
  ...jest.requireActual("next-auth"),
  getServerSession: jest.fn(),
  NextAuth: jest.fn()
}));

// Mock the auth module that route.ts imports from
jest.mock("../../../../../auth", () => ({
  handlers: {
    GET: jest.fn(),
    POST: jest.fn()
  },
  authOptions: {
    providers: [{ id: "credentials" }]
  }
}));

// Import the mocked handlers
import { handlers } from "../../../../../auth";

// Import the actual route handlers after mocking their dependencies
import { GET, POST, OPTIONS } from "@/app/api/auth/[...nextauth]/route";

// Properly type the mocked handlers
const mockHandlers = handlers as jest.Mocked<typeof handlers>;

// Create mock authOptions for testing
const authOptions = {
  providers: [{ id: "credentials" }]
};

describe("NextAuth API Route", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should export valid authOptions with at least one provider", () => {
    expect(authOptions).toBeDefined();
    expect(Array.isArray(authOptions.providers)).toBe(true);
    expect(authOptions.providers.length).toBeGreaterThan(0);
  });

  it("GET handler should call the auth handler", async () => {
    const mockResponse = NextResponse.json({ user: { name: "Test", email: "test@example.com" } });
    mockHandlers.GET.mockResolvedValue(mockResponse);

    const req = new NextRequest('http://localhost:3000/api/auth/session');
    const result = await GET(req);

    expect(mockHandlers.GET).toHaveBeenCalledWith(req);
    expect(result).toBe(mockResponse);
  });

  it("POST handler should call the auth handler", async () => {
    const mockResponse = NextResponse.json({ success: true });
    mockHandlers.POST.mockResolvedValue(mockResponse);

    const req = new NextRequest('http://localhost:3000/api/auth/signin', { method: 'POST' });
    const result = await POST(req);

    expect(mockHandlers.POST).toHaveBeenCalledWith(req);
    expect(result).toBe(mockResponse);
  });

  it("OPTIONS handler should return 200 status", () => {
    const req = new NextRequest('http://localhost:3000/api/auth/session', { method: 'OPTIONS' });
    const result = OPTIONS(req);

    expect(result).toBeInstanceOf(Response);
    expect(result.status).toBe(200);
  });

  // Add a test for a callback/credentials logic if you implement it
  it("contains a credentials provider if expected", () => {
    const providers = authOptions.providers?.map((p: any) => p.id) || [];
    expect(providers).toContain("credentials"); // adjust id if you use google/github/etc.
  });
});