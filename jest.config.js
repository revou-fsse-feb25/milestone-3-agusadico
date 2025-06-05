const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './'
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    // Handle module aliases (if you use them in your project)
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/pages/(.*)$': '<rootDir>/src/pages/$1',
    '^@/hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@/providers/(.*)$': '<rootDir>/src/providers/$1',
    '^@/services/(.*)$': '<rootDir>/src/services/$1',
    // Add this line to map the @/* path alias
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  transform: {
    // Use our custom transformer for JS/TS/JSX/TSX files
    '^.+\.(js|jsx|ts|tsx)$': '<rootDir>/jest-next-transformer.js',
    // Use a specific transformer for the admin page
    'src/app/admin/page.tsx$': '<rootDir>/admin-page-transformer.js',
    // Use the dedicated transformer for the products route
    'src/app/api/products/route.ts$': '<rootDir>/products-route-transformer.js',
    // Use the coverage transformer for the coverage-specific file
    'src/app/api/products/route.for-coverage.ts$': '<rootDir>/coverage-transformer.js'
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(@swc|next|@next|react-dom|react))/',
    '^.+\.module\.(css|sass|scss)$'
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    'src/app/**/*.{js,jsx,ts,tsx}',
    // Explicitly include the coverage file
    'src/app/api/products/route.for-coverage.ts',
    // Exclude test files and directories
    '!src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.test.{js,jsx,ts,tsx}',
    '!src/**/*.spec.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/_*.{js,jsx,ts,tsx}',
    '!**/node_modules/**'
  ],
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
    // Remove these patterns that might be excluding your test files
    // '<rootDir>/src/__tests__/',
    // '<rootDir>/src/tests/',
    // '\\.test\\.',
    // '\\.spec\\.'
  ],
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  coverageThreshold: {
    global: {
      statements: 50,
      branches: 50,
      functions: 50,
      lines: 50
    }
  },
  // Optional: Define test match patterns to be explicit about what files are tests
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}'
  ],
  coverageDirectory: '<rootDir>/coverage',
  coverageProvider: 'v8',
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);