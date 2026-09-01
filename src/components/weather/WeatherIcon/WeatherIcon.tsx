import type { SvgIconComponent } from '@mui/icons-material';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import CloudQueueOutlinedIcon from '@mui/icons-material/CloudQueueOutlined';
import CloudOutlinedIcon from '@mui/icons-material/CloudOutlined';
import GrainOutlinedIcon from '@mui/icons-material/GrainOutlined';
import ThunderstormOutlinedIcon from '@mui/icons-material/ThunderstormOutlined';
import AcUnitOutlinedIcon from '@mui/icons-material/AcUnitOutlined';
import BlurOnOutlinedIcon from '@mui/icons-material/BlurOnOutlined';

interface IconSpec {
  Icon: SvgIconComponent;
  color: string;
}

// Maps OpenWeather's icon code prefix (its two leading digits — the trailing
// d/n day/night suffix doesn't change which glyph we show, only real photo
// icons would need that) to a restrained Material icon + accent colour, kept
// deliberately muted rather than the bright cyan/neon a typical weather app
// would use.
const ICON_MAP: Record<string, IconSpec> = {
  '01': { Icon: WbSunnyOutlinedIcon, color: 'primary.main' },
  '02': { Icon: CloudQueueOutlinedIcon, color: 'secondary.main' },
  '03': { Icon: CloudQueueOutlinedIcon, color: 'secondary.main' },
  '04': { Icon: CloudOutlinedIcon, color: 'text.secondary' },
  '09': { Icon: GrainOutlinedIcon, color: 'secondary.main' },
  '10': { Icon: GrainOutlinedIcon, color: 'secondary.main' },
  '11': { Icon: ThunderstormOutlinedIcon, color: 'breaking.main' },
  '13': { Icon: AcUnitOutlinedIcon, color: 'text.secondary' },
  '50': { Icon: BlurOnOutlinedIcon, color: 'text.disabled' },
};

const DEFAULT_SPEC: IconSpec = { Icon: CloudQueueOutlinedIcon, color: 'text.secondary' };

interface WeatherIconProps {
  icon?: string;
  fontSize?: number;
}

function WeatherIcon({ icon, fontSize = 32 }: WeatherIconProps) {
  const spec = (icon && ICON_MAP[icon.slice(0, 2)]) || DEFAULT_SPEC;
  const { Icon, color } = spec;

  return <Icon sx={{ fontSize, color }} />;
}

export default WeatherIcon;
