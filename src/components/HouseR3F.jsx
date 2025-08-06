import { useRef, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  useProgress,
  Html,
  Environment,
  Stats,
} from "@react-three/drei";
import * as THREE from "three";
import { Spinner } from "./Svgs";

const log = console.log;
const BG_COLOR = 0x222222;

function Loader() {
  const { progress } = useProgress();
  // const v = `${progress.toFixed(1)} % loaded`;
  return (
    <Html center>
      <Spinner />
    </Html>
  );
}

function Ground({ positionY = 0 }) {
  return (
    <mesh receiveShadow rotation-x={-Math.PI / 2} position-y={positionY}>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color={BG_COLOR} />
    </mesh>
  );
}

function HouseModel({ url }) {
  const { scene } = useGLTF(url);
  const ref = useRef();
  const { camera, controls } = useThree();

  // display object names on click
  function handlePointerDown(event) {
    event.stopPropagation();
    if (event.object) {
      const objectName = event.object.name || "Unnamed Object";
      log(`Clicked object: ${objectName}`);
    }
  }

  useEffect(() => {
    let box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);

    let fov = camera.fov * (Math.PI / 180);
    let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2)) * 1.5;

    camera.position.set(center.x, center.y + maxDim / 2, center.z + cameraZ);
    camera.lookAt(center);

    if (controls) {
      controls.target.copy(center);
      controls.update();
    }
  }, [scene, camera, controls]);

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  return (
    <primitive object={scene} ref={ref} onPointerDown={handlePointerDown} />
  );
}

export default function HouseSceneR3F() {
  return (
    <div className="house-scene" style={{ width: "100%", height: "100%" }}>
      <Canvas shadows dpr={[1, 2]} camera={{ fov: 75, near: 0.1, far: 1000 }}>
        <Suspense fallback={<Loader />}>
          <Environment files="/hdr/brown_photostudio_02_1k.hdr" />
          <Stats />
          <directionalLight
            castShadow
            intensity={2}
            position={[0, 10, 10]}
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-near={0.1}
            shadow-camera-far={50}
            shadow-bias={-0.0001}
            shadow-normalBias={0.05}
          />
          <HouseModel url="/3d-models/fornitures-house.glb" />
          <Ground />
        </Suspense>
        <OrbitControls
          enableDamping
          enablePan={false}
          minDistance={1}
          maxDistance={5.5}
          maxPolarAngle={Math.PI / 2}
          makeDefault
        />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/3d-models/fornitures-house.glb");
