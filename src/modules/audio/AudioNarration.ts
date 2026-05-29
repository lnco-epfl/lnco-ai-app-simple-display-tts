export type AudioNarrationState = 'idle' | 'playing' | 'paused';

export class AudioNarration {
  private audio: HTMLAudioElement | null = null;

  private audioVolume: number = 1.0;

  private audioSpeed: number = 1.0;

  private audioState: AudioNarrationState = 'idle';

  private audioLastSrc: string | null = null;

  private onStateChange?: (state: AudioNarrationState) => void;

  private onEnded: (() => void) | null = null;

  private updateState(state: AudioNarrationState): void {
    this.audioState = state;
    this.onStateChange?.(state);
  }

  private cleanup(): void {
    if (this.audio) {
      if (this.onEnded) {
        this.audio.removeEventListener('ended', this.onEnded);
        this.audio.removeEventListener('error', this.onEnded);
        this.onEnded = null;
      }
      this.audio.pause();
      this.audio.src = '';
      this.audio = null;
    }
  }

  setOnStateChange(
    cb: ((state: AudioNarrationState) => void) | undefined,
  ): void {
    this.onStateChange = cb;
  }

  play(src: string): void {
    this.cleanup();

    this.audioLastSrc = src;
    this.audio = new Audio(src);
    this.audio.volume = this.audioVolume;
    this.audio.playbackRate = this.audioSpeed;

    this.onEnded = (): void => {
      this.updateState('idle');
    };

    this.audio.addEventListener('ended', this.onEnded);
    this.audio.addEventListener('error', this.onEnded);

    this.audio.play().catch((): void => this.updateState('idle'));
    this.updateState('playing');
  }

  replay(): void {
    if (this.audioLastSrc) this.play(this.audioLastSrc);
  }

  pause(): void {
    if (this.audio && this.audioState === 'playing') {
      this.audio.pause();
      this.updateState('paused');
    }
  }

  resume(): void {
    if (this.audio && this.audioState === 'paused') {
      this.audio.play().catch((): void => this.updateState('idle'));
      this.updateState('playing');
    }
  }

  stop(): void {
    this.cleanup();
    this.audioLastSrc = null;
    this.updateState('idle');
  }

  setVolume(volume: number): void {
    this.audioVolume = Math.max(0, Math.min(1, volume));
    if (this.audio) this.audio.volume = this.audioVolume;
  }

  setSpeed(speed: number): void {
    this.audioSpeed = speed;
    if (this.audio) this.audio.playbackRate = this.audioSpeed;
  }

  get state(): AudioNarrationState {
    return this.audioState;
  }

  get volume(): number {
    return this.audioVolume;
  }

  get speed(): number {
    return this.audioSpeed;
  }

  get lastSrc(): string | null {
    return this.audioLastSrc;
  }
}
