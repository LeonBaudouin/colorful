import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import Scene from './Components/Scene'
import MyDat from './Utils/MyDat'

function debugBase64(base64URL) {
  const win = window.open()
  win.document.write(
    '<iframe src="' +
      base64URL +
      '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>'
  )
}

function initWebglRenderer(): THREE.WebGLRenderer {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  })
  // renderer.autoClear = false
  // renderer.setClearColor(0x000000, 0.0)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.debug.checkShaderErrors = true
  return renderer
}

export default function Load() {
  return new GLTFLoader()
    .loadAsync(require('@models/Headset.glb').default)
    .then(Setup)
}

function Setup(gltf: GLTF): { raf: Function; cb: Function } {
  const camera = new THREE.PerspectiveCamera(
    25,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )

  const webGLrenderer = initWebglRenderer()
  webGLrenderer.outputEncoding = THREE.sRGBEncoding
  webGLrenderer.toneMapping = THREE.ACESFilmicToneMapping

  const controls = new OrbitControls(camera, webGLrenderer.domElement)
  controls.enabled = false
  MyDat.getGUI().add(controls, 'enabled').name('orbitControls')
  camera.position.z = 2

  const scene = new Scene(camera, gltf)

  document.body.append(webGLrenderer.domElement)

  window.addEventListener('resize', () => {
    webGLrenderer.setSize(window.innerWidth, window.innerHeight)

    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
  })
  const clock = new THREE.Clock(true)

  return {
    raf: () => {
      webGLrenderer.render(scene.scene, camera)
      const deltaTime = clock.getElapsedTime()
      const elapsedTime = clock.elapsedTime
      scene.tick(elapsedTime, deltaTime)

      // debugBase64((<HTMLCanvasElement>webGLrenderer.domElement).toDataURL('image/png'))
    },
    cb: () => {},
  }
}
