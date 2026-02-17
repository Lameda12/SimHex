import { updateMovement, updateIdleBob } from '../RobotAnimations.js';

export const MovingState = {
  name: 'moving',

  enter(robot) {},

  update(robot, dt, elapsed) {
    updateIdleBob(robot, elapsed);
    const arrived = updateMovement(robot, dt);

    if (arrived) {
      // Transition to target state
      const targetState = robot.targetState || 'idle';
      robot.targetState = null;
      robot.stateMachine.setState(targetState);
    }
  },

  exit(robot) {},
};
