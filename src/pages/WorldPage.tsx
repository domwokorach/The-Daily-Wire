import CategoryPageTemplate from './CategoryPageTemplate';
import { useWorldFeed } from '@/features/world';
import { getCategoryByKey } from '@/data/categories';

function WorldPage() {
  const feed = useWorldFeed();
  const category = getCategoryByKey('world');

  return (
    <CategoryPageTemplate label={category?.label ?? 'World'} description={category?.description} feed={feed} />
  );
}

export default WorldPage;
