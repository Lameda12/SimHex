import { RobotStatusPanel } from './RobotStatusPanel.js';
import { TimePanel } from './TimePanel.js';
import { TaskQueuePanel } from './TaskQueuePanel.js';
import { ControlsPanel } from './ControlsPanel.js';

export class UIManager {
  constructor(sceneManager, clock, robots, taskQueue, onRobotClick) {
    const root = document.getElementById('ui-root');

    // Title
    const title = document.createElement('div');
    title.className = 'title-bar';
    title.innerHTML = 'HEX HOME<span>Robot Simulation</span>';
    root.appendChild(title);

    this.robotPanel = new RobotStatusPanel(root, robots, onRobotClick);
    this.timePanel = new TimePanel(root, clock);
    this.taskPanel = new TaskQueuePanel(root, taskQueue);
    this.controlsPanel = new ControlsPanel(root, sceneManager);
  }

  update() {
    this.robotPanel.update();
    this.timePanel.update();
    this.taskPanel.update();
  }
}
