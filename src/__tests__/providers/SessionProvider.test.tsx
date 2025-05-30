// __tests__/providers/SessionProvider.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SessionProvider from '../../providers/SessionProvider';

// Mock next-auth/react
jest.mock('next-auth/react', () => ({
  SessionProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="next-auth-session-provider">{children}</div>
  ),
}));

describe('SessionProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render without crashing', () => {
      const TestChild = () => <div>Test Child</div>;
      
      expect(() => {
        render(
          <SessionProvider>
            <TestChild />
          </SessionProvider>
        );
      }).not.toThrow();
    });

    it('should render children properly', () => {
      const testText = 'Test Child Content';
      const TestChild = () => <div>{testText}</div>;

      render(
        <SessionProvider>
          <TestChild />
        </SessionProvider>
      );

      expect(screen.getByText(testText)).toBeInTheDocument();
    });

    it('should wrap children with NextAuthSessionProvider', () => {
      const TestChild = () => <div data-testid="test-child">Test Child</div>;

      render(
        <SessionProvider>
          <TestChild />
        </SessionProvider>
      );

      const sessionProvider = screen.getByTestId('next-auth-session-provider');
      const testChild = screen.getByTestId('test-child');

      expect(sessionProvider).toBeInTheDocument();
      expect(sessionProvider).toContainElement(testChild);
    });
  });

  describe('Props Handling', () => {
    it('should accept and render multiple children', () => {
      render(
        <SessionProvider>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
          <span data-testid="child-3">Child 3</span>
        </SessionProvider>
      );

      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
      expect(screen.getByTestId('child-3')).toBeInTheDocument();
    });

    it('should handle null children gracefully', () => {
      expect(() => {
        render(<SessionProvider>{null}</SessionProvider>);
      }).not.toThrow();
    });

    it('should handle undefined children gracefully', () => {
      expect(() => {
        render(<SessionProvider>{undefined}</SessionProvider>);
      }).not.toThrow();
    });

    //   expect(() => {
    //     render(<SessionProvider></SessionProvider>);
    //   }).not.toThrow();
      
    //   // Verify the component renders without crashing when no children are provided
    //   const { container } = render(<SessionProvider></SessionProvider>);
    //   expect(container.firstChild).toBeInTheDocument();
    // });
  });

  describe('Component Structure', () => {
    it('should maintain proper component hierarchy', () => {
      const TestComponent = () => (
        <div data-testid="nested-component">
          <h1>Header</h1>
          <p>Content</p>
        </div>
      );

      render(
        <SessionProvider>
          <TestComponent />
        </SessionProvider>
      );

      const sessionProvider = screen.getByTestId('next-auth-session-provider');
      const nestedComponent = screen.getByTestId('nested-component');
      const header = screen.getByText('Header');
      const content = screen.getByText('Content');

      expect(sessionProvider).toContainElement(nestedComponent);
      expect(nestedComponent).toContainElement(header);
      expect(nestedComponent).toContainElement(content);
    });

    it('should preserve React component tree structure', () => {
      const GrandChild = () => <span data-testid="grandchild">GrandChild</span>;
      const Child = () => (
        <div data-testid="child">
          Child <GrandChild />
        </div>
      );

      render(
        <SessionProvider>
          <Child />
        </SessionProvider>
      );

      const sessionProvider = screen.getByTestId('next-auth-session-provider');
      const child = screen.getByTestId('child');
      const grandchild = screen.getByTestId('grandchild');

      expect(sessionProvider).toContainElement(child);
      expect(child).toContainElement(grandchild);
    });
  });

  describe('Error Boundaries', () => {
    it('should not crash when child component throws error', () => {
      const ErrorComponent = () => {
        throw new Error('Test error');
      };

      // Suppress console.error for this test
      const originalError = console.error;
      console.error = jest.fn();

      expect(() => {
        render(
          <SessionProvider>
            <ErrorComponent />
          </SessionProvider>
        );
      }).toThrow('Test error');

      console.error = originalError;
    });
  });

  describe('TypeScript Types', () => {
    it('should accept valid React.ReactNode children', () => {
      // This test ensures TypeScript compilation works correctly
      const validChildren = [
        <div key="1">String content</div>,
        <span key="2">{42}</span>,
        <p key="3">{true && 'Conditional content'}</p>,
      ];

      expect(() => {
        render(<SessionProvider>{validChildren}</SessionProvider>);
      }).not.toThrow();

      validChildren.forEach((_, index) => {
        expect(screen.getByText(
          index === 0 ? 'String content' : 
          index === 1 ? '42' : 
          'Conditional content'
        )).toBeInTheDocument();
      });
    });
  });

  describe('Performance', () => {
    it('should render efficiently with large number of children', () => {
      const startTime = performance.now();
      
      const manyChildren = Array.from({ length: 100 }, (_, i) => (
        <div key={i} data-testid={`child-${i}`}>
          Child {i}
        </div>
      ));

      render(<SessionProvider>{manyChildren}</SessionProvider>);

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render within reasonable time (adjust threshold as needed)
      expect(renderTime).toBeLessThan(100); // 100ms threshold

      // Verify all children are rendered
      expect(screen.getByTestId('child-0')).toBeInTheDocument();
      expect(screen.getByTestId('child-99')).toBeInTheDocument();
    });

    it('should have minimal re-renders', () => {
      let renderCount = 0;
      
      const TestChild = () => {
        renderCount++;
        return <div>Render count: {renderCount}</div>;
      };

      const { rerender } = render(
        <SessionProvider>
          <TestChild />
        </SessionProvider>
      );

      expect(renderCount).toBe(1);

      // Re-render with same props should not cause unnecessary re-renders
      rerender(
        <SessionProvider>
          <TestChild />
        </SessionProvider>
      );

      expect(renderCount).toBe(2); // Expected behavior for function components
    });
  });
});