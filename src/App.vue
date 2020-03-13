<template>
  <div id="app">
    <nav class="router">
      <router-link to="/" class="router__link">Home</router-link>
      <router-link to="/lights" class="router__link">Lights</router-link>
    </nav>
    <router-view/>
    <canvas ref="canvas" />
  </div>
</template>

<script>
  export default {
    name: 'App',
    data() {
      return {
        width: 0,
        height: 0,
      }
    },
    computed: {
      camera() {
        return this.$store.state.camera;
      },
      renderer() {
        return this.$store.state.renderer;
      },
    },
    mounted() {
      this.$store.commit('initScene', this.$refs.canvas);
      this.resize();
    },
    methods: {
      resize() {
        this.width = this.$refs.canvas.clientWidth;
        this.height = this.$refs.canvas.clientHeight;
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.width, this.height, false);
      },
    },
  }
</script>

<style lang="scss">
  body {
    margin: 0;
    font-family: sans-serif;
  }
  canvas {
    display: block;
    width: 100vw;
    height: 100vh;
  }
  .router {
    position: absolute;
    top: 16px;
    left: 32px;
  }
  .router__link {
    color: white;
    font-size: 20px;
    text-decoration: none;

    &:not(:last-child) {
      margin-right: 32px;
    }

    &.router-link-exact-active {
      text-decoration: underline;
    }
  }
</style>
