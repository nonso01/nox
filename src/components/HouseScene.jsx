import { useEffect, useRef } from "react";
import * as THREE from "three";
// import { GUI} from "three/addons/libs/lil-gui.module.min.js";
import Stats from "three/addons/libs/stats.module.js";

const BLACK = 0x000000;
const DARK = 0x222222;
const WHITE = 0xffffff;

export default function HouseScene() {
  const mountRef = useRef(null);
  // Use a ref to store the renderer to ensure access during cleanup
  const rendererRef = useRef(null);

  const stats = new Stats(); // stats.js for performance monitoring
  document.body.appendChild(stats.dom);

  useEffect(() => {
    // Skip if mountRef is not attached
    if (!mountRef.current) {
      console.warn("mountRef.current is null on mount");
      return;
    }

    // three.js Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(BLACK);

    // initialize camera with parent div's aspect ratio
    const parentWidth = mountRef.current?.clientWidth;
    const parentHeight = mountRef.current?.clientHeight;
    const camera = new THREE.PerspectiveCamera(
      75,
      parentWidth / parentHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

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
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

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

    // animation loop
    const animate = (time) => {
      stats.begin(); // begin stats calculations

      time *= 0.001; // convert to seconds
      requestAnimationFrame(animate);
      resizeRendererToDisplaySize(); // check resize every frame
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);

      stats.end(); // end calculations
    };
    requestAnimationFrame(animate);

    // cleanup
    return () => {
      if (mountRef.current && rendererRef.current?.domElement) {
        try {
          mountRef.current.removeChild(rendererRef.current.domElement);
        } catch (error) {
          console.warn("Error removing canvas:", error);
        }
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
        rendererRef.current = null;
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
