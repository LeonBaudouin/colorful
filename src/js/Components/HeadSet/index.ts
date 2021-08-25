import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import * as THREE from 'three'

export default class HeadSet {
  public mesh: THREE.Mesh

  constructor(gltf: GLTF) {
    this.setupMesh(gltf)
  }

  private setupMesh(gltf: GLTF) {
    const origMesh = gltf.scene.getObjectByName('HeadSet') as THREE.Mesh
    const loader = new THREE.TextureLoader()

    const onLoad = (t: THREE.Texture) => {
      t.flipY = false
      t.needsUpdate = true
      t.magFilter = THREE.NearestFilter
    }
    const roughnessMap = loader.load(
      require('@textures/roughness.png').default,
      onLoad
    )
    const map = loader.load(require('@textures/color_2.png').default, onLoad)

    const mat = new THREE.MeshStandardMaterial({
      roughnessMap,
      map,
    })

    this.mesh = new THREE.Mesh(origMesh.geometry, mat)

    this.mesh.name = 'HeadSet'
    this.mesh.rotation.copy(origMesh.rotation)
    this.mesh.scale.copy(origMesh.scale)
    this.mesh.position.copy(origMesh.position)
  }
}
