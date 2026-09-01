import { Route, Routes } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import {
  HomePage,
  PoliticsPage,
  WorldPage,
  BusinessPage,
  HealthPage,
  TechPage,
  SportPage,
  MatchPage,
  WeatherPage,
  SearchPage,
  ArticlePage,
  NotFoundPage,
} from '@/pages';
import { ROUTES } from '@/config/routes';

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.POLITICS} element={<PoliticsPage />} />
        <Route path={ROUTES.WORLD} element={<WorldPage />} />
        <Route path={ROUTES.BUSINESS} element={<BusinessPage />} />
        <Route path={ROUTES.HEALTH} element={<HealthPage />} />
        <Route path={ROUTES.TECH} element={<TechPage />} />
        <Route path={ROUTES.SPORT} element={<SportPage />} />
        <Route path={ROUTES.MATCH} element={<MatchPage />} />
        <Route path={ROUTES.WEATHER} element={<WeatherPage />} />
        <Route path={ROUTES.SEARCH} element={<SearchPage />} />
        <Route path={ROUTES.ARTICLE} element={<ArticlePage />} />
        <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
