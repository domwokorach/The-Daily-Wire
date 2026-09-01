import { hasTestDb, resetTestDb } from './helpers/testDb.js';
import { register, login } from '../services/authService.js';
import { findSessionByToken } from '../repositories/sessionRepository.js';
import { findUserByEmail } from '../repositories/userRepository.js';

const PAYLOAD = {
  fullName: 'Ada Lovelace',
  dateOfBirth: '1990-01-01',
  email: 'ada@example.com',
  mobileNumber: '+447700900000',
  password: 'correct horse battery',
};

const maybeDescribe = hasTestDb ? describe : describe.skip;

beforeAll(async () => {
  if (hasTestDb) await resetTestDb();
});

maybeDescribe('register', () => {
  test('hashes the password rather than storing it in plain text', async () => {
    await register(PAYLOAD, 'jest');
    const row = await findUserByEmail(PAYLOAD.email);
    expect(row.password_hash).toBeDefined();
    expect(row.password_hash).not.toBe(PAYLOAD.password);
  });

  test('issues a valid session on registration', async () => {
    const result = await register({ ...PAYLOAD, email: 'session-check@example.com' }, 'jest');
    expect(result.session.token).toBeDefined();
    const session = await findSessionByToken(result.session.token);
    expect(session).toBeTruthy();
  });

  test('rejects a second registration with the same email', async () => {
    const result = await register(PAYLOAD, 'jest');
    expect(result.status).toBe(409);
  });
});

maybeDescribe('login', () => {
  test('rejects an incorrect password without revealing whether the account exists', async () => {
    const result = await login({ email: PAYLOAD.email, password: 'wrong-password' }, 'jest');
    expect(result.status).toBe(401);
    expect(result.body.code).toBe('INVALID_CREDENTIALS');
  });

  test('rejects a login for an email that was never registered, with the same generic error', async () => {
    const result = await login({ email: 'nobody@example.com', password: 'whatever' }, 'jest');
    expect(result.status).toBe(401);
    expect(result.body.code).toBe('INVALID_CREDENTIALS');
  });

  test('succeeds with correct credentials and issues a session', async () => {
    const result = await login({ email: PAYLOAD.email, password: PAYLOAD.password }, 'jest');
    expect(result.status).toBe(200);
    expect(result.session.token).toBeDefined();
  });
});
