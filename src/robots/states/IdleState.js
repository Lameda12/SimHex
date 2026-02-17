import { updateOrbitBob } from '../RobotAnimations.js';

export const IdleState = {
  name: 'idle',

  enter(robot) {},

  update(robot, dt, elapsed) {
    // Orbit around current planet
    updateOrbitBob(robot, elapsed);

    // Check for available missions
    if (robot.simulation && robot.simulation.missionAssigner) {
      robot.simulation.missionAssigner.assignToRobot(robot);
    }
  },

  exit(robot) {},
};
