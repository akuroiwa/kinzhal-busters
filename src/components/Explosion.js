import * as THREE from 'three';

export class Explosion {
  constructor(position) {
    this.particles = [];
    this.lifetime = 60; // frames
    this.age = 0;
    
    const particleCount = 20;
    const geometry = new THREE.SphereGeometry(0.2, 8, 8);
    const material = new THREE.MeshPhongMaterial({ color: 0xff6600 });
    
    for (let i = 0; i < particleCount; i++) {
      const particle = new THREE.Mesh(geometry, material);
      particle.position.copy(position);
      particle.velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.5,
        (Math.random() - 0.5) * 0.5,
        (Math.random() - 0.5) * 0.5
      );
      this.particles.push(particle);
    }
  }

  update() {
    this.age++;
    const scale = 1 - (this.age / this.lifetime);
    
    this.particles.forEach(particle => {
      particle.position.add(particle.velocity);
      particle.scale.setScalar(scale);
    });
    
    return this.age < this.lifetime;
  }
}