<template>
  <section class="container">
    <article class="tile">
      <figure class="tile__figure">
        <img
            data-src="https://tympanus.net/Tutorials/GooeyImageHoverEffects/dist/img/tiles/woods/base.jpg"
            data-hover="https://tympanus.net/Tutorials/GooeyImageHoverEffects/dist/img/tiles/woods/hover.jpg"
            class="tile__image"
            alt="My image"
            width="400"
            height="300" />
      </figure>
    </article>
  </section>
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
      scene: new THREE.Scene(),
      ambientlight: null,
      light: null,
      targetObject: null,
      ADD: -0.1,
      objs: [],
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
    camera() {
      return this.$store.state.camera;
    },
    renderer() {
      return this.$store.state.renderer;
    },
    refCanvas() {
      return this.$store.state.refCanvas;
    }
  },
  methods: {
    init() {
      // light = new THREE.AmbientLight(0x63b8ff);
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.refCanvas,
        alpha: true,
      });

      this.ambientlight = new THREE.AmbientLight(0xffffff, 2);
      this.scene.add(this.ambientlight);
      this.camera.fov = 20;
      this.camera.updateProjectionMatrix();
      gsap.to(this.camera.position, {
        x: 0,
        y: 0,
        z: 800,
        duration: 2,
      });
      this.mainLoop()
    },
    mainLoop() {
      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(this.mainLoop);
    },

    destroy() {
      this.scene.remove(this.ambientlight)
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
