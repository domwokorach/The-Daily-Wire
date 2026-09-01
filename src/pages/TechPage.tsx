import CategoryPageTemplate from './CategoryPageTemplate';
import { useTopHeadlines } from '@/features/news';
import { getCategoryByKey } from '@/data/categories';

function TechPage() {
  const feed = useTopHeadlines('tech');
  const category = getCategoryByKey('tech');

  return (
    <CategoryPageTemplate label={category?.label ?? 'Tech'} description={category?.description} feed={feed} />
  );
}

export default TechPage;
