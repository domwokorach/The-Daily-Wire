import CategoryPageTemplate from './CategoryPageTemplate';
import { useSectionNews } from '@/features/news';
import { getCategoryByKey } from '@/data/categories';

function PoliticsPage() {
  const feed = useSectionNews('politics');
  const category = getCategoryByKey('politics');

  return (
    <CategoryPageTemplate label={category?.label ?? 'Politics'} description={category?.description} feed={feed} />
  );
}

export default PoliticsPage;
