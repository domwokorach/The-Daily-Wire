export type CategoryKey =
  | 'home'
  | 'politics'
  | 'world'
  | 'business'
  | 'health'
  | 'tech'
  | 'sport'
  | 'weather';

export interface CategoryDef {
  key: CategoryKey;
  label: string;
  path: string;
  description?: string;
}

export const CATEGORIES: CategoryDef[] = [
  { key: 'home', label: 'Home', path: '/' },
  {
    key: 'politics',
    label: 'Politics',
    path: '/politics',
    description: 'Westminster, the UK government, Parliament, elections, and policy analysis.',
  },
  {
    key: 'world',
    label: 'World',
    path: '/world',
    description: 'International affairs and global developments, as reported by UK news organisations.',
  },
  {
    key: 'business',
    label: 'Business',
    path: '/business',
    description: 'UK markets, the Bank of England, British companies, and the economy.',
  },
  {
    key: 'health',
    label: 'Health',
    path: '/health',
    description: 'The NHS, public health, medical research, and health policy.',
  },
  {
    key: 'tech',
    label: 'Tech',
    path: '/tech',
    description: "AI, software, hardware, cybersecurity, and the UK's technology sector.",
  },
  {
    key: 'sport',
    label: 'Sport',
    path: '/sport',
    description: 'Premier League, England, Scotland, Wales, Northern Ireland, and major UK sport.',
  },
  {
    key: 'weather',
    label: 'Weather',
    path: '/weather',
    description: 'Current conditions and daily forecasts for UK locations.',
  },
];

export function getCategoryByKey(key: CategoryKey): CategoryDef | undefined {
  return CATEGORIES.find((category) => category.key === key);
}

export type ArticleCategory = Exclude<CategoryKey, 'home' | 'weather'>;
