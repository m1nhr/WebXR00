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

  // adding the 3D Model

  let koalaModel: Object3D;

  const gltfLoader = new GLTFLoader();

  gltfLoader.load("../assets/models/koala.glb", (gltf: GLTF) => {koalaModel = gltf.scene.children[0];});
  const planeMarker = createPlaneMarker();

  // adding ambient light
  const ambientLight = new AmbientLight(0xffffff, 1.0);
  scene.add(ambientLight);
  // adding WebXR controller

  const controller = renderer.xr.getController(0);
  scene.add(controller);
  // adding the event
  controller.addEventListener("select", onSelect);

  function onSelect() {
    if (planeMarker.visible) {
        const model = koalaModel.clone();
        model.position.setFromMatrixPosition(planeMarker.matrix);

        model.rotation.y = Math.random() * (Math.PI * 2);
        model.visible = true;
        scene.add(model)
    }
  }
  scene.add(planeMarker);


  const renderLoop = (timestamp: number, frame ?:XRFrame) => {

    if (renderer.xr.isPresenting) {
        if (frame) {
            handleXRHitTest(renderer, frame, (HitPoseTransformed: Float32Array) => {
                if (HitPoseTransformed) {
                    planeMarker.visible = true;
                    planeMarker.matrix.fromArray(HitPoseTransformed);
                }
            }, () => {planeMarker.visible = false;})

        }
        renderer.render(scene, camera);
    }
  }
  renderer.setAnimationLoop(renderLoop);
};
