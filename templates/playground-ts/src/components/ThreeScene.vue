<template>
  <div ref="webglWrapper" id="webgl"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const webglWrapper = ref(null)

onMounted(() => {
  const wrapperWidth = webglWrapper.value.offsetWidth
  const app = new ThreeApp(webglWrapper.value, wrapperWidth)
  app.render()
})

class ThreeApp {
  static CAMERA_PARAM = {
    fovy: 60,
    aspect: window.innerWidth / window.innerHeight,
    near: 0.1,
    far: 10.0,
    position: new THREE.Vector3(1.0, 0.5, 4.0),
    lookAt: new THREE.Vector3(0.0, 0.0, 0.0),
  }

  static RENDERER_PARAM = {
    clearColor: 0x666666,
    width: window.innerWidth,
    height: window.innerHeight,
  }

  static DIRECTIONAL_LIGHT_PARAM = {
    color: 0xffffff,
    intensity: 1.0,
    position: new THREE.Vector3(1.0, 1.0, 1.0),
  }

  static AMBIENT_LIGHT_PARAM = {
    color: 0xffffff,
    intensity: 0.1,
  }

  static MATERIAL_PARAM_1 = {
    color: 0x42b883,
  }

  static MATERIAL_PARAM_2 = {
    color: 0x35495e,
  }

  renderer
  scene
  camera
  directionalLight
  ambientLight
  geometry
  geometry2
  material1
  material2
  vShapeGroup
  controls
  axesHelper

  constructor(wrapper, wrapperWidth) {
    const color = new THREE.Color(ThreeApp.RENDERER_PARAM.clearColor)
    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setClearColor(color)
    this.renderer.setSize(wrapperWidth, ThreeApp.RENDERER_PARAM.height)
    wrapper.appendChild(this.renderer.domElement)

    this.scene = new THREE.Scene()

    this.camera = new THREE.PerspectiveCamera(
      ThreeApp.CAMERA_PARAM.fovy,
      wrapperWidth / ThreeApp.RENDERER_PARAM.height,
      ThreeApp.CAMERA_PARAM.near,
      ThreeApp.CAMERA_PARAM.far,
    )
    this.camera.position.copy(ThreeApp.CAMERA_PARAM.position)
    this.camera.lookAt(ThreeApp.CAMERA_PARAM.lookAt)

    this.directionalLight = new THREE.DirectionalLight(
      ThreeApp.DIRECTIONAL_LIGHT_PARAM.color,
      ThreeApp.DIRECTIONAL_LIGHT_PARAM.intensity,
    )
    this.directionalLight.position.copy(
      ThreeApp.DIRECTIONAL_LIGHT_PARAM.position,
    )
    this.scene.add(this.directionalLight)

    this.ambientLight = new THREE.AmbientLight(
      ThreeApp.AMBIENT_LIGHT_PARAM.color,
      ThreeApp.AMBIENT_LIGHT_PARAM.intensity,
    )
    this.scene.add(this.ambientLight)

    this.geometry = this.createVueLogoGeometry()
    this.material1 = new THREE.MeshPhongMaterial(ThreeApp.MATERIAL_PARAM_1)
    const vShape1 = new THREE.Mesh(this.geometry, this.material1)
    vShape1.position.y = -0.18

    this.geometry2 = this.createVueLogoGeometry2()
    this.material2 = new THREE.MeshPhongMaterial(ThreeApp.MATERIAL_PARAM_2)
    const vShape2 = new THREE.Mesh(this.geometry2, this.material2)
    vShape2.position.y = 0.31

    this.vShapeGroup = new THREE.Group()
    this.vShapeGroup.add(vShape1)
    this.vShapeGroup.add(vShape2)

    this.scene.add(this.vShapeGroup)

    const axesBarLength = 5.0
    this.axesHelper = new THREE.AxesHelper(axesBarLength)
    this.scene.add(this.axesHelper)

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.render = this.render.bind(this)
  }

  createVueLogoGeometry() {
    const shape = new THREE.Shape()

    shape.moveTo(0, 0)
    shape.lineTo(-0.6, 1.16)
    shape.lineTo(-0.35, 1.16)
    shape.lineTo(0, 0.5)
    shape.lineTo(0.35, 1.16)
    shape.lineTo(0.6, 1.16)
    shape.lineTo(0, 0)

    const extrudeSettings = { depth: 0.3, bevelEnabled: false }
    return new THREE.ExtrudeGeometry(shape, extrudeSettings)
  }

  createVueLogoGeometry2() {
    const shape = new THREE.Shape()

    shape.moveTo(0, 0)
    shape.lineTo(-0.35, 0.67)
    shape.lineTo(-0.18, 0.67)
    shape.lineTo(0, 0.38)
    shape.lineTo(0.18, 0.67)
    shape.lineTo(0.35, 0.67)
    shape.lineTo(0, 0)

    const extrudeSettings = { depth: 0.3, bevelEnabled: false }
    return new THREE.ExtrudeGeometry(shape, extrudeSettings)
  }

  render() {
    requestAnimationFrame(this.render)
    this.controls.update()

    this.vShapeGroup.rotation.x += 0.02
    this.vShapeGroup.rotation.y += 0.04

    this.renderer.render(this.scene, this.camera)
  }
}
</script>
