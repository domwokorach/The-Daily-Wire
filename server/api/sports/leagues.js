import { asyncHandler } from '../../middleware/errorHandler.js';
import { fetchLeagues } from '../../providers/apiFootball/leagues.js';
import { sanitizeText } from '../../utils/sanitize.js';

/** Discovery only — for confirming league IDs during setup, not called by
 * the frontend. Mounted only in non-production (see `api/sports/index.js`). */
export default asyncHandler(async (req, res) => {
  const country = sanitizeText(req.query.country, 100);
  const current = req.query.current === 'true' ? 'true' : undefined;
  const data = await fetchLeagues({ country, current });
  res.status(200).json({ leagues: data?.response ?? [] });
});
