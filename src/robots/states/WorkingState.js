import { updateOrbitBob, updateWorkingAnim } from '../RobotAnimations.js';
import { EventBus } from '../../utils/EventBus.js';

export const WorkingState = {
  name: 'working',

  enter(robot) {
    robot.workTimer = robot.currentMission ? robot.currentMission.duration : 30;
  },

  update(robot, dt, elapsed) {
    // Stay in orbit while working
    updateOrbitBob(robot, elapsed);
    updateWorkingAnim(robot, elapsed);

    // Decrement timer in sim-days
    const simDays = dt * robot.simulation.clock.speedMultiplier * 0.5;
    robot.workTimer -= simDays;

    if (robot.workTimer <= 0) {
      // Mission complete
      if (robot.currentMission) {
        robot.currentMission.completed = true;
        robot.missionsCompleted++;

        // Check if it's a base-building mission
        if (robot.currentMission.type === 'build_base' || robot.currentMission.type === 'establish_colony') {
          if (robot.currentPlanet) {
            robot.currentPlanet.addBase();
            EventBus.emit('base-built', {
              planetId: robot.currentPlanet.id,
              missionType: robot.currentMission.type,
            });
          }
        }

        if (robot.simulation && robot.simulation.missionQueue) {
          robot.simulation.missionQueue.completeMission(robot.currentMission);
        }

        EventBus.emit('mission-completed', {
          mission: robot.currentMission,
          robotName: robot.name,
          planetId: robot.currentPlanet ? robot.currentPlanet.id : null,
        });
      }
      robot.currentMission = null;
      robot.stateMachine.setState('idle');
    }
  },

  exit(robot) {},
};
