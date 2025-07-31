import { useEffect, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  Stats,
  useHelper,
  Environment,
} from "@react-three/drei";
import * as THREE from "three";
import { DirectionalLightHelper } from "three";

const BG_COLOR = 0x222222;
const log = console.log;

function SceneContent() {
  const { camera } = useThree();
  const gltf = useGLTF("/3d-models/fornitures-house.glb", true); // Draco enabled
  const modelRef = useRef();
  const dirLightRef = useRef();

  // Attach helper to the directional light
  useHelper(dirLightRef, DirectionalLightHelper, 5, 0xff0000);

  useEffect(() => {
    if (modelRef.current) {
      const box = new THREE.Box3().setFromObject(modelRef.current);
      const boxSize = box.getSize(new THREE.Vector3());
      const boxCenter = box.getCenter(new THREE.Vector3());
      const maxDim = Math.max(boxSize.x, boxSize.y, boxSize.z);
      const fov = camera.fov * (Math.PI / 180);
      let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
      cameraZ *= 1.5;
      camera.position.set(
        boxCenter.x,
        boxCenter.y + maxDim / 2,
        boxCenter.z + cameraZ
      );
      camera.lookAt(boxCenter);
    }
  }, [camera, gltf]);

  useEffect(() => {
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [gltf]);

  // display object names on click
  function handlePointerDown(event) {
    event.stopPropagation();
    // We'll use event.point and event.object for the clicked mesh
    if (event.object) {
      const objectName = event.object.name || "Unnamed Object";
      log(`Clicked object: ${objectName}`);
      // log(event.object);
    }
  }

  return (
    <>
      <directionalLight
        ref={dirLightRef}
        position={[0, 10, 10]}
        intensity={2}
        color={0xffffff}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.1}
        shadow-camera-far={50}
        shadow-bias={-0.0001}
        shadow-normalBias={0.05}
      />
      {/* HDR for ambientLights */}
      <Environment files={"/hdr/brown_photostudio_02_1k.hdr"} />
      <primitive
        object={gltf.scene}
        ref={modelRef}
        onPointerDown={handlePointerDown}
      />
      <OrbitControls
        enableDamping
        minDistance={1}
        maxDistance={5.5}
        maxPolarAngle={Math.PI / 2}
        target={[0, 0, 0]} // Updated in useEffect
      />
    </>
  );
}

export default function HouseScene() {
  const containerRef = useRef(null);

  return (
    <div className="house-scene" ref={containerRef}>
      <Canvas
        shadows
        camera={{ fov: 75, near: 0.1, far: 1000 }}
        gl={{ antialias: true }}
        onCreated={({ gl }) => {
          gl.setClearColor(BG_COLOR);
          gl.setPixelRatio(window.devicePixelRatio);
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }}
      >
        <SceneContent />
        <Stats />
      </Canvas>
    </div>
  );
}
