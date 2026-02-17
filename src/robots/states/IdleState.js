import { getMostUrgentNeed } from '../NeedsSystem.js';
import { updateIdleBob, resetLean, resetArms, resetEyes } from '../RobotAnimations.js';
import { randomRange } from '../../utils/MathUtils.js';

export const IdleState = {
  name: 'idle',

  enter(robot) {
    robot.wanderTimer = randomRange(2, 5);
    resetArms(robot);
    resetEyes(robot);
  },

  update(robot, dt, elapsed) {
    updateIdleBob(robot, elapsed);
    resetLean(robot, dt);

    // Check urgent needs
    const urgentNeed = getMostUrgentNeed(robot.needs);
    if (urgentNeed) {
      robot.seekNeed(urgentNeed);
      return;
    }

    // Check for available tasks
    if (robot.simulation && robot.simulation.taskAssigner) {
      const task = robot.simulation.taskAssigner.assignTask(robot);
      if (task) return; // task assigner handles state transition
    }

    // Wander randomly
    robot.wanderTimer -= dt;
    if (robot.wanderTimer <= 0) {
      robot.wanderTimer = randomRange(3, 6);
      robot.wanderToRandomNeighbor();
    }
  },

  exit(robot) {},
};
