import Container from '@mui/material/Container';

import { PLAYER_VIEW_CY } from '@/config/selectors';

import { UserAnswersProvider } from '../context/UserAnswersContext';
import DisplayView from '../display/DisplayView';

const PlayerView = (): JSX.Element => (
  <Container data-cy={PLAYER_VIEW_CY}>
    <UserAnswersProvider>
      <DisplayView />
    </UserAnswersProvider>
  </Container>
);
export default PlayerView;
