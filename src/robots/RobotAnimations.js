import { lerp } from '../utils/MathUtils.js';
import { axialToWorld } from '../hex/HexUtils.js';

// Idle bobbing animation
export function updateIdleBob(robot, elapsed) {
  const bobAmount = Math.sin(elapsed * 2 + robot.bobOffset) * 0.04;
  robot.mesh.position.y = bobAmount;
}

// Smooth movement toward next path waypoint
export function updateMovement(robot, dt) {
  if (!robot.path || robot.path.length === 0) return true; // done

  const target = robot.path[0];
  const targetWorld = axialToWorld(target.q, target.r);
  const tx = targetWorld.x;
  const tz = targetWorld.z;

  const dx = tx - robot.worldX;
  const dz = tz - robot.worldZ;
  const dist = Math.sqrt(dx * dx + dz * dz);

  if (dist < 0.05) {
    // Arrived at waypoint
    robot.worldX = tx;
    robot.worldZ = tz;
    robot.q = target.q;
    robot.r = target.r;
    robot.path.shift();

    if (robot.path.length === 0) return true; // path complete
    return false;
  }

  // Move toward target
  const speed = robot.speed * dt;
  const moveX = (dx / dist) * Math.min(speed, dist);
  const moveZ = (dz / dist) * Math.min(speed, dist);

  robot.worldX += moveX;
  robot.worldZ += moveZ;

  // Face movement direction
  const angle = Math.atan2(dx, dz);
  robot.mesh.rotation.y = lerp(robot.mesh.rotation.y, angle, 0.15);

  // Slight forward lean while moving
  robot.mesh.rotation.x = lerp(robot.mesh.rotation.x, 0.08, 0.1);

  return false;
}

// Reset lean when idle
export function resetLean(robot, dt) {
  robot.mesh.rotation.x = lerp(robot.mesh.rotation.x, 0, 0.1);
}

// Working animation - arm rotation
export function updateWorkingAnim(robot, elapsed) {
  const leftArm = robot.mesh.getObjectByName('left-arm');
  const rightArm = robot.mesh.getObjectByName('right-arm');
  if (leftArm) {
    leftArm.rotation.z = Math.sin(elapsed * 4 + robot.bobOffset) * 0.3;
  }
  if (rightArm) {
    rightArm.rotation.z = -Math.sin(elapsed * 4 + robot.bobOffset) * 0.3;
  }
}

// Sleeping animation - dim eyes
export function updateSleepAnim(robot, elapsed) {
  const leftEye = robot.mesh.getObjectByName('left-eye');
  const rightEye = robot.mesh.getObjectByName('right-eye');
  const dimFactor = 0.1 + Math.sin(elapsed * 0.5) * 0.05;
  if (leftEye) leftEye.material.emissiveIntensity = dimFactor;
  if (rightEye) rightEye.material.emissiveIntensity = dimFactor;
}

// Wake up eyes
export function resetEyes(robot) {
  const leftEye = robot.mesh.getObjectByName('left-eye');
  const rightEye = robot.mesh.getObjectByName('right-eye');
  if (leftEye) leftEye.material.emissiveIntensity = 1.0;
  if (rightEye) rightEye.material.emissiveIntensity = 1.0;
}

// Reset arm positions
export function resetArms(robot) {
  const leftArm = robot.mesh.getObjectByName('left-arm');
  const rightArm = robot.mesh.getObjectByName('right-arm');
  if (leftArm) leftArm.rotation.z = 0;
  if (rightArm) rightArm.rotation.z = 0;
}
