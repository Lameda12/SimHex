import * as THREE from 'three';

export function createRobotMesh(accentColor) {
  const group = new THREE.Group();

  // Main body - cylinder bus
  const bodyGeo = new THREE.CylinderGeometry(0.15, 0.18, 0.5, 8);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x333344,
    metalness: 0.6,
    roughness: 0.3,
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.name = 'body';
  group.add(body);

  // Accent ring around body
  const ringGeo = new THREE.TorusGeometry(0.17, 0.015, 8, 16);
  const ringMat = new THREE.MeshStandardMaterial({
    color: accentColor,
    emissive: accentColor,
    emissiveIntensity: 0.5,
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.05;
  group.add(ring);

  // Solar panels - two thin rectangles
  const panelGeo = new THREE.BoxGeometry(0.6, 0.02, 0.2);
  const panelMat = new THREE.MeshStandardMaterial({
    color: 0x224488,
    metalness: 0.8,
    roughness: 0.2,
  });

  const leftPanel = new THREE.Mesh(panelGeo, panelMat);
  leftPanel.position.set(-0.4, 0.05, 0);
  leftPanel.name = 'left-panel';
  group.add(leftPanel);

  const rightPanel = new THREE.Mesh(panelGeo, panelMat);
  rightPanel.position.set(0.4, 0.05, 0);
  rightPanel.name = 'right-panel';
  group.add(rightPanel);

  // Dish antenna on top
  const dishGeo = new THREE.ConeGeometry(0.1, 0.08, 16, 1, true);
  const dishMat = new THREE.MeshStandardMaterial({
    color: 0xccccdd,
    metalness: 0.7,
    roughness: 0.2,
    side: THREE.DoubleSide,
  });
  const dish = new THREE.Mesh(dishGeo, dishMat);
  dish.position.y = 0.3;
  dish.rotation.x = Math.PI;
  dish.name = 'dish';
  group.add(dish);

  // Antenna mast
  const mastGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.12, 6);
  const mastMat = new THREE.MeshStandardMaterial({ color: 0x888899 });
  const mast = new THREE.Mesh(mastGeo, mastMat);
  mast.position.y = 0.36;
  group.add(mast);

  // Antenna tip
  const tipGeo = new THREE.SphereGeometry(0.015, 8, 8);
  const tipMat = new THREE.MeshStandardMaterial({
    color: accentColor,
    emissive: accentColor,
    emissiveIntensity: 0.8,
  });
  const tip = new THREE.Mesh(tipGeo, tipMat);
  tip.position.y = 0.42;
  group.add(tip);

  // Thruster at bottom (emissive, toggleable)
  const thrusterGeo = new THREE.SphereGeometry(0.06, 8, 8);
  const thrusterMat = new THREE.MeshStandardMaterial({
    color: accentColor,
    emissive: accentColor,
    emissiveIntensity: 0,
    transparent: true,
    opacity: 0,
  });
  const thruster = new THREE.Mesh(thrusterGeo, thrusterMat);
  thruster.position.y = -0.3;
  thruster.name = 'thruster';
  group.add(thruster);

  // Point light glow
  const glow = new THREE.PointLight(accentColor, 0.4, 3);
  glow.position.y = 0;
  group.add(glow);

  group.userData.accentColor = accentColor;
  return group;
}
