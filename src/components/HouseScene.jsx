import { useEffect, useRef } from "react";
import * as THREE from "three";
// import { GUI} from "three/addons/libs/lil-gui.module.min.js";

export default function HouseScene() {
  const mountRef = useRef(null);
  // Use a ref to store the renderer to ensure access during cleanup
  const rendererRef = useRef(null);

  useEffect(() => {
    // Skip if mountRef is not attached
    if (!mountRef.current) {
      console.warn("mountRef.current is null on mount");
      return;
    }

    // Three.js Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // Initialize camera with parent div's aspect ratio
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

    // Prevent multiple canvas appends
    if (mountRef.current.childElementCount === 0) {
      mountRef.current.appendChild(renderer.domElement);
    } else {
      console.warn("Canvas already exists, skipping append");
    }

    const geometry = new THREE.TorusKnotGeometry(4, 1, 100, 16);
    const material = new THREE.MeshNormalMaterial({
        wireframe: true,
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);


    // Resize function
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

    // Animation loop
    const animate = (time) => {
      time *= 0.001; // Convert to seconds
      requestAnimationFrame(animate);
      resizeRendererToDisplaySize(); // Check resize every frame
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    requestAnimationFrame(animate);

    // Cleanup
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
