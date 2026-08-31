import { Chip, type ChipProps } from '@mui/material';

interface StatusChipProps extends Omit<ChipProps, 'color'> {
  status: 'breaking' | 'live';
}

function StatusChip({ status, sx, ...rest }: StatusChipProps) {
  const isLive = status === 'live';
  return (
    <Chip
      {...rest}
      sx={{
        bgcolor: isLive ? 'live.main' : 'breaking.main',
        color: isLive ? 'live.contrastText' : 'breaking.contrastText',
        fontSize: '0.65rem',
        letterSpacing: '0.06em',
        border: '1px solid rgba(255,255,255,0.15)',
        ...sx,
      }}
    />
  );
}

export default StatusChip;
