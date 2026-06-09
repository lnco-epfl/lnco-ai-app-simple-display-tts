import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { ConsentCheck } from '@/config/appData';
import {
  CheckboxComponent,
  EmailComponent,
  TimerComponent,
} from '@/config/appSettings';
import i18n from '@/config/i18n';

import { AudioNarration } from '../audio/AudioNarration';
import { AudioNarrationControls } from '../audio/AudioNarrationControls';
import { useSettings } from '../context/SettingsContext';
import useUserAnswers from '../context/UserAnswersContext';
import CheckboxBlock from './components/CheckboxBlock';
import EmailBlock from './components/EmailBlock';
import TextBlock from './components/TextBlock';
import TimerBlock from './components/TimerBlock';

const DisplayView: FC = () => {
  const { t } = useTranslation();
  const { settings } = useSettings();
  const { completeApp } = useUserAnswers();

  const [pageIndex, setPageIndex] = useState(0);
  const [checkedState, setCheckedState] = useState<Record<string, boolean>>({});
  const [timersDone, setTimersDone] = useState<Record<string, boolean>>({});
  const [emailsDone, setEmailsDone] = useState<Record<string, boolean>>({});
  const [allConsentChecks, setAllConsentChecks] = useState<ConsentCheck[]>([]);
  const [audioActive, setAudioActive] = useState(false);

  const narration = useMemo(() => new AudioNarration(), []);

  const { pages } = settings;
  const currentPage = pages[pageIndex];
  const isLastPage = pageIndex === pages.length - 1;

  // Apply player language from settings, restore on unmount
  useEffect(() => {
    const prev = i18n.language;
    i18n.changeLanguage(settings.language ?? 'en');
    return (): void => {
      i18n.changeLanguage(prev);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.language]);

  // Play audio when page changes, stop on cleanup
  useEffect(() => {
    if (currentPage?.audioSrc) {
      narration.play(currentPage.audioSrc);
      setAudioActive(true);
    } else {
      narration.stop();
      setAudioActive(false);
    }
    return (): void => {
      narration.stop();
      setAudioActive(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex]);

  // Stop audio on unmount
  useEffect(() => () => narration.stop(), []); // eslint-disable-line react-hooks/exhaustive-deps

  const timerComponents = useMemo(
    () =>
      (currentPage?.components.filter((c) => c.type === 'timer') ??
        []) as TimerComponent[],
    [currentPage],
  );

  const checkboxComponents = useMemo(
    () =>
      (currentPage?.components.filter((c) => c.type === 'checkbox') ??
        []) as CheckboxComponent[],
    [currentPage],
  );

  const emailComponents = useMemo(
    () =>
      (currentPage?.components.filter((c) => c.type === 'email') ??
        []) as EmailComponent[],
    [currentPage],
  );

  const allTimersDone = timerComponents.every((tc) => timersDone[tc.id]);
  const allRequiredChecked = checkboxComponents
    .filter((c) => c.required)
    .every((c) => checkedState[c.id]);
  const allRequiredEmailsDone = emailComponents
    .filter((c) => c.required)
    .every((c) => emailsDone[c.id]);
  const canContinue =
    allTimersDone && allRequiredChecked && allRequiredEmailsDone;

  const handleContinue = useCallback(() => {
    const pageChecks: ConsentCheck[] = checkboxComponents.map((c) => ({
      componentId: c.id,
      checked: checkedState[c.id] ?? false,
    }));
    const updatedChecks = [...allConsentChecks, ...pageChecks];

    if (isLastPage) {
      completeApp(updatedChecks);
      if (settings.endPageLink) {
        window.parent.location.href = settings.endPageLink;
      }
    } else {
      setAllConsentChecks(updatedChecks);
      setPageIndex((prev) => prev + 1);
      setCheckedState({});
      setTimersDone({});
      setEmailsDone({});
    }
  }, [
    checkboxComponents,
    checkedState,
    allConsentChecks,
    isLastPage,
    completeApp,
    settings.endPageLink,
  ]);

  // Keep a stable ref so the auto-continue effect always calls the latest version
  const handleContinueRef = useRef(handleContinue);
  useEffect(() => {
    handleContinueRef.current = handleContinue;
  }, [handleContinue]);

  // Auto-continue when a timer with autoContinue=true finishes
  useEffect(() => {
    const hasAutoContinueTimerDone = timerComponents.some(
      (tc) => tc.autoContinue && timersDone[tc.id],
    );
    if (
      hasAutoContinueTimerDone &&
      allTimersDone &&
      allRequiredChecked &&
      allRequiredEmailsDone
    ) {
      handleContinueRef.current();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timersDone, checkedState, emailsDone]);

  if (!pages.length) {
    return (
      <Typography color="text.secondary">{t('NO_PAGES_MESSAGE')}</Typography>
    );
  }

  if (!currentPage) return null;

  return (
    <Stack spacing={3}>
      {currentPage.components.map((component) => {
        switch (component.type) {
          case 'text':
            return <TextBlock key={component.id} component={component} />;
          case 'timer':
            return (
              <TimerBlock
                key={component.id}
                component={component}
                onComplete={() =>
                  setTimersDone((prev) => ({ ...prev, [component.id]: true }))
                }
              />
            );
          case 'checkbox':
            return (
              <CheckboxBlock
                key={component.id}
                component={component}
                checked={checkedState[component.id] ?? false}
                onChange={(checked) =>
                  setCheckedState((prev) => ({
                    ...prev,
                    [component.id]: checked,
                  }))
                }
              />
            );
          case 'email':
            return (
              <EmailBlock
                key={component.id}
                component={component}
                onSubmitSuccess={() =>
                  setEmailsDone((prev) => ({ ...prev, [component.id]: true }))
                }
              />
            );
          default:
            return null;
        }
      })}

      <Divider />

      <Box display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          disabled={!canContinue}
          onClick={handleContinue}
          style={{ marginBottom: '15px' }}
        >
          {t('CONTINUE_BUTTON')}
        </Button>
      </Box>

      {audioActive && (
        <AudioNarrationControls narration={narration} position="bottom-left" />
      )}
    </Stack>
  );
};

export default DisplayView;
