<template>
  <div></div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from 'gsap';
import { randomInRange } from "../utils";

export default {
  name: 'Home',
  components: {
  },
  data() {
    return {
      axes: null,
      controls: null,
      cube: null,
      donuts: [],
    }
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
  mounted() {
    this.$nextTick(() => {
      this.init();
    });
  },
  beforeDestroy() {
    this.destroy()
  },
  methods: {
    init() {
      this.scene.background = new THREE.Color(0xababab);
      gsap.to(this.camera.position, {
        x: 0,
        y: -10,
        z: 5,
      })
      // this.camera.position.set(0, -10, 0);

      this.axes = new THREE.AxesHelper(5);
      this.scene.add(this.axes);
      this.controls = new OrbitControls( this.camera, this.$store.state.canvasRef);
      this.controls.update();

      // this.createDonuts()
      this.createCube();
      this.mainLoop();
    },
    destroy() {
      this.scene.remove(this.axes);
      this.scene.remove(this.cube);
    },
    mainLoop() {
      this.cube.rotation.x += 0.01;
      this.cube.rotation.y += 0.01;
      this.controls.update();

      this.donuts.forEach(d => {
        d.position.y -= 0.1;
        d.position.z -= 0.1;
      });
      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(this.mainLoop);
    },
    createCube() {
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshBasicMaterial({ color: 0x00a1cb, wireframe: true });
      this.cube = new THREE.Mesh(geometry, material);
      this.scene.add(this.cube);
    },
    createDonuts() {
      const geometry = new THREE.TorusGeometry(1, 0.5, 5, 30);
      //const material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff });
      const material = new THREE.MeshDepthMaterial();
      const d = new THREE.Mesh(geometry, material);
      d.position.x = randomInRange(-15, 15)
      d.position.z = randomInRange(-15, 15)
      d.position.y = 15;

      this.scene.add(d)
      this.donuts.push(d)
    }
  },
}
</script>
