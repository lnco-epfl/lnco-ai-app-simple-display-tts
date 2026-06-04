import { useLocalContext } from '@lnco-ai/apps-query-client';
import { PermissionLevel } from '@lnco-ai/sdk';

import AdminView from './AdminView';
import PlayerView from './PlayerView';

const BuilderView = (): JSX.Element => {
  const context = useLocalContext();

  switch (context.permission) {
    // show "teacher view"
    case PermissionLevel.Admin:
      return <AdminView />;
    case PermissionLevel.Read:
    default:
      return <PlayerView />;
  }
};

export default BuilderView;
