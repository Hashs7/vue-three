import * as THREE from 'three'
import gsap from 'gsap';
import { toRadian } from "../utils";
import { InputManager } from "./InputManager";


export class Character {
  camera;
  mixer;
  walkAnimation;
  group;
  character;

  constructor(gltf, camera) {
    const inputManager = new InputManager();
    inputManager.setInputReceiver(this);
    this.camera = camera;
    gltf.scene.scale.set(0.2, 0.2, 0.2);
    gltf.scene.position.set(0, 0, 0);
    this.walkAnimation = gltf.animations[1];
    this.character = gltf.scene.children[0];
    this.camera.position.set(0.5, 250, -100);
    this.group = new THREE.Group();
    this.group.add(this.character);
    this.group.add(this.camera);
    this.group.position.set(0,0,0);
    this.character.position.set(0,10,0);
    this.camera.lookAt(this.group.position.x, this.group.position.y, this.group.position.z + 400);
  }

  handleKeyboardEvent(event, code, pressed) {
    if(!pressed) return;
    switch (code) {
      case 38:
        // Up key
        gsap.to(this.character.rotation, {
          y: toRadian(0),
          duration: .3,
        });
        this.group.position.z += 10;
        break;

      case 40:
        // down key
        gsap.to(this.character.rotation, {
          y: toRadian(180),
          duration: .3,
        });
        this.group.position.z -= 10;
        break;

      case 37:
        // Left key
        gsap.to(this.character.rotation, {
          y: toRadian(90),
          duration: 0.3,
        });
        this.group.position.x +=10;
        break;

      case 39:
        // Right key
        gsap.to(this.character.rotation, {
          y: toRadian(-90),
          duration: 0.3,
        });
        this.group.position.x -= 10;
        break;
      default:
        break;
    }
    this.camera.lookAt(this.group.position.x, this.group.position.y, this.group.position.z + 400);
  }

  playAnimation() {
    this.mixer = new THREE.AnimationMixer(this.character);
    const action = this.mixer.clipAction(this.walkAnimation);
    console.log('play', action);
    action.play();
  }
}