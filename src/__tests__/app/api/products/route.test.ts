import { NextRequest } from 'next/server';
// Use a direct relative path instead of the path alias
import { GET, POST, PUT, DELETE, resetProducts } from '../../../../app/api/products/route.for-coverage';

// Mock the Product type
export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  category?: string;
}

// Helper function to create mock NextRequest
const createMockRequest = (body?: any, method: string = 'GET'): NextRequest => {
  const req = new NextRequest('http://localhost:3000/api/products', {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return req;
};

// Reset products array before each test
beforeEach(async () => {
  // Use the exported resetProducts function
  resetProducts();
  
  // Get all existing products
  const response = await GET();
  const products = await response.json();
  
  // Delete each product using Promise.all for proper async handling
  await Promise.all(
    products.map(async (product: Product) => {
      const deleteReq = createMockRequest({ id: product.id }, 'DELETE');
      return await DELETE(deleteReq);
    })
  );
});

describe('/api/products API Route', () => {
  describe('GET /api/products', () => {
    it('should return empty array when no products exist', async () => {
      const response = await GET();
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data).toEqual([]);
    });

    it('should return all products when products exist', async () => {
      // Add some test data first
      const testProduct = {
        name: 'Test Product',
        price: 99.99,
        description: 'Test Description'
      };
      
      const postRequest = createMockRequest(testProduct, 'POST');
      await POST(postRequest);
      
      const response = await GET();
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data).toHaveLength(1);
      expect(data[0]).toMatchObject(testProduct);
      expect(data[0]).toHaveProperty('id');
    });
  });

  describe('POST /api/products', () => {
    it('should create a new product with valid data', async () => {
      const newProduct = {
        name: 'New Product',
        price: 49.99,
        description: 'A new product',
        category: 'Electronics'
      };

      const request = createMockRequest(newProduct, 'POST');
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toMatchObject(newProduct);
      expect(data).toHaveProperty('id');
      expect(typeof data.id).toBe('string');
    });

    it('should handle product creation with minimal data', async () => {
      const minimalProduct = {
        name: 'Minimal Product',
        price: 0
      };

      const request = createMockRequest(minimalProduct, 'POST');
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toMatchObject(minimalProduct);
      expect(data).toHaveProperty('id');
    });

    it('should generate unique IDs for multiple products', async () => {
      const product1 = { name: 'Product 1', price: 10 };
      const product2 = { name: 'Product 2', price: 20 };

      const request1 = createMockRequest(product1, 'POST');
      const request2 = createMockRequest(product2, 'POST');
      
      const response1 = await POST(request1);
      const response2 = await POST(request2);
      
      const data1 = await response1.json();
      const data2 = await response2.json();

      expect(data1.id).not.toBe(data2.id);
      expect(response1.status).toBe(201);
      expect(response2.status).toBe(201);
    });
  });

  describe('PUT /api/products', () => {
    it('should update existing product', async () => {
      // First create a product
      const originalProduct = {
        name: 'Original Product',
        price: 100,
        description: 'Original description'
      };

      const createRequest = createMockRequest(originalProduct, 'POST');
      const createResponse = await POST(createRequest);
      const createdProduct = await createResponse.json();

      // Then update it
      const updatedData = {
        id: createdProduct.id,
        name: 'Updated Product',
        price: 150,
        description: 'Updated description'
      };

      const updateRequest = createMockRequest(updatedData, 'PUT');
      const updateResponse = await PUT(updateRequest);
      const updatedProduct = await updateResponse.json();

      expect(updateResponse.status).toBe(200);
      expect(updatedProduct.id).toBe(createdProduct.id);
      expect(updatedProduct.name).toBe('Updated Product');
      expect(updatedProduct.price).toBe(150);
      expect(updatedProduct.description).toBe('Updated description');
    });

    it('should partially update product (merge behavior)', async () => {
      // Create original product
      const originalProduct = {
        name: 'Original Product',
        price: 100,
        description: 'Original description',
        category: 'Original category'
      };

      const createRequest = createMockRequest(originalProduct, 'POST');
      const createResponse = await POST(createRequest);
      const createdProduct = await createResponse.json();

      // Partial update (only price)
      const partialUpdate = {
        id: createdProduct.id,
        price: 200
      };

      const updateRequest = createMockRequest(partialUpdate, 'PUT');
      const updateResponse = await PUT(updateRequest);
      const updatedProduct = await updateResponse.json();

      expect(updateResponse.status).toBe(200);
      expect(updatedProduct.name).toBe('Original Product'); // Should remain unchanged
      expect(updatedProduct.price).toBe(200); // Should be updated
      expect(updatedProduct.description).toBe('Original description'); // Should remain unchanged
      expect(updatedProduct.category).toBe('Original category'); // Should remain unchanged
    });

    it('should return 404 for non-existent product ID', async () => {
      const nonExistentUpdate = {
        id: 'non-existent-id',
        name: 'Updated Name',
        price: 99
      };

      const request = createMockRequest(nonExistentUpdate, 'PUT');
      const response = await PUT(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toEqual({ error: 'Not found' });
    });
  });

  describe('DELETE /api/products', () => {
    it('should delete existing product', async () => {
      // First create a product
      const testProduct = {
        name: 'Product to Delete',
        price: 75
      };

      const createRequest = createMockRequest(testProduct, 'POST');
      const createResponse = await POST(createRequest);
      const createdProduct = await createResponse.json();

      // Verify product exists
      const getResponse1 = await GET();
      const products1 = await getResponse1.json();
      expect(products1).toHaveLength(1);

      // Delete the product
      const deleteRequest = createMockRequest({ id: createdProduct.id }, 'DELETE');
      const deleteResponse = await DELETE(deleteRequest);
      const deleteData = await deleteResponse.json();

      expect(deleteResponse.status).toBe(200);
      expect(deleteData).toEqual({ success: true });

      // Verify product is deleted
      const getResponse2 = await GET();
      const products2 = await getResponse2.json();
      expect(products2).toHaveLength(0);
    });

    it('should handle deletion of non-existent product gracefully', async () => {
      const deleteRequest = createMockRequest({ id: 'non-existent-id' }, 'DELETE');
      const deleteResponse = await DELETE(deleteRequest);
      const deleteData = await deleteResponse.json();

      expect(deleteResponse.status).toBe(200);
      expect(deleteData).toEqual({ success: true });
    });

    it('should delete only the specified product', async () => {
      // Create multiple products
      const product1 = { name: 'Product 1', price: 10 };
      const product2 = { name: 'Product 2', price: 20 };

      const request1 = createMockRequest(product1, 'POST');
      const request2 = createMockRequest(product2, 'POST');
      
      const response1 = await POST(request1);
      const response2 = await POST(request2);
      
      const createdProduct1 = await response1.json();
      const createdProduct2 = await response2.json();

      // Delete only the first product
      const deleteRequest = createMockRequest({ id: createdProduct1.id }, 'DELETE');
      await DELETE(deleteRequest);

      // Verify only one product remains
      const getResponse = await GET();
      const remainingProducts = await getResponse.json();
      
      expect(remainingProducts).toHaveLength(1);
      expect(remainingProducts[0].id).toBe(createdProduct2.id);
      expect(remainingProducts[0].name).toBe('Product 2');
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete CRUD workflow', async () => {
      // CREATE
      const newProduct = {
        name: 'Integration Test Product',
        price: 99.99,
        description: 'Test product for integration testing'
      };

      const createRequest = createMockRequest(newProduct, 'POST');
      const createResponse = await POST(createRequest);
      const createdProduct = await createResponse.json();

      expect(createResponse.status).toBe(201);
      expect(createdProduct).toMatchObject(newProduct);

      // READ
      const readResponse = await GET();
      const products = await readResponse.json();
      
      expect(readResponse.status).toBe(200);
      expect(products).toHaveLength(1);
      expect(products[0].id).toBe(createdProduct.id);

      // UPDATE
      const updateData = {
        id: createdProduct.id,
        name: 'Updated Integration Product',
        price: 149.99
      };

      const updateRequest = createMockRequest(updateData, 'PUT');
      const updateResponse = await PUT(updateRequest);
      const updatedProduct = await updateResponse.json();

      expect(updateResponse.status).toBe(200);
      expect(updatedProduct.name).toBe('Updated Integration Product');
      expect(updatedProduct.price).toBe(149.99);
      expect(updatedProduct.description).toBe('Test product for integration testing'); // Should remain

      // DELETE
      const deleteRequest = createMockRequest({ id: createdProduct.id }, 'DELETE');
      const deleteResponse = await DELETE(deleteRequest);

      expect(deleteResponse.status).toBe(200);

      // Verify deletion
      const finalReadResponse = await GET();
      const finalProducts = await finalReadResponse.json();
      expect(finalProducts).toHaveLength(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed request data', async () => {
      // Test POST with missing required fields
      const incompleteProduct = { name: 'Incomplete Product' }; // missing price
      const request = createMockRequest(incompleteProduct, 'POST');
      
      const response = await POST(request);
      const data = await response.json();
      
      expect(response.status).toBe(201);
      expect(data).toMatchObject(incompleteProduct);
      expect(data).toHaveProperty('id');
    });

    it('should handle empty request bodies', async () => {
      const request = createMockRequest({}, 'POST');
      const response = await POST(request);
      
      expect(response.status).toBe(201);
    });

    it('should handle PUT with missing ID', async () => {
      const updateWithoutId = { name: 'Updated Name' };
      const request = createMockRequest(updateWithoutId, 'PUT');
      
      const response = await PUT(request);
      expect(response.status).toBe(404);
    });

    it('should handle DELETE with missing ID', async () => {
      const request = createMockRequest({}, 'DELETE');
      const response = await DELETE(request);
      
      expect(response.status).toBe(200);
      expect((await response.json())).toEqual({ success: true });
    });
  });
});

// Add these tests to your Error Handling describe block
describe('Error Handling', () => {
  it('should handle invalid JSON in POST requests', async () => {
    const invalidRequest = new NextRequest('http://localhost:3000/api/products', {
      method: 'POST',
      body: 'not-valid-json',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const response = await POST(invalidRequest);
    const data = await response.json();
    
    expect(response.status).toBe(400);
    expect(data).toEqual({ error: 'Invalid request data' });
  });
  
  it('should handle invalid JSON in PUT requests', async () => {
    const invalidRequest = new NextRequest('http://localhost:3000/api/products', {
      method: 'PUT',
      body: 'not-valid-json',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const response = await PUT(invalidRequest);
    const data = await response.json();
    
    expect(response.status).toBe(400);
    expect(data).toEqual({ error: 'Invalid request data' });
  });
  
  it('should handle invalid JSON in DELETE requests', async () => {
    const invalidRequest = new NextRequest('http://localhost:3000/api/products', {
      method: 'DELETE',
      body: 'not-valid-json',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const response = await DELETE(invalidRequest);
    const data = await response.json();
    
    expect(response.status).toBe(200); // Still returns success for idempotency
    expect(data).toHaveProperty('success', true);
    expect(data).toHaveProperty('error', 'Invalid request data');
  });
});