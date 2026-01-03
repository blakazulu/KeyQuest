/**
 * Sound Manager for KeyQuest
 *
 * Uses Web Audio API for low-latency sound playback.
 * Manages preloading, caching, and volume control.
 */

export type SoundName =
  | 'keypress'
  | 'keypress-wrong'
  | 'success'
  | 'achievement'
  | 'combo'
  | 'level-up'
  // Game-specific sounds
  | 'engine-running'
  | 'car-stop'
  | 'brick-drop';

interface SoundConfig {
  src: string;
  volume?: number;
}

const SOUND_CONFIG: Record<SoundName, SoundConfig> = {
  // Core typing sounds
  keypress: { src: '/sounds/keypress.mp3', volume: 0.3 },
  'keypress-wrong': { src: '/sounds/keypress-wrong.mp3', volume: 0.4 },
  success: { src: '/sounds/success.mp3', volume: 0.5 },
  achievement: { src: '/sounds/achievement.mp3', volume: 0.6 },
  combo: { src: '/sounds/combo.mp3', volume: 0.5 },
  'level-up': { src: '/sounds/level-up.mp3', volume: 0.6 },
  // Race game sounds
  'engine-running': { src: '/sounds/engine-running.mp3', volume: 0.3 },
  'car-stop': { src: '/sounds/car-stop.mp3', volume: 0.4 },
  // Tower game sounds
  'brick-drop': { src: '/sounds/brick-drop.mp3', volume: 0.5 },
};

class SoundManager {
  private audioContext: AudioContext | null = null;
  private audioBuffers: Map<SoundName, AudioBuffer> = new Map();
  private isPreloaded = false;
  private masterVolume = 0.5;
  private isEnabled = true;
  // Track looping sounds so we can stop them
  private loopingSources: Map<SoundName, { source: AudioBufferSourceNode; gain: GainNode }> = new Map();

  /**
   * Initialize the AudioContext (must be called after user interaction)
   */
  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;

    if (!this.audioContext) {
      try {
        this.audioContext = new (window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      } catch {
        console.warn('Web Audio API not supported');
        return null;
      }
    }

    // Resume if suspended (browser autoplay policy)
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    return this.audioContext;
  }

  /**
   * Preload all sound files
   */
  async preload(): Promise<void> {
    if (this.isPreloaded) return;

    const context = this.getAudioContext();
    if (!context) return;

    const loadPromises = Object.entries(SOUND_CONFIG).map(async ([name, config]) => {
      try {
        const response = await fetch(config.src);
        if (!response.ok) {
          console.warn(`Failed to load sound: ${config.src}`);
          return;
        }
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await context.decodeAudioData(arrayBuffer);
        this.audioBuffers.set(name as SoundName, audioBuffer);
      } catch (error) {
        console.warn(`Error loading sound ${name}:`, error);
      }
    });

    await Promise.all(loadPromises);
    this.isPreloaded = true;
  }

  /**
   * Play a sound by name
   */
  play(name: SoundName): void {
    if (!this.isEnabled) return;

    const context = this.getAudioContext();
    if (!context) return;

    const buffer = this.audioBuffers.get(name);
    if (!buffer) {
      // Try to preload if not loaded yet
      this.preload();
      return;
    }

    try {
      // Create source node
      const source = context.createBufferSource();
      source.buffer = buffer;

      // Create gain node for volume control
      const gainNode = context.createGain();
      const soundVolume = SOUND_CONFIG[name].volume ?? 1;
      gainNode.gain.value = this.masterVolume * soundVolume;

      // Connect nodes
      source.connect(gainNode);
      gainNode.connect(context.destination);

      // Play
      source.start(0);
    } catch (error) {
      console.warn(`Error playing sound ${name}:`, error);
    }
  }

  /**
   * Set master volume (0-1)
   */
  setVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    // Update any currently playing looping sounds
    this.loopingSources.forEach(({ gain }, name) => {
      const soundVolume = SOUND_CONFIG[name].volume ?? 1;
      gain.gain.value = this.masterVolume * soundVolume;
    });
  }

  /**
   * Start a looping sound
   */
  startLoop(name: SoundName): void {
    if (!this.isEnabled) return;

    // Don't start if already looping
    if (this.loopingSources.has(name)) return;

    const context = this.getAudioContext();
    if (!context) return;

    const buffer = this.audioBuffers.get(name);
    if (!buffer) {
      this.preload();
      return;
    }

    try {
      // Create source node
      const source = context.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      // Create gain node for volume control
      const gainNode = context.createGain();
      const soundVolume = SOUND_CONFIG[name].volume ?? 1;
      gainNode.gain.value = this.masterVolume * soundVolume;

      // Connect nodes
      source.connect(gainNode);
      gainNode.connect(context.destination);

      // Store reference to stop later
      this.loopingSources.set(name, { source, gain: gainNode });

      // Start
      source.start(0);
    } catch (error) {
      console.warn(`Error starting looping sound ${name}:`, error);
    }
  }

  /**
   * Stop a looping sound with optional fade out
   */
  stopLoop(name: SoundName, fadeOutMs = 0): void {
    const looping = this.loopingSources.get(name);
    if (!looping) return;

    const { source, gain } = looping;
    const context = this.getAudioContext();

    try {
      if (fadeOutMs > 0 && context) {
        // Fade out
        gain.gain.linearRampToValueAtTime(0, context.currentTime + fadeOutMs / 1000);
        setTimeout(() => {
          try {
            source.stop();
          } catch {
            // Source may have already stopped
          }
          this.loopingSources.delete(name);
        }, fadeOutMs);
      } else {
        source.stop();
        this.loopingSources.delete(name);
      }
    } catch (error) {
      console.warn(`Error stopping looping sound ${name}:`, error);
      this.loopingSources.delete(name);
    }
  }

  /**
   * Stop all looping sounds
   */
  stopAllLoops(): void {
    this.loopingSources.forEach((_, name) => {
      this.stopLoop(name);
    });
  }

  /**
   * Enable or disable sounds
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  /**
   * Get current enabled state
   */
  getEnabled(): boolean {
    return this.isEnabled;
  }

  /**
   * Get current volume
   */
  getVolume(): number {
    return this.masterVolume;
  }
}

// Singleton instance
export const soundManager = new SoundManager();

/**
 * Convenience function to play a sound
 */
export function playSound(name: SoundName): void {
  soundManager.play(name);
}

/**
 * Preload all sounds (call on app initialization)
 */
export async function preloadSounds(): Promise<void> {
  await soundManager.preload();
}
