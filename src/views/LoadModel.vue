<template>
  <div>
  </div>
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
        lookAtObject: null,
        character: null,
        mixer: null,
        animations: null,
        light: null,
        group: null,
        skybox: null,
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
        this.$store.commit('changeScene', {
          scene: new THREE.Scene(),
          camera: this.camera,
        });
        this.light = new THREE.HemisphereLight(0xffffff, 0x444444);
        this.scene.add(this.light);
        this.controls = new OrbitControls(this.camera, this.$store.state.canvasRef);
        gsap.to(this.camera.position, {
          x: 100,
          y: 200,
          z: 100,
          duration: 2,
        });

        LoadManager.loadGLTF('./models/pilier.glb', (gltf) => {
          console.log('pilier', gltf);
          gltf.scene.scale.set(20, 20, 20);
          gltf.scene.position.set(10, 0, 10);
          this.scene.add(gltf.scene);
        });

        this.mainLoop();
      },

      mainLoop() {
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.mainLoop);
      },

      destroy() {
        this.controls.enabled = false;
        this.scene.remove(this.targetObject);
      },
    },
  }
</script>

