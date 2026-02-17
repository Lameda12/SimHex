export class StateMachine {
  constructor(owner) {
    this.owner = owner;
    this.currentState = null;
    this.currentStateName = null;
    this.states = {};
  }

  addState(name, stateObj) {
    this.states[name] = stateObj;
    stateObj.name = name;
  }

  setState(name) {
    if (this.currentStateName === name) return;
    if (this.currentState && this.currentState.exit) {
      this.currentState.exit(this.owner);
    }
    this.currentState = this.states[name];
    this.currentStateName = name;
    if (this.currentState && this.currentState.enter) {
      this.currentState.enter(this.owner);
    }
  }

  update(dt, elapsed) {
    if (this.currentState && this.currentState.update) {
      this.currentState.update(this.owner, dt, elapsed);
    }
  }

  getCurrentStateName() {
    return this.currentStateName;
  }
}
