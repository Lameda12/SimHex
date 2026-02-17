# SimHex — Stellar Probe: Solar System Exploration

A 3D solar system simulation where autonomous robot probes (PROBE-01 through PROBE-05) explore planets, complete missions, and advance civilization through progressive stages. Built with **Three.js** and **Vite**.

## Features

- **Full Solar System** — All 8 planets (Mercury through Neptune) with accurate orbital mechanics, rotations, and visual details
- **Autonomous Robot Probes** — Five probes with distinct colors that launch from Earth, travel to planets, and complete missions
- **Mission System** — Six mission types: Flyby Survey, Collect Samples, Deploy Equipment, Build Base, Explore Surface, Establish Colony
- **Civilization Progression** — Unlock new planets and mission types as you advance through 6 stages:
  - First Space Flight → Lunar Colony → Mars Colonization → Inner Solar System → Outer Solar System → Multi-Planetary Civilization
- **Real-time Simulation** — Planets orbit and rotate, probes travel between worlds, missions progress over time
- **Interactive 3D View** — Orbit controls to rotate, zoom, and pan; camera focus buttons for Earth, Mars, and overview
- **Mission Control UI** — Track active missions, fleet status, civilization progress, and simulation time
- **Progressive Unlocks** — Complete missions to unlock new planets and advanced mission types

## Tech Stack

- [Three.js](https://threejs.org/) — 3D rendering and scene management
- [Vite](https://vitejs.dev/) — Build tool and dev server
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

### Build for Production

```bash
npm run build
npm run preview   # optional: preview the built app
```

## Controls

- **Mouse Drag** — Rotate camera around the solar system
- **Scroll Wheel** — Zoom in/out
- **Right Click + Drag** — Pan the view
- **Overview Button** — Reset camera to overview position
- **Focus Earth/Mars** — Jump camera to focus on specific planets

## Project Structure

```
SimHex/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.js                    # Entry point: scene setup, robots, missions
    ├── constants.js              # Planets, sun, robot config, timing
    ├── core/
    │   ├── Scene.js              # Three.js scene, camera, lights, renderer
    │   └── SimulationClock.js    # In-game time tracking
    ├── solar/
    │   ├── SolarSystem.js        # Manages all planets and orbits
    │   ├── Sun.js                # Central star with lighting
    │   ├── Planet.js             # Individual planet logic
    │   ├── PlanetMeshFactory.js  # Creates planet 3D meshes
    │   ├── PlanetLabel.js        # Planet name labels
    │   ├── OrbitLine.js          # Visual orbit paths
    │   └── Starfield.js          # Background stars
    ├── robots/
    │   ├── Robot.js              # Probe behavior and state
    │   ├── StateMachine.js       # State management (Idle, Launching, Moving, Arriving, Working)
    │   ├── RobotMeshFactory.js   # Creates probe 3D meshes
    │   ├── RobotAnimations.js    # Animation helpers
    │   └── states/               # State implementations
    ├── missions/
    │   ├── MissionQueue.js       # Manages mission queue and scheduling
    │   ├── MissionAssigner.js    # Assigns missions to available probes
    │   └── MissionTypes.js       # Mission definitions and requirements
    ├── civilization/
    │   ├── CivilizationTracker.js # Tracks progress and unlocks
    │   └── StageDefinitions.js   # Civilization stage requirements
    ├── ui/
    │   ├── UIManager.js          # Main UI coordinator
    │   ├── MissionControlPanel.js # Mission queue display
    │   ├── FleetStatusPanel.js    # Robot probe status
    │   ├── CivilizationPanel.js  # Civilization progress tracker
    │   ├── TimePanel.js          # Simulation time display
    │   └── ControlsPanel.js     # Camera control buttons
    └── utils/
        ├── EventBus.js           # Event system
        ├── ColorPalette.js       # Color constants
        └── MathUtils.js          # Math helpers
```

## Configuration

Edit `src/constants.js` to customize:

- **Planets** — Colors, sizes, orbital distances, speeds, descriptions
- **Sun** — Size, color, light intensity
- **Simulation Speed** — `SIM_DAYS_PER_REAL_SECOND` (default: 0.5 days per real second)
- **Robot Probes** — `ROBOT_COUNT`, `ROBOT_NAMES`, `ROBOT_COLORS`, `ROBOT_FLIGHT_SPEED`
- **Mission Types** — Edit `src/missions/MissionTypes.js` for durations, priorities, requirements
- **Civilization Stages** — Edit `src/civilization/StageDefinitions.js` for progression requirements

## Mission Types

1. **Flyby Survey** (15s) — Quick orbital survey, unlocks Moon
2. **Collect Samples** (45s) — Gather geological samples
3. **Deploy Equipment** (60s) — Set up scientific instruments, requires Stage 2
4. **Build Base** (120s) — Establish permanent outpost, unlocks new planets
5. **Explore Surface** (90s) — Extended surface exploration, requires Stage 3
6. **Establish Colony** (240s) — Full colonization mission, requires Stage 4

## Civilization Stages

- **Stage 1: First Space Flight** — Complete 1 mission → Unlocks Moon
- **Stage 2: Lunar Colony** — Build base on Moon → Unlocks Mars, Venus, Mercury
- **Stage 3: Mars Colonization** — Build base on Mars → Unlocks Jupiter, Saturn
- **Stage 4: Inner Solar System** — Build 3+ bases → Unlocks Uranus, Neptune
- **Stage 5: Outer Solar System** — Visit all 8 planets
- **Stage 6: Multi-Planetary Civilization** — Establish 5+ colonies

## License

MIT

## Repository

[https://github.com/Lameda12/SimHex](https://github.com/Lameda12/SimHex)
