import { apiClient } from '@/services/apiClient';
import { APP_CONFIG } from '@/config/appConfig';
import type { SafeUser, RegisterPayload, LoginPayload, ResetPasswordPayload } from '../types';

const AUTH_ENDPOINT = `${APP_CONFIG.apiBaseUrl}/auth`;

interface UserEnvelope {
  user: SafeUser;
}

export function register(payload: RegisterPayload): Promise<SafeUser> {
  return apiClient.post<UserEnvelope>(`${AUTH_ENDPOINT}/register`, payload).then((r) => r.user);
}

export function login(payload: LoginPayload): Promise<SafeUser> {
  return apiClient.post<UserEnvelope>(`${AUTH_ENDPOINT}/login`, payload).then((r) => r.user);
}

export function logout(): Promise<void> {
  return apiClient.post(`${AUTH_ENDPOINT}/logout`, {});
}

export function getMe(): Promise<SafeUser> {
  return apiClient.get<UserEnvelope>(`${AUTH_ENDPOINT}/me`).then((r) => r.user);
}

export function forgotPassword(email: string): Promise<{ message: string }> {
  return apiClient.post(`${AUTH_ENDPOINT}/forgot-password`, { email });
}

export function resetPassword(payload: ResetPasswordPayload): Promise<{ message: string }> {
  return apiClient.post(`${AUTH_ENDPOINT}/reset-password`, payload);
}

export function verifyEmail(token: string): Promise<{ verified: boolean }> {
  return apiClient.post(`${AUTH_ENDPOINT}/verify-email`, { token });
}
