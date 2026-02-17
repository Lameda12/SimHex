import * as THREE from 'three';
import { ORBIT_LINE_COLOR, ORBIT_LINE_OPACITY } from '../utils/ColorPalette.js';

export function createOrbitLine(radius, segments = 128) {
  const points = [];
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    points.push(new THREE.Vector3(
      Math.cos(angle) * radius,
      0,
      Math.sin(angle) * radius
    ));
  }

  const geo = new THREE.BufferGeometry().setFromPoints(points);
  const mat = new THREE.LineBasicMaterial({
    color: ORBIT_LINE_COLOR,
    transparent: true,
    opacity: ORBIT_LINE_OPACITY,
  });

  return new THREE.Line(geo, mat);
}
