import { CIVILIZATION_STAGES } from '../civilization/StageDefinitions.js';

export class CivilizationPanel {
  constructor(container, civTracker) {
    this.civTracker = civTracker;

    this.el = document.createElement('div');
    this.el.className = 'civ-panel hex-panel';
    this.el.innerHTML = `<h3>Civilization Progress</h3><div data-stages></div><div class="civ-stats" data-stats></div>`;
    container.appendChild(this.el);
  }

  update() {
    const stagesEl = this.el.querySelector('[data-stages]');
    stagesEl.innerHTML = '';

    for (const stage of CIVILIZATION_STAGES) {
      const isComplete = stage.id < this.civTracker.currentStage;
      const isCurrent = stage.id === this.civTracker.currentStage;

      const node = document.createElement('div');
      node.className = `civ-stage ${isComplete ? 'complete' : ''} ${isCurrent ? 'current' : ''}`;
      node.innerHTML = `
        <div class="civ-stage-dot"></div>
        <div class="civ-stage-info">
          <div class="civ-stage-name">${stage.name}</div>
          <div class="civ-stage-desc">${stage.description}</div>
        </div>
      `;
      stagesEl.appendChild(node);
    }

    const statsEl = this.el.querySelector('[data-stats]');
    const s = this.civTracker.stats;
    statsEl.innerHTML = `
      <div class="stat-row">Missions: ${s.missionsCompleted}</div>
      <div class="stat-row">Planets Visited: ${s.planetsVisited.size}</div>
      <div class="stat-row">Bases Built: ${s.basesBuilt.size}</div>
      <div class="stat-row">Colonies: ${s.coloniesEstablished.size}</div>
    `;
  }
}
