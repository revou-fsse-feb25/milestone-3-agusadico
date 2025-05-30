// Optional: configure or set up a testing framework before each test.
import '@testing-library/jest-dom';

// Mock next/router
jest.mock('next/navigation', () => require('next-router-mock'));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, width, height, ...props }) => {
    return <img src={src} alt={alt} width={width} height={height} {...props} />;
  }
}));

// Mock localStorage
class LocalStorageMock {
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = String(value);
  }

  removeItem(key) {
    delete this.store[key];
  }
}

Object.defineProperty(window, 'localStorage', {
  value: new LocalStorageMock()
});