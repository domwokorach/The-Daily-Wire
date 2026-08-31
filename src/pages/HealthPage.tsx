import CategoryPageTemplate from './CategoryPageTemplate';
import { useHealthFeed } from '@/features/health';
import { getCategoryByKey } from '@/data/categories';

function HealthPage() {
  const feed = useHealthFeed();
  const category = getCategoryByKey('health');

  return (
    <CategoryPageTemplate label={category?.label ?? 'Health'} description={category?.description} feed={feed} />
  );
}

export default HealthPage;
