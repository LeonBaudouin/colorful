import * as THREE from 'three'
import { SHAPE_COLORS } from '../../../Utils/Palette'

export default class Shape {
  public mesh: THREE.Mesh

  private gui: dat.GUI

  constructor(
    mesh: THREE.Mesh,
    defaultParams: ConstructorParameters<typeof THREE.MeshStandardMaterial>[0],
    parentGui: dat.GUI
  ) {
    this.setupMesh(mesh, defaultParams, parentGui)
  }

  private setupMesh(
    origMesh: THREE.Mesh,
    defaultParams: ConstructorParameters<typeof THREE.MeshStandardMaterial>[0],
    parentGui: dat.GUI
  ) {
    this.gui = parentGui.addFolder(origMesh.name)
    const params = defaultParams || {
      color: SHAPE_COLORS[Math.floor(Math.random() * SHAPE_COLORS.length)],
    }
    const material = new THREE.MeshStandardMaterial(
      defaultParams || {
        metalness: 0,
        roughness: 1,
        color: params.color,
      }
    )
    this.mesh = new THREE.Mesh((origMesh as THREE.Mesh).geometry, material)

    // gui
    //   .addColor(params, 'color')
    //   .onChange((v) => (material.color = new THREE.Color(v)))

    this.mesh.scale.copy(origMesh.scale)
    this.mesh.rotation.copy(origMesh.rotation)
    this.mesh.position.copy(origMesh.position)
  }
}
