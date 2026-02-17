import * as THREE from 'three';
import { HEX_SIZE, HEX_HEIGHT, WALL_HEIGHT } from '../constants.js';
import { FLOOR_BASE, GRID_LINE, GRID_LINE_OPACITY, WALL_COLOR, WALL_OPACITY } from '../utils/ColorPalette.js';

// Create a flat-top hex shape
function createHexShape(size = HEX_SIZE) {
  const shape = new THREE.Shape();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 180) * (60 * i);
    const x = size * Math.cos(angle);
    const y = size * Math.sin(angle);
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  return shape;
}

// Shared geometries
const hexShape = createHexShape(HEX_SIZE * 0.97);
const floorGeo = new THREE.ExtrudeGeometry(hexShape, {
  depth: HEX_HEIGHT,
  bevelEnabled: false,
});
floorGeo.rotateX(-Math.PI / 2);

const wallShape = createHexShape(HEX_SIZE * 0.97);
const wallGeo = new THREE.ExtrudeGeometry(wallShape, {
  depth: WALL_HEIGHT,
  bevelEnabled: false,
});
wallGeo.rotateX(-Math.PI / 2);

// Edge outline geometry for glowing lines
function createHexEdgesGeo(size = HEX_SIZE) {
  const points = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 180) * (60 * i);
    points.push(new THREE.Vector3(
      size * Math.cos(angle),
      0.01,
      size * Math.sin(angle),
    ));
  }
  points.push(points[0].clone());
  return new THREE.BufferGeometry().setFromPoints(points);
}

const edgesGeo = createHexEdgesGeo();

// Materials
const floorMat = new THREE.MeshStandardMaterial({
  color: FLOOR_BASE,
  roughness: 0.8,
  metalness: 0.2,
});

const wallMat = new THREE.MeshStandardMaterial({
  color: WALL_COLOR,
  transparent: true,
  opacity: WALL_OPACITY,
  roughness: 0.5,
  metalness: 0.3,
  side: THREE.DoubleSide,
});

const edgeMat = new THREE.LineBasicMaterial({
  color: GRID_LINE,
  transparent: true,
  opacity: GRID_LINE_OPACITY,
});

export function createFloorTile(tintColor = null) {
  const mat = tintColor
    ? floorMat.clone()
    : floorMat;
  if (tintColor) mat.color.set(tintColor);

  const mesh = new THREE.Mesh(floorGeo, mat);
  mesh.receiveShadow = true;

  const edges = new THREE.Line(edgesGeo, edgeMat);
  edges.position.y = HEX_HEIGHT + 0.001;
  mesh.add(edges);

  return mesh;
}

export function createWallTile() {
  const mesh = new THREE.Mesh(wallGeo, wallMat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  const topEdgesGeo = createHexEdgesGeo();
  const topEdgeMat = new THREE.LineBasicMaterial({
    color: GRID_LINE,
    transparent: true,
    opacity: 0.6,
  });
  const topEdges = new THREE.Line(topEdgesGeo, topEdgeMat);
  topEdges.position.y = WALL_HEIGHT + 0.01;
  mesh.add(topEdges);

  return mesh;
}

// -- Hex prism (core building block) --
export function createHexPrism(size, height, color, emissive = 0x000000, emissiveIntensity = 0) {
  const shape = createHexShape(size);
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: height,
    bevelEnabled: false,
  });
  geo.rotateX(-Math.PI / 2);

  const mat = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.6,
    metalness: 0.3,
    emissive,
    emissiveIntensity,
  });

  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

// -- Beveled hex prism (nicer edges) --
export function createBeveledHexPrism(size, height, color, emissive = 0x000000, emissiveIntensity = 0) {
  const shape = createHexShape(size);
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: height,
    bevelEnabled: true,
    bevelThickness: 0.01,
    bevelSize: 0.01,
    bevelSegments: 2,
  });
  geo.rotateX(-Math.PI / 2);

  const mat = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.4,
    metalness: 0.4,
    emissive,
    emissiveIntensity,
  });

  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

// -- Rounded box (for soft furniture) --
export function createRoundedBox(w, h, d, color, opts = {}) {
  const geo = new THREE.BoxGeometry(w, h, d, 4, 4, 4);
  // Soft rounding by normalizing vertices slightly
  const pos = geo.attributes.position;
  const radius = opts.radius || 0.02;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const hw = w / 2, hh = h / 2, hd = d / 2;
    const fx = Math.max(0, Math.abs(x) - hw + radius) * Math.sign(x);
    const fy = Math.max(0, Math.abs(y) - hh + radius) * Math.sign(y);
    const fz = Math.max(0, Math.abs(z) - hd + radius) * Math.sign(z);
    const len = Math.sqrt(fx * fx + fy * fy + fz * fz);
    if (len > 0) {
      const scale = radius / len;
      pos.setXYZ(i,
        Math.sign(x) * Math.min(Math.abs(x), hw - radius) + fx * scale,
        Math.sign(y) * Math.min(Math.abs(y), hh - radius) + fy * scale,
        Math.sign(z) * Math.min(Math.abs(z), hd - radius) + fz * scale,
      );
    }
  }
  geo.computeVertexNormals();

  const mat = new THREE.MeshStandardMaterial({
    color,
    roughness: opts.roughness ?? 0.7,
    metalness: opts.metalness ?? 0.1,
    emissive: opts.emissive ?? 0x000000,
    emissiveIntensity: opts.emissiveIntensity ?? 0,
  });

  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

// -- Cylinder helper --
export function createCylinder(radiusTop, radiusBottom, height, color, opts = {}) {
  const geo = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, opts.segments || 12);
  const mat = new THREE.MeshStandardMaterial({
    color,
    roughness: opts.roughness ?? 0.5,
    metalness: opts.metalness ?? 0.3,
    emissive: opts.emissive ?? 0x000000,
    emissiveIntensity: opts.emissiveIntensity ?? 0,
    transparent: opts.transparent ?? false,
    opacity: opts.opacity ?? 1,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

// -- Glass material --
export function createGlassMaterial(color = 0xaaddff) {
  return new THREE.MeshPhysicalMaterial({
    color,
    transparent: true,
    opacity: 0.3,
    roughness: 0.05,
    metalness: 0.0,
    transmission: 0.9,
    thickness: 0.1,
    side: THREE.DoubleSide,
  });
}

// -- Sphere helper --
export function createSphere(radius, color, opts = {}) {
  const geo = new THREE.SphereGeometry(radius, 16, 16);
  const mat = new THREE.MeshStandardMaterial({
    color,
    roughness: opts.roughness ?? 0.5,
    metalness: opts.metalness ?? 0.2,
    emissive: opts.emissive ?? 0x000000,
    emissiveIntensity: opts.emissiveIntensity ?? 0,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true;
  return mesh;
}

// -- Torus for decorative rings --
export function createRing(radius, tube, color, opts = {}) {
  const geo = new THREE.TorusGeometry(radius, tube, 8, 24);
  const mat = new THREE.MeshStandardMaterial({
    color,
    roughness: opts.roughness ?? 0.3,
    metalness: opts.metalness ?? 0.7,
    emissive: opts.emissive ?? 0x000000,
    emissiveIntensity: opts.emissiveIntensity ?? 0,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true;
  return mesh;
}
