import { FleetStatusPanel } from './FleetStatusPanel.js';
import { TimePanel } from './TimePanel.js';
import { MissionControlPanel } from './MissionControlPanel.js';
import { CivilizationPanel } from './CivilizationPanel.js';
import { ControlsPanel } from './ControlsPanel.js';
import { EventBus } from '../utils/EventBus.js';

export class UIManager {
  constructor(sceneManager, clock, robots, missionQueue, civTracker, solarSystem) {
    const root = document.getElementById('ui-root');

    // Title
    const title = document.createElement('div');
    title.className = 'title-bar';
    title.innerHTML = 'STELLAR PROBE<span>Solar System Exploration</span>';
    root.appendChild(title);

    // Toast container
    this.toastContainer = document.createElement('div');
    this.toastContainer.className = 'toast-container';
    root.appendChild(this.toastContainer);

    this.fleetPanel = new FleetStatusPanel(root, robots, (robot) => {
      sceneManager.focusOn(robot.position.x, robot.position.y, robot.position.z);
    });
    this.timePanel = new TimePanel(root, clock, civTracker);
    this.missionPanel = new MissionControlPanel(root, missionQueue, robots, solarSystem, civTracker);
    this.civPanel = new CivilizationPanel(root, civTracker);
    this.controlsPanel = new ControlsPanel(root, sceneManager, solarSystem);

    // Listen for stage advancement
    EventBus.on('stage-advanced', (data) => {
      this.showToast(`STAGE ${data.stageId}: ${data.stage.name}`, 'stage');
    });

    EventBus.on('mission-completed', (data) => {
      this.showToast(`${data.robotName} completed ${data.mission.label}`, 'mission');
    });
  }

  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    this.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-fade');
      setTimeout(() => toast.remove(), 500);
    }, 3000);
  }

  update() {
    this.fleetPanel.update();
    this.timePanel.update();
    this.missionPanel.update();
    this.civPanel.update();
  }
}
