import * as THREE from 'three';

export class Missile {
  constructor(startPosition, targetPosition) {
    // Changed missile shape to cone
    const geometry = new THREE.ConeGeometry(0.3, 2, 16);
    const material = new THREE.MeshPhongMaterial({ color: 0xff0000 });

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.copy(startPosition);

    // Calculate heading direction
    this.velocity = new THREE.Vector3()
      .subVectors(targetPosition, startPosition)
      .normalize()
      .multiplyScalar(0.3);

    // Set the initial orientation
    this.mesh.lookAt(targetPosition);

    // Rotate the cone 90 degrees so that the tip faces the direction of travel
    this.mesh.rotateX(Math.PI / 2);
  }

  update() {
    this.mesh.position.add(this.velocity);
    // Update orientation to direction of travel
    this.mesh.lookAt(this.mesh.position.clone().add(this.velocity));
    // Rotate the cone 90 degrees so that the tip faces the direction of travel
    this.mesh.rotateX(Math.PI / 2);
  }
}
