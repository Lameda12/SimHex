import { ROBOT_COLORS } from '../constants.js';

const NEED_COLORS = {
  energy: '#76ff03',
  hunger: '#ffab00',
  social: '#ff0066',
  hygiene: '#00e5ff',
};

const NEED_ICONS = {
  energy: 'E',
  hunger: 'H',
  social: 'S',
  hygiene: 'C', // clean
};

export class RobotStatusPanel {
  constructor(container, robots, onRobotClick) {
    this.robots = robots;
    this.el = document.createElement('div');
    this.el.className = 'robot-panel';
    container.appendChild(this.el);
    this.cards = [];

    for (let i = 0; i < robots.length; i++) {
      const robot = robots[i];
      const card = document.createElement('div');
      card.className = 'robot-card';
      card.addEventListener('click', () => onRobotClick(robot));

      const colorHex = '#' + ROBOT_COLORS[i].toString(16).padStart(6, '0');

      card.innerHTML = `
        <div class="robot-header">
          <div class="robot-dot" style="background:${colorHex}; color:${colorHex}"></div>
          <div class="robot-name">${robot.name}</div>
          <div class="robot-state" data-state>Idle</div>
        </div>
        <div class="needs-bars">
          ${Object.keys(NEED_COLORS).map(need => `
            <div class="need-row">
              <div class="need-label">${NEED_ICONS[need]}</div>
              <div class="need-bar">
                <div class="need-fill" data-need="${need}" style="width:80%;background:${NEED_COLORS[need]}"></div>
              </div>
            </div>
          `).join('')}
        </div>
      `;

      this.el.appendChild(card);
      this.cards.push(card);
    }
  }

  update() {
    for (let i = 0; i < this.robots.length; i++) {
      const robot = this.robots[i];
      const card = this.cards[i];

      card.querySelector('[data-state]').textContent = robot.getStateLabel();

      for (const need of Object.keys(NEED_COLORS)) {
        const fill = card.querySelector(`[data-need="${need}"]`);
        if (fill) {
          fill.style.width = `${Math.max(0, robot.needs[need])}%`;
        }
      }
    }
  }
}
