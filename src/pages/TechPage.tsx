import CategoryPageTemplate from './CategoryPageTemplate';
import { useTechFeed } from '@/features/tech';
import { getCategoryByKey } from '@/data/categories';

function TechPage() {
  const feed = useTechFeed();
  const category = getCategoryByKey('tech');

  return (
    <CategoryPageTemplate label={category?.label ?? 'Tech'} description={category?.description} feed={feed} />
  );
}

export default TechPage;
