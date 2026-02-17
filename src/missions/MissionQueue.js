import { MISSION_TYPES } from './MissionTypes.js';
import { EventBus } from '../utils/EventBus.js';

let missionIdCounter = 0;

export class MissionQueue {
  constructor(civilizationTracker) {
    this.civTracker = civilizationTracker;
    this.pending = [];
    this.active = [];
    this.completed = [];
    this.autoSpawnTimer = 0;
  }

  update(clock) {
    if (clock.paused) return;

    // Auto-spawn missions periodically
    this.autoSpawnTimer += clock.speedMultiplier * 0.016;
    if (this.autoSpawnTimer > 5) {
      this.autoSpawnTimer = 0;
      this.spawnRandomMission();
    }
  }

  spawnRandomMission() {
    const currentStage = this.civTracker.currentStage;
    const available = Object.values(MISSION_TYPES).filter(
      m => m.stageRequirement <= currentStage
    );
    if (available.length === 0) return;

    // Pick a random mission type
    const mType = available[Math.floor(Math.random() * available.length)];

    // Pick a random unlocked planet
    const targets = this.civTracker.getUnlockedPlanets();
    if (targets.length === 0) return;
    const targetId = targets[Math.floor(Math.random() * targets.length)];

    // Don't add if same type + planet already pending
    const exists = this.pending.find(m => m.type === mType.id && m.targetPlanetId === targetId);
    if (exists) return;

    this.addMission(mType.id, targetId);
  }

  addMission(typeId, targetPlanetId) {
    const mType = MISSION_TYPES[typeId];
    if (!mType) return null;

    const mission = {
      id: ++missionIdCounter,
      type: typeId,
      label: mType.label,
      duration: mType.duration,
      priority: mType.priority,
      description: mType.description,
      targetPlanetId,
      assignedTo: null,
      completed: false,
    };

    this.pending.push(mission);
    this.pending.sort((a, b) => b.priority - a.priority);
    EventBus.emit('mission-added', mission);
    return mission;
  }

  assignMission(mission, robot) {
    const idx = this.pending.indexOf(mission);
    if (idx === -1) return;
    this.pending.splice(idx, 1);
    mission.assignedTo = robot.name;
    this.active.push(mission);
    EventBus.emit('mission-assigned', { mission, robot: robot.name });
  }

  completeMission(mission) {
    const idx = this.active.indexOf(mission);
    if (idx !== -1) this.active.splice(idx, 1);
    this.completed.push(mission);
    if (this.completed.length > 20) this.completed.shift();
    EventBus.emit('mission-completed-queue', mission);
  }

  getUnassignedMissions() {
    return this.pending.filter(m => !m.assignedTo);
  }
}
