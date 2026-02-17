export class ControlsPanel {
  constructor(container, sceneManager, solarSystem) {
    this.sceneManager = sceneManager;
    this.solarSystem = solarSystem;

    this.el = document.createElement('div');
    this.el.className = 'controls-panel';
    this.el.innerHTML = `
      <button class="ctrl-btn" data-action="overview">Overview</button>
      <button class="ctrl-btn" data-action="focus-earth">Focus Earth</button>
      <button class="ctrl-btn" data-action="focus-mars">Focus Mars</button>
    `;
    container.appendChild(this.el);

    this.el.querySelector('[data-action="overview"]').addEventListener('click', () => {
      sceneManager.camera.position.set(0, 60, 80);
      sceneManager.controls.target.set(0, 0, 0);
    });

    this.el.querySelector('[data-action="focus-earth"]').addEventListener('click', () => {
      const earth = solarSystem.getPlanet('earth');
      if (earth) {
        const pos = earth.getWorldPosition();
        sceneManager.controls.target.set(pos.x, pos.y, pos.z);
        sceneManager.camera.position.set(pos.x + 3, pos.y + 3, pos.z + 3);
      }
    });

    this.el.querySelector('[data-action="focus-mars"]').addEventListener('click', () => {
      const mars = solarSystem.getPlanet('mars');
      if (mars) {
        const pos = mars.getWorldPosition();
        sceneManager.controls.target.set(pos.x, pos.y, pos.z);
        sceneManager.camera.position.set(pos.x + 3, pos.y + 3, pos.z + 3);
      }
    });
  }
}
