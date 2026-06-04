import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import DeleteIcon from '@mui/icons-material/Delete';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import TextEditor from '@lnco-ai/ui/text-editor';

import {
  AppSettingsType,
  CheckboxComponent,
  EmailComponent,
  Page,
  PageComponent,
  TimerComponent,
} from '@/config/appSettings';

import { moveItem, updateComponent, updatePage } from './pageUtils';

const COMPONENT_LABELS: Record<string, string> = {
  text: 'Text',
  timer: 'Timer',
  checkbox: 'Checkbox',
  email: 'Email',
};

// ---- Text ----

const TextComponentEditor: FC<{
  component: Extract<PageComponent, { type: 'text' }>;
  onUpdate: (updated: Extract<PageComponent, { type: 'text' }>) => void;
}> = ({ component, onUpdate }) => {
  const { t } = useTranslation();
  return (
    <TextEditor
      value={component.html}
      onSave={(html): void => onUpdate({ ...component, html })}
      showActions
      saveButtonText={t('SETTINGS.SAVE_BTN')}
      savedButtonText={t('SETTINGS.SAVED_BTN')}
      placeholderText={t('SETTINGS.PAGES.COMPONENT.TEXT.PLACEHOLDER')}
    />
  );
};

// ---- Timer ----

const TimerComponentEditor: FC<{
  component: TimerComponent;
  onUpdate: (updated: TimerComponent) => void;
}> = ({ component, onUpdate }) => {
  const { t } = useTranslation();
  const [duration, setDuration] = useState(component.durationMinutes);

  useEffect(() => {
    setDuration(component.durationMinutes);
  }, [component.durationMinutes]);

  return (
    <Stack spacing={2}>
      <TextField
        type="number"
        size="small"
        label={t('SETTINGS.PAGES.COMPONENT.TIMER.DURATION_LABEL')}
        inputProps={{ min: 1 }}
        value={duration}
        onChange={(e): void => setDuration(Number(e.target.value))}
        onBlur={(): void =>
          onUpdate({ ...component, durationMinutes: duration })
        }
      />
      <FormControlLabel
        control={
          <Switch
            checked={component.autoContinue}
            onChange={(e): void =>
              onUpdate({ ...component, autoContinue: e.target.checked })
            }
          />
        }
        label={t('SETTINGS.PAGES.COMPONENT.TIMER.AUTO_CONTINUE_LABEL')}
      />
    </Stack>
  );
};

// ---- Checkbox ----

const CheckboxComponentEditor: FC<{
  component: CheckboxComponent;
  onUpdate: (updated: CheckboxComponent) => void;
}> = ({ component, onUpdate }) => {
  const { t } = useTranslation();
  const [label, setLabel] = useState(component.label);

  useEffect(() => {
    setLabel(component.label);
  }, [component.label]);

  return (
    <Stack spacing={2}>
      <TextField
        size="small"
        label={t('SETTINGS.PAGES.COMPONENT.CHECKBOX.LABEL')}
        value={label}
        onChange={(e): void => setLabel(e.target.value)}
        onBlur={(): void => onUpdate({ ...component, label })}
        fullWidth
      />
      <FormControlLabel
        control={
          <Switch
            checked={component.required}
            onChange={(e): void =>
              onUpdate({ ...component, required: e.target.checked })
            }
          />
        }
        label={t('SETTINGS.PAGES.COMPONENT.CHECKBOX.REQUIRED_LABEL')}
      />
    </Stack>
  );
};

// ---- Email ----

const EmailComponentEditor: FC<{
  component: EmailComponent;
  onUpdate: (updated: EmailComponent) => void;
}> = ({ component, onUpdate }) => {
  const { t } = useTranslation();
  const [postUrl, setPostUrl] = useState(component.postUrl);
  const [placeholder, setPlaceholder] = useState(component.placeholder);

  useEffect(() => setPostUrl(component.postUrl), [component.postUrl]);
  useEffect(
    () => setPlaceholder(component.placeholder),
    [component.placeholder],
  );

  return (
    <Stack spacing={2}>
      <TextField
        size="small"
        label={t('SETTINGS.PAGES.COMPONENT.EMAIL.POST_URL_LABEL')}
        value={postUrl}
        onChange={(e): void => setPostUrl(e.target.value)}
        onBlur={(): void => onUpdate({ ...component, postUrl })}
        fullWidth
      />
      <TextField
        size="small"
        label={t('SETTINGS.PAGES.COMPONENT.EMAIL.PLACEHOLDER_LABEL')}
        value={placeholder}
        onChange={(e): void => setPlaceholder(e.target.value)}
        onBlur={(): void => onUpdate({ ...component, placeholder })}
        fullWidth
      />
      <FormControlLabel
        control={
          <Switch
            checked={component.required}
            onChange={(e): void =>
              onUpdate({ ...component, required: e.target.checked })
            }
          />
        }
        label={t('SETTINGS.PAGES.COMPONENT.EMAIL.REQUIRED_LABEL')}
      />
    </Stack>
  );
};

// ---- Main editor ----

interface Props {
  pages: Page[];
  pageIndex: number;
  componentIndex: number;
  saveSettings: (patch: Partial<AppSettingsType>) => void;
}

const ComponentEditor: FC<Props> = ({
  pages,
  pageIndex,
  componentIndex,
  saveSettings,
}) => {
  const { t } = useTranslation();
  const page = pages[pageIndex];
  const component = page.components[componentIndex];
  const isFirst = componentIndex === 0;
  const isLast = componentIndex === page.components.length - 1;

  const handleUpdateComponent = (updated: PageComponent): void => {
    saveSettings({
      pages: updateComponent(pages, pageIndex, componentIndex, () => updated),
    });
  };

  const handleDelete = (): void => {
    saveSettings({
      pages: updatePage(pages, pageIndex, (p) => ({
        ...p,
        components: p.components.filter((_, i) => i !== componentIndex),
      })),
    });
  };

  const handleMove = (direction: 'up' | 'down'): void => {
    const to = direction === 'up' ? componentIndex - 1 : componentIndex + 1;
    saveSettings({
      pages: updatePage(pages, pageIndex, (p) => ({
        ...p,
        components: moveItem(p.components, componentIndex, to),
      })),
    });
  };

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle2" color="text.secondary">
            {COMPONENT_LABELS[component.type] ?? component.type}
          </Typography>
          <Stack direction="row" spacing={0.5}>
            <Tooltip title={t('SETTINGS.PAGES.COMPONENT.MOVE_UP')}>
              <span>
                <IconButton
                  size="small"
                  onClick={(): void => handleMove('up')}
                  disabled={isFirst}
                >
                  <ArrowUpwardIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title={t('SETTINGS.PAGES.COMPONENT.MOVE_DOWN')}>
              <span>
                <IconButton
                  size="small"
                  onClick={(): void => handleMove('down')}
                  disabled={isLast}
                >
                  <ArrowDownwardIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title={t('SETTINGS.PAGES.COMPONENT.DELETE')}>
              <IconButton size="small" onClick={handleDelete} color="error">
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>

        {component.type === 'text' && (
          <TextComponentEditor
            component={component}
            onUpdate={handleUpdateComponent}
          />
        )}
        {component.type === 'timer' && (
          <TimerComponentEditor
            component={component}
            onUpdate={handleUpdateComponent}
          />
        )}
        {component.type === 'checkbox' && (
          <CheckboxComponentEditor
            component={component}
            onUpdate={handleUpdateComponent}
          />
        )}
        {component.type === 'email' && (
          <EmailComponentEditor
            component={component}
            onUpdate={handleUpdateComponent}
          />
        )}
      </Stack>
    </Paper>
  );
};

export default ComponentEditor;
