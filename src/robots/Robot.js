import { createRobotMesh } from './RobotMeshFactory.js';
import { StateMachine } from './StateMachine.js';
import { IdleState } from './states/IdleState.js';
import { MovingState } from './states/MovingState.js';
import { WorkingState } from './states/WorkingState.js';
import { RestingState } from './states/RestingState.js';
import { SocializingState } from './states/SocializingState.js';
import { EatingState } from './states/EatingState.js';
import { initNeeds, decayNeeds } from './NeedsSystem.js';
import { axialToWorld } from '../hex/HexUtils.js';
import { findPath, findNearestTile } from '../hex/HexPathfinding.js';
import { ROBOT_SPEED } from '../constants.js';

export class Robot {
  constructor(name, color, q, r, simulation) {
    this.name = name;
    this.color = color;
    this.q = q;
    this.r = r;
    this.simulation = simulation;

    const worldPos = axialToWorld(q, r);
    this.worldX = worldPos.x;
    this.worldZ = worldPos.z;

    this.mesh = createRobotMesh(color);
    this.mesh.position.set(this.worldX, 0, this.worldZ);
    this.mesh.userData.robot = this;

    this.speed = ROBOT_SPEED;
    this.bobOffset = Math.random() * Math.PI * 2;

    this.needs = initNeeds();
    this.path = [];
    this.currentTask = null;
    this.targetState = null;
    this.wanderTimer = 0;
    this.socializePartner = null;
    this.socializeTimer = 0;
    this.eatTimer = 0;
    this.workTimer = 0;

    // State machine
    this.stateMachine = new StateMachine(this);
    this.stateMachine.addState('idle', { ...IdleState });
    this.stateMachine.addState('moving', { ...MovingState });
    this.stateMachine.addState('working', { ...WorkingState });
    this.stateMachine.addState('resting', { ...RestingState });
    this.stateMachine.addState('socializing', { ...SocializingState });
    this.stateMachine.addState('eating', { ...EatingState });
    this.stateMachine.setState('idle');
  }

  update(dt, elapsed) {
    // Decay needs based on sim time
    const simHours = dt * this.simulation.clock.speedMultiplier * 2 / 60;
    const isWorking = this.stateMachine.getCurrentStateName() === 'working';
    decayNeeds(this.needs, simHours, isWorking);

    // Update state machine
    this.stateMachine.update(dt, elapsed);

    // Sync mesh position
    this.mesh.position.x = this.worldX;
    this.mesh.position.z = this.worldZ;
  }

  moveTo(targetQ, targetR, targetState = 'idle') {
    const path = findPath(this.simulation.grid, this.q, this.r, targetQ, targetR);
    if (path && path.length > 0) {
      this.path = path;
      this.targetState = targetState;
      this.stateMachine.setState('moving');
      return true;
    }
    return false;
  }

  seekNeed(need) {
    const grid = this.simulation.grid;

    switch (need) {
      case 'energy': {
        // Find nearest bed
        const bedTile = findNearestTile(grid, this.q, this.r, t =>
          t.furniture && t.furniture.userData.furnitureType === 'bed'
        );
        if (bedTile) {
          // Find adjacent walkable tile
          const interactionTile = this.findInteractionTile(bedTile.q, bedTile.r);
          if (interactionTile) {
            this.moveTo(interactionTile.q, interactionTile.r, 'resting');
          }
        }
        break;
      }
      case 'hunger': {
        // Find nearest table (kitchen)
        const tableTile = findNearestTile(grid, this.q, this.r, t =>
          t.furniture && t.furniture.userData.furnitureType === 'table'
        );
        if (tableTile) {
          const interactionTile = this.findInteractionTile(tableTile.q, tableTile.r);
          if (interactionTile) {
            this.moveTo(interactionTile.q, interactionTile.r, 'eating');
          }
        }
        break;
      }
      case 'social': {
        // Find another idle robot nearby
        const partner = this.simulation.robots.find(r =>
          r !== this &&
          r.stateMachine.getCurrentStateName() === 'idle' &&
          !r.socializePartner
        );
        if (partner) {
          this.socializePartner = partner;
          partner.socializePartner = this;
          partner.stateMachine.setState('socializing');
          this.stateMachine.setState('socializing');
        }
        break;
      }
      case 'hygiene': {
        // Find bathroom sink or toilet
        const bathTile = findNearestTile(grid, this.q, this.r, t =>
          t.furniture && (t.furniture.userData.furnitureType === 'bathroomSink' || t.furniture.userData.furnitureType === 'toilet')
        );
        if (bathTile) {
          const interactionTile = this.findInteractionTile(bathTile.q, bathTile.r);
          if (interactionTile) {
            this.currentTask = { duration: 10, type: 'hygiene' };
            this.moveTo(interactionTile.q, interactionTile.r, 'working');
          }
        }
        break;
      }
    }
  }

  findInteractionTile(furnitureQ, furnitureR) {
    const neighbors = this.simulation.grid.getWalkableNeighbors(furnitureQ, furnitureR);
    if (neighbors.length > 0) {
      return neighbors[0];
    }
    return null;
  }

  wanderToRandomNeighbor() {
    const walkable = this.simulation.grid.getWalkableNeighbors(this.q, this.r);
    if (walkable.length > 0) {
      const target = walkable[Math.floor(Math.random() * walkable.length)];
      this.path = [target];
      this.targetState = 'idle';
      this.stateMachine.setState('moving');
    }
  }

  getStateLabel() {
    const state = this.stateMachine.getCurrentStateName();
    const labels = {
      idle: 'Idle',
      moving: 'Moving',
      working: this.currentTask ? this.currentTask.type : 'Working',
      resting: 'Sleeping',
      socializing: 'Chatting',
      eating: 'Eating',
    };
    return labels[state] || state;
  }
}
