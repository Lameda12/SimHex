import { CIVILIZATION_STAGES } from './StageDefinitions.js';
import { EventBus } from '../utils/EventBus.js';

export class CivilizationTracker {
  constructor() {
    this.currentStage = 1;
    this.stats = {
      missionsCompleted: 0,
      planetsVisited: new Set(['earth']),
      basesBuilt: new Map(),
      coloniesEstablished: new Set(),
    };

    // Listen for events
    EventBus.on('mission-completed', (data) => this.onMissionCompleted(data));
    EventBus.on('base-built', (data) => this.onBaseBuilt(data));
    EventBus.on('planet-visited', (data) => this.onPlanetVisited(data));
  }

  onMissionCompleted(data) {
    this.stats.missionsCompleted++;
    if (data.mission && data.mission.type === 'establish_colony' && data.planetId) {
      this.stats.coloniesEstablished.add(data.planetId);
    }
  }

  onBaseBuilt(data) {
    const current = this.stats.basesBuilt.get(data.planetId) || 0;
    this.stats.basesBuilt.set(data.planetId, current + 1);
  }

  onPlanetVisited(data) {
    this.stats.planetsVisited.add(data.planetId);
  }

  checkAdvancement() {
    if (this.currentStage >= CIVILIZATION_STAGES.length) return;

    const nextStage = CIVILIZATION_STAGES[this.currentStage]; // 0-indexed: stage 1 has index 0, next is index 1
    if (!nextStage) return;

    const req = nextStage.requirement;
    let met = false;

    switch (req.type) {
      case 'missions_completed':
        met = this.stats.missionsCompleted >= req.count;
        break;
      case 'base_built':
        met = (this.stats.basesBuilt.get(req.target) || 0) > 0;
        break;
      case 'bases_count':
        met = this.stats.basesBuilt.size >= req.count;
        break;
      case 'planets_visited':
        met = this.stats.planetsVisited.size >= req.count;
        break;
      case 'colonies_count':
        met = this.stats.coloniesEstablished.size >= req.count;
        break;
    }

    if (met) {
      this.currentStage = nextStage.id;
      EventBus.emit('stage-advanced', {
        stage: nextStage,
        stageId: nextStage.id,
      });
    }
  }

  getUnlockedPlanets() {
    const unlocked = new Set(['earth']);
    for (let i = 0; i < this.currentStage && i < CIVILIZATION_STAGES.length; i++) {
      const stage = CIVILIZATION_STAGES[i];
      if (stage.unlocksTargets) {
        for (const t of stage.unlocksTargets) {
          unlocked.add(t);
        }
      }
    }
    return Array.from(unlocked);
  }

  getCurrentStageDef() {
    return CIVILIZATION_STAGES[this.currentStage - 1] || CIVILIZATION_STAGES[0];
  }

  getNextStageDef() {
    if (this.currentStage >= CIVILIZATION_STAGES.length) return null;
    return CIVILIZATION_STAGES[this.currentStage];
  }
}
