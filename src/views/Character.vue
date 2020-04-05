<template>
  <div>
  </div>
</template>

<script>
  import * as THREE from 'three'
  import { TextureLoader } from "three/src/loaders/TextureLoader";
  import { Character } from "../components/Character";
  import LoadManager from "../components/LoadManager";

  export default {
    name: 'Character',
    data() {
      return {
        gui: null,
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
      this.character.destroy();
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
        this.$store.commit('setLoader', true);
        this.$store.commit('changeScene', {
          scene: new THREE.Scene(),
          camera: this.camera,
        });
        this.light = new THREE.HemisphereLight(0xffffff, 0x444444);
        this.scene.add(this.light);
        this.addSkybox();
        LoadManager.loadGLTF('./assets/models/soldier.glb', (gltf) => {
          this.character = new Character(gltf, this.camera);
          // this.initLookAtObject();
          this.scene.add(this.character.group);
        });
        this.addFloor();
        this.mainLoop();
      },

      initLookAtObject() {
        this.lookAtObject = new THREE.Vector3(this.character.group.position.x, this.character.group.position.y,  this.character.group.position.z);
        this.camera.lookAt(this.lookAtObject.x, this.lookAtObject.y, this.lookAtObject.z);
      },

      mainLoop() {
        if (this.character) {
          this.character.update();
        }
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.mainLoop);
      },

      addSkybox() {
        const materialArray = this.createMaterialArray('afterrain');
        const skyboxGeo = new THREE.BoxGeometry(8000, 8000, 8000);
        this.skybox = new THREE.Mesh(skyboxGeo, materialArray);
        this.addsky()
      },

      addsky() {
        this.scene.add(this.skybox);
        console.log(this.skybox);
      },

      addFloor() {
        new TextureLoader().load('./assets/textures/FloorsCheckerboard_S_Diffuse.jpg', (texture) => {
            const geometry = new THREE.BoxGeometry(500, 1, 500);
            const material = new THREE.MeshBasicMaterial({ map: texture });
            const plane = new THREE.Mesh(geometry, material);
            // plane.position.y = -1;
            this.scene.add(plane);
          });
      },

      createPathStrings(filename) {
        const basePath = "./assets/skybox/";
        const baseFilename = basePath + filename;
        const fileType = ".jpg";
        const sides = ["ft", "bk", "up", "dn", "rt", "lf"];
        return sides.map(side => baseFilename + "_" + side + fileType);
      },

      createMaterialArray(filename) {
        console.log(filename);
        const skyboxImagepaths = this.createPathStrings(filename);
        const materialArray = skyboxImagepaths.map(image => {
          let texture = new THREE.TextureLoader().load(image);
          return new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
        });
        return materialArray;
      },
    },
  }
</script>

