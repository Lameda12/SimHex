import * as THREE from 'three';
import {
  createHexPrism, createBeveledHexPrism, createRoundedBox,
  createCylinder, createSphere, createGlassMaterial, createRing,
} from '../hex/HexMeshFactory.js';
import { HEX_HEIGHT } from '../constants.js';

const Y = HEX_HEIGHT;

export function createFurniture(type) {
  switch (type) {
    case 'stove': return createStove();
    case 'table': return createTable();
    case 'sink': return createSink();
    case 'couch': return createCouch();
    case 'shelf': return createShelf();
    case 'desk': return createDesk();
    case 'bed': return createBed();
    case 'nightstand': return createNightstand();
    case 'toilet': return createToilet();
    case 'bathroomSink': return createBathroomSink();
    case 'plant': return createPlant();
    default: return createGenericHex();
  }
}

// ─── KITCHEN ───────────────────────────────────────────

function createStove() {
  const group = new THREE.Group();

  // Main body - sleek dark appliance
  const body = createRoundedBox(0.6, 0.52, 0.55, 0x1a1a22, { metalness: 0.5, roughness: 0.3 });
  body.position.set(0, Y + 0.26, 0);
  group.add(body);

  // Cooktop surface - dark glass
  const cooktop = createRoundedBox(0.58, 0.02, 0.53, 0x0a0a10, { metalness: 0.8, roughness: 0.1 });
  cooktop.position.set(0, Y + 0.53, 0);
  group.add(cooktop);

  // 4 burner rings (glowing)
  const burnerPositions = [
    { x: -0.14, z: -0.12 }, { x: 0.14, z: -0.12 },
    { x: -0.14, z: 0.14 }, { x: 0.14, z: 0.14 },
  ];
  for (let i = 0; i < burnerPositions.length; i++) {
    const pos = burnerPositions[i];
    const isOn = i < 2;
    const ring = createRing(0.07, 0.008, isOn ? 0xff3300 : 0x333344, {
      emissive: isOn ? 0xff3300 : 0x000000,
      emissiveIntensity: isOn ? 1.2 : 0,
    });
    ring.rotation.x = Math.PI / 2;
    ring.position.set(pos.x, Y + 0.55, pos.z);
    group.add(ring);

    if (isOn) {
      const innerRing = createRing(0.04, 0.005, 0xff6600, {
        emissive: 0xff4400, emissiveIntensity: 0.8,
      });
      innerRing.rotation.x = Math.PI / 2;
      innerRing.position.set(pos.x, Y + 0.55, pos.z);
      group.add(innerRing);
    }
  }

  // Oven door handle
  const handle = createCylinder(0.008, 0.008, 0.35, 0xcccccc, { metalness: 0.9, roughness: 0.1 });
  handle.rotation.z = Math.PI / 2;
  handle.position.set(0, Y + 0.38, 0.28);
  group.add(handle);

  // Oven window
  const ovenWindow = createRoundedBox(0.3, 0.15, 0.01, 0x111115, { metalness: 0.1, roughness: 0.05 });
  ovenWindow.position.set(0, Y + 0.2, 0.28);
  group.add(ovenWindow);

  // Knobs
  for (let i = 0; i < 4; i++) {
    const knob = createCylinder(0.015, 0.015, 0.015, 0xcccccc, { metalness: 0.9, roughness: 0.1 });
    knob.rotation.x = Math.PI / 2;
    knob.position.set(-0.21 + i * 0.14, Y + 0.47, 0.28);
    group.add(knob);
  }

  // Pot on burner
  const pot = createCylinder(0.06, 0.055, 0.07, 0x888899, { metalness: 0.8, roughness: 0.2 });
  pot.position.set(-0.14, Y + 0.59, -0.12);
  group.add(pot);
  const potHandle = createCylinder(0.005, 0.005, 0.08, 0x444444, { metalness: 0.7 });
  potHandle.rotation.z = Math.PI / 2;
  potHandle.position.set(-0.14, Y + 0.63, -0.16);
  group.add(potHandle);

  group.userData.furnitureType = 'stove';
  return group;
}

function createTable() {
  const group = new THREE.Group();

  // Tabletop - warm wood hex
  const top = createBeveledHexPrism(0.35, 0.03, 0x8B6914);
  top.position.y = Y + 0.4;
  group.add(top);

  // 3 slim legs (tripod style)
  for (let i = 0; i < 3; i++) {
    const angle = (i * 120 + 30) * Math.PI / 180;
    const legX = Math.cos(angle) * 0.2;
    const legZ = Math.sin(angle) * 0.2;
    const leg = createCylinder(0.015, 0.02, 0.4, 0x666655, { metalness: 0.7, roughness: 0.2 });
    leg.position.set(legX, Y + 0.2, legZ);
    group.add(leg);

    const foot = createSphere(0.02, 0x888877, { metalness: 0.5 });
    foot.position.set(legX, Y + 0.01, legZ);
    group.add(foot);
  }

  // Plate on table
  const plate = createCylinder(0.05, 0.05, 0.005, 0xeeeef0, { roughness: 0.2, metalness: 0.05 });
  plate.position.set(0.05, Y + 0.435, 0.05);
  group.add(plate);

  // Glass
  const glassMat = createGlassMaterial(0xccddff);
  const glassGeo = new THREE.CylinderGeometry(0.02, 0.018, 0.06, 12, 1, true);
  const glass = new THREE.Mesh(glassGeo, glassMat);
  glass.position.set(-0.08, Y + 0.46, -0.04);
  group.add(glass);

  group.userData.furnitureType = 'table';
  return group;
}

function createSink() {
  const group = new THREE.Group();

  // Cabinet base
  const cabinet = createRoundedBox(0.55, 0.48, 0.45, 0x2a2a35, { roughness: 0.5, metalness: 0.2 });
  cabinet.position.set(0, Y + 0.24, 0);
  group.add(cabinet);

  // Countertop
  const counter = createRoundedBox(0.58, 0.03, 0.48, 0x444455, { roughness: 0.15, metalness: 0.4 });
  counter.position.set(0, Y + 0.49, 0);
  group.add(counter);

  // Basin
  const basinOuter = createRoundedBox(0.28, 0.1, 0.25, 0x555566, { roughness: 0.1, metalness: 0.6 });
  basinOuter.position.set(0, Y + 0.45, 0);
  group.add(basinOuter);

  // Water
  const water = createRoundedBox(0.24, 0.02, 0.21, 0x2255cc, {
    roughness: 0.05, metalness: 0.1,
    emissive: 0x112244, emissiveIntensity: 0.3,
  });
  water.position.set(0, Y + 0.42, 0);
  group.add(water);

  // Faucet
  const faucetBase = createCylinder(0.012, 0.012, 0.18, 0xcccccc, { metalness: 0.9, roughness: 0.1 });
  faucetBase.position.set(0, Y + 0.59, -0.15);
  group.add(faucetBase);

  const spout = createCylinder(0.008, 0.008, 0.1, 0xcccccc, { metalness: 0.9, roughness: 0.1 });
  spout.rotation.z = Math.PI / 2.5;
  spout.position.set(0, Y + 0.66, -0.09);
  group.add(spout);

  // Cabinet handles
  for (const xOff of [-0.06, 0.06]) {
    const dh = createCylinder(0.005, 0.005, 0.04, 0x888899, { metalness: 0.8 });
    dh.position.set(xOff, Y + 0.28, 0.24);
    group.add(dh);
  }

  group.userData.furnitureType = 'sink';
  return group;
}

// ─── LIVING ROOM ───────────────────────────────────────

function createCouch() {
  const group = new THREE.Group();

  // Base frame
  const frame = createRoundedBox(0.7, 0.08, 0.4, 0x1a1a22, { roughness: 0.7 });
  frame.position.set(0, Y + 0.08, 0);
  group.add(frame);

  // Seat cushions (hex-shaped)
  const cushion1 = createBeveledHexPrism(0.18, 0.08, 0x4a2860);
  cushion1.position.set(-0.15, Y + 0.12, 0.02);
  group.add(cushion1);

  const cushion2 = createBeveledHexPrism(0.18, 0.08, 0x4a2860);
  cushion2.position.set(0.15, Y + 0.12, 0.02);
  group.add(cushion2);

  // Backrest
  const backrest = createRoundedBox(0.68, 0.3, 0.08, 0x3a1f4a, { roughness: 0.8 });
  backrest.position.set(0, Y + 0.3, -0.22);
  group.add(backrest);

  // Armrests
  for (const xOff of [-0.33, 0.33]) {
    const arm = createRoundedBox(0.06, 0.18, 0.35, 0x3a1f4a, { roughness: 0.8 });
    arm.position.set(xOff, Y + 0.2, 0);
    group.add(arm);
  }

  // Decorative hex pillows
  const pillow = createBeveledHexPrism(0.06, 0.04, 0xcc6699);
  pillow.position.set(-0.18, Y + 0.25, -0.12);
  pillow.rotation.z = 0.3;
  group.add(pillow);

  const pillow2 = createBeveledHexPrism(0.06, 0.04, 0x6699cc);
  pillow2.position.set(0.2, Y + 0.25, -0.14);
  pillow2.rotation.z = -0.2;
  group.add(pillow2);

  // Legs
  for (const x of [-0.28, 0.28]) {
    for (const z of [-0.15, 0.15]) {
      const leg = createCylinder(0.012, 0.012, 0.04, 0x888877, { metalness: 0.7 });
      leg.position.set(x, Y + 0.02, z);
      group.add(leg);
    }
  }

  group.userData.furnitureType = 'couch';
  return group;
}

function createShelf() {
  const group = new THREE.Group();

  // Back panel
  const back = createRoundedBox(0.5, 1.0, 0.02, 0x2a2520, { roughness: 0.7 });
  back.position.set(0, Y + 0.5, -0.12);
  group.add(back);

  // Side panels
  for (const xOff of [-0.24, 0.24]) {
    const side = createRoundedBox(0.02, 1.0, 0.25, 0x332e28, { roughness: 0.6 });
    side.position.set(xOff, Y + 0.5, 0);
    group.add(side);
  }

  // 4 shelves
  for (let i = 0; i < 4; i++) {
    const shelf = createRoundedBox(0.46, 0.015, 0.24, 0x3d3830, { roughness: 0.5 });
    shelf.position.set(0, Y + 0.01 + i * 0.25, 0);
    group.add(shelf);
  }

  // Books
  const bookColors = [0xaa3333, 0x3355aa, 0x33aa55, 0xaaaa33, 0x8833aa];
  for (let i = 0; i < 5; i++) {
    const bookH = 0.12 + Math.random() * 0.06;
    const book = createRoundedBox(0.03, bookH, 0.12, bookColors[i], { roughness: 0.8 });
    book.position.set(-0.16 + i * 0.08, Y + 0.26 + bookH / 2 + 0.01, 0);
    group.add(book);
  }

  // Hex decoration
  const hexDeco = createBeveledHexPrism(0.04, 0.06, 0x00e5ff, 0x00e5ff, 0.5);
  hexDeco.position.set(0.1, Y + 0.52, 0.02);
  group.add(hexDeco);

  // Mini plant on top
  const miniPot = createCylinder(0.03, 0.025, 0.04, 0x884422);
  miniPot.position.set(-0.08, Y + 0.78, 0.02);
  group.add(miniPot);
  const miniLeaf = createSphere(0.04, 0x22aa44, { emissive: 0x115522, emissiveIntensity: 0.2 });
  miniLeaf.position.set(-0.08, Y + 0.84, 0.02);
  group.add(miniLeaf);

  group.userData.furnitureType = 'shelf';
  return group;
}

function createDesk() {
  const group = new THREE.Group();

  // Desktop
  const surface = createRoundedBox(0.65, 0.03, 0.4, 0x3a3530, { roughness: 0.4, metalness: 0.15 });
  surface.position.set(0, Y + 0.42, 0);
  group.add(surface);

  // A-frame legs
  for (const xOff of [-0.28, 0.28]) {
    const leg1 = createRoundedBox(0.02, 0.42, 0.02, 0x555555, { metalness: 0.6 });
    leg1.position.set(xOff, Y + 0.21, -0.15);
    leg1.rotation.z = xOff > 0 ? -0.08 : 0.08;
    group.add(leg1);

    const leg2 = createRoundedBox(0.02, 0.42, 0.02, 0x555555, { metalness: 0.6 });
    leg2.position.set(xOff, Y + 0.21, 0.15);
    leg2.rotation.z = xOff > 0 ? -0.08 : 0.08;
    group.add(leg2);
  }

  // Monitor stand
  const monitorStand = createCylinder(0.008, 0.04, 0.15, 0x333333, { metalness: 0.8 });
  monitorStand.position.set(0, Y + 0.51, -0.08);
  group.add(monitorStand);

  const monitorBase = createHexPrism(0.06, 0.01, 0x333333);
  monitorBase.position.set(0, Y + 0.44, -0.08);
  group.add(monitorBase);

  // Screen (glowing)
  const screen = createRoundedBox(0.3, 0.18, 0.01, 0x111118, {
    emissive: 0x1133aa, emissiveIntensity: 0.6,
    metalness: 0.1, roughness: 0.05,
  });
  screen.position.set(0, Y + 0.65, -0.08);
  group.add(screen);

  const screenLight = new THREE.PointLight(0x3355ff, 0.3, 1.5);
  screenLight.position.set(0, Y + 0.65, 0);
  group.add(screenLight);

  // Keyboard
  const keyboard = createRoundedBox(0.2, 0.008, 0.06, 0x222228, { roughness: 0.3, metalness: 0.4 });
  keyboard.position.set(0, Y + 0.445, 0.08);
  group.add(keyboard);

  // Mouse
  const mouse = createRoundedBox(0.025, 0.012, 0.04, 0x222228, { roughness: 0.3, metalness: 0.4 });
  mouse.position.set(0.18, Y + 0.445, 0.08);
  group.add(mouse);

  // Coffee mug
  const mug = createCylinder(0.018, 0.018, 0.04, 0xdd6633);
  mug.position.set(-0.22, Y + 0.465, 0.1);
  group.add(mug);
  const mugHandle = createRing(0.012, 0.003, 0xdd6633);
  mugHandle.position.set(-0.24, Y + 0.47, 0.1);
  mugHandle.rotation.y = Math.PI / 2;
  group.add(mugHandle);

  group.userData.furnitureType = 'desk';
  return group;
}

// ─── BEDROOM ───────────────────────────────────────────

function createBed() {
  const group = new THREE.Group();

  // Bed frame
  const frame = createRoundedBox(0.7, 0.12, 0.9, 0x2a2218, { roughness: 0.6 });
  frame.position.set(0, Y + 0.06, 0);
  group.add(frame);

  // Headboard
  const headboard = createRoundedBox(0.7, 0.45, 0.04, 0x2a2218, { roughness: 0.5 });
  headboard.position.set(0, Y + 0.28, -0.44);
  group.add(headboard);

  // Hex deco on headboard
  const headDeco = createBeveledHexPrism(0.08, 0.01, 0x00e5ff, 0x00e5ff, 0.3);
  headDeco.position.set(0, Y + 0.35, -0.45);
  headDeco.rotation.x = Math.PI / 2;
  group.add(headDeco);

  // Mattress
  const mattress = createRoundedBox(0.64, 0.1, 0.82, 0xeeeef5, {
    roughness: 0.9, metalness: 0.0, radius: 0.03,
  });
  mattress.position.set(0, Y + 0.17, 0.02);
  group.add(mattress);

  // Blanket
  const blanket = createRoundedBox(0.62, 0.04, 0.45, 0x3344aa, {
    roughness: 0.95, metalness: 0.0, radius: 0.02,
  });
  blanket.position.set(0, Y + 0.24, 0.18);
  group.add(blanket);

  // Pillows
  const pillow1 = createRoundedBox(0.2, 0.06, 0.15, 0xdddde5, {
    roughness: 0.95, radius: 0.03,
  });
  pillow1.position.set(-0.14, Y + 0.26, -0.28);
  pillow1.rotation.z = -0.05;
  group.add(pillow1);

  const pillow2 = createRoundedBox(0.2, 0.06, 0.15, 0xdddde5, {
    roughness: 0.95, radius: 0.03,
  });
  pillow2.position.set(0.14, Y + 0.26, -0.28);
  pillow2.rotation.z = 0.05;
  group.add(pillow2);

  // Legs
  for (const x of [-0.3, 0.3]) {
    for (const z of [-0.4, 0.4]) {
      const leg = createRoundedBox(0.03, 0.04, 0.03, 0x1a1510);
      leg.position.set(x, Y - 0.02, z);
      group.add(leg);
    }
  }

  group.userData.furnitureType = 'bed';
  return group;
}

function createNightstand() {
  const group = new THREE.Group();

  // Body
  const body = createBeveledHexPrism(0.16, 0.3, 0x2a2218);
  body.position.y = Y;
  group.add(body);

  // Top surface
  const topSurface = createBeveledHexPrism(0.17, 0.015, 0x332e25);
  topSurface.position.y = Y + 0.3;
  group.add(topSurface);

  // Lamp
  const lampBase = createHexPrism(0.04, 0.01, 0x888877);
  lampBase.position.set(0, Y + 0.32, 0);
  group.add(lampBase);

  const lampPole = createCylinder(0.006, 0.006, 0.12, 0x888877, { metalness: 0.7 });
  lampPole.position.set(0, Y + 0.39, 0);
  group.add(lampPole);

  const shade = createCylinder(0.04, 0.06, 0.06, 0xeedd99, {
    roughness: 0.9, metalness: 0.0,
    emissive: 0xffcc66, emissiveIntensity: 0.6,
  });
  shade.position.set(0, Y + 0.47, 0);
  group.add(shade);

  const lampLight = new THREE.PointLight(0xffcc66, 0.4, 2);
  lampLight.position.set(0, Y + 0.5, 0);
  group.add(lampLight);

  // Drawer handle
  const drawerHandle = createCylinder(0.003, 0.003, 0.05, 0xaaaaaa, { metalness: 0.8 });
  drawerHandle.rotation.z = Math.PI / 2;
  drawerHandle.position.set(0, Y + 0.15, 0.15);
  group.add(drawerHandle);

  group.userData.furnitureType = 'nightstand';
  return group;
}

// ─── BATHROOM ──────────────────────────────────────────

function createToilet() {
  const group = new THREE.Group();

  // Bowl
  const bowl = createCylinder(0.1, 0.12, 0.22, 0xeeeef2, { roughness: 0.15, metalness: 0.05 });
  bowl.position.set(0, Y + 0.11, 0.04);
  group.add(bowl);

  // Seat rim
  const seatRim = createRing(0.1, 0.02, 0xeeeef2, { roughness: 0.2, metalness: 0.05 });
  seatRim.rotation.x = Math.PI / 2;
  seatRim.position.set(0, Y + 0.23, 0.04);
  group.add(seatRim);

  // Tank
  const tank = createRoundedBox(0.2, 0.22, 0.1, 0xeeeef2, { roughness: 0.15, metalness: 0.05 });
  tank.position.set(0, Y + 0.28, -0.12);
  group.add(tank);

  // Tank lid
  const lid = createRoundedBox(0.22, 0.02, 0.12, 0xddddee, { roughness: 0.1, metalness: 0.1 });
  lid.position.set(0, Y + 0.4, -0.12);
  group.add(lid);

  // Flush handle
  const flushHandle = createCylinder(0.005, 0.005, 0.04, 0xcccccc, { metalness: 0.9 });
  flushHandle.rotation.z = Math.PI / 4;
  flushHandle.position.set(0.12, Y + 0.38, -0.12);
  group.add(flushHandle);

  group.userData.furnitureType = 'toilet';
  return group;
}

function createBathroomSink() {
  const group = new THREE.Group();

  // Pedestal
  const pedestal = createCylinder(0.06, 0.08, 0.36, 0xeeeef2, { roughness: 0.15, metalness: 0.05 });
  pedestal.position.set(0, Y + 0.18, 0);
  group.add(pedestal);

  // Basin
  const basin = createCylinder(0.14, 0.06, 0.06, 0xeeeef2, { roughness: 0.1, metalness: 0.1 });
  basin.position.set(0, Y + 0.39, 0);
  group.add(basin);

  // Basin inner
  const inner = createCylinder(0.1, 0.04, 0.03, 0xddddee, { roughness: 0.05, metalness: 0.15 });
  inner.position.set(0, Y + 0.38, 0);
  group.add(inner);

  // Faucet
  const faucet = createCylinder(0.01, 0.01, 0.12, 0xcccccc, { metalness: 0.9, roughness: 0.1 });
  faucet.position.set(0, Y + 0.48, -0.08);
  group.add(faucet);

  const spout = createCylinder(0.007, 0.007, 0.06, 0xcccccc, { metalness: 0.9, roughness: 0.1 });
  spout.rotation.z = Math.PI / 3;
  spout.position.set(0, Y + 0.52, -0.04);
  group.add(spout);

  // Mirror
  const mirror = createRoundedBox(0.18, 0.22, 0.01, 0x88aacc, {
    roughness: 0.02, metalness: 0.9,
  });
  mirror.position.set(0, Y + 0.7, -0.15);
  group.add(mirror);

  const mirrorFrame = createRoundedBox(0.2, 0.24, 0.008, 0x444444, { metalness: 0.5 });
  mirrorFrame.position.set(0, Y + 0.7, -0.155);
  group.add(mirrorFrame);

  group.userData.furnitureType = 'bathroomSink';
  return group;
}

// ─── GARDEN ────────────────────────────────────────────

function createPlant() {
  const group = new THREE.Group();

  // Hex pot
  const pot = createBeveledHexPrism(0.14, 0.16, 0x884422);
  pot.position.y = Y;
  group.add(pot);

  const potRim = createBeveledHexPrism(0.15, 0.02, 0x995533);
  potRim.position.y = Y + 0.14;
  group.add(potRim);

  // Soil
  const soil = createHexPrism(0.12, 0.02, 0x332211);
  soil.position.y = Y + 0.12;
  group.add(soil);

  // Trunk
  const trunk = createCylinder(0.015, 0.02, 0.22, 0x4a3520);
  trunk.position.set(0, Y + 0.27, 0);
  trunk.rotation.z = 0.05;
  group.add(trunk);

  // Leaf clusters - hex layers
  const leafColors = [0x22aa44, 0x33bb55, 0x44cc55, 0x22bb33];
  const leafPositions = [
    { x: 0, y: 0.38, z: 0, size: 0.1, rot: 0 },
    { x: 0.04, y: 0.42, z: 0.02, size: 0.07, rot: 0.5 },
    { x: -0.03, y: 0.44, z: -0.02, size: 0.06, rot: 1.0 },
    { x: 0.02, y: 0.46, z: -0.01, size: 0.05, rot: 1.5 },
  ];

  leafPositions.forEach((lp, i) => {
    const leaf = createBeveledHexPrism(lp.size, 0.02, leafColors[i], leafColors[i], 0.15);
    leaf.position.set(lp.x, Y + lp.y, lp.z);
    leaf.rotation.y = lp.rot;
    group.add(leaf);
  });

  // Flowers
  const flower = createSphere(0.015, 0xff6699, { emissive: 0xff3366, emissiveIntensity: 0.3 });
  flower.position.set(0.06, Y + 0.44, 0.04);
  group.add(flower);

  const flower2 = createSphere(0.012, 0xffcc33, { emissive: 0xffaa00, emissiveIntensity: 0.3 });
  flower2.position.set(-0.04, Y + 0.46, -0.03);
  group.add(flower2);

  group.userData.furnitureType = 'plant';
  group.userData.waterLevel = 100;
  return group;
}

function createGenericHex() {
  const group = new THREE.Group();
  const box = createBeveledHexPrism(0.2, 0.3, 0x555555);
  box.position.y = Y;
  group.add(box);
  return group;
}
