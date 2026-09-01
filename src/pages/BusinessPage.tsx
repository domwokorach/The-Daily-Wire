import CategoryPageTemplate from './CategoryPageTemplate';
import { useTopHeadlines } from '@/features/news';
import { getCategoryByKey } from '@/data/categories';

function BusinessPage() {
  const feed = useTopHeadlines('business');
  const category = getCategoryByKey('business');

  return (
    <CategoryPageTemplate
      label={category?.label ?? 'Business'}
      description={category?.description}
      feed={feed}
    />
  );
}

export default BusinessPage;
