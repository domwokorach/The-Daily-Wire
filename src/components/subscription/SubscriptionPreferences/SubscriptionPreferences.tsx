import { Divider, FormControlLabel, Stack, Switch, Typography } from '@mui/material';
import { SUBSCRIPTION_PREFERENCE_OPTIONS } from '@/features/subscription';
import type { SubscriptionPreferenceKey, SubscriptionPreferences as Preferences } from '@/features/subscription';

interface SubscriptionPreferencesProps {
  preferences: Partial<Preferences>;
  onChange: (key: SubscriptionPreferenceKey, value: boolean) => void;
  disabled?: boolean;
}

/** The one preference checklist reused everywhere preferences are edited —
 * Settings, the guest manage-by-token page, and the post-signup preference
 * step — so "which categories exist" only has to change in one place. */
function SubscriptionPreferences({ preferences, onChange, disabled }: SubscriptionPreferencesProps) {
  const delivery = SUBSCRIPTION_PREFERENCE_OPTIONS.filter((option) => option.group === 'delivery');
  const topics = SUBSCRIPTION_PREFERENCE_OPTIONS.filter((option) => option.group === 'topic');

  return (
    <Stack spacing={0.5}>
      <Typography variant="overline" color="primary.main">
        Email Updates
      </Typography>
      {delivery.map((option) => (
        <FormControlLabel
          key={option.key}
          control={
            <Switch
              checked={Boolean(preferences[option.key])}
              onChange={(e) => onChange(option.key, e.target.checked)}
              disabled={disabled}
            />
          }
          label={option.label}
        />
      ))}
      <Divider sx={{ my: 1.5 }} />
      <Typography variant="overline" color="primary.main">
        Topics
      </Typography>
      {topics.map((option) => (
        <FormControlLabel
          key={option.key}
          control={
            <Switch
              checked={Boolean(preferences[option.key])}
              onChange={(e) => onChange(option.key, e.target.checked)}
              disabled={disabled}
            />
          }
          label={option.label}
        />
      ))}
    </Stack>
  );
}

export default SubscriptionPreferences;
