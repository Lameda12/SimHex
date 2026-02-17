import * as THREE from 'three';
import { lerp } from '../utils/MathUtils.js';
import { NIGHT_SKY, DAY_SKY, DAWN_SKY } from '../utils/ColorPalette.js';

const tempColor = new THREE.Color();

export class DayNightCycle {
  constructor(sceneManager) {
    this.scene = sceneManager.scene;
    this.sunLight = sceneManager.sunLight;
    this.ambientLight = sceneManager.ambientLight;
    this.renderer = sceneManager.renderer;
  }

  update(clock) {
    const progress = clock.getDayProgress(); // 0-1
    const sunAngle = progress * Math.PI * 2 - Math.PI / 2; // -PI/2 at midnight

    // Sun position arc
    const sunRadius = 12;
    const sunX = Math.cos(sunAngle) * sunRadius;
    const sunY = Math.sin(sunAngle) * sunRadius;
    this.sunLight.position.set(sunX, Math.max(sunY, 0.5), 3);

    // Sun intensity based on height
    const sunHeight = Math.sin(sunAngle);
    this.sunLight.intensity = Math.max(0, sunHeight) * 1.2;

    // Sun color shifts
    if (sunHeight > 0.3) {
      this.sunLight.color.setHex(0xffeedd); // daylight
    } else if (sunHeight > 0) {
      this.sunLight.color.lerpColors(
        new THREE.Color(0xff6622),
        new THREE.Color(0xffeedd),
        sunHeight / 0.3
      );
    }

    // Ambient light
    const ambientIntensity = Math.max(0.1, sunHeight * 0.4 + 0.15);
    this.ambientLight.intensity = ambientIntensity;

    // Sky/background color
    const bg = this.scene.background;
    if (sunHeight > 0.2) {
      bg.copy(DAY_SKY);
    } else if (sunHeight > -0.1) {
      // Dawn/dusk transition
      const t = (sunHeight + 0.1) / 0.3;
      bg.lerpColors(DAWN_SKY, DAY_SKY, t);
    } else {
      // Night
      const t = Math.max(0, (sunHeight + 0.5) / 0.4);
      bg.lerpColors(NIGHT_SKY, DAWN_SKY, t);
    }

    // Tone mapping exposure
    this.renderer.toneMappingExposure = lerp(0.3, 1.2, Math.max(0, sunHeight + 0.2));
  }
}
