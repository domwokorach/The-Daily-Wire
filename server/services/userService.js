import { findUserById, updateProfile as updateProfileRow, toSafeUser } from '../repositories/userRepository.js';

export async function updateProfile(userId, { fullName, dateOfBirth, mobileNumber }) {
  await updateProfileRow(userId, { fullName, dateOfBirth, mobile: mobileNumber });
  return { status: 200, body: { user: toSafeUser(await findUserById(userId)) } };
}
