import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import * as THREE from 'three'
import beginVertex from './beginVertex.vert'
import normalVertex from './normalVertex.vert'
import positionVertex from './positionVertex.vert'
import { SHAPE_COLORS } from '../../Utils/Palette'
import MyDat from '../../Utils/MyDat'

type ParticlesParams = Omit<
  ConstructorParameters<typeof THREE.MeshStandardMaterial>[0],
  'flatShading'
> & {
  amount: number
  seed: number
  cycleOffset: number
  individualOffset: number
  yCycleOffset: number
  spreadFactor: number
  scale: number
  varScale: number
  speed: number
}

export default class ShapeParticles {
  public mesh: THREE.InstancedMesh

  private uniforms: Record<string, THREE.IUniform>
  private params: ParticlesParams

  private gui: dat.GUI

  constructor(
    name: string,
    origMesh: THREE.Mesh,
    parentGui: dat.GUI,
    params: Partial<ParticlesParams> = {}
  ) {
    const defaultParams: ParticlesParams = {
      amount: 1000,
      color: SHAPE_COLORS[3],
      seed: Math.random(),
      cycleOffset: 0,
      individualOffset: 0.01,
      yCycleOffset: 0,
      spreadFactor: 0.3,
      scale: 0.05,
      varScale: 0,
      speed: 0.5,
    }

    this.gui = parentGui.addFolder(name)

    this.params = { ...defaultParams, ...params }
    this.setupParticles(origMesh)
  }

  private createGeometry(amount: number, origGeometry: THREE.BufferGeometry) {
    const geometry = new THREE.InstancedBufferGeometry()

    geometry.instanceCount = amount

    Object.keys(origGeometry.attributes).forEach((attributeName) => {
      geometry.attributes[attributeName] =
        origGeometry.attributes[attributeName]
    })
    geometry.index = origGeometry.index

    const index = new Float32Array(amount)

    for (let i = 0; i < amount; i++) index[i] = i
    geometry.setAttribute(
      'aIndex',
      new THREE.InstancedBufferAttribute(index, 1, false)
    )

    return geometry
  }

  private setupParticles(origMesh: THREE.Mesh) {
    const origGeometry = origMesh.geometry
    const {
      amount,
      seed,
      cycleOffset,
      individualOffset,
      yCycleOffset,
      spreadFactor,
      scale,
      varScale,
      speed,
      ...materialParams
    } = this.params

    const geometry = this.createGeometry(amount, origGeometry)

    const material = new THREE.MeshStandardMaterial({
      flatShading: true,
      ...materialParams,
    })
    material.onBeforeCompile = (data: THREE.Shader) => {
      data.uniforms.uTime = { value: 0 }
      data.uniforms.uSeed = { value: seed }
      data.uniforms.uCycleOffset = { value: cycleOffset }
      data.uniforms.uIndividualOffset = { value: individualOffset }
      data.uniforms.uYCycleOffset = { value: yCycleOffset }
      data.uniforms.uSpreadFactor = { value: spreadFactor }
      data.uniforms.uScale = { value: scale }
      data.uniforms.uVarScale = { value: varScale }
      data.uniforms.uSpeed = { value: speed }
      this.uniforms = data.uniforms

      data.vertexShader = data.vertexShader.replace(
        '#include <common>',
        `
        #include <common>
        ${beginVertex}
        `
      )

      data.vertexShader = data.vertexShader.replace(
        '#include <normal_vertex>',
        `
        #ifndef FLAT_SHADED
          ${normalVertex}
          vNormal = normalize( transformedNormal );
          #ifdef USE_TANGENT
            vTangent = normalize( transformedTangent );
            vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
          #endif
        #endif
        `
      )

      data.vertexShader = data.vertexShader.replace(
        '#include <project_vertex>',
        `
        ${positionVertex}
        vec4 mvPosition = vec4( transformed, 1.0 );
        #ifdef USE_INSTANCING
          mvPosition = instanceMatrix * mvPosition;
        #endif
        mvPosition = modelViewMatrix * mvPosition;
        gl_Position = projectionMatrix * mvPosition;
        `
      )
    }

    this.mesh = new THREE.InstancedMesh(geometry, material, amount)
    const fillMatrices = () => {
      for (let index = 0; index < this.params.amount; index++)
        this.mesh.setMatrixAt(index, new THREE.Matrix4())
    }
    fillMatrices()

    const motion = this.gui.addFolder('Motion')

    motion
      .add(this.params, 'seed')
      .onChange((v) => (this.uniforms.uSeed.value = v))
    motion
      .add(this.params, 'cycleOffset', 0, 1, 0.01)
      .onChange((v) => (this.uniforms.uCycleOffset.value = v))
    motion
      .add(this.params, 'individualOffset', 0, 0.1, 0.001)
      .onChange((v) => (this.uniforms.uIndividualOffset.value = v))
    motion
      .add(this.params, 'yCycleOffset', 0, 1, 0.01)
      .onChange((v) => (this.uniforms.uYCycleOffset.value = v))
    motion
      .add(this.params, 'spreadFactor')
      .step(0.01)
      .onChange((v) => (this.uniforms.uSpreadFactor.value = v))
    motion
      .add(this.params, 'speed')
      .step(0.01)
      .onChange((v) => (this.uniforms.uSpeed.value = v))
    motion
      .add(this.params, 'scale')
      .step(0.01)
      .onChange((v) => (this.uniforms.uScale.value = v))
    motion
      .add(this.params, 'varScale')
      .step(0.01)
      .onChange((v) => (this.uniforms.uVarScale.value = v))

    const materialGui = this.gui.addFolder('Material')
    materialGui
      .addColor(this.params, 'color')
      .onChange((v) => material.color.set(v))
    materialGui.add(material, 'metalness', 0, 1, 0.01)
    materialGui.add(material, 'roughness', 0, 1, 0.01)
  }

  public tick(elapsed: number, delta: number) {
    this.uniforms.uTime.value = elapsed % 4000
  }
}
