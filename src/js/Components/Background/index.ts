import fragmentShader from './fragmentShader.frag'
import vertexShader from './vertexShader.vert'
import MyDat from '../../Utils/MyDat'
import * as THREE from 'three'

export default class Background {
  private params = {
    // insideColor: 0x161616,, 0.01
    // outsideColor: 0x050505,
    insideColor: 0xefa4da,
    outsideColor: 0xcc6174,
    gradientStart: 0,
    gradientEnd: 0.8,
  }

  private gui: dat.GUI = MyDat.getGUI().addFolder('Background')

  private uniforms: Record<string, THREE.IUniform>

  public mesh: THREE.Mesh

  constructor(camera: THREE.Camera) {
    this.setupMesh(camera)
  }

  private setupMesh(camera: THREE.Camera) {
    this.uniforms = {
      uInsideColor: { value: new THREE.Color(this.params.insideColor) },
      uOutsideColor: { value: new THREE.Color(this.params.outsideColor) },
      uGradientStart: { value: this.params.gradientStart },
      uGradientEnd: { value: this.params.gradientEnd },
      uCameraPosition: { value: camera.position },
      uScreenResolution: {
        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
      },
    }

    this.mesh = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(10, 10),
      new THREE.RawShaderMaterial({
        fragmentShader: fragmentShader,
        vertexShader: vertexShader,
        depthTest: false,
        uniforms: this.uniforms,
      })
    )
    this.mesh.renderOrder = -1

    this.gui
      .addColor(this.params, 'insideColor')
      .onChange((v) => (this.uniforms.uInsideColor.value = new THREE.Color(v)))
    this.gui
      .addColor(this.params, 'outsideColor')
      .onChange((v) => (this.uniforms.uOutsideColor.value = new THREE.Color(v)))
    this.gui
      .add(this.params, 'gradientStart', 0, 1, 0.01)
      .onChange((v) => (this.uniforms.uGradientStart.value = v))
    this.gui
      .add(this.params, 'gradientEnd', 0, 1, 0.01)
      .onChange((v) => (this.uniforms.uGradientEnd.value = v))
  }
}
