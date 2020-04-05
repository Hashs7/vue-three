<template>
  <ul class="btn-container">
    <li v-for="(m, i) in models" :key="i">
      <button @click="loadModel(m)">Load {{ m.name }}</button>
    </li>
  </ul>
</template>

<script>
  import * as THREE from 'three'
  import LoadManager from "../components/LoadManager";
  import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
  import gsap from 'gsap';

  export default {
    name: 'Character',
    data() {
      return {
        models: [{
          name: 'pilier',
          path: './assets/models/',
          gltf: null,
        },{
          name: 'petunia',
          path: './assets/models/',
          gltf: null,
        }],
        light: null,
        scene: null,
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
      }
    },
    methods: {
      init() {
        this.renderer.setClearColor(0x000000);
        this.controls = new OrbitControls(this.camera, this.$store.state.canvasRef);
        gsap.to(this.camera.position, {
          x: 100,
          y: 200,
          z: 100,
          duration: 2,
        });

        this.loadModel(this.models[0]);
        this.mainLoop();
      },

      mainLoop() {
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.mainLoop);
      },

      loadModel(model) {
        this.scene = new THREE.Scene();
        this.light = new THREE.HemisphereLight(0xffffff, 0x444444);
        this.scene.add(this.light);

        if (!model.gltf) {
          LoadManager.loadGLTF(`${model.path}${model.name}.glb`, (gltf) => {
            model.gltf = gltf.scene;
            gltf.scene.scale.set(20, 20, 20);
            this.scene.add(gltf.scene);
            console.log(gltf);
          });
          return
        }
        this.scene.add(model.gltf);
      },

      destroy() {
        this.controls.enabled = false;
      },
    },
  }
</script>

<style lang="scss" scoped>
  .btn-container {
    position: absolute;
    top: 20px;
    right: 20px;
    list-style: none;
    margin: 0;
    padding: 0;

    button {
      margin-bottom: 8px;
      padding: 8px 16px;
    }
  }
</style>
