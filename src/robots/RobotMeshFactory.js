import * as THREE from 'three';
import { createHexPrism } from '../hex/HexMeshFactory.js';
import { HEX_HEIGHT } from '../constants.js';

export function createRobotMesh(accentColor) {
  const group = new THREE.Group();

  // Hover disk (flat glowing hex at ground level)
  const hoverDisk = createHexPrism(0.25, 0.02, 0x111118, accentColor, 0.5);
  hoverDisk.position.y = HEX_HEIGHT + 0.02;
  hoverDisk.name = 'hover-disk';
  group.add(hoverDisk);

  // Body - hex prism
  const body = createHexPrism(0.18, 0.4, 0x222233, accentColor, 0.15);
  body.position.y = HEX_HEIGHT + 0.12;
  body.name = 'body';
  group.add(body);

  // Head - smaller hex prism, slightly rotated
  const head = createHexPrism(0.12, 0.15, 0x333344, accentColor, 0.2);
  head.position.y = HEX_HEIGHT + 0.55;
  head.rotation.y = Math.PI / 6; // rotated 30 degrees for visual interest
  head.name = 'head';
  group.add(head);

  // Eyes - two small emissive spheres
  const eyeGeo = new THREE.SphereGeometry(0.025, 8, 8);
  const eyeMat = new THREE.MeshStandardMaterial({
    color: accentColor,
    emissive: accentColor,
    emissiveIntensity: 1.0,
  });
  const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
  leftEye.position.set(-0.05, HEX_HEIGHT + 0.65, 0.1);
  leftEye.name = 'left-eye';
  group.add(leftEye);

  const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
  rightEye.position.set(0.05, HEX_HEIGHT + 0.65, 0.1);
  rightEye.name = 'right-eye';
  group.add(rightEye);

  // Arms - thin hex prisms
  const armGeo = createHexPrism(0.03, 0.25, 0x333344);
  const leftArm = armGeo.clone();
  leftArm.position.set(-0.22, HEX_HEIGHT + 0.25, 0);
  leftArm.name = 'left-arm';
  group.add(leftArm);

  const rightArm = armGeo.clone();
  rightArm.position.set(0.22, HEX_HEIGHT + 0.25, 0);
  rightArm.name = 'right-arm';
  group.add(rightArm);

  // Antenna
  const antennaGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.15, 6);
  const antennaMat = new THREE.MeshStandardMaterial({ color: 0x888899 });
  const antenna = new THREE.Mesh(antennaGeo, antennaMat);
  antenna.position.y = HEX_HEIGHT + 0.77;
  group.add(antenna);

  // Antenna tip
  const tipGeo = new THREE.SphereGeometry(0.02, 8, 8);
  const tipMat = new THREE.MeshStandardMaterial({
    color: accentColor,
    emissive: accentColor,
    emissiveIntensity: 0.8,
  });
  const tip = new THREE.Mesh(tipGeo, tipMat);
  tip.position.y = HEX_HEIGHT + 0.85;
  group.add(tip);

  // Point light from the robot (subtle glow)
  const glow = new THREE.PointLight(accentColor, 0.3, 2);
  glow.position.y = HEX_HEIGHT + 0.4;
  group.add(glow);

  group.castShadow = true;
  group.userData.accentColor = accentColor;
  return group;
}
