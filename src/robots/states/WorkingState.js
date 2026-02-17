import { updateIdleBob, updateWorkingAnim } from '../RobotAnimations.js';

export const WorkingState = {
  name: 'working',

  enter(robot) {
    robot.workTimer = robot.currentTask ? robot.currentTask.duration : 20;
  },

  update(robot, dt, elapsed) {
    updateIdleBob(robot, elapsed);
    updateWorkingAnim(robot, elapsed);

    // Convert dt to in-game minutes
    const simMinutes = dt * robot.simulation.clock.speedMultiplier * 2;
    robot.workTimer -= simMinutes;

    if (robot.workTimer <= 0) {
      // Task complete
      if (robot.currentTask) {
        robot.currentTask.completed = true;
        robot.currentTask.assignedTo = null;
        if (robot.simulation && robot.simulation.taskQueue) {
          robot.simulation.taskQueue.completeTask(robot.currentTask);
        }
      }
      robot.currentTask = null;
      robot.stateMachine.setState('idle');
    }
  },

  exit(robot) {},
};
