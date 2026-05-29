import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { useSettings } from '../context/SettingsContext';

const GeneralSettings: FC = () => {
  const { t } = useTranslation();
  const { settings, saveSettings } = useSettings();
  const [endPageLink, setEndPageLink] = useState(settings.endPageLink ?? '');

  return (
    <Stack spacing={2}>
      <Typography variant="h2">{t('SETTINGS.GENERAL.TITLE')}</Typography>
      <TextField
        label={t('SETTINGS.GENERAL.END_PAGE_LINK_LABEL')}
        placeholder="https://..."
        value={endPageLink}
        onChange={(e) => setEndPageLink(e.target.value)}
        onBlur={() =>
          saveSettings({ endPageLink: endPageLink.trim() || undefined })
        }
        helperText={t('SETTINGS.GENERAL.END_PAGE_LINK_HELPER')}
        fullWidth
      />
    </Stack>
  );
};

export default GeneralSettings;
