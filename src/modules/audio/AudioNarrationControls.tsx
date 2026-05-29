import React, { FC, useEffect, useState } from 'react';

import { AudioNarration, AudioNarrationState } from './AudioNarration';

export type ControlsPosition =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

interface Props {
  narration: AudioNarration;
  position?: ControlsPosition;
  expanded?: boolean;
}

const SPEED_OPTIONS = [0.6, 0.8, 1.0, 1.2];

const positionStyles: Record<ControlsPosition, React.CSSProperties> = {
  'top-left': { top: 16, left: 16 },
  'top-right': { top: 16, right: 16 },
  'bottom-left': { bottom: 16, left: 16 },
  'bottom-right': { bottom: 16, right: 16 },
};

const btnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#fff',
  cursor: 'pointer',
  fontSize: 16,
  padding: '2px 4px',
  lineHeight: 1,
};

const selectStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.15)',
  border: 'none',
  borderRadius: 6,
  color: '#fff',
  fontSize: 12,
  padding: '2px 4px',
  cursor: 'pointer',
};

export const AudioNarrationControls: FC<Props> = ({
  narration,
  position = 'bottom-right',
  expanded = true,
}) => {
  const [audioState, setAudioState] = useState<AudioNarrationState>(
    narration.state,
  );
  const [volume, setVolumeState] = useState(narration.volume);
  const [speed, setSpeedState] = useState(narration.speed);

  useEffect(() => {
    // Sync immediately in case state changed before this effect ran
    setAudioState(narration.state);
    narration.setOnStateChange(setAudioState);
    return (): void => narration.setOnStateChange(undefined);
  }, [narration]);

  const handleVolumeChange = (v: number): void => {
    narration.setVolume(v);
    setVolumeState(v);
  };

  const handleSpeedChange = (s: number): void => {
    narration.setSpeed(s);
    setSpeedState(s);
  };

  const isPlaying = audioState === 'playing';
  const isIdle = audioState === 'idle';

  return (
    <div
      style={{
        position: 'fixed',
        ...positionStyles[position],
        background: 'rgba(30,30,30,0.75)',
        backdropFilter: 'blur(6px)',
        borderRadius: expanded ? 12 : 24,
        padding: expanded ? '10px 14px' : '8px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        zIndex: 9999,
        transition: 'all 0.2s ease',
        color: '#fff',
        fontSize: 13,
        userSelect: 'none',
      }}
    >
      <button
        type="button"
        onClick={(): void => narration.replay()}
        style={{ ...btnStyle, opacity: isIdle && !narration.lastSrc ? 0.4 : 1 }}
        title="Replay"
      >
        🔊
      </button>

      {expanded && !isIdle && (
        <>
          <button
            type="button"
            onClick={
              isPlaying
                ? (): void => narration.pause()
                : (): void => narration.resume()
            }
            style={btnStyle}
            title={isPlaying ? 'Pause' : 'Resume'}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>

          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={(e): void =>
              handleVolumeChange(parseFloat(e.target.value))
            }
            style={{ width: 70, accentColor: '#fff' }}
            title="Volume"
          />

          <select
            value={speed}
            onChange={(e): void =>
              handleSpeedChange(parseFloat(e.target.value))
            }
            style={selectStyle}
            title="Speed"
          >
            {SPEED_OPTIONS.map((s) => (
              <option
                key={s}
                value={s}
                style={{ background: '#1e1e1e', color: '#fff' }}
              >
                {s}×
              </option>
            ))}
          </select>
        </>
      )}
    </div>
  );
};
