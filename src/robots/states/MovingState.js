import { updateFlight, setThrusterActive } from '../RobotAnimations.js';

export const MovingState = {
  name: 'moving',

  enter(robot) {
    setThrusterActive(robot, true);
  },

  update(robot, dt, elapsed) {
    const arrived = updateFlight(robot, dt);

    if (arrived) {
      robot.stateMachine.setState('arriving');
    }
  },

  exit(robot) {
    setThrusterActive(robot, false);
  },
};
