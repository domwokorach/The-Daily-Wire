import { asyncHandler } from '../../middleware/errorHandler.js';
import { unsubscribePush } from '../../services/notificationService.js';

export default asyncHandler(async (req, res) => {
  const { status, body } = await unsubscribePush(req.user.id);
  res.status(status).json(body);
});
