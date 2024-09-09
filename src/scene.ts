import { createPlaneMarker } from "./objects/PlaneMarker";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { handleXRHitTest } from "./utils/hitTest";

import {
  AmbientLight,
  BoxBufferGeometry,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  XRFrame,
} from "three";

export function createScene(renderer: WebGLRenderer) {
  // TODO: Create a scene and build a WebXR app!
  const scene = new Scene();

  const camera = new PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.02,
    20,
  );

  const boxGeometry = new BoxBufferGeometry(1, 1, 1);
  const boxMaterial = new MeshBasicMaterial({color: 0xff0000});
  const box = new Mesh(boxGeometry, boxMaterial);
  box.position.z = -3;

  scene.add(box);
  
  const renderLoop = (timestamp: number, frame ?:XRFrame) => {
    box.rotation.y += 0.03;
    box.rotation.x += 0.03;

    if (renderer.xr.isPresenting)
        renderer.render(scene, camera);
  }

  renderer.setAnimationLoop(renderLoop);
};
