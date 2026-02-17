import { setThrusterActive, updateLaunch } from '../RobotAnimations.js';

export const LaunchingState = {
  name: 'launching',

  enter(robot) {
    robot.launchOrigin = robot.position.clone();
    robot.launchProgress = 0;
    setThrusterActive(robot, true);
    robot.currentPlanet = null;
  },

  update(robot, dt, elapsed) {
    robot.launchProgress += dt * 0.8;
    updateLaunch(robot, robot.launchProgress);

    if (robot.launchProgress >= 1.0) {
      robot.stateMachine.setState('moving');
    }
  },

  exit(robot) {
    robot.launchOrigin = null;
  },
};
