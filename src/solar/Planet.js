import * as THREE from 'three';
import { createPlanetMesh, createMoonMesh } from './PlanetMeshFactory.js';
import { createOrbitLine } from './OrbitLine.js';
import { createPlanetLabel } from './PlanetLabel.js';

export class Planet {
  constructor(definition) {
    this.id = definition.id;
    this.name = definition.name;
    this.definition = definition;
    this.orbitRadius = definition.orbitRadius;
    this.orbitSpeed = definition.orbitSpeed;
    this.rotationSpeed = definition.rotationSpeed;

    // Three.js group for the planet + moons (moves along orbit)
    this.group = new THREE.Group();

    // Planet mesh
    this.mesh = createPlanetMesh(definition);
    this.group.add(this.mesh);

    // Orbit line (stays at origin, doesn't move with the planet)
    this.orbitLine = createOrbitLine(this.orbitRadius);

    // Moons
    this.moons = [];
    if (definition.moons) {
      for (const moonDef of definition.moons) {
        const moonMesh = createMoonMesh(moonDef);
        const moonData = {
          id: moonDef.id,
          name: moonDef.name,
          mesh: moonMesh,
          orbitRadius: moonDef.orbitRadius,
          orbitSpeed: moonDef.orbitSpeed,
        };
        this.moons.push(moonData);
        this.group.add(moonMesh);
      }
    }

    // Planet name label sprite
    this.labelSprite = createPlanetLabel(definition.name);
    this.labelSprite.position.y = definition.radius + 0.8;
    this.group.add(this.labelSprite);

    // State
    this.visited = false;
    this.bases = [];
    this.colonized = false;
  }

  updateOrbit(totalDays) {
    const angle = totalDays * this.orbitSpeed * 0.01;
    this.group.position.x = Math.cos(angle) * this.orbitRadius;
    this.group.position.z = Math.sin(angle) * this.orbitRadius;

    // Rotate the planet sphere
    const sphere = this.mesh.userData.planetSphere;
    if (sphere) {
      sphere.rotation.y += this.rotationSpeed * 0.01;
    }

    // Update moon orbits
    for (const moon of this.moons) {
      const moonAngle = totalDays * moon.orbitSpeed * 0.01;
      moon.mesh.position.x = Math.cos(moonAngle) * moon.orbitRadius;
      moon.mesh.position.z = Math.sin(moonAngle) * moon.orbitRadius;
    }
  }

  getWorldPosition() {
    const pos = new THREE.Vector3();
    this.group.getWorldPosition(pos);
    return pos;
  }

  addBase() {
    this.bases.push({ builtAt: Date.now() });
    if (!this.visited) this.visited = true;
  }

  markVisited() {
    this.visited = true;
  }
}
