<template>
  <div>
    <button class="btn" @click="logPosition" >log position</button>
  </div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from 'gsap';

export default {
  name: 'Home',
  components: {
  },
  data() {
    return {
      controls: null,
      light: null,
      spotLight: null,
      lightHelper: null,
      spotLightHelper: null,
      targetObject: null,
      ADD: -0.1,
      cube: null,
      objs: [],
      donuts: [],
      width: null,
      height: null,
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.init();
    });
  },
  beforeDestroy() {
    this.destroy()
  },
  computed: {
    scene() {
      return this.$store.state.scene;
    },
    camera() {
      return this.$store.state.camera;
    },
    renderer() {
      return this.$store.state.renderer;
    }
  },
  methods: {
    init() {
      // light = new THREE.AmbientLight(0x63b8ff);
      this.light = new THREE.DirectionalLight(0x00ff00);
      // const light = new THREE.DirectionalLight(0x00ff00, 0x0000ff);
      this.light.position.set(10, 5, 0)
      // const light = new THREE.HemisphereLight(0x00ff00, 0x0000ff);
      this.lightHelper = new THREE.DirectionalLightHelper(this.light, 5, 0xffffff);

      this.spotLight = new THREE.SpotLight( 0xffffff, 0.5, 0, Math.PI/10 );
      this.spotLight.position.set( 0, 100, 100 );
      this.spotLight.castShadow = true;
      this.targetObject = new THREE.Object3D();
      this.targetObject.position.set(0, 0, 100);
      this.spotLight.target = this.targetObject;

      this.spotLightHelper = new THREE.SpotLightHelper( this.spotLight );
      this.scene.add(this.targetObject);
      this.scene.add(this.spotLight);
      this.scene.add(this.spotLightHelper);
      this.scene.add(this.light);
      this.scene.add(this.lightHelper);

      this.createGeometry();

      gsap.to(this.camera.position, {
        x: 24,
        y: 21,
        z: -29,
        duration: 4,
      });
      this.controls = new OrbitControls( this.camera, this.$store.state.canvasRef);
      this.controls.update();
      this.mainLoop()
    },
    mainLoop() {
      this.spotLightHelper.update();
      this.lightHelper.update();
      this.controls.update();
      if (this.spotLight.position.z > 100 || this.spotLight.position.z < -100) {
        this.ADD *= -1
      }

      this.targetObject.translateZ(this.ADD);
      this.spotLight.translateZ(this.ADD);
      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(this.mainLoop);
    },
    createGeometry() {
      let geometry = new THREE.BoxGeometry(5, 5, 5);
      let material = new THREE.MeshPhongMaterial({color: 0Xdff913,
        shininess: 100, side: THREE.DoubleSide});
      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(5, 0, 0);

      geometry = new THREE.SphereGeometry(5, 30, 30);
      material = new THREE.MeshPhongMaterial({color: 0X66cdaa,
        shininess: 100, side: THREE.DoubleSide});
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(-5, 5, -5);

      geometry = new THREE.BoxGeometry(2000, 1, 2000);
      material = new THREE.MeshPhongMaterial({color: 0X693421,
        side: THREE.DoubleSide});
      const plane = new THREE.Mesh(geometry, material);
      plane.position.y = -1;

      this.objs.push(cube);
      this.objs.push(sphere);
      this.objs.push(plane);
      this.scene.add(cube);
      this.scene.add(sphere);
      this.scene.add(plane);
    },
    destroy() {
      this.objs.forEach(obj => this.scene.remove(obj));
      this.scene.remove(this.targetObject);
      this.scene.remove(this.spotLight);
      this.scene.remove(this.spotLightHelper);
      this.scene.remove(this.light);
      this.scene.remove(this.lightHelper);
    },
    logPosition() {
      console.log(this.controls);
    }
  },
}
</script>

<style>
  .btn {
    position: absolute;
    top: 16px;
    right: 32px;
    padding: 10px 20px;
  }
</style>
