import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { AppLanguage } from '@/config/appSettings';

import { useSettings } from '../context/SettingsContext';

const GeneralSettings: FC = () => {
  const { t } = useTranslation();
  const { settings, saveSettings } = useSettings();
  const [endPageLink, setEndPageLink] = useState(settings.endPageLink ?? '');

  return (
    <Stack spacing={2}>
      <Typography variant="h2">{t('SETTINGS.GENERAL.TITLE')}</Typography>

      <FormControl fullWidth>
        <InputLabel>{t('SETTINGS.GENERAL.LANGUAGE_LABEL')}</InputLabel>
        <Select
          value={settings.language ?? 'en'}
          label={t('SETTINGS.GENERAL.LANGUAGE_LABEL')}
          onChange={(e): void =>
            saveSettings({ language: e.target.value as AppLanguage })
          }
        >
          <MenuItem value="en">English</MenuItem>
          <MenuItem value="fr">Français</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label={t('SETTINGS.GENERAL.END_PAGE_LINK_LABEL')}
        placeholder="https://..."
        value={endPageLink}
        onChange={(e): void => setEndPageLink(e.target.value)}
        onBlur={(): void =>
          saveSettings({ endPageLink: endPageLink.trim() || undefined })
        }
        helperText={t('SETTINGS.GENERAL.END_PAGE_LINK_HELPER')}
        fullWidth
      />
    </Stack>
  );
};

export default GeneralSettings;
