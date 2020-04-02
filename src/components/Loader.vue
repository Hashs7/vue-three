<template>
  <transition>
    <div v-if="isLoading" class="modal">
      <div class="loader">
        <div class="loader__container">
          <span class="loader__progress" :style="`width: ${percent}%`"></span>
        </div>
        <span class="loader__percent">{{percent}}%</span>
      </div>
    </div>
  </transition>
</template>

<script>
  import LoadManager from "./LoadManager";

  export default {
    name: "Loader",
    data() {
      return {
        isLoading: true,
        percent: 0,
      }
    },
    mounted() {
      const loaderInstance = LoadManager;
      console.log(LoadManager);
      loaderInstance.setReceiver(this);
    },
    methods: {
      progressHandler(percent) {
        this.percent = percent;
        console.log(percent,' percent');
        if (percent !== 100) return;
        setTimeout(() => this.isLoading = false, 200)
      }
    },
  }
</script>

<style scoped>
  .modal {
    z-index: 1000;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: black;
  }
  .loader {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    width: 200px;
    height: 30px;
  }
  .loader__percent {
    position: relative;
    z-index: 10000;
    display: block;
    margin-top: 8px;
    text-align: center;
    color: white;
  }
  .loader__container {
    height: 10px;
    background-color: gray;
  }
  .loader__progress {
    display: block;
    height: 100%;
    background-color: #fff;
    transition: width .2s ease-in-out;
  }
</style>