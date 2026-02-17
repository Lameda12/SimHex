import * as THREE from 'three';
import { PLANETS } from '../constants.js';
import { Sun } from './Sun.js';
import { Planet } from './Planet.js';
import { Starfield } from './Starfield.js';

export class SolarSystem {
  constructor(sceneManager) {
    this.group = new THREE.Group();
    this.sun = new Sun();
    this.planets = {};
    this.starfield = new Starfield();

    this.group.add(this.sun.group);
    this.group.add(this.starfield.mesh);

    for (const pDef of PLANETS) {
      const planet = new Planet(pDef);
      this.planets[pDef.id] = planet;
      this.group.add(planet.group);
      this.group.add(planet.orbitLine);
    }

    sceneManager.add(this.group);
  }

  update(clock, elapsed) {
    const totalDays = clock.totalDays;
    for (const planet of Object.values(this.planets)) {
      planet.updateOrbit(totalDays);
    }
    this.sun.update(elapsed);
  }

  getPlanet(id) {
    return this.planets[id];
  }

  getPlanetPosition(id) {
    const planet = this.planets[id];
    return planet ? planet.getWorldPosition() : new THREE.Vector3();
  }

  getAllPlanets() {
    return Object.values(this.planets);
  }

  // Get planets + moons as flat list for mission targeting
  getAllTargets() {
    const targets = [];
    for (const planet of Object.values(this.planets)) {
      targets.push({ type: 'planet', id: planet.id, name: planet.name, object: planet });
      for (const moon of planet.moons) {
        targets.push({ type: 'moon', id: moon.id, name: moon.name, parentPlanet: planet, object: moon });
      }
    }
    return targets;
  }
}
