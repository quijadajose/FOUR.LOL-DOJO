class SoundManager {
  private ctx: AudioContext | null = null;
  public enabled = true;

  private getContext(): AudioContext | null {
    if (!this.enabled || typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private tone(
    freq: number,
    duration: number,
    type: OscillatorType = 'sine',
    gainVal = 0.08,
    delay = 0,
    slideTo?: number
  ): void {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (slideTo !== undefined) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), now + duration);
    }

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(gainVal, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.01);
  }

  move(): void {
    this.tone(240, 0.035, 'triangle', 0.045);
  }

  rotate(isSpinReady = false): void {
    if (isSpinReady) {
      // Crisp metallic T-spin click!
      this.tone(587.33, 0.07, 'sine', 0.11);
      this.tone(880, 0.09, 'triangle', 0.09, 0.02);
    } else {
      this.tone(380, 0.045, 'sine', 0.055, 0, 440);
    }
  }

  hold(): void {
    this.tone(320, 0.06, 'sine', 0.06, 0, 480);
  }

  hardDrop(): void {
    this.tone(150, 0.08, 'triangle', 0.11, 0, 52);
  }

  softDrop(): void {
    this.tone(190, 0.025, 'sine', 0.025);
  }

  clear(lines: number, isTSpin: boolean, isPC: boolean, combo: number, b2b: boolean): void {
    if (isPC) {
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5];
      notes.forEach((n, idx) => this.tone(n, 0.28, 'triangle', 0.12, idx * 0.055));
      return;
    }

    const comboSemitones = Math.min(Math.max(0, combo), 14);
    const comboMult = Math.pow(2, comboSemitones / 12);

    if (isTSpin) {
      const chord = lines === 3 ? [440, 554.37, 659.25, 880] : [392, 493.88, 587.33, 783.99];
      chord.forEach((n, idx) =>
        this.tone(n * (b2b ? 1.06 : 1), 0.22, 'sawtooth', 0.065, idx * 0.03)
      );
      return;
    }

    if (lines === 4) {
      [330, 440, 554.37, 659.25].forEach((n, idx) =>
        this.tone(n, 0.2, 'triangle', 0.09, idx * 0.035)
      );
      return;
    }

    this.tone(360 * comboMult, 0.12, 'triangle', 0.085);
    if (lines >= 2) {
      this.tone(450 * comboMult, 0.14, 'sine', 0.075, 0.035);
    }
  }

  lessonSuccess(): void {
    const fanfare = [523.25, 659.25, 783.99, 1046.5];
    fanfare.forEach((n, idx) => this.tone(n, 0.26, 'triangle', 0.11, idx * 0.07));
  }

  finesseFault(): void {
    this.tone(165, 0.09, 'sawtooth', 0.05, 0, 130);
  }
}

export const sound = new SoundManager();
