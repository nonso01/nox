// convert to r3f version
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import Stats from "three/addons/libs/stats.module.js";

const BG_COLOR = 0x222222;
const log = console.log;

export default function HouseScene() {
  // Use a ref to store the renderer to ensure access during cleanup
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    // skip if mountRef is not attached
    if (!mountRef.current) {
      console.warn("mountRef.current is null on mount");
      return;
    }

    const stats = new Stats();
    statsRef.current = stats;
    document.body.appendChild(stats.dom);

    // three.js Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(BG_COLOR);

    // initialize camera with parent div's aspect ratio
    const parentWidth = mountRef.current?.clientWidth;
    const parentHeight = mountRef.current?.clientHeight;
    const camera = new THREE.PerspectiveCamera(
      75,
      parentWidth / parentHeight,
      0.1,
      1000
    );
    // camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(parentWidth, parentHeight); // Match parent div
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // prevent multiple canvas appends
    if (mountRef.current.childElementCount === 0) {
      mountRef.current.appendChild(renderer.domElement);
    } else {
      console.warn("Canvas already exists, skipping append");
    }

    // Lights

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(0, 10, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize = new THREE.Vector2(2048, 2048);
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.bias = -0.0001;
    directionalLight.shadow.normalBias = 0.05;
    scene.add(directionalLight);

    //light helper
    const lightHelper = new THREE.DirectionalLightHelper(
      directionalLight,
      5,
      0xff0000
    );
    scene.add(lightHelper);

    // controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    // controls.dampingFactor = 0.1;
    controls.minDistance = 1;
    controls.maxDistance = 5.5;
    controls.maxPolarAngle = Math.PI / 2;

    camera.position.set(0, 10, 10);
    controls.update();

    // Load HDR environment map
    const rgbeLoader = new RGBELoader();
    rgbeLoader.load(
      "/hdr/brown_photostudio_02_1k.hdr",
      (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        // scene.background = texture
        scene.environment = texture;
      },
      undefined,
      (error) => {
        log("Error loading HDR texture:", error);
      }
    );

    // load gltf model
    const loadingManager = new THREE.LoadingManager();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(
      "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/libs/draco/"
    );
    dracoLoader.setDecoderConfig({ type: "js" });
    const gltfLoader = new GLTFLoader(loadingManager);
    gltfLoader.setDRACOLoader(dracoLoader);
    const url = "/3d-models/fornitures-house.glb";

    gltfLoader.load(
      url,
      (gltf) => {
        const root = gltf.scene;
        root.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        scene.add(root);
        // Compute bounding box and center camera
        const box = new THREE.Box3().setFromObject(root);
        log(box);
        const boxSize = box.getSize(new THREE.Vector3());
        const boxCenter = box.getCenter(new THREE.Vector3());
        const maxDim = Math.max(boxSize.x, boxSize.y, boxSize.z);
        const fov = camera.fov * (Math.PI / 180);
        let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
        cameraZ *= 1.5; // Zoom out slightly for better framing
        camera.position.set(
          boxCenter.x,
          boxCenter.y + maxDim / 2,
          boxCenter.z + cameraZ
        );
        controls.target.set(boxCenter.x, boxCenter.y, boxCenter.z);
        controls.update();
      },
      (xhr) => {
        log(xhr.loaded / xhr.total);
      },
      (error) => {
        log("Error loading GLTF model:", error);
      }
    );

    // resize function
    const resizeRendererToDisplaySize = () => {
      const canvas = renderer.domElement;
      const width = Math.floor(mountRef.current.clientWidth);
      const height = Math.floor(mountRef.current.clientHeight);
      const needResize = canvas.width !== width || canvas.height !== height;
      if (needResize) {
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
      return needResize;
    };

    // window.addEventListener("resize", resizeRendererToDisplaySize); // resize

    // animation loop
    const animate = (time) => {
      stats.begin();

      requestAnimationFrame(animate);
      resizeRendererToDisplaySize();
      renderer.render(scene, camera);

      stats.end();
    };
    requestAnimationFrame(animate);

    // cleanup
    return () => {
      if (mountRef.current && rendererRef.current?.domElement) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
        rendererRef.current = null;
      }
      if (statsRef.current && statsRef.current.dom.parentNode) {
        statsRef.current.dom.parentNode.removeChild(statsRef.current.dom);
      }
    };
  }, []);

  return (
    <>
      <div className="house-scene" ref={mountRef} />
    </>
  );
}
