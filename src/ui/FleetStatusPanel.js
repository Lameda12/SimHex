export class FleetStatusPanel {
  constructor(container, robots, onRobotClick) {
    this.robots = robots;
    this.onRobotClick = onRobotClick;

    this.el = document.createElement('div');
    this.el.className = 'robot-panel';
    container.appendChild(this.el);

    this.cards = [];
    for (const robot of robots) {
      const card = document.createElement('div');
      card.className = 'robot-card';
      card.innerHTML = `
        <div class="robot-header">
          <div class="robot-dot" style="color: #${robot.color.toString(16).padStart(6, '0')}; background: #${robot.color.toString(16).padStart(6, '0')}"></div>
          <div class="robot-name">${robot.name}</div>
          <div class="robot-state" data-state>Idle</div>
        </div>
        <div class="probe-info">
          <div class="probe-location" data-location>Earth</div>
          <div class="probe-missions" data-missions>0 missions</div>
          <div class="probe-progress-row" data-progress-row style="display:none">
            <div class="need-bar"><div class="need-fill" data-progress-fill style="background: #${robot.color.toString(16).padStart(6, '0')}; width: 0%"></div></div>
          </div>
        </div>
      `;
      card.addEventListener('click', () => onRobotClick(robot));
      this.el.appendChild(card);
      this.cards.push({ el: card, robot });
    }
  }

  update() {
    for (const { el, robot } of this.cards) {
      el.querySelector('[data-state]').textContent = robot.getStateLabel();

      const location = robot.currentPlanet ? robot.currentPlanet.name :
        (robot.targetPlanet ? `-> ${robot.targetPlanet.name}` : 'Deep Space');
      el.querySelector('[data-location]').textContent = location;
      el.querySelector('[data-missions]').textContent = `${robot.missionsCompleted} missions`;

      const progress = robot.getMissionProgress();
      const progressRow = el.querySelector('[data-progress-row]');
      if (progress !== null) {
        progressRow.style.display = '';
        el.querySelector('[data-progress-fill]').style.width = `${progress * 100}%`;
      } else {
        progressRow.style.display = 'none';
      }
    }
  }
}
