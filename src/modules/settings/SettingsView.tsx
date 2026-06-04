import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { SETTINGS_VIEW_CY } from '@/config/selectors';

import { useSettings } from '../context/SettingsContext';
import GeneralSettings from './GeneralSettings';
import PageAccordion from './PageAccordion';
import { newPage } from './pageUtils';

const SettingsView: FC = () => {
  const { t } = useTranslation();
  const { settings, saveSettings } = useSettings();
  const { pages } = settings;

  const handleAddPage = (): void => {
    saveSettings({ pages: [...pages, newPage()] });
  };

  return (
    <Stack data-cy={SETTINGS_VIEW_CY} spacing={3}>
      <Typography variant="h1">{t('SETTINGS.TITLE')}</Typography>

      <GeneralSettings />

      <Divider />

      <Typography variant="h2">{t('SETTINGS.PAGES.TITLE')}</Typography>

      {pages.map((page, index) => (
        <PageAccordion
          key={page.id}
          pages={pages}
          pageIndex={index}
          saveSettings={saveSettings}
        />
      ))}

      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={handleAddPage}
        sx={{ alignSelf: 'flex-start' }}
      >
        {t('SETTINGS.PAGES.ADD_BTN')}
      </Button>
    </Stack>
  );
};

export default SettingsView;
