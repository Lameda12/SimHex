import { updateIdleBob } from '../RobotAnimations.js';
import { regenerateNeed } from '../NeedsSystem.js';

export const SocializingState = {
  name: 'socializing',

  enter(robot) {
    robot.socializeTimer = 30 + Math.random() * 30; // 30-60 in-game minutes
  },

  update(robot, dt, elapsed) {
    updateIdleBob(robot, elapsed);

    const simMinutes = dt * robot.simulation.clock.speedMultiplier * 2;
    const simHours = simMinutes / 60;

    regenerateNeed(robot.needs, 'social', 20 * simHours);

    // Face socializing partner if exists
    if (robot.socializePartner) {
      const dx = robot.socializePartner.worldX - robot.worldX;
      const dz = robot.socializePartner.worldZ - robot.worldZ;
      robot.mesh.rotation.y = Math.atan2(dx, dz);
    }

    robot.socializeTimer -= simMinutes;
    if (robot.socializeTimer <= 0) {
      if (robot.socializePartner) {
        robot.socializePartner.socializePartner = null;
        if (robot.socializePartner.stateMachine.getCurrentStateName() === 'socializing') {
          robot.socializePartner.stateMachine.setState('idle');
        }
      }
      robot.socializePartner = null;
      robot.stateMachine.setState('idle');
    }
  },

  exit(robot) {},
};
