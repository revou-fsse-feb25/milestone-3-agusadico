import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NavbarAuthClient from '../../components/NavbarAuthClient';
import { useSession, signIn, signOut } from 'next-auth/react';
import '@testing-library/jest-dom';

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn()
}));

describe('NavbarAuthClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login button when user is not authenticated', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'unauthenticated'
    });

    render(<NavbarAuthClient />);
    
    const loginButton = screen.getByRole('button', { name: /login/i });
    expect(loginButton).toBeInTheDocument();
    
    fireEvent.click(loginButton);
    expect(signIn).toHaveBeenCalled();
  });

  test('renders user info and logout button for regular users', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          name: 'John Doe',
          email: 'john@example.com',
          role: 'user'
        }
      },
      status: 'authenticated'
    });

    render(<NavbarAuthClient />);
    
    expect(screen.getByText(/welcome/i)).toBeInTheDocument();
    expect(screen.getByText(/john doe/i)).toBeInTheDocument();
    
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    expect(logoutButton).toBeInTheDocument();
    
    fireEvent.click(logoutButton);
    expect(signOut).toHaveBeenCalled();
  });

  test('renders admin dropdown for admin users', async () => {
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin'
        }
      },
      status: 'authenticated'
    });

    render(<NavbarAuthClient />);
    
    expect(screen.getByText(/welcome/i)).toBeInTheDocument();
    expect(screen.getByText(/admin user/i)).toBeInTheDocument();
    expect(screen.getByText(/admin/i)).toBeInTheDocument();
    
    // Test dropdown functionality
    const dropdownButton = screen.getByRole('button', { name: /welcome/i });
    fireEvent.click(dropdownButton);
    
    await waitFor(() => {
      expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    });
    
    const logoutOption = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(logoutOption);
    expect(signOut).toHaveBeenCalled();
  });
});