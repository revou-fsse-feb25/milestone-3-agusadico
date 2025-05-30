import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '../../../app/login/page';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// Mock next-auth
jest.mock('next-auth/react', () => ({
  signIn: jest.fn()
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

describe('LoginPage', () => {
  const mockRouter = {
    push: jest.fn(),
    refresh: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  test('renders login form correctly', () => {
    render(<LoginPage />);
    
    expect(screen.getByRole('heading', { name: /sign in to your account/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByText(/create a new account/i)).toBeInTheDocument();
  });

  test('handles form submission with valid credentials', async () => {
    (signIn as jest.Mock).mockResolvedValue({ ok: true, error: null });
    
    render(<LoginPage />);
    
    fireEvent.change(screen.getByPlaceholderText(/email address/i), {
      target: { value: 'test@example.com' }
    });
    
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'password123' }
    });
    
    fireEvent.submit(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('credentials', {
        email: 'test@example.com',
        password: 'password123',
        redirect: false
      });
      expect(mockRouter.push).toHaveBeenCalledWith('/');
      expect(mockRouter.refresh).toHaveBeenCalled();
    });
  });

  test('displays error message on invalid credentials', async () => {
    (signIn as jest.Mock).mockResolvedValue({ ok: false, error: 'CredentialsSignin' });
    
    render(<LoginPage />);
    
    fireEvent.change(screen.getByPlaceholderText(/email address/i), {
      target: { value: 'wrong@example.com' }
    });
    
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'wrongpassword' }
    });
    
    fireEvent.submit(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
      expect(mockRouter.push).not.toHaveBeenCalled();
    });
  });
});