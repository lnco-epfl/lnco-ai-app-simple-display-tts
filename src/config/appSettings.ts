export type TextComponent = {
  id: string;
  type: 'text';
  html: string;
};

export type TimerComponent = {
  id: string;
  type: 'timer';
  durationMinutes: number;
  autoContinue: boolean;
};

export type CheckboxComponent = {
  id: string;
  type: 'checkbox';
  label: string;
  required: boolean;
};

export type PageComponent = TextComponent | TimerComponent | CheckboxComponent;

export type Page = {
  id: string;
  audioSrc?: string;
  components: PageComponent[];
};

export type AppSettingsType = {
  pages: Page[];
  endPageLink?: string;
};

export const DEFAULT_SETTINGS: AppSettingsType = {
  pages: [],
  endPageLink: undefined,
};
