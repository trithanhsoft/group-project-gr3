/**
 * @vitest-environment jsdom
 */
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '@/modules/auth/LoginPage';
import { loginApi } from '@/services/authApi';

// Mock the auth API service
vi.mock('@/services/authApi', () => ({
  loginApi: vi.fn(),
  googleLoginApi: vi.fn(),
}));

// Mock storage and utility functions
vi.mock('@/utils/authStorage', () => ({
  getDashboardPath: vi.fn().mockReturnValue('/dashboard'),
  saveAuth: vi.fn(),
}));

// Mock Next.js navigation directly in test file
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
    replace: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock Google Login component
vi.mock('@react-oauth/google', () => ({
  GoogleLogin: () => null,
  GoogleOAuthProvider: ({ children }: any) => children,
}));

describe('LoginPage UI Components & Event Handler Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render form inputs, placeholders, and buttons correctly', () => {
    // Act
    render(<LoginPage />);

    // Assert
    expect(screen.getByRole('heading', { name: 'Đăng nhập' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Mật khẩu')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'LOGIN' })).toBeInTheDocument();
  });

  it('should show validation error if email format is invalid', async () => {
    // Act
    render(<LoginPage />);
    
    const emailInput = screen.getByPlaceholderText('Email');
    const submitBtn = screen.getByRole('button', { name: 'LOGIN' });

    // Type invalid email format
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.submit(emailInput.closest('form')!);

    // Assert
    expect(await screen.findByText('Email không hợp lệ')).toBeInTheDocument();
    expect(loginApi).not.toHaveBeenCalled();
  });

  it('should trigger loginApi call on valid form submit', async () => {
    // Arrange
    vi.mocked(loginApi).mockResolvedValue({
      token: 'mock-jwt-token',
      user: {
        userId: 1,
        email: 'johndoe@example.com',
        roles: ['Player'],
      },
    });

    // Act
    render(<LoginPage />);
    
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Mật khẩu');
    const submitBtn = screen.getByRole('button', { name: 'LOGIN' });

    fireEvent.change(emailInput, { target: { value: 'johndoe@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    fireEvent.click(submitBtn);

    // Assert
    await waitFor(() => {
      expect(loginApi).toHaveBeenCalledWith({
        email: 'johndoe@example.com',
        password: 'Password123!',
      });
    });
  });
});
