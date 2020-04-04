import * as THREE from 'three'
import gsap from 'gsap';
import { toRadian } from "../utils";
import { InputManager } from "./InputManager";
import * as dat from 'dat.gui';

export class Character {
  camera;
  mixer;
  actions;
  isWalking;
  idleAction;
  walkAction;
  group;
  character;
  lookAtObject;

  constructor(gltf, camera) {
    const inputManager = new InputManager();
    inputManager.setInputReceiver(this);

    gltf.scene.scale.set(0.2, 0.2, 0.2);
    gltf.scene.position.set(0, 0, 0);
    this.character = gltf.scene.children[0];
    console.log(this.character);
    this.camera = camera;
    this.camera.position.set(0, 250, -150);

    this.group = new THREE.Group();
    this.group.add(this.character);
    this.group.add(this.camera);
    this.group.position.set(0,0,0);
    this.character.position.set(0,10,0);
    this.character.scale.set(1,1,1);
    this.mixer = new THREE.AnimationMixer(this.character);
    this.setAnimations(gltf.animations);
    this.activateAllActions();
    this.lookAtObject = new THREE.Vector3(this.group.position.x, this.group.position.y, this.group.position.z)
    this.camera.lookAt(this.lookAtObject.x, this.lookAtObject.y, this.lookAtObject.z);
    this.buildGUI();
  }

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
      x: this.lookAtObject.x,
      y: this.lookAtObject.y,
      z: this.lookAtObject.z,
    };
    folderPosition.add(paramsPosition, 'x', -1000, 1000).onChange(() => this.updateCamera(paramsPosition));
    folderPosition.add(paramsPosition, 'y', -1000, 1000).onChange(() => this.updateCamera(paramsPosition));
    folderPosition.add(paramsPosition, 'z', -1000, 1000).onChange(() => this.updateCamera(paramsPosition));
    folderPosition.open();

    folderLookAt.add(paramsLookAt, 'x', -1000, 1000).onChange(() => this.updateLookAt(paramsLookAt));
    folderLookAt.add(paramsLookAt, 'y', -1000, 1000).onChange(() => this.updateLookAt(paramsLookAt));
    folderLookAt.add(paramsLookAt, 'z', -1000, 1000).onChange(() => this.updateLookAt(paramsLookAt));
    folderLookAt.open();
  }

  updateCamera(params) {
    this.camera.position.set(params.x, params.y, params.z)
  }

  updateLookAt(params) {
    this.lookAtObject = { ...params };
    this.camera.lookAt(
      this.lookAtObject.x + this.group.position.x,
      this.lookAtObject.y + this.group.position.y,
      this.lookAtObject.z + this.group.position.z,
    );
  }

  handleKeyboardEvent(event, code, pressed) {
    if (!pressed) {
      this.isWalking = false;
      this.prepareCrossFade(this.walkAction, this.idleAction);
      return
    }

    switch (code) {
      case 38:
        // Up key
        gsap.to(this.character.rotation, {
          z: toRadian(180),
          duration: .3,
        });
        this.group.position.z += 10;
        this.setWalking();
        break;

      case 40:
        // down key
        gsap.to(this.character.rotation, {
          z: toRadian(0),
          duration: .3,
        });
        this.group.position.z -= 10;
        this.setWalking();
        break;

      case 37:
        // Left key
        gsap.to(this.character.rotation, {
          z: toRadian(-90),
          duration: 0.3,
        });
        this.group.position.x +=10;
        this.setWalking();
        break;

      case 39:
        // Right key
        gsap.to(this.character.rotation, {
          z: toRadian(90),
          duration: 0.3,
        });
        this.group.position.x -= 10;
        this.setWalking();
        break;
      default:
        break;
    }

    this.camera.lookAt(
      this.lookAtObject.x + this.group.position.x,
      this.lookAtObject.y + this.group.position.y,
      this.lookAtObject.z + this.group.position.z,
    );
  }

  update() {
    this.mixer.update( 0.01 );
  }

  setWalking() {
    if (this.isWalking) return;
    this.prepareCrossFade(this.idleAction, this.walkAction);
    this.isWalking = true;
  }

  setAnimations(animations) {
    this.idleAction = this.mixer.clipAction( animations.find(act => act.name === 'Idle') );
    this.walkAction = this.mixer.clipAction( animations.find(act => act.name === 'Walk') );
    this.actions = [this.idleAction, this.walkAction];
  }

  prepareCrossFade( startAction, endAction, duration = 0.3 ) {
    // Switch default / custom crossfade duration (according to the user's choice)
    // const duration = this.setCrossFadeDuration( defaultDuration );
    this.unPauseAllActions();
    this.executeCrossFade( startAction, endAction, duration );

    // If the current action is 'idle' (duration 4 sec), execute the crossfade immediately;
    // else wait until the current action has finished its current loop// debugger;

/*    if ( startAction === this.idleAction ) {
      this.executeCrossFade( startAction, endAction, duration );
    } else {
      console.log('synch');
      this.synchronizeCrossFade( startAction, endAction, duration );
    }*/
  }


  synchronizeCrossFade( startAction, endAction, duration ) {
    const onLoopFinished = ( event ) => {
      if ( event.action === startAction ) {
        this.mixer.removeEventListener( 'loop', onLoopFinished );
        this.executeCrossFade( startAction, endAction, duration );
      }
    };
    this.mixer.addEventListener( 'loop', onLoopFinished );
  }

  executeCrossFade( startAction, endAction, duration ) {
    // Not only the start action, but also the end action must get a weight of 1 before fading
    // (concerning the start action this is already guaranteed in this place)
    this.setWeight( endAction, 1 );
    endAction.time = 0;

    // Crossfade with warping - you can also try without warping by setting the third parameter to false
    startAction.crossFadeTo( endAction, duration, true );
  }

  setWeight( action, weight ) {
    action.enabled = true;
    action.setEffectiveTimeScale(1);
    action.setEffectiveWeight( weight );
  }

  activateAllActions() {
    this.setWeight( this.idleAction, 1);
    this.setWeight( this.walkAction, 0 );
    this.actions.forEach(( action ) => action.play());
  }

  pauseContinue() {
    if ( this.idleAction.paused ) {
      this.unPauseAllActions();
      return
    }
    this.pauseAllActions();
  }

  pauseAllActions() {
    this.actions.forEach(( action ) => action.paused = true);
  }

  unPauseAllActions() {
    this.actions.forEach(( action ) => action.paused = false);
  }
}