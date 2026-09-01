import { Container, Link, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNoneOutlined';
import type { Article } from '@/data/mockArticles';
import { timeAgo } from '@/utils/formatDate';
import { buildArticlePath, ROUTES } from '@/config/routes';
import StatusChip from '@/components/common/StatusChip';

interface BreakingNewsBarProps {
  articles: Article[];
}

function BreakingNewsBar({ articles }: BreakingNewsBarProps) {
  if (articles.length === 0) return null;

  return (
    <Stack
      sx={{
        bgcolor: 'surfaceAlt.main',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="xl">
        <Stack
          direction="row"
          spacing={1.5}
          sx={{
            py: 1,
            alignItems: 'center',
            overflowX: 'auto',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          <StatusChip status="breaking" label="LATEST" size="small" sx={{ flexShrink: 0 }} />
          <Stack
            direction="row"
            spacing={4}
            sx={{ alignItems: 'center', overflowX: 'auto', '&::-webkit-scrollbar': { display: 'none' } }}
          >
            {articles.map((article) => (
              <Stack key={article.id} direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
                {(article.breaking || article.live) && (
                  <StatusChip
                    status={article.live ? 'live' : 'breaking'}
                    label={article.live ? 'LIVE' : 'BREAKING'}
                    size="small"
                    sx={{ flexShrink: 0, height: 18, fontSize: '0.6rem', '& .MuiChip-label': { px: 0.6 } }}
                  />
                )}
                {article.categoryLabel && (
                  <Typography
                    variant="overline"
                    color="primary.main"
                    sx={{ fontSize: '0.65rem', whiteSpace: 'nowrap' }}
                  >
                    {article.categoryLabel}
                  </Typography>
                )}
                <Link
                  component={RouterLink}
                  to={buildArticlePath(article.id)}
                  underline="hover"
                  sx={{ color: 'inherit', '&:hover': { color: 'primary.main' } }}
                >
                  <Typography
                    variant="body2"
                    color="text.primary"
                    sx={{
                      whiteSpace: 'nowrap',
                      fontWeight: 500,
                      fontSize: '0.85rem',
                    }}
                  >
                    {article.headline}
                  </Typography>
                </Link>
                {article.timestamp && (
                  <Typography
                    variant="caption"
                    color="text.disabled"
                    sx={{ whiteSpace: 'nowrap', fontSize: '0.7rem' }}
                  >
                    {timeAgo(article.timestamp)}
                  </Typography>
                )}
                <ChevronRightIcon sx={{ fontSize: '1rem', color: 'text.disabled' }} />
              </Stack>
            ))}
          </Stack>
          <Link
            component={RouterLink}
            to={ROUTES.SUBSCRIBE}
            underline="hover"
            sx={{
              flexShrink: 0,
              ml: 'auto',
              pl: 2,
              display: { xs: 'none', sm: 'inline-flex' },
              alignItems: 'center',
              gap: 0.5,
              color: 'text.secondary',
              '&:hover': { color: 'primary.main' },
            }}
          >
            <NotificationsNoneIcon sx={{ fontSize: '1rem' }} />
            <Typography variant="caption" sx={{ whiteSpace: 'nowrap', fontWeight: 600 }}>
              Get Breaking News Alerts
            </Typography>
          </Link>
        </Stack>
      </Container>
    </Stack>
  );
}

export default BreakingNewsBar;
