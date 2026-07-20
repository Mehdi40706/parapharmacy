export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export const useAuth = () => {
  const api = useApi();

  const forgotPassword = (email: string) => {
    return api<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: { email },
    });
  };

  const resetPassword = (token: string, newPassword: string) => {
    return api<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: { token, newPassword },
    });
  };

  return { forgotPassword, resetPassword };
};