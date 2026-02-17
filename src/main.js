import { SceneManager } from './core/Scene.js';
import { SimulationClock } from './core/SimulationClock.js';
import { SolarSystem } from './solar/SolarSystem.js';
import { Robot } from './robots/Robot.js';
import { MissionQueue } from './missions/MissionQueue.js';
import { MissionAssigner } from './missions/MissionAssigner.js';
import { CivilizationTracker } from './civilization/CivilizationTracker.js';
import { UIManager } from './ui/UIManager.js';
import { ROBOT_COUNT, ROBOT_NAMES, ROBOT_COLORS } from './constants.js';

// Bootstrap
const canvas = document.getElementById('app');
const sceneManager = new SceneManager(canvas);

const clock = new SimulationClock();
const solarSystem = new SolarSystem(sceneManager);
const civTracker = new CivilizationTracker();
const missionQueue = new MissionQueue(civTracker);

// Shared simulation context
const simulation = {
  clock,
  solarSystem,
  missionQueue,
  civTracker,
  robots: [],
  missionAssigner: null,
};

// Spawn robot probes orbiting Earth
const earth = solarSystem.getPlanet('earth');
const robots = [];
for (let i = 0; i < ROBOT_COUNT; i++) {
  const robot = new Robot(ROBOT_NAMES[i], ROBOT_COLORS[i], earth, simulation);
  robots.push(robot);
  sceneManager.add(robot.mesh);
}
simulation.robots = robots;

const missionAssigner = new MissionAssigner(missionQueue, robots, solarSystem);
simulation.missionAssigner = missionAssigner;

const uiManager = new UIManager(sceneManager, clock, robots, missionQueue, civTracker, solarSystem);

// Seed initial mission so things start happening
missionQueue.addMission('flyby', 'earth');

let uiFrame = 0;
sceneManager.onTick((dt, elapsed) => {
  clock.update(dt);
  solarSystem.update(clock, elapsed);

  for (const robot of robots) {
    robot.update(dt, elapsed);
  }

  missionQueue.update(clock);
  civTracker.checkAdvancement();

  uiFrame++;
  if (uiFrame % 3 === 0) uiManager.update();
});

sceneManager.start();
console.log('Stellar Probe - Solar System Exploration started');
