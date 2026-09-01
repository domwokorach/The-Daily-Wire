import CategoryPageTemplate from './CategoryPageTemplate';
import { useSectionNews } from '@/features/news';
import { getCategoryByKey } from '@/data/categories';

function WorldPage() {
  const feed = useSectionNews('world');
  const category = getCategoryByKey('world');

  return (
    <CategoryPageTemplate label={category?.label ?? 'World'} description={category?.description} feed={feed} />
  );
}

export default WorldPage;
