import { APP_CONFIG } from '@/config/appConfig';

export const BREAKING_STREAM_URL = `${APP_CONFIG.apiBaseUrl}/notifications/breaking/stream`;

export interface BreakingAlert {
  id: string;
  headline: string;
  summary?: string;
  category: string;
  url: string;
  timestamp: string;
}
