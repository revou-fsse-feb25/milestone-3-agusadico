import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import * as shopServices from '../../services/shopServices';

// Mock console methods to avoid noise in tests
const consoleSpy = {
  error: jest.spyOn(console, 'error').mockImplementation(() => {}),
  warn: jest.spyOn(console, 'warn').mockImplementation(() => {})
};

// Mock API responses
const mockProducts = [
  { 
    id: '1', 
    title: 'Product 1', 
    price: 100, 
    images: ['image1.jpg'],
    description: 'Description 1'
  },
  { 
    id: '2', 
    title: 'Product 2', 
    price: 200, 
    images: ['image2.jpg'],
    description: 'Description 2'
  },
  { 
    id: '3', 
    title: 'Another Product', 
    price: 150, 
    images: ['image3.jpg'],
    description: 'Description 3'
  }
];

const mockCategories = [
  { id: 1, name: 'Category 1', slug: 'category-1', image: 'cat1.jpg' },
  { id: 2, name: 'Category 2', slug: 'category-2', image: 'cat2.jpg' }
];

// Setup MSW server
const server = setupServer(
  // Default handlers
  http.get('https://api.escuelajs.co/api/v1/products', ({ request }) => {
    const url = new URL(request.url);
    const offset = url.searchParams.get('offset');
    const limit = url.searchParams.get('limit');
    const title = url.searchParams.get('title');
    const categoryId = url.searchParams.get('categoryId');
    
    // Handle search by title
    if (title) {
      const filteredProducts = mockProducts.filter(p => 
        p.title.toLowerCase().includes(title.toLowerCase())
      );
      return HttpResponse.json(filteredProducts);
    }
    
    // Handle search by category
    if (categoryId) {
      return HttpResponse.json(mockProducts);
    }
    
    // Handle pagination
    if (offset === '0' && limit === '20') {
      return HttpResponse.json(mockProducts);
    }
    
    return HttpResponse.json(mockProducts);
  }),
  
  http.get('https://api.escuelajs.co/api/v1/products/:id', ({ params }) => {
    const { id } = params;
    const product = mockProducts.find(p => p.id === id);
    
    if (!product) {
      return new HttpResponse('EntityNotFoundError: Product not found', { status: 400 });
    }
    
    return HttpResponse.json(product);
  }),
  
  http.get('https://api.escuelajs.co/api/v1/categories', () => {
    return HttpResponse.json(mockCategories);
  }),
  
  http.get('https://api.escuelajs.co/api/v1/products/:id/related', ({ params }) => {
    const { id } = params;
    // Return related products (excluding the current one)
    const relatedProducts = mockProducts.filter(p => p.id !== id);
    return HttpResponse.json(relatedProducts.slice(0, 2));
  })
);

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  consoleSpy.error.mockClear();
  consoleSpy.warn.mockClear();
});
afterAll(() => {
  server.close();
  consoleSpy.error.mockRestore();
  consoleSpy.warn.mockRestore();
});

describe('Shop Services', () => {
  describe('fetchProducts', () => {
    test('returns products successfully', async () => {
      const products = await shopServices.fetchProducts();
      expect(products).toEqual(mockProducts);
      expect(products).toHaveLength(3);
    });

    test('returns products with custom offset and limit', async () => {
      const products = await shopServices.fetchProducts(10, 5);
      expect(products).toHaveLength(3); // Mock returns all products
    });

    test('handles fetch failure with network error', async () => {
      server.use(
        http.get('https://api.escuelajs.co/api/v1/products', () => {
          return HttpResponse.error();
        })
      );

      await expect(shopServices.fetchProducts()).rejects.toThrow();
      expect(consoleSpy.error).toHaveBeenCalledWith('Error in fetchProducts:', expect.any(Error));
    });

    test('handles non-ok response', async () => {
      server.use(
        http.get('https://api.escuelajs.co/api/v1/products', () => {
          return new HttpResponse(null, { status: 500, statusText: 'Internal Server Error' });
        })
      );

      await expect(shopServices.fetchProducts()).rejects.toThrow('Failed to fetch products');
      expect(consoleSpy.error).toHaveBeenCalled();
    });

    test('handles invalid JSON response', async () => {
      server.use(
        http.get('https://api.escuelajs.co/api/v1/products', () => {
          return new HttpResponse('invalid json', { status: 200 });
        })
      );

      await expect(shopServices.fetchProducts()).rejects.toThrow();
      expect(consoleSpy.error).toHaveBeenCalled();
    });
  });

  describe('fetchProductById', () => {
    test('returns a product when found', async () => {
      const product = await shopServices.fetchProductById('1');
      expect(product).toEqual(mockProducts[0]);
    });

    test('returns fallback product when EntityNotFoundError occurs', async () => {
      const product = await shopServices.fetchProductById('999');
      expect(product.id).toEqual('999');
      expect(product.title).toEqual('Product Not Available');
      expect(product.images).toEqual(['/images/logo-revoshop.jpg']);
      expect(product.price).toEqual(0);
      expect(product.description).toEqual('This product is no longer available.');
      expect(consoleSpy.warn).toHaveBeenCalledWith('Product with ID 999 not found, using fallback product');
    });

    test('handles non-400 errors', async () => {
      server.use(
        http.get('https://api.escuelajs.co/api/v1/products/:id', () => {
          return new HttpResponse('Server Error', { status: 500, statusText: 'Internal Server Error' });
        })
      );

      await expect(shopServices.fetchProductById('1')).rejects.toThrow('Failed to fetch product: 500 Internal Server Error. Server Error');
      expect(consoleSpy.error).toHaveBeenCalled();
    });

    test('handles 400 error without EntityNotFoundError', async () => {
      server.use(
        http.get('https://api.escuelajs.co/api/v1/products/:id', () => {
          return new HttpResponse('Bad Request', { status: 400, statusText: 'Bad Request' });
        })
      );

      await expect(shopServices.fetchProductById('1')).rejects.toThrow('Failed to fetch product: 400 Bad Request. Bad Request');
      expect(consoleSpy.error).toHaveBeenCalled();
    });

    test('handles error when response.text() fails', async () => {
      server.use(
        http.get('https://api.escuelajs.co/api/v1/products/:id', () => {
          const mockResponse = new Response(null, {
            status: 500,
            statusText: 'Internal Server Error'
          });
          
          Object.defineProperty(mockResponse, 'text', {
            value: jest.fn().mockRejectedValue(new Error('Text parsing failed')),
            writable: true
          });
          
          Object.defineProperty(mockResponse, 'ok', {
            value: false,
            writable: true
          });
          
          return mockResponse;
        })
      );

      await expect(shopServices.fetchProductById('1')).rejects.toThrow('Failed to fetch product: 500 Internal Server Error. No error details available');
      expect(consoleSpy.error).toHaveBeenCalled();
    });

    test('handles network error', async () => {
      server.use(
        http.get('https://api.escuelajs.co/api/v1/products/:id', () => {
          return HttpResponse.error();
        })
      );

      await expect(shopServices.fetchProductById('1')).rejects.toThrow();
      expect(consoleSpy.error).toHaveBeenCalled();
    });

    test('handles JSON parsing error on successful response', async () => {
      server.use(
        http.get('https://api.escuelajs.co/api/v1/products/:id', () => {
          return new HttpResponse('invalid json', { status: 200 });
        })
      );

      await expect(shopServices.fetchProductById('1')).rejects.toThrow();
      expect(consoleSpy.error).toHaveBeenCalled();
    });
  });

  describe('fetchRelatedProducts', () => {
    test('returns related products successfully', async () => {
      const products = await shopServices.fetchRelatedProducts('1');
      expect(products).toHaveLength(2);
      expect(products).not.toContain(mockProducts[0]);
    });

    test('handles fetch failure gracefully', async () => {
      server.use(
        http.get('https://api.escuelajs.co/api/v1/products/:id/related', () => {
          return new HttpResponse(null, { status: 500 });
        })
      );

      const products = await shopServices.fetchRelatedProducts('1');
      expect(products).toEqual([]);
      expect(consoleSpy.error).toHaveBeenCalledWith('Error in fetchRelatedProducts:', expect.any(Error));
    });

    test('handles network error gracefully', async () => {
      server.use(
        http.get('https://api.escuelajs.co/api/v1/products/:id/related', () => {
          return HttpResponse.error();
        })
      );

      const products = await shopServices.fetchRelatedProducts('1');
      expect(products).toEqual([]);
      expect(consoleSpy.error).toHaveBeenCalled();
    });

    test('handles JSON parsing error gracefully', async () => {
      server.use(
        http.get('https://api.escuelajs.co/api/v1/products/:id/related', () => {
          return new HttpResponse('invalid json', { status: 200 });
        })
      );

      const products = await shopServices.fetchRelatedProducts('1');
      expect(products).toEqual([]);
      expect(consoleSpy.error).toHaveBeenCalled();
    });

    test('handles non-ok response gracefully', async () => {
      server.use(
        http.get('https://api.escuelajs.co/api/v1/products/:id/related', () => {
          return new HttpResponse(null, { status: 404 });
        })
      );

      const products = await shopServices.fetchRelatedProducts('1');
      expect(products).toEqual([]);
      expect(consoleSpy.error).toHaveBeenCalled();
    });
  });

  describe('fetchCategories', () => {
    test('returns categories successfully', async () => {
      const categories = await shopServices.fetchCategories();
      expect(categories).toEqual(mockCategories);
      expect(categories).toHaveLength(2);
    });

    test('handles fetch failure', async () => {
      server.use(
        http.get('https://api.escuelajs.co/api/v1/categories', () => {
          return new HttpResponse(null, { status: 500 });
        })
      );

      await expect(shopServices.fetchCategories()).rejects.toThrow('Failed to fetch categories');
      expect(consoleSpy.error).toHaveBeenCalledWith('Error in fetchCategories:', expect.any(Error));
    });

    test('handles network error', async () => {
      server.use(
        http.get('https://api.escuelajs.co/api/v1/categories', () => {
          return HttpResponse.error();
        })
      );

      await expect(shopServices.fetchCategories()).rejects.toThrow();
      expect(consoleSpy.error).toHaveBeenCalled();
    });

    test('handles JSON parsing error', async () => {
      server.use(
        http.get('https://api.escuelajs.co/api/v1/categories', () => {
          return new HttpResponse('invalid json', { status: 200 });
        })
      );

      await expect(shopServices.fetchCategories()).rejects.toThrow();
      expect(consoleSpy.error).toHaveBeenCalled();
    });

    test('handles non-ok response', async () => {
      server.use(
        http.get('https://api.escuelajs.co/api/v1/categories', () => {
          return new HttpResponse('Not Found', { status: 404, statusText: 'Not Found' });
        })
      );

      await expect(shopServices.fetchCategories()).rejects.toThrow('Failed to fetch categories');
      expect(consoleSpy.error).toHaveBeenCalled();
    });
  });

  describe('searchProductsByTitle', () => {
    test('returns filtered products by title', async () => {
      const products = await shopServices.searchProductsByTitle('Product 1');
      expect(products).toHaveLength(1);
      expect(products[0].title).toEqual('Product 1');
    });

    test('returns multiple products for partial match', async () => {
      const products = await shopServices.searchProductsByTitle('Product');
      expect(products).toHaveLength(2);
      expect(products.map(p => p.title)).toContain('Product 1');
      expect(products.map(p => p.title)).toContain('Product 2');
    });

    test('returns empty array when no matches found', async () => {
      const products = await shopServices.searchProductsByTitle('NonExistent');
      expect(products).toHaveLength(0);
    });

    test('handles case insensitive search', async () => {
      const products = await shopServices.searchProductsByTitle('PRODUCT');
      expect(products.length).toBeGreaterThan(0);
    });

    test('handles URL encoding for special characters', async () => {
      const products = await shopServices.searchProductsByTitle('Product & Test');
      expect(Array.isArray(products)).toBe(true);
    });

    test('handles empty string search', async () => {
      const products = await shopServices.searchProductsByTitle('');
      expect(Array.isArray(products)).toBe(true);
    });

    test('handles fetch failure', async () => {
      server.use(
        http.get('https://api.escuelajs.co/api/v1/products', () => {
          return new HttpResponse(null, { status: 500 });
        })
      );

      await expect(shopServices.searchProductsByTitle('test')).rejects.toThrow('Failed to search products');
      expect(consoleSpy.error).toHaveBeenCalledWith('Error in searchProductsByTitle:', expect.any(Error));
    });

    test('handles network error', async () => {
      server.use(
        http.get('https://api.escuelajs.co/api/v1/products', () => {
          return HttpResponse.error();
        })
      );

      await expect(shopServices.searchProductsByTitle('test')).rejects.toThrow();
      expect(consoleSpy.error).toHaveBeenCalled();
    });

    test('handles JSON parsing error', async () => {
      server.use(
        http.get('https://api.escuelajs.co/api/v1/products', () => {
          return new HttpResponse('invalid json', { status: 200 });
        })
      );

      await expect(shopServices.searchProductsByTitle('test')).rejects.toThrow();
      expect(consoleSpy.error).toHaveBeenCalled();
    });

    test('handles non-ok response', async () => {
      server.use(
        http.get('https://api.escuelajs.co/api/v1/products', () => {
          return new HttpResponse('Bad Request', { status: 400, statusText: 'Bad Request' });
        })
      );

      await expect(shopServices.searchProductsByTitle('test')).rejects.toThrow('Failed to search products');
      expect(consoleSpy.error).toHaveBeenCalled();
    });
  });

  describe('fetchProductsByCategoryAndTitle', () => {
    test('returns filtered products by category and title', async () => {
      const products = await shopServices.fetchProductsByCategoryAndTitle(1, 'Product');
      expect(products).toHaveLength(2);
      expect(products.every((p: any) => p.title.toLowerCase().includes('product'))).toBe(true);
    });

    test('returns all products when title matches all', async () => {
      const products = await shopServices.fetchProductsByCategoryAndTitle(1, '');
      expect(products).toHaveLength(3);
    });

    test('returns empty array when no products match title', async () => {
      const products = await shopServices.fetchProductsByCategoryAndTitle(1, 'NonExistent');
      expect(products).toHaveLength(0);
    });

    test('handles case insensitive search', async () => {
      const products = await shopServices.fetchProductsByCategoryAndTitle(1, 'PRODUCT');
      expect(products.length).toBeGreaterThan(0);
    });

    test('handles partial title matches', async () => {
      const products = await shopServices.fetchProductsByCategoryAndTitle(1, 'Prod');
      expect(products).toHaveLength(2);
    });

    test('handles different category IDs', async () => {
      const products = await shopServices.fetchProductsByCategoryAndTitle(2, 'Product');
      expect(Array.isArray(products)).toBe(true);
    });

    test('handles string category ID', async () => {
      const products = await shopServices.fetchProductsByCategoryAndTitle('1' as any, 'Product');
      expect(Array.isArray(products)).toBe(true);
    });

    test('handles fetch failure', async () => {
      server.use(
        http.get('https://api.escuelajs.co/api/v1/products', () => {
          return new HttpResponse(null, { status: 500 });
        })
      );

      await expect(shopServices.fetchProductsByCategoryAndTitle(1, 'test')).rejects.toThrow();
      expect(consoleSpy.error).toHaveBeenCalled();
    });

    test('handles network error', async () => {
      server.use(
        http.get('https://api.escuelajs.co/api/v1/products', () => {
          return HttpResponse.error();
        })
      );

      await expect(shopServices.fetchProductsByCategoryAndTitle(1, 'test')).rejects.toThrow();
      expect(consoleSpy.error).toHaveBeenCalled();
    });

    test('handles JSON parsing error', async () => {
      server.use(
        http.get('https://api.escuelajs.co/api/v1/products', () => {
          return new HttpResponse('invalid json', { status: 200 });
        })
      );

      await expect(shopServices.fetchProductsByCategoryAndTitle(1, 'test')).rejects.toThrow();
      expect(consoleSpy.error).toHaveBeenCalled();
    });

    test('handles non-ok response', async () => {
      server.use(
        http.get('https://api.escuelajs.co/api/v1/products', () => {
          return new HttpResponse('Bad Request', { status: 400, statusText: 'Bad Request' });
        })
      );

      await expect(shopServices.fetchProductsByCategoryAndTitle(1, 'test')).rejects.toThrow();
      expect(consoleSpy.error).toHaveBeenCalled();
    });

    test('handles empty response array', async () => {
      server.use(
        http.get('https://api.escuelajs.co/api/v1/products', () => {
          return HttpResponse.json([]);
        })
      );

      const products = await shopServices.fetchProductsByCategoryAndTitle(1, 'test');
      expect(products).toEqual([]);
    });

    test('handles server returning null', async () => {
      server.use(
        http.get('https://api.escuelajs.co/api/v1/products', () => {
          return HttpResponse.json(null);
        })
      );

      await expect(shopServices.fetchProductsByCategoryAndTitle(1, 'test')).rejects.toThrow();
      expect(consoleSpy.error).toHaveBeenCalled();
    });
  });
});