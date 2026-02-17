import { NEEDS_DECAY, WORKING_ENERGY_DECAY, NEEDS_THRESHOLDS } from '../constants.js';
import { clamp } from '../utils/MathUtils.js';

export function initNeeds() {
  return {
    energy: 80 + Math.random() * 20,
    hunger: 70 + Math.random() * 30,
    social: 60 + Math.random() * 40,
    hygiene: 70 + Math.random() * 30,
  };
}

export function decayNeeds(needs, dtHours, isWorking = false) {
  needs.energy -= (isWorking ? WORKING_ENERGY_DECAY : NEEDS_DECAY.energy) * dtHours;
  needs.hunger -= NEEDS_DECAY.hunger * dtHours;
  needs.social -= NEEDS_DECAY.social * dtHours;
  needs.hygiene -= NEEDS_DECAY.hygiene * dtHours;

  needs.energy = clamp(needs.energy, 0, 100);
  needs.hunger = clamp(needs.hunger, 0, 100);
  needs.social = clamp(needs.social, 0, 100);
  needs.hygiene = clamp(needs.hygiene, 0, 100);
}

// Returns the most urgent need below threshold, or null
export function getMostUrgentNeed(needs) {
  let worst = null;
  let worstValue = Infinity;

  for (const [need, threshold] of Object.entries(NEEDS_THRESHOLDS)) {
    if (needs[need] < threshold && needs[need] < worstValue) {
      worst = need;
      worstValue = needs[need];
    }
  }
  return worst;
}

export function regenerateNeed(needs, need, amount) {
  needs[need] = clamp(needs[need] + amount, 0, 100);
}
