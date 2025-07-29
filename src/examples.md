## marquee example 1

```html
<div class="slider">
  <div class="slide-track bd">
    <div class="slide">
      <img
        src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/1.png"
        height="100"
        width="250"
        alt=""
      />
    </div>
    <div class="slide">
      <img
        src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/2.png"
        height="100"
        width="250"
        alt=""
      />
    </div>
    <div class="slide">
      <img
        src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/3.png"
        height="100"
        width="250"
        alt=""
      />
    </div>
    <div class="slide">
      <img
        src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/4.png"
        height="100"
        width="250"
        alt=""
      />
    </div>
    <div class="slide">
      <img
        src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/5.png"
        height="100"
        width="250"
        alt=""
      />
    </div>
    <div class="slide">
      <img
        src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/6.png"
        height="100"
        width="250"
        alt=""
      />
    </div>
    <div class="slide">
      <img
        src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/7.png"
        height="100"
        width="250"
        alt=""
      />
    </div>
    <div class="slide">
      <img
        src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/1.png"
        height="100"
        width="250"
        alt=""
      />
    </div>
    <div class="slide">
      <img
        src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/2.png"
        height="100"
        width="250"
        alt=""
      />
    </div>
    <div class="slide">
      <img
        src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/3.png"
        height="100"
        width="250"
        alt=""
      />
    </div>
    <div class="slide">
      <img
        src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/4.png"
        height="100"
        width="250"
        alt=""
      />
    </div>
    <div class="slide">
      <img
        src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/5.png"
        height="100"
        width="250"
        alt=""
      />
    </div>
    <div class="slide">
      <img
        src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/6.png"
        height="100"
        width="250"
        alt=""
      />
    </div>
    <div class="slide">
      <img
        src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/7.png"
        height="100"
        width="250"
        alt=""
      />
    </div>
  </div>
</div>
```

```css
body {
  align-items: center;
  background: #e3e3e3;
  display: flex;
  height: 100vh;
  justify-content: center;
}

.bd {
  border: 2px solid red;
}

@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(calc(-250px * 7));
  }
}
.slider {
  background: white;
  box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.125);
  height: 100px;
  margin: auto;
  overflow: hidden;
  position: relative;
  width: 960px;
}
.slider::before,
.slider::after {
  background: linear-gradient(to right, white 0%, rgba(255, 255, 255, 0) 100%);
  content: "";
  height: 100px;
  position: absolute;
  width: 200px;
  z-index: 2;
}
.slider::after {
  right: 0;
  top: 0;
  transform: rotateZ(180deg);
}
.slider::before {
  left: 0;
  top: 0;
}
.slider .slide-track {
  -webkit-animation: scroll 40s linear infinite;
  animation: scroll 40s linear infinite;
  display: flex;
  width: calc(250px * 14);
}
.slider .slide {
  height: 100px;
  width: 250px;
}
```

## R3F working code
```js
import { useEffect, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Stats, useHelper } from "@react-three/drei";
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
      log(box);
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

  return (
    <>
      <ambientLight intensity={1.5} color={0x404040} />
      <directionalLight
        ref={dirLightRef}
        position={[0, 10, 10]}
        intensity={3}
        color={0xffffff}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.1}
        shadow-camera-far={50}
        shadow-bias={-0.0001}
        shadow-normalBias={0.05}
      />
      <primitive object={gltf.scene} ref={modelRef} />
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
```