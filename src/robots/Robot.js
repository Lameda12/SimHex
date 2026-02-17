import * as THREE from 'three';
import { createRobotMesh } from './RobotMeshFactory.js';
import { StateMachine } from './StateMachine.js';
import { IdleState } from './states/IdleState.js';
import { LaunchingState } from './states/LaunchingState.js';
import { MovingState } from './states/MovingState.js';
import { ArrivingState } from './states/ArrivingState.js';
import { WorkingState } from './states/WorkingState.js';
import { ROBOT_FLIGHT_SPEED } from '../constants.js';

export class Robot {
  constructor(name, color, homePlanet, simulation) {
    this.name = name;
    this.color = color;
    this.simulation = simulation;

    // Position in 3D space
    this.position = new THREE.Vector3();
    this.currentPlanet = homePlanet;
    this.targetPlanet = null;
    this.currentMission = null;

    // Flight
    this.flightSpeed = ROBOT_FLIGHT_SPEED;
    this.launchOrigin = null;
    this.launchProgress = 0;

    // Orbit phase offset (desync multiple robots)
    this.orbitPhase = Math.random() * Math.PI * 2;

    // Work timer
    this.workTimer = 0;

    // Stats
    this.missionsCompleted = 0;
    this.planetsVisited = new Set();
    if (homePlanet) {
      this.planetsVisited.add(homePlanet.id);
    }

    // Mesh
    this.mesh = createRobotMesh(color);
    this.mesh.userData.robot = this;

    // State machine
    this.stateMachine = new StateMachine(this);
    this.stateMachine.addState('idle', { ...IdleState });
    this.stateMachine.addState('launching', { ...LaunchingState });
    this.stateMachine.addState('moving', { ...MovingState });
    this.stateMachine.addState('arriving', { ...ArrivingState });
    this.stateMachine.addState('working', { ...WorkingState });
    this.stateMachine.setState('idle');
  }

  update(dt, elapsed) {
    this.stateMachine.update(dt, elapsed);

    // Sync mesh position
    this.mesh.position.copy(this.position);
  }

  launchTo(targetPlanet, mission) {
    this.targetPlanet = targetPlanet;
    this.currentMission = mission;
    this.stateMachine.setState('launching');
  }

  getStateLabel() {
    const state = this.stateMachine.getCurrentStateName();
    const labels = {
      idle: this.currentPlanet ? `Orbiting ${this.currentPlanet.name}` : 'Idle',
      launching: 'Launching',
      moving: this.targetPlanet ? `En route to ${this.targetPlanet.name}` : 'In transit',
      arriving: 'Entering orbit',
      working: this.currentMission ? this.currentMission.label : 'On mission',
    };
    return labels[state] || state;
  }

  getMissionProgress() {
    if (this.stateMachine.getCurrentStateName() !== 'working' || !this.currentMission) {
      return null;
    }
    const elapsed = this.currentMission.duration - this.workTimer;
    return Math.min(1, elapsed / this.currentMission.duration);
  }
}
