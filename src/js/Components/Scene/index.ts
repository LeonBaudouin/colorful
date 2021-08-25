import * as THREE from 'three'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import MyDat from '../../Utils/MyDat'
import { SHAPE_COLORS } from '../../Utils/Palette'
import Background from '../Background'
import Head from '../Head'
import HeadSet from '../HeadSet'
import Lights from '../Lights'
import ShapeParticles from '../ShapeParticles'
import Shapes from '../Shapes'

export default class Scene {
  public scene: THREE.Scene

  private gui: dat.GUI
  private head: Head
  private particles: ShapeParticles[]
  private showScene = false

  constructor(camera: THREE.Camera, gltf: GLTF) {
    this.setup(camera, gltf)
  }

  private setup(camera: THREE.Camera, gltf: GLTF) {
    // this.gui = MyDat.getGUI().addFolder('Scene')
    this.scene = new THREE.Scene()

    // const path = 'textures/env/night/'
    // const format = '.png'
    // const names = ['px', 'nx', 'py', 'ny', 'pz', 'nz']

    // const textureCube = new THREE.CubeTextureLoader().load(
    //   names.map((name) => `${path}${name}${format}`)
    // )
    // // this.scene.environment = textureCube
    // this.gui
    //   .add(this, 'showScene')
    //   .onChange(
    //     (showScene) => (this.scene.environment = showScene ? textureCube : null)
    //   )

    const particlesGui = MyDat.getGUI().addFolder('Particles')

    this.head = new Head(gltf)
    this.particles = [
      new ShapeParticles(
        'Yellow Cubes',
        gltf.scene.getObjectByName('Cube') as THREE.Mesh,
        particlesGui,
        {
          amount: 200,
          color: SHAPE_COLORS[0],
          individualOffset: 0.01,
          yCycleOffset: 0.3,
          spreadFactor: 0.7,
          scale: 0.1,
          varScale: 0.1,
        }
      ),
      new ShapeParticles(
        'Purple Cubes',
        gltf.scene.getObjectByName('Cube') as THREE.Mesh,
        particlesGui,
        {
          amount: 30,
          color: SHAPE_COLORS[1],
          individualOffset: 0.03,
          yCycleOffset: 0.3,
          spreadFactor: 0.8,
          scale: 0.2,
          varScale: 0.2,
        }
      ),
      new ShapeParticles(
        'Blue Cubes',
        gltf.scene.getObjectByName('Cube') as THREE.Mesh,
        particlesGui,
        {
          amount: 100,
          color: SHAPE_COLORS[3],
          individualOffset: 0.01,
          yCycleOffset: 0.3,
          spreadFactor: 0.7,
          scale: 0.13,
          varScale: 0.13,
        }
      ),
    ]

    const particlesGroup = new THREE.Group()
    particlesGroup.position.x -= 0.4
    particlesGroup.position.y -= 1.5
    particlesGroup.add(...this.particles.map((p) => p.mesh))

    const sceneWrapper = new THREE.Group()
    sceneWrapper.scale.multiplyScalar(0.1)
    sceneWrapper.position.y += 0.04
    sceneWrapper.rotateY(Math.PI / 2 + Math.PI / 8)

    sceneWrapper.add(
      this.head.mesh, //--
      // new HeadSet(gltf).mesh, //--
      // new Shapes(gltf).group, //--
      particlesGroup //--
    )

    this.scene.add(
      sceneWrapper,
      new Background(camera).mesh, //--
      new Lights().group //--
    )
  }

  public tick(time: number, delta: number) {
    this.head.tick(time, delta)
    this.particles.forEach((p) => p.tick(time, delta))
  }
}
