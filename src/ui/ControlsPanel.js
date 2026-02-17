export class ControlsPanel {
  constructor(container, sceneManager) {
    this.sceneManager = sceneManager;

    this.el = document.createElement('div');
    this.el.className = 'controls-panel';
    this.el.innerHTML = `
      <button class="ctrl-btn" data-action="reset-cam">Reset Camera</button>
      <button class="ctrl-btn" data-action="toggle-grid">Grid Lines</button>
    `;
    container.appendChild(this.el);

    this.el.querySelector('[data-action="reset-cam"]').addEventListener('click', () => {
      sceneManager.camera.position.set(8, 10, 8);
      sceneManager.controls.target.set(0, 0, 0);
    });

    this.el.querySelector('[data-action="toggle-grid"]').addEventListener('click', () => {
      const grid = sceneManager.scene.getObjectByName('hex-grid');
      if (grid) {
        grid.traverse(child => {
          if (child.isLine) {
            child.visible = !child.visible;
          }
        });
      }
    });
  }
}
