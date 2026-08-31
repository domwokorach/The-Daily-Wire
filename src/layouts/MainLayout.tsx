import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from '@/components/layout/Header';
import BreakingNewsBar from '@/components/layout/BreakingNewsBar';
import Footer from '@/components/layout/Footer';
import { useBreakingNews } from '@/hooks/useBreakingNews';

function MainLayout() {
  const { articles } = useBreakingNews();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <BreakingNewsBar articles={articles} />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
}

export default MainLayout;
