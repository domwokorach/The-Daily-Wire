import { asyncHandler } from '../../middleware/errorHandler.js';
import { deleteSessionById } from '../../repositories/sessionRepository.js';
import { clearSessionCookie } from '../../utils/cookies.js';

export default asyncHandler(async (req, res) => {
  if (req.session) deleteSessionById(req.session.id);
  clearSessionCookie(res);
  res.status(200).json({ loggedOut: true });
});
