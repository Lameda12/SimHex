import { updateIdleBob } from '../RobotAnimations.js';
import { regenerateNeed } from '../NeedsSystem.js';

export const EatingState = {
  name: 'eating',

  enter(robot) {
    robot.eatTimer = 15; // 15 in-game minutes
  },

  update(robot, dt, elapsed) {
    updateIdleBob(robot, elapsed);

    const simMinutes = dt * robot.simulation.clock.speedMultiplier * 2;
    const simHours = simMinutes / 60;

    regenerateNeed(robot.needs, 'hunger', 40 * simHours);

    robot.eatTimer -= simMinutes;
    if (robot.eatTimer <= 0 || robot.needs.hunger >= 90) {
      robot.stateMachine.setState('idle');
    }
  },

  exit(robot) {},
};
