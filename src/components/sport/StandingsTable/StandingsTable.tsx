import {
  Avatar,
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

interface StandingsTableProps {
  standings: StandingRow[];
}

const HEAD_CELLS = ['#', 'Team', 'P', 'W', 'D', 'L', 'GD', 'Pts'];

function StandingsTable({ standings }: StandingsTableProps) {
  return (
    <TableContainer sx={{ overflowX: 'auto' }}>
      <Table size="small" sx={{ minWidth: 480 }}>
        <TableHead>
          <TableRow>
            {HEAD_CELLS.map((label, index) => (
              <TableCell
                key={label}
                align={index < 2 ? 'left' : 'center'}
                sx={{ color: 'text.secondary', fontWeight: 700, borderColor: 'divider' }}
              >
                {label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {standings.map((row) => (
            <TableRow key={row.team.id ?? row.position}>
              <TableCell sx={{ borderColor: 'divider', color: 'text.secondary' }}>{row.position}</TableCell>
              <TableCell sx={{ borderColor: 'divider' }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <Avatar
                    src={row.team.badge ?? undefined}
                    variant="square"
                    sx={{ width: 20, height: 20, bgcolor: 'transparent' }}
                  />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    {row.team.name}
                  </Typography>
                </Stack>
              </TableCell>
              <TableCell align="center" sx={{ borderColor: 'divider', color: 'text.secondary' }}>
                {row.played}
              </TableCell>
              <TableCell align="center" sx={{ borderColor: 'divider', color: 'text.secondary' }}>
                {row.won}
              </TableCell>
              <TableCell align="center" sx={{ borderColor: 'divider', color: 'text.secondary' }}>
                {row.drawn}
              </TableCell>
              <TableCell align="center" sx={{ borderColor: 'divider', color: 'text.secondary' }}>
                {row.lost}
              </TableCell>
              <TableCell align="center" sx={{ borderColor: 'divider', color: 'text.secondary' }}>
                {typeof row.goalDifference === 'number' && row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
              </TableCell>
              <TableCell align="center" sx={{ borderColor: 'divider' }}>
                <Box component="span" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  {row.points}
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default StandingsTable;
