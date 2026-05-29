import { AppData, AppDataVisibility } from '@graasp/sdk';

export const COMPLETION_APP_DATA_TYPE = 'completion' as const;

export type ConsentCheck = {
  componentId: string;
  checked: boolean;
};

export type CompletionData = {
  startedAt: string;
  completedAt: string;
  durationSeconds: number;
  consentChecks: ConsentCheck[];
};

export type CompletionAppData = AppData & {
  type: typeof COMPLETION_APP_DATA_TYPE;
  data: CompletionData;
  visibility: AppDataVisibility.Member;
};

export const makeCompletionAppData = (
  data: CompletionData,
): Pick<CompletionAppData, 'data' | 'type' | 'visibility'> => ({
  type: COMPLETION_APP_DATA_TYPE,
  data,
  visibility: AppDataVisibility.Member,
});
