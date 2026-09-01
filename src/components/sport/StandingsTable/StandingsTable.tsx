import {
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import type { StandingRow } from '@/features/sport';
import { getStandingsZone, ZONE_ACCENT_COLOR } from '@/features/sport/utils/standingsIndicator';
import ResponsiveImage from '@/components/common/ResponsiveImage';

const BADGE_SIZE = 20;

interface StandingsTableProps {
  standings: StandingRow[];
}

// `hideOnMobile` columns collapse on small screens — the mobile table
// keeps only #, Team, P, GD, Pts per the mobile layout spec.
const HEAD_CELLS: { label: string; align: 'left' | 'center'; hideOnMobile?: boolean }[] = [
  { label: '#', align: 'left' },
  { label: 'Team', align: 'left' },
  { label: 'P', align: 'center' },
  { label: 'W', align: 'center', hideOnMobile: true },
  { label: 'D', align: 'center', hideOnMobile: true },
  { label: 'L', align: 'center', hideOnMobile: true },
  { label: 'GF', align: 'center', hideOnMobile: true },
  { label: 'GA', align: 'center', hideOnMobile: true },
  { label: 'GD', align: 'center' },
  { label: 'Pts', align: 'center' },
];

function StandingsTable({ standings }: StandingsTableProps) {
  const totalTeams = standings.length;

  return (
    <TableContainer sx={{ overflowX: 'auto' }}>
      <Table size="small" sx={{ minWidth: 420 }}>
        <TableHead>
          <TableRow>
            {HEAD_CELLS.map((cell) => (
              <TableCell
                key={cell.label}
                align={cell.align}
                sx={{
                  color: 'text.secondary',
                  fontWeight: 700,
                  borderColor: 'divider',
                  display: cell.hideOnMobile ? { xs: 'none', sm: 'table-cell' } : undefined,
                }}
              >
                {cell.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {standings.map((row) => {
            const zone = getStandingsZone(row.position, totalTeams);
            return (
              <TableRow key={row.team.id ?? row.position}>
                <TableCell
                  sx={{
                    borderColor: 'divider',
                    color: 'text.secondary',
                    borderLeft: zone ? '3px solid' : '3px solid transparent',
                    borderLeftColor: zone ? ZONE_ACCENT_COLOR[zone] : 'transparent',
                  }}
                >
                  {row.position}
                </TableCell>
                <TableCell sx={{ borderColor: 'divider' }}>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    {row.team.badge ? (
                      <Box sx={{ width: BADGE_SIZE, height: BADGE_SIZE, flexShrink: 0 }}>
                        <ResponsiveImage variant="badge" src={row.team.badge} alt={`${row.team.name} badge`} />
                      </Box>
                    ) : (
                      <Box sx={{ width: BADGE_SIZE, height: BADGE_SIZE, flexShrink: 0 }} />
                    )}
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                      {row.team.name}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell align="center" sx={{ borderColor: 'divider', color: 'text.secondary' }}>
                  {row.played}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ borderColor: 'divider', color: 'text.secondary', display: { xs: 'none', sm: 'table-cell' } }}
                >
                  {row.won}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ borderColor: 'divider', color: 'text.secondary', display: { xs: 'none', sm: 'table-cell' } }}
                >
                  {row.drawn}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ borderColor: 'divider', color: 'text.secondary', display: { xs: 'none', sm: 'table-cell' } }}
                >
                  {row.lost}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ borderColor: 'divider', color: 'text.secondary', display: { xs: 'none', sm: 'table-cell' } }}
                >
                  {row.goalsFor}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ borderColor: 'divider', color: 'text.secondary', display: { xs: 'none', sm: 'table-cell' } }}
                >
                  {row.goalsAgainst}
                </TableCell>
                <TableCell align="center" sx={{ borderColor: 'divider', color: 'text.secondary' }}>
                  {typeof row.goalDifference === 'number' && row.goalDifference > 0
                    ? `+${row.goalDifference}`
                    : row.goalDifference}
                </TableCell>
                <TableCell align="center" sx={{ borderColor: 'divider' }}>
                  <Box component="span" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {row.points}
                  </Box>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default StandingsTable;
