import * as THREE from 'three';
import { lerp } from '../utils/MathUtils.js';

const _targetPos = new THREE.Vector3();

// Gentle bobbing while orbiting a planet
export function updateOrbitBob(robot, elapsed) {
  if (!robot.currentPlanet) return;

  const planet = robot.currentPlanet;
  const planetPos = planet.getWorldPosition();
  const orbitOffset = planet.definition.radius + 0.6;
  const angle = elapsed * 0.8 + robot.orbitPhase;

  robot.position.set(
    planetPos.x + Math.cos(angle) * orbitOffset,
    planetPos.y + Math.sin(elapsed * 1.5 + robot.orbitPhase) * 0.1,
    planetPos.z + Math.sin(angle) * orbitOffset
  );
}

// Interplanetary flight - smooth interpolation toward moving target
export function updateFlight(robot, dt) {
  if (!robot.targetPlanet) return true;

  const speed = robot.flightSpeed * dt * robot.simulation.clock.speedMultiplier;

  // Get current target position (planet moves during flight)
  _targetPos.copy(robot.targetPlanet.getWorldPosition());

  const direction = _targetPos.clone().sub(robot.position);
  const dist = direction.length();

  if (dist < robot.targetPlanet.definition.radius + 0.8) {
    return true; // arrived
  }

  direction.normalize().multiplyScalar(Math.min(speed, dist));
  robot.position.add(direction);

  // Face movement direction
  const angle = Math.atan2(direction.x, direction.z);
  robot.mesh.rotation.y = lerp(robot.mesh.rotation.y, angle, 0.1);

  return false;
}

// Toggle thruster visual
export function setThrusterActive(robot, active) {
  const thruster = robot.mesh.getObjectByName('thruster');
  if (!thruster) return;
  thruster.material.emissiveIntensity = active ? 1.5 : 0;
  thruster.material.opacity = active ? 0.8 : 0;
}

// Dish rotation during work
export function updateWorkingAnim(robot, elapsed) {
  const dish = robot.mesh.getObjectByName('dish');
  if (dish) {
    dish.rotation.y = elapsed * 2;
  }
  const leftPanel = robot.mesh.getObjectByName('left-panel');
  const rightPanel = robot.mesh.getObjectByName('right-panel');
  if (leftPanel) {
    leftPanel.rotation.z = Math.sin(elapsed * 0.5) * 0.1;
  }
  if (rightPanel) {
    rightPanel.rotation.z = -Math.sin(elapsed * 0.5) * 0.1;
  }
}

// Launch sequence - rise from planet
export function updateLaunch(robot, progress) {
  if (!robot.launchOrigin) return;
  const height = progress * 2.0;
  robot.position.copy(robot.launchOrigin);
  robot.position.y += height;
}
