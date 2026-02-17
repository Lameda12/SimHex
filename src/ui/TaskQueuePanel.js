export class TaskQueuePanel {
  constructor(container, taskQueue) {
    this.taskQueue = taskQueue;

    this.el = document.createElement('div');
    this.el.className = 'task-panel hex-panel';
    this.el.innerHTML = `
      <h3>Tasks</h3>
      <div data-task-list></div>
    `;
    container.appendChild(this.el);
    this.listEl = this.el.querySelector('[data-task-list]');
  }

  update() {
    const tasks = this.taskQueue.getAllTasks();
    const html = tasks.map(task => {
      const priorityColor = task.priority >= 4 ? '#ff0066' : task.priority >= 3 ? '#ffab00' : '#00e5ff';
      return `
        <div class="task-item">
          <div class="task-priority" style="background:${priorityColor}"></div>
          <div class="task-name">${task.label}</div>
          ${task.assignedTo ? `<div class="task-assignee">${task.assignedTo}</div>` : ''}
        </div>
      `;
    }).join('');

    this.listEl.innerHTML = html || '<div class="task-item" style="color:var(--text-dim)">No tasks</div>';
  }
}
