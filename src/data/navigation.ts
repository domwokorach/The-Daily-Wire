import { CATEGORIES } from './categories';

export interface NavItem {
  key: string;
  label: string;
  path: string;
}

export const NAV_ITEMS: NavItem[] = CATEGORIES.map(({ key, label, path }) => ({
  key,
  label,
  path,
}));
