export interface SafeUser {
  id: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  dateOfBirth: string;
  emailVerified: boolean;
  createdAt: string;
}

export interface RegisterPayload {
  fullName: string;
  dateOfBirth: string;
  email: string;
  mobileNumber: string;
  password: string;
  confirmPassword: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
  confirmPassword: string;
}
