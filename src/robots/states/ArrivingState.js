import { EventBus } from '../../utils/EventBus.js';

export const ArrivingState = {
  name: 'arriving',

  enter(robot) {
    // Set current planet to target
    robot.currentPlanet = robot.targetPlanet;
    robot.targetPlanet = null;

    // Mark planet as visited
    if (robot.currentPlanet) {
      robot.currentPlanet.markVisited();
      robot.planetsVisited.add(robot.currentPlanet.id);
      EventBus.emit('planet-visited', {
        planetId: robot.currentPlanet.id,
        robotName: robot.name,
      });
    }
  },

  update(robot, dt, elapsed) {
    // Brief pause then transition
    if (robot.currentMission) {
      robot.stateMachine.setState('working');
    } else {
      robot.stateMachine.setState('idle');
    }
  },

  exit(robot) {},
};
