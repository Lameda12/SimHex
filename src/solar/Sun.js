import * as THREE from 'three';
import { SUN } from '../constants.js';

export class Sun {
  constructor() {
    this.group = new THREE.Group();

    // Emissive sun sphere
    const geo = new THREE.SphereGeometry(SUN.radius, 32, 32);
    const mat = new THREE.MeshBasicMaterial({
      color: SUN.color,
      transparent: true,
      opacity: 1.0,
    });
    this.mesh = new THREE.Mesh(geo, mat);
    this.group.add(this.mesh);

    // Outer glow
    const glowGeo = new THREE.SphereGeometry(SUN.radius * 1.4, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({
      color: SUN.emissive,
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide,
    });
    this.glow = new THREE.Mesh(glowGeo, glowMat);
    this.group.add(this.glow);

    // Point light from sun
    this.light = new THREE.PointLight(SUN.lightColor, SUN.lightIntensity, 300, 0.1);
    this.light.position.set(0, 0, 0);
    this.group.add(this.light);
  }

  update(elapsed) {
    // Subtle pulse
    const pulse = 1.0 + Math.sin(elapsed * 2) * 0.05;
    this.glow.scale.setScalar(pulse);
    this.light.intensity = SUN.lightIntensity + Math.sin(elapsed * 1.5) * 0.2;
  }
}
