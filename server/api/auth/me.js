import { asyncHandler } from '../../middleware/errorHandler.js';
import { getMe } from '../../services/authService.js';

export default asyncHandler(async (req, res) => {
  const { status, body } = getMe(req.user.id);
  res.status(status).json(body);
});
