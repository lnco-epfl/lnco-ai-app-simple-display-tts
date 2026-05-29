import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import { Page } from '@/config/appSettings';
import { PRELOADED_AUDIO } from '@/config/audio';

const NONE = '__none__';
const CUSTOM = '__custom__';

const getDropdownValue = (audioSrc: string | undefined): string => {
  if (!audioSrc) return NONE;
  if (PRELOADED_AUDIO.some((a) => a.src === audioSrc)) return audioSrc;
  return CUSTOM;
};

interface Props {
  page: Page;
  onUpdatePage: (updater: (p: Page) => Page) => void;
}

const AudioSettings: FC<Props> = ({ page, onUpdatePage }) => {
  const { t } = useTranslation();
  const [dropdownValue, setDropdownValue] = useState(
    getDropdownValue(page.audioSrc),
  );
  const [customUrl, setCustomUrl] = useState(
    getDropdownValue(page.audioSrc) === CUSTOM ? (page.audioSrc ?? '') : '',
  );

  // Sync if page.audioSrc changes externally
  useEffect(() => {
    setDropdownValue(getDropdownValue(page.audioSrc));
    if (getDropdownValue(page.audioSrc) === CUSTOM) {
      setCustomUrl(page.audioSrc ?? '');
    }
  }, [page.audioSrc]);

  const handleDropdownChange = (value: string): void => {
    setDropdownValue(value);
    if (value === NONE) {
      setCustomUrl('');
      onUpdatePage((p) => ({ ...p, audioSrc: undefined }));
    } else if (value !== CUSTOM) {
      onUpdatePage((p) => ({ ...p, audioSrc: value }));
    }
  };

  const handleCustomUrlBlur = (): void => {
    onUpdatePage((p) => ({
      ...p,
      audioSrc: customUrl.trim() || undefined,
    }));
  };

  return (
    <Stack spacing={1}>
      <FormControl fullWidth size="small">
        <InputLabel>{t('SETTINGS.PAGES.AUDIO.SELECT_LABEL')}</InputLabel>
        <Select
          value={dropdownValue}
          label={t('SETTINGS.PAGES.AUDIO.SELECT_LABEL')}
          onChange={(e) => handleDropdownChange(e.target.value)}
        >
          <MenuItem value={NONE}>{t('SETTINGS.PAGES.AUDIO.NONE')}</MenuItem>
          {PRELOADED_AUDIO.map((a) => (
            <MenuItem key={a.src} value={a.src}>
              {a.label}
            </MenuItem>
          ))}
          <MenuItem value={CUSTOM}>{t('SETTINGS.PAGES.AUDIO.CUSTOM')}</MenuItem>
        </Select>
      </FormControl>
      {dropdownValue === CUSTOM && (
        <TextField
          size="small"
          label={t('SETTINGS.PAGES.AUDIO.URL_LABEL')}
          placeholder="https://.../audio.mp3"
          value={customUrl}
          onChange={(e) => setCustomUrl(e.target.value)}
          onBlur={handleCustomUrlBlur}
          fullWidth
        />
      )}
    </Stack>
  );
};

export default AudioSettings;
