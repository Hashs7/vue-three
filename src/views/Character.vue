<template>
  <div>
    <button class="btn" @click="playAnimation">Play animation</button>
  </div>
</template>

<script>
  import * as THREE from 'three'
  import { TextureLoader } from "three/src/loaders/TextureLoader";
  import { Character } from "../components/Character";
  import LoadManager from "../components/LoadManager";

  export default {
    name: 'Map',
    components: {},
    data() {
      return {
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
        // this.camera.maxDistance = 5000;
        this.light = new THREE.HemisphereLight(0xffffff, 0x444444);
        this.scene.add(this.light);
        // this.scene.add(this.lightHelper);


        // this.camera.position.set(1200, -250, 2000);
        /*
         this.controls = new OrbitControls( this.camera, this.$store.state.canvasRef);
         this.controls.update();*/
        this.addSkybox();
        const loader = LoadManager;
        loader.loadGLTF('./models/soldier.glb', (gltf) => {
          this.character = new Character(gltf, this.camera);
          this.scene.add(this.character.group);
        })
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
      playAnimation() {
        this.character.playAnimation()
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
      logPosition() {
        console.log(this.camera);
      },
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
