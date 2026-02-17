import { SIM_DAYS_PER_REAL_SECOND } from '../constants.js';
import { EventBus } from '../utils/EventBus.js';

export class SimulationClock {
  constructor() {
    this.totalDays = 0;
    this.speedMultiplier = 1;
    this.paused = false;
  }

  update(dt) {
    if (this.paused) return;
    this.totalDays += dt * SIM_DAYS_PER_REAL_SECOND * this.speedMultiplier;
  }

  getDays() {
    return Math.floor(this.totalDays % 365);
  }

  getYears() {
    return Math.floor(this.totalDays / 365);
  }

  getTimeString() {
    const y = this.getYears();
    const d = this.getDays();
    return `Year ${y + 1}, Day ${d + 1}`;
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
