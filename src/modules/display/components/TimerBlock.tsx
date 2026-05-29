import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { TimerComponent } from '@/config/appSettings';

const pad = (n: number): string => String(n).padStart(2, '0');

interface Props {
  component: TimerComponent;
  onComplete: () => void;
}

const TimerBlock: FC<Props> = ({ component, onComplete }) => {
  const { t } = useTranslation();
  const [secondsRemaining, setSecondsRemaining] = useState(
    component.durationMinutes * 60,
  );
  const isOver = secondsRemaining === 0;

  useEffect(() => {
    if (isOver) return undefined;
    const interval = setInterval(() => {
      setSecondsRemaining((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOver]);

  useEffect(() => {
    if (isOver) onComplete();
    // onComplete is intentionally excluded — it uses stable setState updaters
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOver]);

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;

  return (
    <Box textAlign="center" py={2}>
      <Typography variant="h2">{`${pad(minutes)}:${pad(seconds)}`}</Typography>
      {isOver && (
        <Alert severity="success" sx={{ mt: 1 }}>
          {t('TIMER_OVER_MESSAGE')}
        </Alert>
      )}
    </Box>
  );
};

export default TimerBlock;
