import * as THREE from 'three'
import MyDat from '../../Utils/MyDat'

export default class Lights {
  private params = {
    ambient: {
      color: 0xffffff,
      intensity: 0.99,
    },
    lights: [
      {
        color: 0xffffff,
        intensity: 3.17,
        position: new THREE.Vector3(-8, -3.7, 0),
      },
      {
        color: 0xffffff,
        intensity: 3.5,
        position: new THREE.Vector3(-4.6, 2.1, 0.7),
      },
    ],
  }

  private gui = MyDat.getGUI().addFolder('Lights')

  public group = new THREE.Group()

  constructor() {
    this.setup()
  }

  private setup() {
    const ambientGUI = this.gui.addFolder('Ambient Light')
    const ambient = new THREE.AmbientLight(
      this.params.ambient.color,
      this.params.ambient.intensity
    )
    ambientGUI
      .addColor(this.params.ambient, 'color')
      .onChange((v) => (ambient.color = new THREE.Color(v)))
    ambientGUI
      .add(this.params.ambient, 'intensity')
      .onChange((v) => (ambient.intensity = v))

    this.group.add(ambient)

    let index = 1
    for (const params of this.params.lights) {
      const light = new THREE.DirectionalLight(params.color, params.intensity)
      light.position.copy(params.position)
      const helper = new THREE.DirectionalLightHelper(light, 1)
      helper.visible = false

      // GUI
      const gui = this.gui.addFolder(`Light ${index}`)
      gui.addColor(params, 'color').onChange((v) => {
        light.color = new THREE.Color(v)
      })
      gui.add(params, 'intensity', 0, 5, 0.01).onChange((v) => {
        light.intensity = v
        helper.update()
      })
      gui.add(helper, 'visible').name('debug')
      const pos = gui.addFolder('position')
      pos
        .add(params.position, 'x')
        .step(0.1)
        .onChange((v) => {
          light.position.x = v
          helper.update()
        })
      pos
        .add(params.position, 'y')
        .step(0.1)
        .onChange((v) => {
          light.position.y = v
          helper.update()
        })
      pos
        .add(params.position, 'z')
        .step(0.1)
        .onChange((v) => {
          light.position.z = v
          helper.update()
        })
      this.group.add(helper, light)
      index++
    }

    this.group.scale.setScalar(1)
  }
}
