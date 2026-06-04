import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import { EmailComponent } from '@/config/appSettings';

type SubmitStatus = 'idle' | 'pending' | 'success' | 'error';

interface Props {
  component: EmailComponent;
  onSubmitSuccess: () => void;
}

const EmailBlock: FC<Props> = ({ component, onSubmitSuccess }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (): Promise<void> => {
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setErrorMessage(t('EMAIL.INVALID'));
      return;
    }
    setStatus('pending');
    setErrorMessage('');
    try {
      // GET with a query parameter is a CORS "simple request" — no preflight,
      // works reliably with Google Apps Script (e.parameter.email in doGet).
      // Response is opaque with no-cors, so a non-throwing fetch = success.
      const url = new URL(component.postUrl);
      url.searchParams.set('email', trimmed);
      await fetch(url.toString(), { method: 'GET', mode: 'no-cors' });
      setStatus('success');
      onSubmitSuccess();
    } catch {
      setStatus('error');
      setErrorMessage(t('EMAIL.ERROR'));
    }
  };

  if (status === 'success') {
    return <Alert severity="success">{t('EMAIL.SUCCESS')}</Alert>;
  }

  return (
    <Stack spacing={1}>
      <Box display="flex" gap={1} alignItems="flex-start">
        <TextField
          type="email"
          label={t('EMAIL.LABEL')}
          placeholder={component.placeholder || t('EMAIL.PLACEHOLDER')}
          value={email}
          onChange={(e): void => setEmail(e.target.value)}
          onKeyDown={(e): void => {
            if (e.key === 'Enter') handleSubmit();
          }}
          disabled={status === 'pending'}
          size="small"
          sx={{ flexGrow: 1 }}
        />
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={status === 'pending' || !email.trim()}
          startIcon={
            status === 'pending' ? (
              <CircularProgress size={16} color="inherit" />
            ) : undefined
          }
        >
          {status === 'pending' ? t('EMAIL.SUBMITTING') : t('EMAIL.SUBMIT')}
        </Button>
      </Box>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
    </Stack>
  );
};

export default EmailBlock;
