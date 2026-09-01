import { asyncHandler } from '../../middleware/errorHandler.js';
import { getPreferences } from '../../services/notificationService.js';

export default asyncHandler(async (req, res) => {
  const { status, body } = await getPreferences(req.user.id);
  res.status(status).json(body);
});
