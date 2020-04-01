import Vue from 'vue'
import Vuex from 'vuex'
import * as THREE from 'three'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    camera: null,
    renderer: null,
    canvasRef: null,
  },
  mutations: {
    initScene(state, canvas) {
      console.log('init');
      state.canvasRef = canvas;
      state.scene = new THREE.Scene();
      state.scene.background = new THREE.Color(0x000000);
      // console.log(window.innerWidth, window.innerHeight);
      state.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 8000);
      state.camera.position.set(0, 0, 20);
      state.renderer = new THREE.WebGLRenderer({ canvas });
      // dunno
      state.renderer.setPixelRatio(window.devicePixelRatio);
    }
  },
  actions: {
  },
  modules: {
  }
})
