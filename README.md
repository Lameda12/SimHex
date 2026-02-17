# SimHex — HEX Home Robot Simulation

A 3D hex-grid home simulation where autonomous robots (HEX-01 through HEX-05) manage needs, complete tasks, and move around a house with a day/night cycle. Built with **Three.js** and **Vite**.

## Features

- **Hex-based house** — Rooms (kitchen, living room, bathroom, garden, etc.) and walls built from hex tiles
- **Autonomous robots** — Five robots with distinct colors; they eat, rest, socialize, and work based on needs
- **Needs system** — Energy, hunger, social, and hygiene decay over time and drive behavior
- **Task queue** — Scheduled and on-demand tasks: cook meal, wash dishes, water plants, clean floor, organize shelf, clean bathroom
- **Day/night cycle** — In-game time with dawn, morning, afternoon, dusk, and night (configurable speed)
- **Orbit controls** — Rotate, zoom, and pan the 3D view
- **UI panels** — Time, robot status, task queue, and simulation controls

## Tech Stack

- [Three.js](https://threejs.org/) — 3D rendering
- [Vite](https://vitejs.dev/) — Build and dev server
- Vanilla JavaScript (ES modules)

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Install & Run

```bash
# Clone the repo
git clone https://github.com/Lameda12/SimHex.git
cd SimHex

# Install dependencies
npm install

# Start dev server
npm run dev
```

Then open the URL shown (e.g. `http://localhost:5173`) in your browser.

### Build for production

```bash
npm run build
npm run preview   # optional: preview the built app
```

## Project Structure

```
SimHex/
├── index.html
├── package.json
├── vite.config.js
├── styles/
│   └── main.css
└── src/
    ├── main.js              # Entry: scene, grid, robots, UI
    ├── constants.js         # Hex size, timing, robot count, needs decay
    ├── core/
    │   ├── Scene.js         # Three.js scene, camera, lights
    │   ├── SimulationClock.js
    │   └── DayNightCycle.js
    ├── hex/
    │   ├── HexGrid.js
    │   ├── HexTile.js
    │   ├── HexUtils.js
    │   ├── HexMeshFactory.js
    │   └── HexPathfinding.js
    ├── house/
    │   ├── HouseLayout.js   # ROOMS, DOORS
    │   ├── Room.js
    │   ├── FurnitureFactory.js
    │   └── Garden.js
    ├── robots/
    │   ├── Robot.js
    │   ├── StateMachine.js
    │   ├── NeedsSystem.js
    │   ├── RobotMeshFactory.js
    │   ├── RobotAnimations.js
    │   └── states/         # Idle, Moving, Working, Resting, Socializing, Eating
    ├── tasks/
    │   ├── TaskQueue.js
    │   ├── TaskAssigner.js
    │   └── TaskDefinitions.js
    ├── ui/
    │   ├── UIManager.js
    │   ├── ControlsPanel.js
    │   ├── TimePanel.js
    │   ├── RobotStatusPanel.js
    │   └── TaskQueuePanel.js
    └── utils/
        ├── EventBus.js
        ├── ColorPalette.js
        └── MathUtils.js
```

## Configuration

Edit `src/constants.js` to change:

- `HEX_SIZE`, `HEX_HEIGHT`, `WALL_HEIGHT` — Grid and wall dimensions
- `SIM_MINUTES_PER_REAL_SECOND` — How fast the in-game clock runs
- `ROBOT_COUNT`, `ROBOT_NAMES`, `ROBOT_COLORS` — Number and identity of robots
- `NEEDS_DECAY` — How quickly energy, hunger, social, hygiene decrease
- Task timings and priorities in `src/tasks/TaskDefinitions.js`

## License

MIT

## Repository

[https://github.com/Lameda12/SimHex](https://github.com/Lameda12/SimHex)
