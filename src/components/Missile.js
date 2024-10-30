import * as THREE from 'three';

export class Missile {
  constructor(startPosition, targetPosition) {
    // Create elongated missile shape
    const geometry = new THREE.CylinderGeometry(0.3, 0.3, 3, 16);
    const noseCone = new THREE.ConeGeometry(0.3, 1, 16);
    const material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    
    // Create missile body
    this.mesh = new THREE.Group();
    const body = new THREE.Mesh(geometry, material);
    const nose = new THREE.Mesh(noseCone, material);
    
    // Position nose cone at the front
    nose.position.y = 2;
    body.rotation.z = Math.PI / 2;
    nose.rotation.z = Math.PI / 2;
    
    this.mesh.add(body);
    this.mesh.add(nose);
    this.mesh.position.copy(startPosition);
    
    this.velocity = new THREE.Vector3()
      .subVectors(targetPosition, startPosition)
      .normalize()
      .multiplyScalar(0.3);
  }

  update() {
    this.mesh.position.add(this.velocity);
    this.mesh.lookAt(this.mesh.position.clone().add(this.velocity));
  }
}