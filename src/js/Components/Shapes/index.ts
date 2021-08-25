import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import * as THREE from 'three'
import MyDat from '../../Utils/MyDat'
import Shape from './Shape'

export default class Shapes {
  public group: THREE.Group

  private gui = MyDat.getGUI().addFolder('Shapes')

  constructor(gltf: GLTF) {
    this.setupShapes(gltf)
  }

  private setupShapes(gltf: GLTF) {
    const meshes: Shape[] = []

    const defaultParams: Record<
      string,
      ConstructorParameters<typeof THREE.MeshStandardMaterial>[0]
    > = {}

    gltf.scene.traverse((o) => {
      if (
        !(
          o.name.includes('Cube') ||
          o.name.includes('Cone') ||
          o.name.includes('Icosphere')
        )
      )
        return

      meshes.push(new Shape(o as THREE.Mesh, defaultParams[o.name], this.gui))
    })

    this.group = new THREE.Group()
    this.group.add(...meshes.map((m) => m.mesh))
  }
}
