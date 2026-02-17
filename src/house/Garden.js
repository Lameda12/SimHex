// Garden is handled via ROOMS.garden in HouseLayout.js
// This module tracks plant watering state

export class Garden {
  constructor(plants) {
    this.plants = plants; // array of furniture groups with userData.waterLevel
  }

  update(dtHours) {
    for (const plant of this.plants) {
      if (plant.userData.waterLevel > 0) {
        plant.userData.waterLevel -= 4 * dtHours; // decay per in-game hour
        if (plant.userData.waterLevel < 0) plant.userData.waterLevel = 0;
      }
    }
  }

  getNeedyPlants() {
    return this.plants.filter(p => p.userData.waterLevel < 30);
  }

  waterPlant(plant) {
    plant.userData.waterLevel = 100;
  }
}
