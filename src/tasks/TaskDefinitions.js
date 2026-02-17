export const TASK_TYPES = {
  clean_floor: { room: 'any', station: 'floor', duration: 20, priority: 3, label: 'Clean Floor' },
  cook_meal: { room: 'kitchen', station: 'stove', duration: 30, priority: 4, label: 'Cook Meal' },
  wash_dishes: { room: 'kitchen', station: 'sink', duration: 15, priority: 2, label: 'Wash Dishes' },
  water_plants: { room: 'garden', station: 'plant', duration: 10, priority: 3, label: 'Water Plants' },
  organize_shelf: { room: 'livingRoom', station: 'shelf', duration: 20, priority: 1, label: 'Organize Shelf' },
  clean_bathroom: { room: 'bathroom', station: 'toilet', duration: 25, priority: 2, label: 'Clean Bathroom' },
};

// Scheduled tasks - when they spawn during the in-game day
export const TASK_SCHEDULE = [
  { type: 'cook_meal', hours: [7, 12, 18] },
  { type: 'water_plants', interval: 6 }, // every 6 hours
  { type: 'clean_floor', intervalMin: 2, intervalMax: 4, randomRoom: true },
  { type: 'wash_dishes', hours: [8, 13, 19] },
  { type: 'organize_shelf', interval: 8 },
  { type: 'clean_bathroom', interval: 10 },
];
