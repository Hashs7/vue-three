<template>
  <div>
  </div>
</template>

<script>
  import * as THREE from 'three'
  import { TextureLoader } from "three/src/loaders/TextureLoader";
  import { Character } from "../components/Character";
  import LoadManager from "../components/LoadManager";
  import * as dat from 'dat.gui';

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
        this.light = new THREE.HemisphereLight(0xffffff, 0x444444);
        this.scene.add(this.light);
         /*
         this.controls = new OrbitControls( this.camera, this.$store.state.canvasRef);
         this.controls.update();
         */
        this.addSkybox();
        const loader = LoadManager;
        loader.loadGLTF('./models/soldier.glb', (gltf) => {
          console.log(gltf);
          this.character = new Character(gltf, this.camera);
          this.scene.add(this.character.group);
          this.initLookAtObject();
          this.buildGUI();
        });
        loader.loadGLTF('./models/pilier.glb', (gltf) => {
          console.log('pilier', gltf);
          gltf.scene.scale.set(20, 20, 20);
          gltf.scene.position.set(10, 0, 10);
          this.scene.add(gltf.scene);
        });
        this.addFloor();
        this.mainLoop();
      },

      mainLoop() {
        // this.controls.autoRotate = autoRotate;
        if (this.character) {
          this.character.update()
        }
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.mainLoop);
      },


      addSkybox() {
        const materialArray = this.createMaterialArray('afterrain');
        const skyboxGeo = new THREE.BoxGeometry(2000, 2000, 2000);
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
          },
          (xhr) => {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
          },
          (error) => {
            console.error('An error happened', error);
          }
        );
      },

      createPathStrings(filename) {
        const basePath = "./assets/skybox/";
        const baseFilename = basePath + filename;
        const fileType = ".jpg";
        const sides = ["ft", "bk", "up", "dn", "rt", "lf"];
        const pathStings = sides.map(side => {
          return baseFilename + "_" + side + fileType;
        });

        return pathStings;
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

      destroy() {
        this.objs.forEach(obj => this.scene.remove(obj));
        this.scene.remove(this.targetObject);
        this.scene.remove(this.spotLight);
        this.scene.remove(this.spotLightHelper);
        this.scene.remove(this.light);
        this.scene.remove(this.lightHelper);
      },

      initLookAtObject() {
        const geometry = new THREE.BoxBufferGeometry( 10, 10, 10 );
        const material = new THREE.MeshBasicMaterial({ color: 0xce214a });

        this.lookAtObject = new THREE.Mesh( geometry, material );
        console.log('group', this.character.group);
        this.lookAtObject.position.set(this.character.group.position.x, this.character.group.position.y, this.character.group.position.z);
        this.camera.lookAt(this.lookAtObject.position.x, this.lookAtObject.position.y, this.lookAtObject.position.z);
        this.scene.add(this.lookAtObject);
      },

      buildGUI() {
        const gui = new dat.GUI();
        const folderPosition = gui.addFolder('Camera position');
        const folderLookAt = gui.addFolder('Camera look at');
        const paramsPosition = {
          x: this.camera.position.x,
          y: this.camera.position.y,
          z: this.camera.position.z,
        };
        const paramsLookAt = {
          x: this.lookAtObject.position.x,
          y: this.lookAtObject.position.y,
          z: this.lookAtObject.position.z,
        };
        folderPosition.add(paramsPosition, 'x', -1000, 1000).onChange(() => this.updateCamera(paramsPosition));
        folderPosition.add(paramsPosition, 'y', -1000, 1000).onChange(() => this.updateCamera(paramsPosition));
        folderPosition.add(paramsPosition, 'z', -1000, 1000).onChange(() => this.updateCamera(paramsPosition));
        folderPosition.open();

        folderLookAt.add(paramsLookAt, 'x', -1000, 1000).onChange(() => this.updateLookAt(paramsLookAt));
        folderLookAt.add(paramsLookAt, 'y', -1000, 1000).onChange(() => this.updateLookAt(paramsLookAt));
        folderLookAt.add(paramsLookAt, 'z', -1000, 1000).onChange(() => this.updateLookAt(paramsLookAt));
        folderLookAt.open();
      },

      updateCamera(params) {
        this.camera.position.set(params.x, params.y, params.z);
      },

      updateLookAt(params) {
        this.lookAtObject.position.set(params.x, params.y, params.z);
        this.camera.lookAt(
          this.lookAtObject.position.x + this.character.group.position.x,
          this.lookAtObject.position.y + this.character.group.position.y,
          this.lookAtObject.position.z + this.character.group.position.z,
        );
      },
    },
  }
</script>

<style scoped>
  .btn {
    position: absolute;
    top: 16px;
    right: 32px;
    padding: 10px 20px;
  }
</style>
