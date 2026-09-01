import bcrypt from 'bcrypt';
import {
  createUser,
  findUserByEmail,
  findUserById,
  markEmailVerified,
  setPendingEmail,
  applyPendingEmail,
  updatePasswordHash,
  anonymizeUserComments,
  deleteUser,
  toSafeUser,
} from '../repositories/userRepository.js';
import { createSession, deleteAllSessionsForUser } from '../repositories/sessionRepository.js';
import {
  createPasswordResetToken,
  consumePasswordResetToken,
  createEmailVerificationToken,
  consumeEmailVerificationToken,
} from '../repositories/tokenRepository.js';
import { sendVerificationEmail, sendPasswordResetEmail, sendEmailChangeVerification } from './emailService.js';

const BCRYPT_ROUNDS = 12;

function genericAuthFailure() {
  return { status: 401, body: { error: true, code: 'INVALID_CREDENTIALS', message: 'Email or password is incorrect.' } };
}

export async function register({ fullName, dateOfBirth, email, mobileNumber, password }, userAgent) {
  if (findUserByEmail(email)) {
    return { status: 409, body: { error: true, code: 'EMAIL_TAKEN', message: 'An account with that email already exists.' } };
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const user = createUser({ fullName, dateOfBirth, email, mobile: mobileNumber, passwordHash });

  const token = createEmailVerificationToken(user.id, email);
  sendVerificationEmail(email, token).catch((err) => console.error('[authService] verification email failed', err));

  const session = createSession(user.id, userAgent);
  return { status: 201, body: { user: toSafeUser(user) }, session };
}

export async function login({ email, password }, userAgent) {
  const user = findUserByEmail(email);
  if (!user) return genericAuthFailure();

  const matches = await bcrypt.compare(password, user.password_hash);
  if (!matches) return genericAuthFailure();

  const session = createSession(user.id, userAgent);
  return { status: 200, body: { user: toSafeUser(user) }, session };
}

export function getMe(userId) {
  const user = findUserById(userId);
  if (!user) return { status: 404, body: { error: true, code: 'NOT_FOUND', message: 'Account not found.' } };
  return { status: 200, body: { user: toSafeUser(user) } };
}

export async function verifyEmail(token) {
  const row = consumeEmailVerificationToken(token);
  if (!row) {
    return { status: 400, body: { error: true, code: 'INVALID_TOKEN', message: 'This verification link is invalid or has expired.' } };
  }

  const user = findUserById(row.user_id);
  if (user?.pending_email && user.pending_email === row.target_email) {
    applyPendingEmail(user.id, row.target_email);
  } else {
    markEmailVerified(row.user_id);
  }
  return { status: 200, body: { verified: true } };
}

export async function requestPasswordReset(email) {
  const user = findUserByEmail(email);
  if (user) {
    const token = createPasswordResetToken(user.id);
    sendPasswordResetEmail(email, token).catch((err) => console.error('[authService] reset email failed', err));
  }
  return {
    status: 200,
    body: { message: 'If an account exists for that email, password reset instructions have been sent.' },
  };
}

export async function resetPassword(token, password) {
  const row = consumePasswordResetToken(token);
  if (!row) {
    return { status: 400, body: { error: true, code: 'INVALID_TOKEN', message: 'This reset link is invalid or has expired.' } };
  }
  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  updatePasswordHash(row.user_id, passwordHash);
  deleteAllSessionsForUser(row.user_id);
  return { status: 200, body: { message: 'Password reset successfully.' } };
}

export async function changePassword(userId, { currentPassword, newPassword }) {
  const user = findUserById(userId);
  const matches = await bcrypt.compare(currentPassword, user.password_hash);
  if (!matches) {
    return { status: 401, body: { error: true, code: 'INVALID_PASSWORD', message: 'Your current password is incorrect.' } };
  }
  const passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
  updatePasswordHash(userId, passwordHash);
  deleteAllSessionsForUser(userId);
  const session = createSession(userId);
  return { status: 200, body: { message: 'Password changed successfully.' }, session };
}

export async function requestEmailChange(userId, { newEmail, currentPassword }) {
  const user = findUserById(userId);
  const matches = await bcrypt.compare(currentPassword, user.password_hash);
  if (!matches) {
    return { status: 401, body: { error: true, code: 'INVALID_PASSWORD', message: 'Your password is incorrect.' } };
  }
  if (findUserByEmail(newEmail)) {
    return { status: 409, body: { error: true, code: 'EMAIL_TAKEN', message: 'An account with that email already exists.' } };
  }

  setPendingEmail(userId, newEmail);
  const token = createEmailVerificationToken(userId, newEmail);
  sendEmailChangeVerification(newEmail, token).catch((err) => console.error('[authService] change-email email failed', err));
  return { status: 200, body: { message: 'Verification email sent to your new address.' } };
}

export async function deleteAccount(userId, currentPassword) {
  const user = findUserById(userId);
  const matches = await bcrypt.compare(currentPassword, user.password_hash);
  if (!matches) {
    return { status: 401, body: { error: true, code: 'INVALID_PASSWORD', message: 'Your password is incorrect.' } };
  }
  anonymizeUserComments(userId);
  deleteAllSessionsForUser(userId);
  deleteUser(userId);
  return { status: 200, body: { message: 'Account deleted.' } };
}
