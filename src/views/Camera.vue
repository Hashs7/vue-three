<template>
  <div>
  </div>
</template>

<script>
  import * as THREE from 'three';
  // import  { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
  import gsap from 'gsap';

  export default {
    name: 'Test',
    data() {
      return {
        controls: null,
        plane: null,
        cube: null,
        step: 2,
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
      this.destroy();
    },
    methods: {
      init() {
        this.$store.commit('changeScene', {
          scene: new THREE.Scene(),
          camera: new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 8000),
        });
        this.scene.background = new THREE.Color(0x111111);

        this.camera.position.set(0, 5, 20);

        /*this.controls = new OrbitControls(
         this.camera,
         this.$store.state.canvasRef,
         );
         this.controls.update();*/

        // Ajouter un plan
        this.createPlane(10, 30, 0xaa0000);
        // Ajouter un cube
        this.createCube(1, 1, 1, 0, 0.5, 0, 0x00aa00);
        // Ajouter des controls sur le cube
        // Bloquer les bords du plan
        document.addEventListener('keydown', event => this.move(event, this.cube));
        // Faire des spotlights
        // Faire balayer les spotlights
        // Détecter le cube dans un spotlight
        // Ajouter du son spatialisé

        this.mainLoop();
      },
      mainLoop() {
        //this.controls.update();
        this.renderer.render(this.scene, this.camera);

        requestAnimationFrame(this.mainLoop);
      },
      createPlane(width, height, color) {
        let geometry = new THREE.PlaneGeometry(width, height);
        let material = new THREE.MeshBasicMaterial({
          color,
          side: THREE.DoubleSide
        });
        this.plane = new THREE.Mesh(geometry, material);
        this.plane.rotateX(Math.PI / 2);
        this.scene.add(this.plane);
      },
      createCube(width, height, depth, x, y, z, color) {
        let geometry = new THREE.BoxGeometry(width, height, depth);
        let material = new THREE.MeshBasicMaterial({
          color,
        });
        this.cube = new THREE.Mesh(geometry, material);
        this.cube.position.set(x, y, z);
        this.scene.add(this.cube)
      },
      destroy() {
        this.scene.remove(this.plane);
        this.scene.remove(this.cube);
      },
      logPosition() {
        //console.log(this.controls);
      },
      move(event, object) {
        event.preventDefault();
        switch (event.code) {
          case 'ArrowUp' :
            //object.position.z -= object.position.z >= -14 ? this.step : 0;
            gsap.to(object.position, {
              z: object.position.z - this.step,
            });
            break;
          case 'ArrowDown' :
            //object.position.z += object.position.z <= 14 ? this.step : 0;
            gsap.to(object.position, {
              z: object.position.z + this.step,
            });
            break;
          case 'ArrowLeft' :
            //object.position.x -= object.position.x >= -4 ? this.step : 0;
            gsap.to(object.position, {
              x: object.position.x - this.step,
            });
            break;
          case 'ArrowRight' :
            //object.position.x += object.position.x <= 4 ? this.step : 0;
            gsap.to(object.position, {
              x: object.position.x + this.step,
            });
            break;
        }
      }
    }
  }
</script>
