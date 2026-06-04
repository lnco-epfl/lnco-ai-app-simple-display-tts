import {
  FC,
  ReactElement,
  createContext,
  useCallback,
  useContext,
  useMemo,
} from 'react';

import { AppSetting } from '@lnco-ai/sdk';

import { AppSettingsType, DEFAULT_SETTINGS } from '@/config/appSettings';

import { hooks, mutations } from '../../config/queryClient';
import Loader from '../common/Loader';

const SETTING_NAME = 'settings' as const;

export type SettingsContextType = {
  settings: AppSettingsType;
  saveSettings: (patch: Partial<AppSettingsType>) => void;
};

const defaultContextValue: SettingsContextType = {
  settings: DEFAULT_SETTINGS,
  saveSettings: () => null,
};

const SettingsContext = createContext<SettingsContextType>(defaultContextValue);

type Prop = {
  children: ReactElement | ReactElement[];
};

export const SettingsProvider: FC<Prop> = ({ children }) => {
  const { mutate: postAppSetting } = mutations.usePostAppSetting();
  const { mutate: patchAppSetting } = mutations.usePatchAppSetting();
  const {
    data: appSettingsList,
    isLoading,
    isSuccess,
  } = hooks.useAppSettings();

  const settings = useMemo((): AppSettingsType => {
    if (isSuccess && appSettingsList) {
      const setting = appSettingsList.find(
        (s: AppSetting) => s.name === SETTING_NAME,
      );
      if (setting) {
        return {
          ...DEFAULT_SETTINGS,
          ...(setting.data as Partial<AppSettingsType>),
        };
      }
    }
    return DEFAULT_SETTINGS;
  }, [isSuccess, appSettingsList]);

  const saveSettings = useCallback(
    (patch: Partial<AppSettingsType>): void => {
      if (!appSettingsList) return;
      const mergedValue = { ...settings, ...patch };
      const previousSetting = appSettingsList.find(
        (s: AppSetting) => s.name === SETTING_NAME,
      );
      if (!previousSetting) {
        postAppSetting({ data: mergedValue, name: SETTING_NAME });
      } else {
        patchAppSetting({ id: previousSetting.id, data: mergedValue });
      }
    },
    [appSettingsList, settings, postAppSetting, patchAppSetting],
  );

  const contextValue = useMemo(
    () => ({ settings, saveSettings }),
    [settings, saveSettings],
  );

  if (isLoading) {
    return <Loader />;
  }

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType =>
  useContext<SettingsContextType>(SettingsContext);
