import CategoryPageTemplate from './CategoryPageTemplate';
import { useBusinessFeed } from '@/features/business';
import { getCategoryByKey } from '@/data/categories';

function BusinessPage() {
  const feed = useBusinessFeed();
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
