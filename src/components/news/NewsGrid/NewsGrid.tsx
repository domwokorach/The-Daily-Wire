import Grid from '@mui/material/Grid';
import type { Article } from '@/data/mockArticles';
import ArticleCard, { ArticleCardSkeleton } from '@/components/news/ArticleCard';

interface NewsGridColumns {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
}

interface NewsGridProps {
  articles: Article[];
  columns?: NewsGridColumns;
  loading?: boolean;
  skeletonCount?: number;
}

const DEFAULT_COLUMNS: NewsGridColumns = { xs: 12, sm: 6, md: 4, lg: 3 };

function NewsGrid({ articles, columns, loading = false, skeletonCount = 4 }: NewsGridProps) {
  const cols = columns ?? DEFAULT_COLUMNS;

  if (loading) {
    return (
      <Grid container spacing={{ xs: 2, md: 3 }}>
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <Grid key={index} size={cols}>
            <ArticleCardSkeleton />
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Grid container spacing={{ xs: 2, md: 3 }}>
      {articles.map((article) => (
        <Grid key={article.id} size={cols}>
          <ArticleCard article={article} />
        </Grid>
      ))}
    </Grid>
  );
}

export default NewsGrid;
