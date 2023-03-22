import { render, fireEvent, screen } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { Login } from '~/components';

jest.mock('next/navigation');

describe('Login', () => {
  it('should update input state when user types in email input', () => {
    const { getByLabelText } = render(<Login />);
    const emailInput = getByLabelText('Email address') as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });

    expect(emailInput.value).toBe('test@test.com');
  });

  it('should update input state when user types in password input', () => {
    const { getByLabelText } = render(<Login />);
    const passwordInput = getByLabelText('Password') as HTMLInputElement;

    fireEvent.change(passwordInput, { target: { value: 'test' } });

    expect(passwordInput.value).toBe('test');
  });

  it('should redirect to the dashboard page after successful login', () => {
    const mockPush = jest.fn();
    const useRouterMock = jest.fn(() => ({ push: mockPush })) as jest.Mock;
    //@ts-ignore
    useRouter.mockImplementation(useRouterMock);

    const { getByLabelText, getByText } = render(<Login />);
    const emailInput = getByLabelText('Email address') as HTMLInputElement;
    const passwordInput = getByLabelText('Password') as HTMLInputElement;
    const signInButton = getByText('Sign in') as HTMLButtonElement;

    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'test' } });
    fireEvent.click(signInButton);

    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });
});
