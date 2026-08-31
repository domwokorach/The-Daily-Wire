import CategoryPageTemplate from './CategoryPageTemplate';
import { usePoliticsFeed } from '@/features/politics';
import { getCategoryByKey } from '@/data/categories';

function PoliticsPage() {
  const feed = usePoliticsFeed();
  const category = getCategoryByKey('politics');

  return (
    <CategoryPageTemplate label={category?.label ?? 'Politics'} description={category?.description} feed={feed} />
  );
}

export default PoliticsPage;
