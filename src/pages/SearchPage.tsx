import { useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Button, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Container from '@/components/common/Container';
import ErrorState from '@/components/common/ErrorState';
import NewsGrid from '@/components/news/NewsGrid';
import { useNewsSearch } from '@/features/news';

const SUGGESTED_QUERIES = [
  'AI',
  'UK economy',
  'NHS',
  'Parliament',
  'Bank of England',
  'Premier League',
  'London',
  'Scotland',
  'Wales',
  'Northern Ireland',
];

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const [draft, setDraft] = useState(query);

  const { articles, totalResults, loading, error, hasMore, loadMore, refetch } = useNewsSearch(query);

  const runSearch = (value: string) => {
    const trimmed = value.trim();
    setSearchParams(trimmed ? { q: trimmed } : {});
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    runSearch(draft);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: { xs: 3, md: 4 } }}>
        <Typography variant="h3" component="h1" sx={{ fontSize: { xs: '2rem', md: '2.75rem' } }}>
          Search
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
          Find coverage across every section.
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 2 }}>
        <TextField
          fullWidth
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Search news, e.g. artificial intelligence"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      <Stack direction="row" spacing={1} sx={{ mb: 4, flexWrap: 'wrap', gap: 1 }}>
        {SUGGESTED_QUERIES.map((suggestion) => (
          <Button
            key={suggestion}
            size="small"
            variant="outlined"
            onClick={() => {
              setDraft(suggestion);
              runSearch(suggestion);
            }}
          >
            {suggestion}
          </Button>
        ))}
      </Stack>

      {!query.trim() && (
        <Typography variant="body1" color="text.secondary">
          Enter a search term or pick a suggestion above to get started.
        </Typography>
      )}

      {query.trim() && error && <ErrorState message={error} onRetry={refetch} />}

      {query.trim() && !error && (
        <>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {loading && articles.length === 0
              ? 'Searching…'
              : `${totalResults.toLocaleString()} result${totalResults === 1 ? '' : 's'} for “${query}”`}
          </Typography>

          {!loading && articles.length === 0 && (
            <Typography variant="body1" color="text.secondary" sx={{ py: 4 }}>
              No results for &ldquo;{query}&rdquo;. Try a different search term.
            </Typography>
          )}

          {(loading || articles.length > 0) && (
            <NewsGrid
              articles={articles}
              columns={{ xs: 12, sm: 6, md: 6 }}
              loading={loading && articles.length === 0}
              skeletonCount={6}
            />
          )}

          {!loading && hasMore && (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Button variant="outlined" onClick={loadMore}>
                Load more
              </Button>
            </Box>
          )}
        </>
      )}
    </Container>
  );
}

export default SearchPage;
