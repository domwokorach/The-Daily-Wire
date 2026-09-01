import { apiClient } from '@/services/apiClient';
import { APP_CONFIG } from '@/config/appConfig';
import type { SafeUser } from '@/features/auth/types';

const AUTH_ENDPOINT = `${APP_CONFIG.apiBaseUrl}/auth`;

export interface ProfilePayload {
  fullName: string;
  dateOfBirth: string;
  mobileNumber: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface ChangeEmailPayload {
  newEmail: string;
  confirmNewEmail: string;
  currentPassword: string;
}

export function updateProfile(payload: ProfilePayload): Promise<SafeUser> {
  return apiClient.patch<{ user: SafeUser }>(`${AUTH_ENDPOINT}/profile`, payload).then((r) => r.user);
}

export function changePassword(payload: ChangePasswordPayload): Promise<{ message: string }> {
  return apiClient.post(`${AUTH_ENDPOINT}/change-password`, payload);
}

export function changeEmail(payload: ChangeEmailPayload): Promise<{ message: string }> {
  return apiClient.post(`${AUTH_ENDPOINT}/change-email`, payload);
}

export function deleteAccount(currentPassword: string): Promise<{ message: string }> {
  return apiClient.delete(`${AUTH_ENDPOINT}/me`, {
    body: JSON.stringify({ confirmation: 'DELETE', currentPassword }),
    headers: { 'Content-Type': 'application/json' },
  });
}
