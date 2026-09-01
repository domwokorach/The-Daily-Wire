import { useState } from 'react';
import { Alert, Box, Button, Card, Divider, FormControlLabel, Skeleton, Stack, Switch, Typography } from '@mui/material';
import { CATEGORIES, type ArticleCategory } from '@/data/categories';
import {
  useNotificationPreferences,
  useUpdateNotificationPreferences,
  type NotificationPreferences,
} from '@/features/account';
import { usePushSubscription } from '@/features/notifications';

const TOPIC_CATEGORIES = CATEGORIES.filter(
  (category): category is typeof category & { key: ArticleCategory } =>
    category.key !== 'home' && category.key !== 'weather',
);

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY as string | undefined;

interface NotificationPreferencesFieldsProps {
  initialPreferences: NotificationPreferences;
}

function NotificationPreferencesFields({ initialPreferences }: NotificationPreferencesFieldsProps) {
  const { updatePreferences, isLoading, isSuccess, error } = useUpdateNotificationPreferences();
  const { enable, disable, isLoading: pushLoading, error: pushError } = usePushSubscription();

  const [categories, setCategories] = useState<ArticleCategory[]>(
    initialPreferences.categories as ArticleCategory[],
  );
  const [pushEnabled, setPushEnabled] = useState(initialPreferences.pushEnabled);

  const toggleCategory = (key: ArticleCategory) => {
    setCategories((current) => (current.includes(key) ? current.filter((c) => c !== key) : [...current, key]));
  };

  const handleSave = () => updatePreferences({ categories, pushEnabled });

  const handleTogglePush = async (checked: boolean) => {
    if (checked && VAPID_PUBLIC_KEY) {
      const ok = await enable(VAPID_PUBLIC_KEY);
      if (ok) setPushEnabled(true);
      return;
    }
    if (!checked) {
      await disable();
    }
    setPushEnabled(checked);
  };

  return (
    <Stack spacing={1}>
      {isSuccess && <Alert severity="success">Notification settings saved.</Alert>}
      {(error || pushError) && <Alert severity="error">{error || pushError}</Alert>}
      <FormControlLabel
        control={
          <Switch
            checked={categories.length > 0}
            onChange={() => setCategories((c) => (c.length ? [] : TOPIC_CATEGORIES.map((t) => t.key)))}
          />
        }
        label="Breaking news alerts"
      />
      <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: -0.5, mb: 0.5 }}>
        Breaking News alerts are optional. Delivery timing cannot be guaranteed.
      </Typography>
      <Divider sx={{ my: 1 }} />
      {TOPIC_CATEGORIES.map((category) => (
        <FormControlLabel
          key={category.key}
          control={<Switch checked={categories.includes(category.key)} onChange={() => toggleCategory(category.key)} />}
          label={`${category.label} alerts`}
        />
      ))}
      <Divider sx={{ my: 1 }} />
      <FormControlLabel
        control={<Switch checked={pushEnabled} onChange={(e) => handleTogglePush(e.target.checked)} disabled={pushLoading} />}
        label="Browser push notifications"
      />
      <Box sx={{ pt: 1 }}>
        <Button variant="contained" color="primary" onClick={handleSave} disabled={isLoading}>
          {isLoading ? 'Saving…' : 'Save preferences'}
        </Button>
      </Box>
    </Stack>
  );
}

function NotificationPreferencesForm() {
  const { preferences, loading } = useNotificationPreferences();

  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Notifications
      </Typography>
      {loading ? (
        <Stack spacing={1.5}>
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} variant="text" height={32} />
          ))}
        </Stack>
      ) : (
        <NotificationPreferencesFields initialPreferences={preferences} />
      )}
    </Card>
  );
}

export default NotificationPreferencesForm;
