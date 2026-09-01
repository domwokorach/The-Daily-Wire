import { Stack } from '@mui/material';
import Container from '@/components/common/Container';
import ProfileSummaryCard from '@/components/account/ProfileSummaryCard';

function ProfilePage() {
  return (
    <Container maxWidth="sm">
      <Stack spacing={3}>
        <ProfileSummaryCard />
      </Stack>
    </Container>
  );
}

export default ProfilePage;
