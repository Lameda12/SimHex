import { TASK_TYPES, TASK_SCHEDULE } from './TaskDefinitions.js';
import { randomRange } from '../utils/MathUtils.js';
import { EventBus } from '../utils/EventBus.js';

let taskIdCounter = 0;

export class TaskQueue {
  constructor() {
    this.pending = [];
    this.active = [];
    this.completed = [];
    this.lastSpawnHour = -1;
    this.nextRandomSpawn = {};

    // Initialize random spawn timers
    for (const schedule of TASK_SCHEDULE) {
      if (schedule.intervalMin) {
        this.nextRandomSpawn[schedule.type] = randomRange(schedule.intervalMin, schedule.intervalMax);
      }
    }
  }

  update(currentHour, dtHours) {
    const hourInt = Math.floor(currentHour);

    // Check scheduled tasks
    if (hourInt !== this.lastSpawnHour) {
      this.lastSpawnHour = hourInt;

      for (const schedule of TASK_SCHEDULE) {
        if (schedule.hours && schedule.hours.includes(hourInt)) {
          this.addTask(schedule.type);
        }
        if (schedule.interval && hourInt % schedule.interval === 0) {
          this.addTask(schedule.type);
        }
      }
    }

    // Check random interval spawns
    for (const schedule of TASK_SCHEDULE) {
      if (schedule.intervalMin) {
        this.nextRandomSpawn[schedule.type] -= dtHours;
        if (this.nextRandomSpawn[schedule.type] <= 0) {
          this.addTask(schedule.type);
          this.nextRandomSpawn[schedule.type] = randomRange(schedule.intervalMin, schedule.intervalMax);
        }
      }
    }
  }

  addTask(type) {
    const def = TASK_TYPES[type];
    if (!def) return;

    // Don't add if same type already pending
    if (this.pending.some(t => t.type === type)) return;

    const task = {
      id: taskIdCounter++,
      type,
      ...def,
      assignedTo: null,
      completed: false,
      createdAt: Date.now(),
    };

    this.pending.push(task);
    this.pending.sort((a, b) => b.priority - a.priority);
    EventBus.emit('task-added', task);
  }

  getNextUnassigned() {
    return this.pending.find(t => !t.assignedTo) || null;
  }

  assignTask(task, robot) {
    task.assignedTo = robot.name;
    const idx = this.pending.indexOf(task);
    if (idx >= 0) this.pending.splice(idx, 1);
    this.active.push(task);
    EventBus.emit('task-assigned', { task, robot });
  }

  completeTask(task) {
    const idx = this.active.indexOf(task);
    if (idx >= 0) this.active.splice(idx, 1);
    this.completed.push(task);
    if (this.completed.length > 20) this.completed.shift();
    EventBus.emit('task-completed', task);
  }

  getAllTasks() {
    return [...this.pending, ...this.active];
  }
}
