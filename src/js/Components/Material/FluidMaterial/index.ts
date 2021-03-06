import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import * as THREE from 'three'
import fragmentShader from './fragmentShader.frag'
import vertexShader from './vertexShader.vert'
import MyDat from '../../../Utils/MyDat'

export default class FluidMaterial {
  private params = {
    direction: new THREE.Euler(2.47, 4.16, 0),
    fresnelColor: '#ffffff',
    fresnelPower: 2.5,
    noiseScale: 5,
    noiseStrength: 0.05,
    loopCount: 10,
    gradient: '',
  }
  private uniforms: Record<string, THREE.IUniform>
  private gui: dat.GUI

  public material: THREE.RawShaderMaterial

  constructor(gui: dat.GUI) {
    this.gui = gui
    this.setupMaterial()
  }

  private setupMaterial() {
    const loader = new THREE.TextureLoader()

    const names = ['colorful', 'black&white', 'debug', 'glue', 'rainbow']
    const onLoad = (t: THREE.Texture) => {
      t.wrapS = THREE.MirroredRepeatWrapping
      t.wrapT = THREE.MirroredRepeatWrapping
      t.magFilter = THREE.LinearFilter
    }
    const textures: Record<string, THREE.Texture> = {}
    for (const name of names)
      textures[name] = loader.load(`./textures/gradient/${name}.png`, onLoad)
    this.params.gradient = 'colorful'

    this.uniforms = {
      uTime: { value: 0 },
      uDirection: {
        value: new THREE.Quaternion().setFromEuler(this.params.direction),
      },
      uGradient: {
        value: textures[this.params.gradient],
      },
      uFresnelPower: { value: this.params.fresnelPower },
      uFresnelColor: { value: new THREE.Color(this.params.fresnelColor) },
      uNoiseScale: { value: this.params.noiseScale },
      uNoiseStrength: { value: this.params.noiseStrength },
      uLoopCount: { value: this.params.loopCount },
    }

    this.material = new THREE.RawShaderMaterial({
      fragmentShader: fragmentShader,
      vertexShader: vertexShader,
      uniforms: this.uniforms,
    })

    this.gui
      .addColor(this.params, 'fresnelColor')
      .onChange((v) => (this.uniforms.uFresnelColor.value = new THREE.Color(v)))
    this.gui
      .add(this.params, 'fresnelPower', 0, 10, 0.01)
      .onChange((v) => (this.uniforms.uFresnelPower.value = v))
    this.gui
      .add(this.params, 'noiseStrength', 0, 0.25, 0.001)
      .onChange((v) => (this.uniforms.uNoiseStrength.value = v))
    this.gui
      .add(this.params, 'noiseScale')
      .onChange((v) => (this.uniforms.uNoiseScale.value = v))
    this.gui
      .add(this.params, 'loopCount')
      .onChange((v) => (this.uniforms.uLoopCount.value = v))
    this.gui
      .add(this.params, 'gradient', Object.keys(textures))
      .onChange((v) => (this.uniforms.uGradient.value = textures[v]))

    const folder = this.gui.addFolder('Direction')
    const onDirChange = () =>
      (this.uniforms.uDirection.value as THREE.Quaternion).setFromEuler(
        this.params.direction
      )
    const guiParams = [0, Math.PI * 2, 0.01]
    folder.add(this.params.direction, 'x', ...guiParams).onChange(onDirChange)
    folder.add(this.params.direction, 'y', ...guiParams).onChange(onDirChange)
    folder.add(this.params.direction, 'z', ...guiParams).onChange(onDirChange)
  }

  public tick(time: number, delta: number) {
    this.uniforms.uTime.value = time
  }
}
