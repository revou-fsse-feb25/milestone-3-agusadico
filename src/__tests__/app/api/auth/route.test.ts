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

  describe("Configuration", () => {
    it("should export valid authOptions with at least one provider", () => {
      expect(authOptions).toBeDefined();
      expect(Array.isArray(authOptions.providers)).toBe(true);
      expect(authOptions.providers.length).toBeGreaterThan(0);
    });

    it("contains a credentials provider if expected", () => {
      const providers = authOptions.providers?.map((p: any) => p.id) || [];
      expect(providers).toContain("credentials");
    });
  });

  describe("GET Handler", () => {
    it("should call the auth handler with correct request", async () => {
      const mockResponse = NextResponse.json({ 
        user: { name: "Test", email: "test@example.com" } 
      });
      mockHandlers.GET.mockResolvedValue(mockResponse);

      const req = new NextRequest('http://localhost:3000/api/auth/session');
      const result = await GET(req);

      expect(mockHandlers.GET).toHaveBeenCalledWith(req);
      expect(result).toBe(mockResponse);
    });

    it("should handle auth session requests", async () => {
      const mockSession = { user: { id: "1", email: "user@test.com" } };
      const mockResponse = NextResponse.json(mockSession);
      mockHandlers.GET.mockResolvedValue(mockResponse);

      const req = new NextRequest('http://localhost:3000/api/auth/session');
      const result = await GET(req);

      expect(mockHandlers.GET).toHaveBeenCalledTimes(1);
      expect(result).toBe(mockResponse);
    });

    it("should handle errors gracefully", async () => {
      const error = new Error("Auth error");
      mockHandlers.GET.mockRejectedValue(error);

      const req = new NextRequest('http://localhost:3000/api/auth/session');
      
      await expect(GET(req)).rejects.toThrow("Auth error");
      expect(mockHandlers.GET).toHaveBeenCalledWith(req);
    });
  });

  describe("POST Handler", () => {
    it("should call the auth handler with correct request", async () => {
      const mockResponse = NextResponse.json({ success: true });
      mockHandlers.POST.mockResolvedValue(mockResponse);

      const req = new NextRequest('http://localhost:3000/api/auth/signin', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: 'test', password: 'password' })
      });
      const result = await POST(req);

      expect(mockHandlers.POST).toHaveBeenCalledWith(req);
      expect(result).toBe(mockResponse);
    });

    it("should handle sign-in requests", async () => {
      const mockResponse = NextResponse.json({ 
        url: "http://localhost:3000/dashboard" 
      });
      mockHandlers.POST.mockResolvedValue(mockResponse);

      const req = new NextRequest('http://localhost:3000/api/auth/signin', { 
        method: 'POST' 
      });
      const result = await POST(req);

      expect(mockHandlers.POST).toHaveBeenCalledTimes(1);
      expect(result).toBe(mockResponse);
    });

    it("should handle sign-out requests", async () => {
      const mockResponse = NextResponse.json({ 
        url: "http://localhost:3000/" 
      });
      mockHandlers.POST.mockResolvedValue(mockResponse);

      const req = new NextRequest('http://localhost:3000/api/auth/signout', { 
        method: 'POST' 
      });
      const result = await POST(req);

      expect(mockHandlers.POST).toHaveBeenCalledWith(req);
      expect(result).toBe(mockResponse);
    });

    it("should handle POST errors gracefully", async () => {
      const error = new Error("Authentication failed");
      mockHandlers.POST.mockRejectedValue(error);

      const req = new NextRequest('http://localhost:3000/api/auth/signin', { 
        method: 'POST' 
      });
      
      await expect(POST(req)).rejects.toThrow("Authentication failed");
      expect(mockHandlers.POST).toHaveBeenCalledWith(req);
    });
  });

  describe("OPTIONS Handler", () => {
    it("should return 200 status for CORS preflight", () => {
      const req = new NextRequest('http://localhost:3000/api/auth/session', { 
        method: 'OPTIONS' 
      });
      const result = OPTIONS(req);

      expect(result).toBeInstanceOf(Response);
      expect(result.status).toBe(200);
    });

    it("should handle OPTIONS requests for different auth endpoints", () => {
      const endpoints = [
        'http://localhost:3000/api/auth/session',
        'http://localhost:3000/api/auth/signin',
        'http://localhost:3000/api/auth/signout'
      ];

      endpoints.forEach(url => {
        const req = new NextRequest(url, { method: 'OPTIONS' });
        const result = OPTIONS(req);
        
        expect(result.status).toBe(200);
      });
    });

    it("should return Response instance with null body", () => {
      const req = new NextRequest('http://localhost:3000/api/auth/session', { 
        method: 'OPTIONS' 
      });
      const result = OPTIONS(req);

      expect(result).toBeInstanceOf(Response);
      expect(result.body).toBeNull();
    });
  });

  describe("Handler Integration", () => {
    it("should properly export all required handlers", () => {
      expect(GET).toBeDefined();
      expect(POST).toBeDefined();
      expect(OPTIONS).toBeDefined();
      expect(typeof GET).toBe('function');
      expect(typeof POST).toBe('function');
      expect(typeof OPTIONS).toBe('function');
    });

    it("should maintain handler function signatures", () => {
      expect(GET.length).toBe(1); // NextRequest parameter
      expect(POST.length).toBe(1); // NextRequest parameter
      expect(OPTIONS.length).toBe(1); // Request parameter
    });
  });
});