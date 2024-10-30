import * as THREE from 'three';

export class PowerPlant {
  constructor() {
    const geometry = new THREE.CylinderGeometry(5, 5, 20, 32);
    const material = new THREE.MeshPhongMaterial({ color: 0x666666 });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.y = 10;
  }

  update() {
    // Add any power plant state updates here
  }
}