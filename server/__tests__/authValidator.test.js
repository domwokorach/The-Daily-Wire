import {
  parseRegisterBody,
  parseLoginBody,
  parseChangePasswordBody,
  parseDeleteAccountBody,
} from '../validators/authValidator.js';

const VALID_REGISTER = {
  fullName: 'Ada Lovelace',
  dateOfBirth: '1990-01-01',
  email: 'ada@example.com',
  mobileNumber: '+447700900000',
  password: 'correct horse battery',
  confirmPassword: 'correct horse battery',
};

describe('parseRegisterBody', () => {
  test('accepts a valid registration', () => {
    const result = parseRegisterBody(VALID_REGISTER);
    expect(result.ok).toBe(true);
    expect(result.params.email).toBe('ada@example.com');
  });

  test('rejects a mismatched password confirmation', () => {
    const result = parseRegisterBody({ ...VALID_REGISTER, confirmPassword: 'something else' });
    expect(result.ok).toBe(false);
    expect(result.code).toBe('PASSWORD_MISMATCH');
  });

  test('rejects a short password', () => {
    const result = parseRegisterBody({ ...VALID_REGISTER, password: 'short', confirmPassword: 'short' });
    expect(result.ok).toBe(false);
    expect(result.code).toBe('INVALID_PASSWORD');
  });

  test('rejects an under-13 date of birth', () => {
    const recentDob = new Date();
    recentDob.setFullYear(recentDob.getFullYear() - 5);
    const result = parseRegisterBody({ ...VALID_REGISTER, dateOfBirth: recentDob.toISOString().slice(0, 10) });
    expect(result.ok).toBe(false);
    expect(result.code).toBe('INVALID_DOB');
  });

  test('rejects an invalid email', () => {
    const result = parseRegisterBody({ ...VALID_REGISTER, email: 'not-an-email' });
    expect(result.ok).toBe(false);
    expect(result.code).toBe('INVALID_EMAIL');
  });
});

describe('parseLoginBody', () => {
  test('requires both email and password', () => {
    expect(parseLoginBody({ email: 'ada@example.com' }).ok).toBe(false);
    expect(parseLoginBody({ password: 'x' }).ok).toBe(false);
  });

  test('accepts valid credentials shape', () => {
    const result = parseLoginBody({ email: 'ada@example.com', password: 'whatever' });
    expect(result.ok).toBe(true);
  });
});

describe('parseChangePasswordBody', () => {
  test('rejects mismatched confirmation', () => {
    const result = parseChangePasswordBody({
      currentPassword: 'old-password-1',
      newPassword: 'new password long enough',
      confirmNewPassword: 'different',
    });
    expect(result.ok).toBe(false);
    expect(result.code).toBe('PASSWORD_MISMATCH');
  });
});

describe('parseDeleteAccountBody', () => {
  test('rejects anything other than the literal confirmation phrase', () => {
    const result = parseDeleteAccountBody({ confirmation: 'delete', currentPassword: 'x' });
    expect(result.ok).toBe(false);
    expect(result.code).toBe('CONFIRMATION_REQUIRED');
  });

  test('accepts the exact confirmation phrase with a password', () => {
    const result = parseDeleteAccountBody({ confirmation: 'DELETE', currentPassword: 'x' });
    expect(result.ok).toBe(true);
  });
});
