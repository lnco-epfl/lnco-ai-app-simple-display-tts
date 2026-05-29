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

export type EmailComponent = {
  id: string;
  type: 'email';
  placeholder: string;
  postUrl: string;
  required: boolean;
};

export type PageComponent =
  | TextComponent
  | TimerComponent
  | CheckboxComponent
  | EmailComponent;

export type Page = {
  id: string;
  audioSrc?: string;
  components: PageComponent[];
};

export type AppLanguage = 'en' | 'fr';

export type AppSettingsType = {
  pages: Page[];
  endPageLink?: string;
  language: AppLanguage;
};

export const DEFAULT_SETTINGS: AppSettingsType = {
  pages: [],
  endPageLink: undefined,
  language: 'en',
};
