import { Avatar, Box, Stack, Typography } from '@mui/material';
import type { TopScorerRow } from '@/features/sport';

interface TopScorersListProps {
  topScorers: TopScorerRow[];
}

function TopScorersList({ topScorers }: TopScorersListProps) {
  return (
    <Stack>
      {topScorers.map((row, index) => (
        <Stack
          key={row.player.id ?? index}
          direction="row"
          spacing={1.5}
          sx={{
            alignItems: 'center',
            py: 1,
            borderBottom: '1px solid',
            borderColor: 'divider',
            '&:last-of-type': { borderBottom: 'none' },
          }}
        >
          <Typography variant="body2" sx={{ width: 20, color: 'text.disabled', fontWeight: 700 }}>
            {index + 1}
          </Typography>
          <Avatar
            src={row.player.photo ?? undefined}
            alt={`${row.player.name} photo`}
            slotProps={{ img: { loading: 'lazy', decoding: 'async' } }}
            sx={{ width: 32, height: 32 }}
          />
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography variant="body2" noWrap sx={{ fontWeight: 600, color: 'text.primary' }}>
              {row.player.name}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {row.team.name}
            </Typography>
          </Box>
          <Typography variant="caption" color="text.disabled" sx={{ display: { xs: 'none', sm: 'block' }, mr: 0.5 }}>
            {row.appearances} apps
          </Typography>
          <Typography
            variant="body1"
            sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 700, color: 'primary.main', minWidth: 20, textAlign: 'right' }}
          >
            {row.goals}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}

export default TopScorersList;
