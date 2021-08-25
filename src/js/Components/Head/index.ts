import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import * as THREE from 'three'
import MyDat from '../../Utils/MyDat'
import FluidMaterial from '../Material/FluidMaterial'

export default class Head {
  private params = {
    oscilationAmount: 0.3,
    oscilationSpeed: 1,
  }
  private gui = MyDat.getGUI().addFolder('Face')

  private material: FluidMaterial
  public mesh: THREE.Mesh

  constructor(gltf: GLTF) {
    this.setupMesh(gltf)
  }

  private setupMesh(gltf: GLTF) {
    const origMesh = gltf.scene.getObjectByName('Head') as THREE.Mesh
    const loader = new THREE.TextureLoader()

    this.material = new FluidMaterial(this.gui.addFolder('Material'))

    this.mesh = new THREE.Mesh(origMesh.geometry, this.material.material)
    this.mesh.name = 'Head'
    this.mesh.rotation.copy(origMesh.rotation)
    this.mesh.scale.copy(origMesh.scale)
    this.mesh.position.copy(origMesh.position)

    this.gui.add(this.params, 'oscilationAmount', 0, 2, 0.01)
    this.gui.add(this.params, 'oscilationSpeed', 0, 2, 0.01)
  }

  public tick(time: number, delta: number) {
    this.material.tick(time, delta)
    this.mesh.position.y =
      Math.sin(time * this.params.oscilationSpeed) *
      this.params.oscilationAmount
  }
}
