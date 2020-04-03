<template>
  <div class="input-container">
    <input type="text" v-model="text" class="input">
    <button class="btn" @click="addWord">Drop word</button>
  </div>
</template>

<script>
  import * as THREE from 'three'
  import { TextureLoader } from "three/src/loaders/TextureLoader";
  import { Character } from "../components/Character";
  import LoadManager from "../components/LoadManager";
  import NWordScene from "../components/NWordScene";
  import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
  import Stats from "stats.js";

  export default {
    name: 'Word',
    components: {},
    data() {
      return {
        stats: null,
        text: null,
        scene: null,
        camera: null,
        factory: null,
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
      renderer() {
        return this.$store.state.renderer;
      }
    },
    methods: {
      init() {
        this.stats = new Stats();
        this.stats.showPanel( 0 );
        document.body.appendChild( this.stats.dom );
        const wordScene = new NWordScene();
        // this.$store.commit('changeScene', wordScene);
        console.log('wordScene', wordScene);
        this.scene = wordScene.scene;
        this.camera = wordScene.camera;
        this.world = wordScene.object;
        this.factory = wordScene.factory;

        this.controls = new OrbitControls(this.camera, this.$store.state.canvasRef);
        this.controls.update();

        this.renderer.setClearColor(0x202533);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.mainLoop();
      },
      mainLoop() {
        this.stats.begin();
        if (this.world) {
          this.world.update();
        }
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
        this.stats.end();
        requestAnimationFrame(this.mainLoop);
      },
      addWord() {
        console.log(this.factory);
        this.factory.addWord(this.text);
      },
      addFloor() {
        new TextureLoader().load('./assets/textures/FloorsCheckerboard_S_Diffuse.jpg', (texture) => {
            const geometry = new THREE.BoxGeometry(500, 1, 500);
            const material = new THREE.MeshBasicMaterial({ map: texture });
            const plane = new THREE.Mesh(geometry, material);
            // plane.position.y = -1;
            this.scene.add(plane);
          },
          (xhr) => {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
          },
          (error) => {
            console.error('An error happened', error);
          }
        );
      },
      destroy() {
        this.objs.forEach(obj => this.scene.remove(obj));
        this.scene.remove(this.targetObject);
        this.scene.remove(this.spotLight);
        this.scene.remove(this.spotLightHelper);
        this.scene.remove(this.light);
        this.scene.remove(this.lightHelper);
      },
    },
  }
</script>

<style scoped>
  .input-container {
    position: absolute;
    top: 16px;
    right: 32px;
  }
  .input {
    display: inline-block;
    border: none;
    padding: 10px 20px;
  }
  .btn {
    display: inline-block;
    padding: 10px 20px;
  }
</style>
