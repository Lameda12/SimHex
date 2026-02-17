import * as THREE from 'three';
import { SceneManager } from './core/Scene.js';
import { SimulationClock } from './core/SimulationClock.js';
import { DayNightCycle } from './core/DayNightCycle.js';
import { HexGrid } from './hex/HexGrid.js';
import { ROOMS, DOORS } from './house/HouseLayout.js';
import { createFurniture } from './house/FurnitureFactory.js';
import { axialToWorld, hexNeighbors, tileKey } from './hex/HexUtils.js';
import { createWallTile } from './hex/HexMeshFactory.js';
import { Robot } from './robots/Robot.js';
import { TaskQueue } from './tasks/TaskQueue.js';
import { TaskAssigner } from './tasks/TaskAssigner.js';
import { UIManager } from './ui/UIManager.js';
import { ROBOT_COUNT, ROBOT_NAMES, ROBOT_COLORS } from './constants.js';

// -- Init Scene --
const canvas = document.getElementById('app');
const sceneManager = new SceneManager(canvas);

// -- Build Hex Grid & House --
const grid = new HexGrid();

// Collect all floor tile positions into a set
const floorSet = new Set();

// Add floor tiles for each room
for (const [roomId, roomDef] of Object.entries(ROOMS)) {
  for (const t of roomDef.tiles) {
    const type = roomId === 'garden' ? 'garden' : 'floor';
    grid.addTile(t.q, t.r, type, roomId);
    floorSet.add(tileKey(t.q, t.r));
  }
}

// -- Compute wall tiles along room boundaries --
const wallGroup = new THREE.Group();
wallGroup.name = 'walls';

// Door positions set for quick lookup
const doorSet = new Set(DOORS.map(d => tileKey(d.q, d.r)));

// Find boundary edges: for each floor tile, check neighbors.
// If a neighbor is not a floor tile, place a wall segment between them.
const wallPositions = new Set();
for (const tile of grid.tiles.values()) {
  if (tile.type === 'garden') continue; // garden has no walls
  const neighbors = hexNeighbors(tile.q, tile.r);
  for (const n of neighbors) {
    const nKey = tileKey(n.q, n.r);
    // If neighbor is not a floor/indoor tile, or is a garden tile
    if (!floorSet.has(nKey) || grid.getTile(n.q, n.r)?.type === 'garden') {
      // Wall at the midpoint between tile and neighbor (or at neighbor position)
      // Skip if this is a door position
      if (doorSet.has(tileKey(tile.q, tile.r))) continue;

      // Place wall at the boundary neighbor position if not already floor
      if (!floorSet.has(nKey)) {
        const key = nKey;
        if (!wallPositions.has(key)) {
          wallPositions.add(key);
          const { x, z } = axialToWorld(n.q, n.r);
          const wall = createWallTile();
          wall.position.set(x, 0, z);
          wallGroup.add(wall);
        }
      }
    }
  }
}
sceneManager.add(wallGroup);

// Place furniture
const furnitureGroups = [];
for (const [roomId, roomDef] of Object.entries(ROOMS)) {
  if (!roomDef.furniture) continue;
  for (const fDef of roomDef.furniture) {
    const furnitureMesh = createFurniture(fDef.type);
    const worldPos = axialToWorld(fDef.q, fDef.r);
    furnitureMesh.position.set(worldPos.x, 0, worldPos.z);
    sceneManager.add(furnitureMesh);
    furnitureGroups.push(furnitureMesh);

    // Mark tile as occupied
    const tile = grid.getTile(fDef.q, fDef.r);
    if (tile) {
      tile.occupied = true;
      tile.walkable = false;
      tile.furniture = furnitureMesh;
    }
  }
}

// Build hex floor meshes
grid.buildMeshes();
sceneManager.add(grid.group);

// -- Ground plane (dark base under the hex tiles) --
const groundGeo = new THREE.PlaneGeometry(30, 30);
const groundMat = new THREE.MeshStandardMaterial({
  color: 0x050508,
  roughness: 1,
  metalness: 0,
});
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.02;
ground.receiveShadow = true;
sceneManager.add(ground);

// -- Fog for atmosphere --
sceneManager.scene.fog = new THREE.FogExp2(0x0a0a0f, 0.04);

// -- Simulation Clock & Day/Night --
const clock = new SimulationClock();
const dayNight = new DayNightCycle(sceneManager);

// -- Task System --
const taskQueue = new TaskQueue();

// -- Simulation object (shared reference) --
const simulation = {
  grid,
  clock,
  taskQueue,
  taskAssigner: null,
  robots: [],
};

// -- Spawn Robots --
const robots = [];
const walkableTiles = grid.getAllWalkableTiles();

for (let i = 0; i < ROBOT_COUNT && i < walkableTiles.length; i++) {
  const spawnTile = walkableTiles[Math.floor(i * walkableTiles.length / ROBOT_COUNT)];
  const robot = new Robot(ROBOT_NAMES[i], ROBOT_COLORS[i], spawnTile.q, spawnTile.r, simulation);
  robots.push(robot);
  sceneManager.add(robot.mesh);
}

simulation.robots = robots;

// -- Task Assigner --
const taskAssigner = new TaskAssigner(grid, taskQueue, robots);
simulation.taskAssigner = taskAssigner;

// -- UI --
const uiManager = new UIManager(sceneManager, clock, robots, taskQueue, (robot) => {
  sceneManager.focusOn(robot.worldX, 0, robot.worldZ);
});

// -- Update Loop --
let uiFrame = 0;

sceneManager.onTick((dt, elapsed) => {
  // Update simulation clock
  clock.update(dt);

  // Day/night cycle
  dayNight.update(clock);

  // Update task queue (spawn new tasks)
  const currentHour = clock.getHour() + clock.getMinute() / 60;
  const dtHours = dt * clock.speedMultiplier * 2 / 60;
  taskQueue.update(currentHour, dtHours);

  // Update robots
  for (const robot of robots) {
    robot.update(dt, elapsed);
  }

  // Update UI every 3 frames for performance
  uiFrame++;
  if (uiFrame % 3 === 0) {
    uiManager.update();
  }
});

// -- Start --
sceneManager.start();

console.log('🤖 HEX HOME - Robot Simulation started');
console.log(`   ${robots.length} robots spawned`);
console.log(`   ${grid.tiles.size} hex tiles`);
console.log(`   ${wallPositions.size} wall segments`);
