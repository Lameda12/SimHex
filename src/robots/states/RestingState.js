import { updateSleepAnim } from '../RobotAnimations.js';
import { regenerateNeed } from '../NeedsSystem.js';

export const RestingState = {
  name: 'resting',

  enter(robot) {},

  update(robot, dt, elapsed) {
    updateSleepAnim(robot, elapsed);

    const simHours = dt * robot.simulation.clock.speedMultiplier * 2 / 60;
    regenerateNeed(robot.needs, 'energy', 15 * simHours);

    if (robot.needs.energy >= 90) {
      robot.stateMachine.setState('idle');
    }
  },

  exit(robot) {},
};
