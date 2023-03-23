import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { Login } from '~/components';
import { api } from '~/utils/api';

jest.mock('next/navigation');
jest.mock('../utils/api', () => {
  return {
    api: {
      admin: {
        login: {
          useMutation: jest.fn().mockImplementation(() => ({
            mutate: jest.fn().mockResolvedValue({ success: true }),
          })),
        },
      },
    },
  };
});

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

  it.skip('should redirect to the dashboard page after successful login', async () => {
    const mockPush = jest.fn();
    const useRouterMock = jest.fn(() => ({ push: mockPush })) as jest.Mock;

    //@ts-ignore
    useRouter.mockImplementation(useRouterMock);

    const useMutationMock = jest.fn().mockImplementation(() => ({ mutate: jest.fn() }))
    //@ts-ignore
    api.admin.login.useMutation.mockImplementation(useMutationMock)

    const { getByLabelText, getByText } = render(<Login />);
    const emailInput = getByLabelText('Email address') as HTMLInputElement;
    const passwordInput = getByLabelText('Password') as HTMLInputElement;
    const signInButton = getByText('Sign in') as HTMLButtonElement;

    fireEvent.change(emailInput, { target: { value: 'hi@email.com' } });
    fireEvent.change(passwordInput, { target: { value: 'admin' } });
    fireEvent.click(signInButton);

    await waitFor(() => screen.debug())

    // await waitFor(() => expect(useMutationMock).toBeCalledTimes(1))
  });
});
