export class TimePanel {
  constructor(container, clock, civTracker) {
    this.clock = clock;
    this.civTracker = civTracker;

    this.el = document.createElement('div');
    this.el.className = 'time-panel hex-panel';
    this.el.innerHTML = `
      <div>
        <div class="time-display" data-time>Year 1, Day 1</div>
        <div class="phase-label" data-phase>Stage 1: First Space Flight</div>
      </div>
      <div class="speed-controls">
        <button class="speed-btn active" data-speed="1">1x</button>
        <button class="speed-btn" data-speed="2">2x</button>
        <button class="speed-btn" data-speed="4">4x</button>
        <button class="speed-btn" data-speed="0">||</button>
      </div>
    `;
    container.appendChild(this.el);

    this.el.querySelectorAll('[data-speed]').forEach(btn => {
      btn.addEventListener('click', () => {
        const speed = parseInt(btn.dataset.speed);
        if (speed === 0) {
          this.clock.togglePause();
          btn.classList.toggle('active', this.clock.paused);
        } else {
          this.clock.paused = false;
          this.clock.setSpeed(speed);
          this.el.querySelectorAll('[data-speed]').forEach(b => {
            b.classList.toggle('active', b.dataset.speed === String(speed));
          });
          this.el.querySelector('[data-speed="0"]').classList.remove('active');
        }
      });
    });
  }

  update() {
    this.el.querySelector('[data-time]').textContent = this.clock.getTimeString();
    const stage = this.civTracker.getCurrentStageDef();
    this.el.querySelector('[data-phase]').textContent =
      `Stage ${stage.id}: ${stage.name}`;
  }
}
