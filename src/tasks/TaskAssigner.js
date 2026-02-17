import { findPath, findNearestTile } from '../hex/HexPathfinding.js';
import { hexDistance } from '../hex/HexUtils.js';

export class TaskAssigner {
  constructor(grid, taskQueue, robots) {
    this.grid = grid;
    this.taskQueue = taskQueue;
    this.robots = robots;
  }

  // Called by idle robots looking for work
  assignTask(robot) {
    const task = this.taskQueue.getNextUnassigned();
    if (!task) return null;

    // Find the station tile for this task
    const stationTile = findNearestTile(this.grid, robot.q, robot.r, t => {
      if (!t.furniture) return false;
      const fType = t.furniture.userData.furnitureType;

      // Match station type
      if (task.station === 'floor') return t.roomId === task.room || task.room === 'any';
      return fType === task.station;
    });

    if (!stationTile) return null;

    // Find walkable tile adjacent to station
    const neighbors = this.grid.getWalkableNeighbors(stationTile.q, stationTile.r);
    if (neighbors.length === 0) return null;

    // Pick the closest neighbor to robot
    let best = neighbors[0];
    let bestDist = hexDistance({ q: robot.q, r: robot.r }, best);
    for (let i = 1; i < neighbors.length; i++) {
      const d = hexDistance({ q: robot.q, r: robot.r }, neighbors[i]);
      if (d < bestDist) {
        bestDist = d;
        best = neighbors[i];
      }
    }

    // Assign
    this.taskQueue.assignTask(task, robot);
    robot.currentTask = task;
    robot.moveTo(best.q, best.r, 'working');
    return task;
  }
}
