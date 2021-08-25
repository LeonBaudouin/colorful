import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import * as THREE from 'three'
import refractFragmentShader from './fragmentShader.frag'
import refractVertexShader from './vertexShader.vert'
import MyDat from '../../Utils/MyDat'

export default class Head {
  private params = {
    fresnelColor: 0x000000,
    ior: 1.01,
    fresnelPower: 2.0,
  }

  private uniforms: Record<string, THREE.IUniform>

  private gui = MyDat.getGUI().addFolder('Face')

  public mesh: THREE.Mesh

  constructor(gltf: GLTF) {
    this.setupMesh(gltf)
  }

  private setupMesh(gltf: GLTF) {
    const origMesh = gltf.scene.getObjectByName('Head') as THREE.Mesh
    const loader = new THREE.TextureLoader()

    this.uniforms = {
      uEnvMap: { value: loader.load(require('@textures/skybox.jpg').default) },
      uResolution: {
        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
      },
      uIor: { value: this.params.ior },
      uFresnelPower: { value: this.params.fresnelPower },
      uFresnelColor: { value: new THREE.Color(this.params.fresnelColor) },
    }

    const mat = new THREE.RawShaderMaterial({
      fragmentShader: refractFragmentShader,
      vertexShader: refractVertexShader,
      uniforms: this.uniforms,
    })

    this.gui
      .addColor(this.params, 'fresnelColor')
      .onChange((v) => (mat.uniforms.uFresnelColor.value = new THREE.Color(v)))
    this.gui
      .add(this.params, 'fresnelPower')
      .onChange((v) => (mat.uniforms.uFresnelPower.value = v))
    this.gui
      .add(this.params, 'ior')
      .onChange((v) => (mat.uniforms.uIor.value = v))

    this.mesh = new THREE.Mesh(origMesh.geometry, mat)
    this.mesh.name = 'Head'
    this.mesh.rotation.copy(origMesh.rotation)
    this.mesh.scale.copy(origMesh.scale)
    this.mesh.position.copy(origMesh.position)
  }
}
