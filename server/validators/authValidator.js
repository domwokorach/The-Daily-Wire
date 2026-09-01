import { sanitizeText, sanitizeIsoDate } from '../utils/sanitize.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_RE = /^\+?[0-9()\-.\s]{7,20}$/;
const MIN_PASSWORD_LENGTH = 10;
const MAX_PASSWORD_LENGTH = 256;
const MIN_AGE_YEARS = 13;

function fail(status, code, message) {
  return { ok: false, status, code, message };
}

function isValidPassword(password) {
  return (
    typeof password === 'string' &&
    password.length >= MIN_PASSWORD_LENGTH &&
    password.length <= MAX_PASSWORD_LENGTH
  );
}

function isOldEnough(dateOfBirth) {
  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) return false;
  const ageMs = Date.now() - dob.getTime();
  const ageYears = ageMs / (365.25 * 24 * 60 * 60 * 1000);
  return ageYears >= MIN_AGE_YEARS && ageYears < 130;
}

export function parseRegisterBody(body) {
  const fullName = sanitizeText(body.fullName, 120);
  const dateOfBirth = sanitizeIsoDate(body.dateOfBirth);
  const email = sanitizeText(body.email, 254)?.toLowerCase();
  const mobileNumber = sanitizeText(body.mobileNumber, 20);
  const password = typeof body.password === 'string' ? body.password : '';

  if (!fullName) return fail(422, 'INVALID_NAME', 'Enter your full name.');
  if (!dateOfBirth || !isOldEnough(dateOfBirth)) {
    return fail(422, 'INVALID_DOB', 'Enter a valid date of birth.');
  }
  if (!email || !EMAIL_RE.test(email)) return fail(422, 'INVALID_EMAIL', 'Enter a valid email address.');
  if (!mobileNumber || !MOBILE_RE.test(mobileNumber)) {
    return fail(422, 'INVALID_MOBILE', 'Enter a valid mobile number.');
  }
  if (!isValidPassword(password)) {
    return fail(422, 'INVALID_PASSWORD', `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
  }
  if (body.password !== body.confirmPassword) {
    return fail(422, 'PASSWORD_MISMATCH', 'Passwords do not match.');
  }

  return { ok: true, params: { fullName, dateOfBirth, email, mobileNumber, password } };
}

export function parseLoginBody(body) {
  const email = sanitizeText(body.email, 254)?.toLowerCase();
  const password = typeof body.password === 'string' ? body.password : '';
  if (!email || !password) return fail(400, 'MISSING_CREDENTIALS', 'Email and password are required.');
  return { ok: true, params: { email, password } };
}

export function parseForgotPasswordBody(body) {
  const email = sanitizeText(body.email, 254)?.toLowerCase();
  if (!email) return fail(400, 'MISSING_EMAIL', 'Enter your email address.');
  return { ok: true, params: { email } };
}

export function parseResetPasswordBody(body) {
  const token = sanitizeText(body.token, 200);
  const password = typeof body.password === 'string' ? body.password : '';
  if (!token) return fail(400, 'MISSING_TOKEN', 'Reset token is required.');
  if (!isValidPassword(password)) {
    return fail(422, 'INVALID_PASSWORD', `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
  }
  if (body.password !== body.confirmPassword) return fail(422, 'PASSWORD_MISMATCH', 'Passwords do not match.');
  return { ok: true, params: { token, password } };
}

export function parseChangePasswordBody(body) {
  const currentPassword = typeof body.currentPassword === 'string' ? body.currentPassword : '';
  const newPassword = typeof body.newPassword === 'string' ? body.newPassword : '';
  if (!currentPassword) return fail(400, 'MISSING_CURRENT_PASSWORD', 'Enter your current password.');
  if (!isValidPassword(newPassword)) {
    return fail(422, 'INVALID_PASSWORD', `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
  }
  if (body.newPassword !== body.confirmNewPassword) {
    return fail(422, 'PASSWORD_MISMATCH', 'Passwords do not match.');
  }
  return { ok: true, params: { currentPassword, newPassword } };
}

export function parseChangeEmailBody(body) {
  const newEmail = sanitizeText(body.newEmail, 254)?.toLowerCase();
  const currentPassword = typeof body.currentPassword === 'string' ? body.currentPassword : '';
  if (!newEmail || !EMAIL_RE.test(newEmail)) return fail(422, 'INVALID_EMAIL', 'Enter a valid email address.');
  if (body.newEmail !== body.confirmNewEmail) return fail(422, 'EMAIL_MISMATCH', 'Email addresses do not match.');
  if (!currentPassword) return fail(400, 'MISSING_PASSWORD', 'Confirm your password to continue.');
  return { ok: true, params: { newEmail, currentPassword } };
}

export function parseProfileBody(body) {
  const fullName = sanitizeText(body.fullName, 120);
  const dateOfBirth = sanitizeIsoDate(body.dateOfBirth);
  const mobileNumber = sanitizeText(body.mobileNumber, 20);
  if (!fullName) return fail(422, 'INVALID_NAME', 'Enter your full name.');
  if (!dateOfBirth || !isOldEnough(dateOfBirth)) return fail(422, 'INVALID_DOB', 'Enter a valid date of birth.');
  if (!mobileNumber || !MOBILE_RE.test(mobileNumber)) {
    return fail(422, 'INVALID_MOBILE', 'Enter a valid mobile number.');
  }
  return { ok: true, params: { fullName, dateOfBirth, mobileNumber } };
}

export function parseDeleteAccountBody(body) {
  const confirmation = sanitizeText(body.confirmation, 20);
  const currentPassword = typeof body.currentPassword === 'string' ? body.currentPassword : '';
  if (confirmation !== 'DELETE') {
    return fail(422, 'CONFIRMATION_REQUIRED', 'Type DELETE to confirm.');
  }
  if (!currentPassword) return fail(400, 'MISSING_PASSWORD', 'Confirm your password to continue.');
  return { ok: true, params: { currentPassword } };
}

export function parseVerifyEmailBody(body) {
  const token = sanitizeText(body.token, 200);
  if (!token) return fail(400, 'MISSING_TOKEN', 'Verification token is required.');
  return { ok: true, params: { token } };
}
