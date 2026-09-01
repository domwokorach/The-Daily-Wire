import { useParams, Link as RouterLink } from 'react-router-dom';
import { Box, Button, Card, Chip, Grid, Stack, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Container from '@/components/common/Container';
import SectionHeader from '@/components/common/SectionHeader';
import LoadingState from '@/components/common/LoadingState';
import ErrorState from '@/components/common/ErrorState';
import StatusChip from '@/components/common/StatusChip';
import ResponsiveImage from '@/components/common/ResponsiveImage';
import { useMatchDetail } from '@/features/sport';
import { formatKickoff, formatMatchStatus, hasScore } from '@/features/sport/utils/formatFixture';
import { ROUTES } from '@/config/routes';

const HERO_BADGE_SIZE = 64;
const EVENT_BADGE_SIZE = 18;
const LINEUP_BADGE_SIZE = 20;

function TeamBadge({
  logo,
  name,
  size,
}: {
  logo: string | null | undefined;
  name: string | undefined;
  size: number;
}) {
  return logo ? (
    <Box sx={{ width: size, height: size, flexShrink: 0 }}>
      <ResponsiveImage variant="badge" src={logo} alt={`${name} badge`} />
    </Box>
  ) : (
    <Box sx={{ width: size, height: size, flexShrink: 0 }} />
  );
}

function MatchPage() {
  const { id } = useParams<{ id: string }>();
  const fixtureId = id ? Number(id) : undefined;
  const { match, loading, error } = useMatchDetail(fixtureId);

  if (!fixtureId || Number.isNaN(fixtureId)) {
    return (
      <Container maxWidth="md">
        <ErrorState message="That match couldn't be found." />
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Button
        component={RouterLink}
        to={ROUTES.SPORT}
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3, color: 'text.secondary' }}
      >
        Back to Sport
      </Button>

      {error && <ErrorState message={error} />}
      {!error && loading && <LoadingState variant="lead" />}

      {!error && !loading && match && (
        <>
          <Card sx={{ p: { xs: 2.5, md: 4 }, mb: { xs: 4, md: 5 } }}>
            <Stack sx={{ alignItems: 'center', mb: 2 }} spacing={0.5}>
              <Typography variant="overline" color="text.secondary">
                {match.fixture.competition.name} · {match.fixture.round}
              </Typography>
              {match.fixture.live ? (
                <StatusChip status="live" label={`LIVE ${formatMatchStatus(match.fixture)}`} size="small" />
              ) : (
                <Chip
                  label={formatMatchStatus(match.fixture)}
                  size="small"
                  sx={{ bgcolor: 'surfaceAlt.main', color: 'text.secondary' }}
                />
              )}
            </Stack>
            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'center' }} spacing={{ xs: 2, sm: 4 }}>
              <Stack sx={{ alignItems: 'center', width: { xs: 96, sm: 140 } }} spacing={1}>
                <TeamBadge logo={match.fixture.homeTeam.logo} name={match.fixture.homeTeam.name} size={HERO_BADGE_SIZE} />
                <Typography variant="subtitle1" sx={{ fontWeight: 700, textAlign: 'center' }}>
                  {match.fixture.homeTeam.name}
                </Typography>
              </Stack>
              <Typography
                variant="h2"
                sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 700, fontSize: { xs: '2.5rem', md: '3.5rem' } }}
              >
                {hasScore(match.fixture) ? `${match.fixture.homeScore} - ${match.fixture.awayScore}` : 'vs'}
              </Typography>
              <Stack sx={{ alignItems: 'center', width: { xs: 96, sm: 140 } }} spacing={1}>
                <TeamBadge logo={match.fixture.awayTeam.logo} name={match.fixture.awayTeam.name} size={HERO_BADGE_SIZE} />
                <Typography variant="subtitle1" sx={{ fontWeight: 700, textAlign: 'center' }}>
                  {match.fixture.awayTeam.name}
                </Typography>
              </Stack>
            </Stack>
            <Stack sx={{ alignItems: 'center', mt: 2 }} spacing={0.25}>
              <Typography variant="body2" color="text.secondary">
                {formatKickoff(match.fixture.kickoff)}
              </Typography>
              {match.fixture.venue && (
                <Typography variant="caption" color="text.disabled">
                  {match.fixture.venue}
                </Typography>
              )}
            </Stack>
          </Card>

          {match.events.length > 0 && (
            <Box sx={{ mb: { xs: 4, md: 5 } }}>
              <SectionHeader title="Match Events" />
              <Stack spacing={1.25}>
                {match.events.map((event, index) => (
                  <Stack key={index} direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ width: 44, color: 'text.disabled', fontWeight: 700 }}>
                      {event.minute}
                      {event.extraMinute ? `+${event.extraMinute}` : ''}'
                    </Typography>
                    <TeamBadge logo={event.team.logo} name={event.team.name} size={EVENT_BADGE_SIZE} />
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        {event.type}
                        {event.detail ? ` — ${event.detail}` : ''}
                      </Typography>
                      {event.player?.name && (
                        <Typography variant="caption" color="text.secondary">
                          {event.player.name}
                          {event.assist?.name ? ` (assist: ${event.assist.name})` : ''}
                        </Typography>
                      )}
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </Box>
          )}

          {match.lineups.length > 0 && (
            <Box sx={{ mb: { xs: 4, md: 5 } }}>
              <SectionHeader title="Line-ups" />
              <Grid container spacing={{ xs: 3, md: 4 }}>
                {match.lineups.map((lineup) => (
                  <Grid key={lineup.team.id} size={{ xs: 12, sm: 6 }}>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1 }}>
                      <TeamBadge logo={lineup.team.logo} name={lineup.team.name} size={LINEUP_BADGE_SIZE} />
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {lineup.team.name}
                      </Typography>
                      {lineup.formation && (
                        <Typography variant="caption" color="text.secondary">
                          ({lineup.formation})
                        </Typography>
                      )}
                    </Stack>
                    <Stack spacing={0.5}>
                      {lineup.startXI.map((player) => (
                        <Typography key={player.id} variant="body2" color="text.secondary">
                          <Box component="span" sx={{ color: 'text.disabled', mr: 1 }}>
                            {player.number}
                          </Box>
                          {player.name}
                        </Typography>
                      ))}
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {match.statistics.length > 0 && (
            <Box>
              <SectionHeader title="Statistics" />
              <Grid container spacing={{ xs: 3, md: 4 }}>
                {match.statistics.map((entry) => (
                  <Grid key={entry.team.id} size={{ xs: 12, sm: 6 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                      {entry.team.name}
                    </Typography>
                    <Stack spacing={0.75}>
                      {entry.stats.map((stat) => (
                        <Stack key={stat.type} direction="row" sx={{ justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">
                            {stat.type}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                            {stat.value === null || stat.value === undefined ? '—' : String(stat.value)}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </>
      )}
    </Container>
  );
}

export default MatchPage;
