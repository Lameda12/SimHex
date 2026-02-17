import { MISSION_TYPES } from '../missions/MissionTypes.js';

export class MissionControlPanel {
  constructor(container, missionQueue, robots, solarSystem, civTracker) {
    this.missionQueue = missionQueue;
    this.robots = robots;
    this.solarSystem = solarSystem;
    this.civTracker = civTracker;

    this.el = document.createElement('div');
    this.el.className = 'task-panel hex-panel';
    this.el.innerHTML = `
      <h3>Mission Control</h3>
      <div class="mission-dispatch" data-dispatch>
        <select class="mission-select" data-mission-type></select>
        <select class="mission-select" data-planet-target></select>
        <button class="ctrl-btn mission-launch-btn" data-launch>Launch</button>
      </div>
      <h3 style="margin-top:12px">Active Missions</h3>
      <div data-active-list></div>
      <h3 style="margin-top:12px">Pending</h3>
      <div data-pending-list></div>
    `;
    container.appendChild(this.el);

    // Launch button
    this.el.querySelector('[data-launch]').addEventListener('click', () => {
      this.dispatchMission();
    });

    this.updateSelectors();
  }

  updateSelectors() {
    const missionSelect = this.el.querySelector('[data-mission-type]');
    const planetSelect = this.el.querySelector('[data-planet-target]');

    // Mission types
    const currentStage = this.civTracker.currentStage;
    const available = Object.values(MISSION_TYPES).filter(
      m => m.stageRequirement <= currentStage
    );

    missionSelect.innerHTML = '';
    for (const m of available) {
      const opt = document.createElement('option');
      opt.value = m.id;
      opt.textContent = m.label;
      missionSelect.appendChild(opt);
    }

    // Planets
    const unlocked = this.civTracker.getUnlockedPlanets();
    planetSelect.innerHTML = '';
    for (const pId of unlocked) {
      const planet = this.solarSystem.getPlanet(pId);
      if (planet) {
        const opt = document.createElement('option');
        opt.value = pId;
        opt.textContent = planet.name;
        planetSelect.appendChild(opt);
      }
    }
  }

  dispatchMission() {
    const typeId = this.el.querySelector('[data-mission-type]').value;
    const planetId = this.el.querySelector('[data-planet-target]').value;
    if (!typeId || !planetId) return;

    // Find an idle robot
    const idle = this.robots.find(r => r.stateMachine.getCurrentStateName() === 'idle');
    if (!idle) return;

    const mission = this.missionQueue.addMission(typeId, planetId);
    if (!mission) return;

    const targetPlanet = this.solarSystem.getPlanet(planetId);
    if (!targetPlanet) return;

    this.missionQueue.assignMission(mission, idle);
    idle.launchTo(targetPlanet, mission);
  }

  update() {
    this.updateSelectors();

    // Active missions
    const activeList = this.el.querySelector('[data-active-list]');
    activeList.innerHTML = '';
    for (const m of this.missionQueue.active) {
      const item = document.createElement('div');
      item.className = 'task-item';
      const planet = this.solarSystem.getPlanet(m.targetPlanetId);
      item.innerHTML = `
        <div class="task-priority" style="background: var(--accent-amber)"></div>
        <div class="task-name">${m.label}</div>
        <div class="task-assignee">${m.assignedTo || ''} -> ${planet ? planet.name : ''}</div>
      `;
      activeList.appendChild(item);
    }

    // Pending missions
    const pendingList = this.el.querySelector('[data-pending-list]');
    pendingList.innerHTML = '';
    for (const m of this.missionQueue.pending) {
      const item = document.createElement('div');
      item.className = 'task-item';
      const planet = this.solarSystem.getPlanet(m.targetPlanetId);
      const color = m.priority >= 4 ? 'var(--accent-pink)' :
        m.priority >= 3 ? 'var(--accent-amber)' : 'var(--accent-teal)';
      item.innerHTML = `
        <div class="task-priority" style="background: ${color}"></div>
        <div class="task-name">${m.label}</div>
        <div class="task-assignee">${planet ? planet.name : ''}</div>
      `;
      pendingList.appendChild(item);
    }
  }
}
