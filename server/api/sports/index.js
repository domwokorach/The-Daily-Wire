import { Router } from 'express';
import { getEnv } from '../../config/env.js';
import liveRoute from './live.js';
import fixturesRoute from './fixtures.js';
import resultsRoute from './results.js';
import standingsRoute from './standings.js';
import teamsRoute from './teams.js';
import topScorersRoute from './topScorers.js';
import matchRoute from './match.js';
import leaguesRoute from './leagues.js';

const router = Router();

// Local development only — never returns the key itself, only whether the
// server is configured. `/leagues` (raw provider discovery) is also
// dev-only — it's for confirming league IDs during setup, not a route the
// frontend calls, and burns the free daily quota if left reachable.
if (!getEnv().isProduction) {
  router.get('/debug', (_req, res) => {
    res.status(200).json({
      configured: Boolean(getEnv().sportsApiKey),
      provider: 'api-football',
    });
  });
  router.get('/leagues', leaguesRoute);
}

router.get('/live', liveRoute);
router.get('/fixtures', fixturesRoute);
router.get('/results', resultsRoute);
router.get('/standings', standingsRoute);
router.get('/teams', teamsRoute);
router.get('/top-scorers', topScorersRoute);
router.get('/match/:id', matchRoute);

export default router;
