import { findUserById, updateProfile as updateProfileRow, toSafeUser } from '../repositories/userRepository.js';

export function updateProfile(userId, { fullName, dateOfBirth, mobileNumber }) {
  updateProfileRow(userId, { fullName, dateOfBirth, mobile: mobileNumber });
  return { status: 200, body: { user: toSafeUser(findUserById(userId)) } };
}
