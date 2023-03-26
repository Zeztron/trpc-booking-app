import { render, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { Login } from '~/components';
import { api } from '~/utils/api';
import withNextTRPCProvider from '~/utils/withNextTrpc';

jest.mock('next/navigation');

jest.mock('../utils/api', () => {
  return {
    api: {
      admin: {
        login: {
          useMutation: jest.fn(() => ({
            mutate: jest.fn(),
            isError: true,
          })),
        },
      },
    },
  };
});

const loginWithWrapper = () =>
  render(<Login />, { wrapper: withNextTRPCProvider });

describe('Login', () => {
  it('should update input state when user types in email input', async () => {
    const { getByLabelText } = loginWithWrapper();

    const emailInput = getByLabelText('Email address') as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });

    expect(emailInput.value).toBe('test@test.com');
  });

  it('should update input state when user types in password input', () => {
    const { getByLabelText } = loginWithWrapper();
    const passwordInput = getByLabelText('Password') as HTMLInputElement;

    fireEvent.change(passwordInput, { target: { value: 'test' } });

    expect(passwordInput.value).toBe('test');
  });

  it('should show error message when login fails', async () => {
    const { getByLabelText, getByText } = loginWithWrapper();

    const emailInput = getByLabelText('Email address') as HTMLInputElement;
    const passwordInput = getByLabelText('Password') as HTMLInputElement;
    const signInButton = getByText('Sign in') as HTMLButtonElement;

    fireEvent.change(emailInput, {
      target: { value: 'wrongemail@example.com' },
    });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });

    fireEvent.click(signInButton);

    await waitFor(() =>
      expect(getByText('Invalid login credentials.')).toBeInTheDocument()
    );
  });

  it('should redirect to the dashboard page after successful login', async () => {
    const mutate = jest.fn();
    const mockPush = jest.fn();
    const useRouterMock = jest.fn(() => ({ push: mockPush })) as jest.Mock;

    //@ts-ignore
    api.admin.login.useMutation.mockImplementation(({ onSuccess }) => {
      onSuccess();
      return { mutate };
    });

    //@ts-ignore
    useRouter.mockImplementation(useRouterMock);

    const { getByLabelText, getByText } = loginWithWrapper();
    const emailInput = getByLabelText('Email address') as HTMLInputElement;
    const passwordInput = getByLabelText('Password') as HTMLInputElement;
    const signInButton = getByText('Sign in') as HTMLButtonElement;

    fireEvent.change(emailInput, { target: { value: 'admin@email.com' } });
    fireEvent.change(passwordInput, { target: { value: 'admin' } });
    fireEvent.click(signInButton);

    await waitFor(() => expect(mutate).toBeCalledTimes(1));
    await waitFor(() =>
      expect(mutate).toBeCalledWith({
        email: 'admin@email.com',
        password: 'admin',
      })
    );

    await waitFor(() => expect(mockPush).toBeCalledWith('/dashboard'));
  });
});
