<template>
  <div>
    <button class="btn" @click="logPosition">log position</button>
    <button class="btn" @click="addsky">Add skybox</button>
  </div>
</template>

<script>
  import * as THREE from 'three'
  import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
  import gsap from 'gsap';
  import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
  import { toRadian } from "../utils";
  import { TextureLoader } from "three/src/loaders/TextureLoader";

  export default {
    name: 'Map',
    components: {},
    data() {
      return {
        controls: {
          up: false,
          down: false,
          left: false,
          right: false,
        },
        character: null,
        light: null,
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
        window.addEventListener('keydown', this.keydown);
        window.addEventListener('keyup', this.keyup);


        this.camera.maxDistance = 5000;
        this.light = new THREE.HemisphereLight(0xffffff, 0x000000, 5);
        this.scene.add(this.light);
        // this.scene.add(this.lightHelper);


        gsap.to(this.camera.position, {
          x: 0.5,
          y: 250,
          z: -100,
          duration: 4,
        });
        // this.camera.position.set(1200, -250, 2000);
        /*
         this.controls = new OrbitControls( this.camera, this.$store.state.canvasRef);
         this.controls.update();*/
        this.addSkybox()
        this.addCharacter()
        this.addFloor()
        this.mainLoop()
      },
      mainLoop() {
        // this.controls.autoRotate = autoRotate;
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.mainLoop);
      },
      addSkybox() {
        const materialArray = this.createMaterialArray('purplenebula');
        const skyboxGeo = new THREE.BoxGeometry(10000, 10000, 10000);
        this.skybox = new THREE.Mesh(skyboxGeo, materialArray);

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
      addCharacter() {
        new GLTFLoader().load('./models/women-walking.glb', (gltf) => {
            gltf.scene.scale.set(0.2, 0.2, 0.2);
            gltf.scene.position.set(0, 0, 0);
            this.scene.add(gltf.scene);
            console.log(gltf);
            // const euler = new THREE.Euler( 0, toRadian(180), 0, 'XYZ' );
            // gltf.scene.children[0].position.applyEuler(euler);

            gsap.to(gltf.scene.children[0].rotation, {
              y: toRadian(180),
              duration: 3,
            });
            this.character = gltf.scene.children[0];
            this.character.add(this.camera);
            this.camera.lookAt(this.character.position.x, this.character.position.y, this.character.position.z + 20);
          },
          (xhr) => {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
          },
          (error) => {
            console.error('An error happened', error);
          }
        );
      },
      keydown(e) {
        switch (e.which) {
          case 37:
            this.character.position.x -=10;
            this.controls.left = true;
            break;
          case 38:
            this.character.position.z -= 10;
            this.controls.up = true;
            break;
          case 39:
            this.character.position.x += 10;
            this.controls.right = true;
            break;
          case 40:
            this.character.position.z += 10;
            this.controls.down = true;
            break;
          default:
            prevent = false;
        }
      },
      keyup(e) {
        switch (e.which) {
          case 37:
            this.controls.left = false;
            break;
          case 38:
            this.controls.up = false;
            break;
          case 39:
            this.controls.right = false;
            break;
          case 40:
            this.controls.down = false;
            break;
          default:
            prevent = false;
        }
      },
      createPathStrings(filename) {
        const basePath = "./assets/skybox/";
        const baseFilename = basePath + filename;
        const fileType = ".png";
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
