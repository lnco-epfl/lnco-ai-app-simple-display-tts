export type PreloadedAudio = {
  label: string;
  src: string;
};

export const PRELOADED_AUDIO: PreloadedAudio[] = [
  {
    label: 'Intro screen 1 (France)',
    src: '/assets/audio/intro-screen-1-fr.mp3',
  },
  { label: 'Intro screen 1 (CH)', src: '/assets/audio/intro-screen-1-ch.mp3' },
  { label: 'Intro screen 2', src: '/assets/audio/intro-screen-2.mp3' },
  { label: 'Intro screen 3', src: '/assets/audio/intro-screen-3.mp3' },
  { label: 'Break 5 minutes', src: '/assets/audio/break-5-minutes.mp3' },
  { label: 'Intro screen audio', src: '/assets/audio/intro-screen-audio.mp3' },
  { label: 'Gift Card (FR)', src: '/assets/audio/gift-card-fr.mp3' },
  { label: 'Gift Card (CH)', src: '/assets/audio/gift-card-ch.mp3' },
  {
    label: 'Audio Guidance (EN)',
    src: '/assets/audio/intro-audio-guidance-en.mp3',
  },
  {
    label: 'Sit Comfortably (EN)',
    src: '/assets/audio/intro-sit-comfortable-en.mp3',
  },
];
