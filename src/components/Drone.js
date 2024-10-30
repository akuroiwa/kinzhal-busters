import * as THREE from 'three';

export class Drone {
  constructor(position) {
    const geometry = new THREE.BoxGeometry(2, 0.5, 2);
    const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.copy(position);
    
    this.speed = 0.5;
    this.target = null;
    this.targetPosition = position.clone();
    this.isDestroyed = false;
  }

  setTargetPosition(position) {
    this.targetPosition.copy(position);
  }

  update() {
    if (this.isDestroyed) return false;

    if (this.target) {
      const direction = new THREE.Vector3()
        .subVectors(this.target.position, this.mesh.position)
        .normalize();
      this.mesh.position.add(direction.multiplyScalar(this.speed));
      
      if (this.mesh.position.distanceTo(this.target.position) < 1) {
        return true; // Missile intercepted
      }
    } else {
      // Move towards target position using PSO
      const direction = new THREE.Vector3()
        .subVectors(this.targetPosition, this.mesh.position)
        .normalize();
      this.mesh.position.add(direction.multiplyScalar(this.speed * 0.5));
    }
    return false;
  }

  setTarget(target) {
    this.target = target;
  }

  checkCollision(missile) {
    return this.mesh.position.distanceTo(missile.mesh.position) < 1.5;
  }
}