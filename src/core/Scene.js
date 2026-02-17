import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { BG_DARK } from '../utils/ColorPalette.js';

export class SceneManager {
  constructor(canvas) {
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(BG_DARK);

    // Camera - slightly top-down perspective
    this.camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    this.camera.position.set(6, 9, 8);
    this.camera.lookAt(-2, 0, -1);

    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.minDistance = 3;
    this.controls.maxDistance = 25;
    this.controls.maxPolarAngle = Math.PI / 2.2;
    this.controls.target.set(-2, 0, -1);

    // Lighting - more detailed setup
    this.ambientLight = new THREE.HemisphereLight(0x2244aa, 0x0a0a0f, 0.5);
    this.scene.add(this.ambientLight);

    this.sunLight = new THREE.DirectionalLight(0xffeedd, 1.0);
    this.sunLight.position.set(5, 8, 3);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 0.5;
    this.sunLight.shadow.camera.far = 30;
    this.sunLight.shadow.camera.left = -12;
    this.sunLight.shadow.camera.right = 12;
    this.sunLight.shadow.camera.top = 12;
    this.sunLight.shadow.camera.bottom = -12;
    this.sunLight.shadow.bias = -0.001;
    this.scene.add(this.sunLight);

    // Subtle teal fill from above
    const fillLight = new THREE.PointLight(0x00e5ff, 0.2, 25);
    fillLight.position.set(-2, 5, -1);
    this.scene.add(fillLight);

    // Warm fill from below for cozy feel
    const warmFill = new THREE.PointLight(0xffaa44, 0.15, 15);
    warmFill.position.set(-1, 1, 2);
    this.scene.add(warmFill);

    // Resize
    window.addEventListener('resize', () => this.onResize());

    // Animation loop
    this.clock = new THREE.Clock();
    this.callbacks = [];
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  onTick(callback) {
    this.callbacks.push(callback);
  }

  add(object) {
    this.scene.add(object);
  }

  start() {
    const animate = () => {
      requestAnimationFrame(animate);
      const dt = this.clock.getDelta();
      const elapsed = this.clock.getElapsedTime();

      this.controls.update();

      for (const cb of this.callbacks) {
        cb(dt, elapsed);
      }

      this.renderer.render(this.scene, this.camera);
    };
    animate();
  }

  focusOn(x, y, z) {
    this.controls.target.set(x, y, z);
  }
}
