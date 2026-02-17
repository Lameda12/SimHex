import * as THREE from 'three';

export function createPlanetMesh(definition) {
  const group = new THREE.Group();

  // Main sphere
  const geo = new THREE.SphereGeometry(definition.radius, 32, 32);
  const mat = new THREE.MeshStandardMaterial({
    color: definition.color,
    roughness: 0.7,
    metalness: 0.1,
  });
  const sphere = new THREE.Mesh(geo, mat);
  group.add(sphere);

  // Atmosphere glow for planets that have it
  if (definition.atmosphere) {
    const atmosGeo = new THREE.SphereGeometry(definition.radius * 1.12, 32, 32);
    const atmosMat = new THREE.MeshBasicMaterial({
      color: definition.atmosphere,
      transparent: true,
      opacity: 0.1,
      side: THREE.BackSide,
    });
    group.add(new THREE.Mesh(atmosGeo, atmosMat));
  }

  // Saturn rings
  if (definition.hasRings) {
    const ringGeo = new THREE.RingGeometry(
      definition.ringsInnerRadius,
      definition.ringsOuterRadius,
      64
    );
    const ringMat = new THREE.MeshBasicMaterial({
      color: definition.ringsColor,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2.5;
    group.add(ring);
  }

  group.userData.planetSphere = sphere;
  return group;
}

export function createMoonMesh(moonDef) {
  const geo = new THREE.SphereGeometry(moonDef.radius, 16, 16);
  const mat = new THREE.MeshStandardMaterial({
    color: moonDef.color,
    roughness: 0.9,
    metalness: 0.0,
  });
  return new THREE.Mesh(geo, mat);
}
