import * as THREE from 'three';
import { Drone } from './Drone.js';
import { Missile } from './Missile.js';
import { Explosion } from './Explosion.js';
import { PSO } from './PSO.js';

export class DefenseSystem {
  constructor(droneCount = 10) {
    this.drones = [];
    this.missiles = [];
    this.explosions = [];
    this.powerPlantPosition = new THREE.Vector3(0, 10, 0);
    
    // Initialize drones in a circular formation
    for (let i = 0; i < droneCount; i++) {
      const angle = (i / droneCount) * Math.PI * 2;
      const position = new THREE.Vector3(
        Math.cos(angle) * 20,
        15,
        Math.sin(angle) * 20
      );
      this.drones.push(new Drone(position));
    }

    this.pso = new PSO(droneCount);
  }

  spawnMissile() {
    const angle = Math.random() * Math.PI * 2;
    const distance = 50;
    const startPosition = new THREE.Vector3(
      Math.cos(angle) * distance,
      20,
      Math.sin(angle) * distance
    );
    
    const missile = new Missile(startPosition, this.powerPlantPosition);
    this.missiles.push(missile);
    return missile.mesh;
  }

  createExplosion(position) {
    const explosion = new Explosion(position);
    this.explosions.push(explosion);
    return explosion.particles;
  }

  update(scene, powerPlant) {
    // Optimize drone positions using PSO
    this.pso.optimize(this.drones, this.missiles, powerPlant);

    // Update missiles
    this.missiles.forEach(missile => missile.update());

    // Update drones and check for interceptions/collisions
    this.drones.forEach(drone => {
      if (!drone.isDestroyed) {
        if (drone.update()) {
          // Missile intercepted
          if (drone.target) {
            const explosionParticles = this.createExplosion(drone.target.position);
            explosionParticles.forEach(particle => scene.add(particle));
            
            const targetMissile = this.missiles.find(m => m.mesh === drone.target);
            if (targetMissile) {
              const index = this.missiles.indexOf(targetMissile);
              scene.remove(targetMissile.mesh);
              this.missiles.splice(index, 1);
            }
            drone.target = null;
          }
        }

        // Check for collisions with missiles
        this.missiles.forEach(missile => {
          if (drone.checkCollision(missile)) {
            drone.isDestroyed = true;
            const explosionParticles = this.createExplosion(drone.mesh.position);
            explosionParticles.forEach(particle => scene.add(particle));
            scene.remove(drone.mesh);
          }
        });
      }
    });

    // Update and remove finished explosions
    this.explosions = this.explosions.filter(explosion => {
      const active = explosion.update();
      if (!active) {
        explosion.particles.forEach(particle => scene.remove(particle));
      }
      return active;
    });

    // Assign free drones to incoming missiles
    const activeDrones = this.drones.filter(drone => !drone.isDestroyed && !drone.target);
    const unassignedMissiles = this.missiles.filter(missile => 
      !this.drones.some(drone => drone.target === missile.mesh)
    );

    activeDrones.forEach(drone => {
      if (unassignedMissiles.length > 0) {
        drone.setTarget(unassignedMissiles[0].mesh);
        unassignedMissiles.shift();
      }
    });
  }
}