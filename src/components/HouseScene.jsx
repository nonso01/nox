import { useEffect, useRef } from "react";
import * as THREE from "three";
// import { GUI} from "three/addons/libs/lil-gui.module.min.js";
import Stats from "three/addons/libs/stats.module.js";

const BG_COLOR = 0x000000;

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
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(parentWidth, parentHeight); // Match parent div
    renderer.setPixelRatio(window.devicePixelRatio);
    rendererRef.current = renderer;

    // prevent multiple canvas appends
    if (mountRef.current.childElementCount === 0) {
      mountRef.current.appendChild(renderer.domElement);
    } else {
      console.warn("Canvas already exists, skipping append");
    }

    const geometry = new THREE.TorusKnotGeometry(2.5, 1, 100, 16);
    const material = new THREE.MeshNormalMaterial({
      wireframe: true,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // resize function
    const resizeRendererToDisplaySize = () => {
      const canvas = renderer.domElement;
      const px = Math.min(window.devicePixelRatio, 2);
      const width = Math.floor(mountRef.current.clientWidth * px);
      const height = Math.floor(mountRef.current.clientHeight * px);
      const needResize = canvas.width !== width || canvas.height !== height;
      if (needResize) {
        renderer.setSize(width, height, false); // false prevents internal CSS update
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
      return needResize;
    };

    window.addEventListener("resize", resizeRendererToDisplaySize); // resize

    // animation loop
    const animate = (time) => {
      stats.begin(); // begin stats calculations

      time *= 0.001; // convert to seconds
      requestAnimationFrame(animate);
      mesh.rotation.x += 0.01;
      mesh.rotation.y += 0.01;
      renderer.render(scene, camera);

      stats.end(); // end calculations
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
      <style jsx="true">
        {`
          .house-scene {
            height: 100%;

            canvas {
              display: block;
              width: 100% !important;
              height: 100% !important;
            }
          }
        `}
      </style>
    </>
  );
}
