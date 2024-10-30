import * as THREE from 'three';

export class PSO {
  constructor(droneCount) {
    this.particleCount = droneCount;
    this.dimensions = 3; // x, y, z coordinates
    this.particles = [];
    this.globalBest = null;
    this.inertia = 0.7;
    this.cognitive = 1.5;
    this.social = 1.5;
    
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        position: new THREE.Vector3(),
        velocity: new THREE.Vector3(),
        personalBest: new THREE.Vector3(),
        personalBestFitness: Infinity
      });
    }
  }

  evaluate(position, missiles, powerPlant) {
    let fitness = 0;
    
    // Distance to nearest missile (want to be close)
    let minMissileDistance = Infinity;
    missiles.forEach(missile => {
      const distance = position.distanceTo(missile.mesh.position);
      minMissileDistance = Math.min(minMissileDistance, distance);
    });
    fitness += minMissileDistance * 2;
    
    // Distance to power plant (want to stay within reasonable range)
    const powerPlantDistance = position.distanceTo(powerPlant.mesh.position);
    fitness += Math.abs(powerPlantDistance - 20);
    
    // Height penalty (keep reasonable altitude)
    fitness += Math.abs(position.y - 15) * 2;
    
    return fitness;
  }

  optimize(drones, missiles, powerPlant) {
    this.particles.forEach((particle, i) => {
      // Update particle position
      particle.position.copy(drones[i].mesh.position);
      
      // Evaluate fitness
      const fitness = this.evaluate(particle.position, missiles, powerPlant);
      
      // Update personal best
      if (fitness < particle.personalBestFitness) {
        particle.personalBestFitness = fitness;
        particle.personalBest.copy(particle.position);
      }
      
      // Update global best
      if (!this.globalBest || fitness < this.evaluate(this.globalBest, missiles, powerPlant)) {
        this.globalBest = particle.position.clone();
      }
      
      // Update velocity
      const cognitive = new THREE.Vector3()
        .subVectors(particle.personalBest, particle.position)
        .multiplyScalar(this.cognitive * Math.random());
        
      const social = new THREE.Vector3()
        .subVectors(this.globalBest, particle.position)
        .multiplyScalar(this.social * Math.random());
        
      particle.velocity.multiplyScalar(this.inertia)
        .add(cognitive)
        .add(social)
        .clampLength(0, 0.5);
        
      // Apply velocity
      const newPosition = particle.position.clone().add(particle.velocity);
      drones[i].setTargetPosition(newPosition);
    });
  }
}