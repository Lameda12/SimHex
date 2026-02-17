import { SIM_MINUTES_PER_REAL_SECOND, DAY_PHASES } from '../constants.js';
import { EventBus } from '../utils/EventBus.js';

export class SimulationClock {
  constructor() {
    this.totalMinutes = 7 * 60; // Start at 7:00 AM
    this.speedMultiplier = 1;
    this.paused = false;
    this.lastPhase = null;
  }

  update(dt) {
    if (this.paused) return;
    this.totalMinutes += dt * SIM_MINUTES_PER_REAL_SECOND * this.speedMultiplier;
    if (this.totalMinutes >= 24 * 60) {
      this.totalMinutes -= 24 * 60;
    }

    const phase = this.getDayPhase();
    if (phase !== this.lastPhase) {
      this.lastPhase = phase;
      EventBus.emit('phase-changed', phase);
    }
  }

  getHour() {
    return Math.floor(this.totalMinutes / 60);
  }

  getMinute() {
    return Math.floor(this.totalMinutes % 60);
  }

  getTimeString() {
    const h = this.getHour().toString().padStart(2, '0');
    const m = this.getMinute().toString().padStart(2, '0');
    return `${h}:${m}`;
  }

  // 0-1 representing position in the day (0 = midnight, 0.5 = noon)
  getDayProgress() {
    return this.totalMinutes / (24 * 60);
  }

  getDayPhase() {
    const h = this.getHour();
    if (h >= 22 || h < 5) return DAY_PHASES.NIGHT;
    if (h >= 5 && h < 7) return DAY_PHASES.DAWN;
    if (h >= 7 && h < 12) return DAY_PHASES.MORNING;
    if (h >= 12 && h < 17) return DAY_PHASES.AFTERNOON;
    return DAY_PHASES.DUSK;
  }

  setSpeed(multiplier) {
    this.speedMultiplier = multiplier;
    EventBus.emit('speed-changed', multiplier);
  }

  togglePause() {
    this.paused = !this.paused;
    EventBus.emit('pause-changed', this.paused);
  }
}
