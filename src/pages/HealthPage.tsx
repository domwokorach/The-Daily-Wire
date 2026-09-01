import CategoryPageTemplate from './CategoryPageTemplate';
import { useTopHeadlines } from '@/features/news';
import { getCategoryByKey } from '@/data/categories';

function HealthPage() {
  const feed = useTopHeadlines('health');
  const category = getCategoryByKey('health');

  return (
    <CategoryPageTemplate label={category?.label ?? 'Health'} description={category?.description} feed={feed} />
  );
}

export default HealthPage;
