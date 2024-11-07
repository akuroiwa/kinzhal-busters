# kinzhal-busters

[Edit in StackBlitz next generation editor ⚡️](https://stackblitz.com/~/github.com/akuroiwa/kinzhal-busters)

## Project Description

This project is a missile defense system simulation using multiple drones, developed with Vite. The primary objective is to protect a central power plant from incoming missiles. The simulation employs the Particle Swarm Optimization (PSO) algorithm to optimize drone behavior and interception strategies.

## Installation and Setup

### Ubuntu Package Requirements

To install the necessary Ubuntu packages, run:

```bash
sudo apt update
sudo apt install nodejs npm
```

### Project Dependencies

To install the project dependencies, navigate to the project directory and run:

```bash
npm install
```

### Development Server

To start the development server, use:

```bash
npm run dev
```

This will launch the application in development mode, typically accessible at [http://localhost:5173](http://localhost:5173).

### Build and Deploy

To build the project for production, run:

```bash
npm run build
```

This will create a `dist` folder with the production-ready files.

To deploy, you can serve these files using a static file server. For a simple deployment, you can use:

```bash
npm run preview
```

This will serve the built files locally for preview. For actual deployment, upload the contents of the `dist` folder to your web server or hosting platform of choice.
