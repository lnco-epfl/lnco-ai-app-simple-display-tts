import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NotesIcon from '@mui/icons-material/Notes';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { AppSettingsType, Page } from '@/config/appSettings';

import AudioSettings from './AudioSettings';
import ComponentEditor from './ComponentEditor';
import {
  moveItem,
  newCheckboxComponent,
  newEmailComponent,
  newTextComponent,
  newTimerComponent,
  updatePage,
} from './pageUtils';

interface Props {
  pages: Page[];
  pageIndex: number;
  saveSettings: (patch: Partial<AppSettingsType>) => void;
}

const PageAccordion: FC<Props> = ({ pages, pageIndex, saveSettings }) => {
  const { t } = useTranslation();
  const page = pages[pageIndex];
  const isFirst = pageIndex === 0;
  const isLast = pageIndex === pages.length - 1;

  const handleUpdatePage = (updater: (p: Page) => Page): void => {
    saveSettings({ pages: updatePage(pages, pageIndex, updater) });
  };

  const handleMovePage = (direction: 'up' | 'down'): void => {
    const to = direction === 'up' ? pageIndex - 1 : pageIndex + 1;
    saveSettings({ pages: moveItem(pages, pageIndex, to) });
  };

  const handleDeletePage = (): void => {
    saveSettings({ pages: pages.filter((_, i) => i !== pageIndex) });
  };

  const componentFactories = {
    text: newTextComponent,
    timer: newTimerComponent,
    checkbox: newCheckboxComponent,
    email: newEmailComponent,
  };

  const addComponent = (
    type: 'text' | 'timer' | 'checkbox' | 'email',
  ): void => {
    const newComp = componentFactories[type]();
    handleUpdatePage((p) => ({
      ...p,
      components: [...p.components, newComp],
    }));
  };

  return (
    <Accordion defaultExpanded disableGutters>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box
          display="flex"
          alignItems="center"
          width="100%"
          pr={1}
          onClick={(e) => e.stopPropagation()}
        >
          <Typography sx={{ flexGrow: 1 }}>
            {t('SETTINGS.PAGES.PAGE_TITLE', { n: pageIndex + 1 })}
          </Typography>
          <Stack direction="row" spacing={0.5}>
            <Tooltip title={t('SETTINGS.PAGES.MOVE_UP')}>
              <span>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMovePage('up');
                  }}
                  disabled={isFirst}
                >
                  <ArrowUpwardIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title={t('SETTINGS.PAGES.MOVE_DOWN')}>
              <span>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMovePage('down');
                  }}
                  disabled={isLast}
                >
                  <ArrowDownwardIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title={t('SETTINGS.PAGES.DELETE')}>
              <IconButton
                size="small"
                color="error"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeletePage();
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>
      </AccordionSummary>

      <AccordionDetails>
        <Stack spacing={2}>
          <AudioSettings page={page} onUpdatePage={handleUpdatePage} />

          {page.components.length > 0 && <Divider />}

          {page.components.map((component, compIndex) => (
            <ComponentEditor
              key={component.id}
              pages={pages}
              pageIndex={pageIndex}
              componentIndex={compIndex}
              saveSettings={saveSettings}
            />
          ))}

          <Divider />

          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Button
              size="small"
              variant="outlined"
              startIcon={<NotesIcon />}
              onClick={() => addComponent('text')}
            >
              {t('SETTINGS.PAGES.ADD_TEXT')}
            </Button>
            <Button
              size="small"
              variant="outlined"
              startIcon={<TimerOutlinedIcon />}
              onClick={() => addComponent('timer')}
            >
              {t('SETTINGS.PAGES.ADD_TIMER')}
            </Button>
            <Button
              size="small"
              variant="outlined"
              startIcon={<CheckBoxOutlinedIcon />}
              onClick={() => addComponent('checkbox')}
            >
              {t('SETTINGS.PAGES.ADD_CHECKBOX')}
            </Button>
            <Button
              size="small"
              variant="outlined"
              startIcon={<EmailOutlinedIcon />}
              onClick={() => addComponent('email')}
            >
              {t('SETTINGS.PAGES.ADD_EMAIL')}
            </Button>
          </Stack>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

export default PageAccordion;
