import {
  CheckboxComponent,
  Page,
  PageComponent,
  TextComponent,
  TimerComponent,
} from '@/config/appSettings';

const newId = (): string => crypto.randomUUID();

export const newTextComponent = (): TextComponent => ({
  id: newId(),
  type: 'text',
  html: '',
});

export const newTimerComponent = (): TimerComponent => ({
  id: newId(),
  type: 'timer',
  durationMinutes: 5,
  autoContinue: false,
});

export const newCheckboxComponent = (): CheckboxComponent => ({
  id: newId(),
  type: 'checkbox',
  label: '',
  required: false,
});

export const newPage = (): Page => ({
  id: newId(),
  components: [],
});

export const updatePage = (
  pages: Page[],
  pageIndex: number,
  updater: (p: Page) => Page,
): Page[] => pages.map((p, i) => (i === pageIndex ? updater(p) : p));

export const updateComponent = (
  pages: Page[],
  pageIndex: number,
  componentIndex: number,
  updater: (c: PageComponent) => PageComponent,
): Page[] =>
  updatePage(pages, pageIndex, (p) => ({
    ...p,
    components: p.components.map((c, i) =>
      i === componentIndex ? updater(c) : c,
    ),
  }));

export const moveItem = <T>(arr: T[], from: number, to: number): T[] => {
  if (to < 0 || to >= arr.length) return arr;
  const result = [...arr];
  const [item] = result.splice(from, 1);
  result.splice(to, 0, item);
  return result;
};
