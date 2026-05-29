import {
  FC,
  ReactElement,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useLocalContext } from '@graasp/apps-query-client';
import { AppData, PermissionLevel, PermissionLevelCompare } from '@graasp/sdk';

import {
  COMPLETION_APP_DATA_TYPE,
  CompletionAppData,
  CompletionData,
  ConsentCheck,
  makeCompletionAppData,
} from '@/config/appData';
import { hooks, mutations } from '@/config/queryClient';

type AppStateContextType = {
  completeApp: (consentChecks: ConsentCheck[]) => void;
  isCompleted: boolean;
  allCompletionsAppData?: CompletionAppData[];
};

const defaultContextValue: AppStateContextType = {
  completeApp: () => null,
  isCompleted: false,
};

const AppStateContext = createContext<AppStateContextType>(defaultContextValue);

export const UserAnswersProvider: FC<{
  children: ReactElement | ReactElement[];
}> = ({ children }) => {
  const { data, isSuccess } = hooks.useAppData<CompletionData>({
    type: COMPLETION_APP_DATA_TYPE,
  });
  const [startedAt] = useState(() => new Date().toISOString());
  const [isCompleted, setIsCompleted] = useState(false);
  const [allCompletionsAppData, setAllCompletionsAppData] =
    useState<CompletionAppData[]>();
  const { mutate: postAppData } = mutations.usePostAppData();
  const { permission, memberId } = useLocalContext();

  const isAdmin = useMemo(
    () => PermissionLevelCompare.gte(permission, PermissionLevel.Admin),
    [permission],
  );

  useEffect(() => {
    if (isSuccess) {
      const completions = data.filter(
        (d: AppData) => d.type === COMPLETION_APP_DATA_TYPE,
      ) as CompletionAppData[];
      setAllCompletionsAppData(completions);
      if (completions.some((d) => d.member.id === memberId)) {
        setIsCompleted(true);
      }
    }
  }, [isSuccess, data, memberId]);

  const completeApp = useMemo(
    () =>
      (consentChecks: ConsentCheck[]): void => {
        const completedAt = new Date().toISOString();
        const durationSeconds = Math.round(
          (new Date(completedAt).getTime() - new Date(startedAt).getTime()) /
            1000,
        );
        const completionData: CompletionData = {
          startedAt,
          completedAt,
          durationSeconds,
          consentChecks,
        };
        postAppData(makeCompletionAppData(completionData));
        setIsCompleted(true);
      },
    [postAppData, startedAt],
  );

  const contextValue = useMemo(
    () => ({
      completeApp,
      isCompleted,
      allCompletionsAppData: isAdmin ? allCompletionsAppData : undefined,
    }),
    [completeApp, isCompleted, isAdmin, allCompletionsAppData],
  );

  return (
    <AppStateContext.Provider value={contextValue}>
      {children}
    </AppStateContext.Provider>
  );
};

const useUserAnswers = (): AppStateContextType => useContext(AppStateContext);

export default useUserAnswers;
