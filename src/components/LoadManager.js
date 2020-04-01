import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export class LoadManager {
  printProgress = false;
  gltfLoader;
  loadingTracker = {};

  constructor() {
    this.gltfLoader = new GLTFLoader();
  }

  loadGLTF(path, onLoadingFinished) {
    this.startLoading(path);
    this.gltfLoader.load(path,
    (gltf) => {
      onLoadingFinished(gltf);
      this.doneLoading(path);
    },
    (xhr) => {
      if (!this.printProgress) return;
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    (error) => console.error(error));
  }

  startLoading(path) {
    this.loadingTracker[path] = true;
    // Trigger loader
    // document.getElementById('loader').style.display = 'flex';
    // document.getElementById('ui-container').style.display = 'none';
  }

  doneLoading(path) {
    this.loadingTracker[path] = false;

    let done = true;
/*    for (const key in this.loadingTracker) {
      if (this.loadingTracker.hasOwnProperty(key)) {
        const stillLoading = this.loadingTracker[key];
        if (stillLoading) done = false;
      }
    }*/

    if (done) {
      // Hide loader
      // document.getElementById('loader').style.display = 'none';
      // document.getElementById('ui-container').style.display = 'block';
    }
  }
}