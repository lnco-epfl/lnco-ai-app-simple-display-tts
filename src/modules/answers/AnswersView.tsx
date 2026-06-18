import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import useUserAnswers from '../context/UserAnswersContext';

const AnswersView: FC = () => {
  const { t } = useTranslation();
  const { allCompletionsAppData, deleteEntry } = useUserAnswers();

  const formatDate = (iso: string): string => {
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso;
    }
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h1">{t('ANSWERS.TITLE')}</Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="completions table">
          <TableHead>
            <TableRow>
              <TableCell>{t('ANSWERS.TABLE.PARTICIPANT_ID_HEAD')}</TableCell>
              <TableCell>{t('ANSWERS.TABLE.PARTICIPANT_CODE_HEAD')}</TableCell>
              <TableCell>{t('ANSWERS.TABLE.STARTED_AT_HEAD')}</TableCell>
              <TableCell>{t('ANSWERS.TABLE.COMPLETED_AT_HEAD')}</TableCell>
              <TableCell>{t('ANSWERS.TABLE.DURATION_HEAD')}</TableCell>
              <TableCell>{t('ANSWERS.TABLE.CONSENT_HEAD')}</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {allCompletionsAppData?.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.account.name ?? '—'}</TableCell>
                <TableCell>{record.data.participantCode ?? '—'}</TableCell>
                <TableCell>{formatDate(record.data.startedAt)}</TableCell>
                <TableCell>{formatDate(record.data.completedAt)}</TableCell>
                <TableCell>{record.data.durationSeconds}s</TableCell>
                <TableCell>
                  {record.data.consentChecks.length === 0
                    ? 'N/A'
                    : record.data.consentChecks
                        .map((c) => (c.checked ? '✓' : '✗'))
                        .join(', ')}
                </TableCell>
                <TableCell padding="checkbox">
                  <IconButton
                    size="small"
                    onClick={() => {
                      // eslint-disable-next-line no-alert
                      if (window.confirm('Delete this entry?')) {
                        deleteEntry(record.id);
                      }
                    }}
                    aria-label="delete"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};

export default AnswersView;
