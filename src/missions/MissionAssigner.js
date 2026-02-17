export class MissionAssigner {
  constructor(missionQueue, robots, solarSystem) {
    this.missionQueue = missionQueue;
    this.robots = robots;
    this.solarSystem = solarSystem;
  }

  assignToRobot(robot) {
    // Only assign to idle robots
    if (robot.stateMachine.getCurrentStateName() !== 'idle') return false;

    const missions = this.missionQueue.getUnassignedMissions();
    if (missions.length === 0) return false;

    // Pick highest priority mission
    const mission = missions[0];
    const targetPlanet = this.solarSystem.getPlanet(mission.targetPlanetId);
    if (!targetPlanet) return false;

    // Skip if robot is already at target planet (assign directly to work)
    if (robot.currentPlanet && robot.currentPlanet.id === targetPlanet.id) {
      this.missionQueue.assignMission(mission, robot);
      robot.currentMission = mission;
      robot.stateMachine.setState('working');
      return true;
    }

    // Launch robot to target planet
    this.missionQueue.assignMission(mission, robot);
    robot.launchTo(targetPlanet, mission);
    return true;
  }
}
