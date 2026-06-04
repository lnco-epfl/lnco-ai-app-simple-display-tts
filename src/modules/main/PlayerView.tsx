import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Container from '@mui/material/Container';

import { PLAYER_VIEW_CY } from '@/config/selectors';

import { UserAnswersProvider } from '../context/UserAnswersContext';
import DisplayView from '../display/DisplayView';

const PlayerView = (): JSX.Element => {
  const { t } = useTranslation();
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);

  useEffect(() => {
    const ioTop = new IntersectionObserver(
      ([entry]) => setCanScrollUp(!entry.isIntersecting),
      { threshold: 0 },
    );
    const ioBottom = new IntersectionObserver(
      ([entry]) => setCanScrollDown(!entry.isIntersecting),
      { threshold: 0 },
    );
    if (topRef.current) ioTop.observe(topRef.current);
    if (bottomRef.current) ioBottom.observe(bottomRef.current);
    return () => {
      ioTop.disconnect();
      ioBottom.disconnect();
    };
  }, []);

  const scrollPage = (direction: 'up' | 'down'): void => {
    window.scrollBy({
      top:
        direction === 'down'
          ? window.innerHeight * 0.6
          : -window.innerHeight * 0.6,
      behavior: 'smooth',
    });
  };

  return (
    <div data-cy={PLAYER_VIEW_CY}>
      <div ref={topRef} />
      <Container>
        <UserAnswersProvider>
          <DisplayView />
        </UserAnswersProvider>
      </Container>
      <div ref={bottomRef} />
      {canScrollDown && (
        <button
          type="button"
          className="scroll-hint scroll-hint--down"
          onClick={() => scrollPage('down')}
          aria-label={t('SCROLL_DOWN')}
        >
          {t('SCROLL_DOWN')}
        </button>
      )}
      {canScrollUp && (
        <button
          type="button"
          className="scroll-hint scroll-hint--up"
          onClick={() => scrollPage('up')}
          aria-label={t('SCROLL_UP')}
        >
          {t('SCROLL_UP')}
        </button>
      )}
    </div>
  );
};
export default PlayerView;
