import { Canvas, useFrame } from '@react-three/fiber';
import vertexShader from './shaders/vertex.vert';
import fragmentShader from './shaders/fragment.frag';

import { OrbitControls, useTexture } from '@react-three/drei'
import "./App.css"
import { useEffect, useRef, type RefObject, } from 'react'
import * as THREE from 'three'


// type FlagUniforms = {
//   u_time: { value: number };
//   u_intensity: { value: number };
// }



type PlaneUniforms = {
  u_time: { value: number };
  u_progress: { value: number };
  u_scrollSpeed: { value: number };
  u_texture1: { value: THREE.Texture | null };
  u_texture2: { value: THREE.Texture | null };
}

type planeProps = {
  progressSpeed: number;
  progressTarget: RefObject<number>;
}


const Plane = ({ progressSpeed, progressTarget }: planeProps) => {

  const mesh = useRef<THREE.Mesh | null>(null);
  const [image1, image2] = useTexture(["/textures/image1.jpg", "/textures/image2.jpg"])


  const uniforms = useRef<PlaneUniforms>({
    u_time: { value: 0 },
    u_progress: { value: 0 },
    u_texture1: { value: null },
    u_texture2: { value: null },
    u_scrollSpeed: {value: 0},
  })





  const material = useRef<THREE.ShaderMaterial | null>(null);

  useEffect(() => {
    uniforms.current.u_texture1.value = image1;
    uniforms.current.u_texture2.value = image2;
  }, [image1, image2])

  useFrame(({ clock }, delta) => {
    if (!material.current) return;
    material.current.uniforms.u_time.value = clock.getElapsedTime();

    const u = uniforms.current.u_progress

    u.value = THREE.MathUtils.clamp(
      THREE.MathUtils.lerp(u.value, progressTarget.current, delta * progressSpeed),
      0,
      1
    )

  })



  return (
    <mesh ref={mesh} scale={1.5} rotation={[0, 0, 0]} >
      <planeGeometry args={[4, 3, 24, 24]} />
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms.current}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}
export default function App() {

  const progressTarget = useRef(0)
  const progressSpeed = 2 // 2 seconds → reach target

  const next = () => {
    progressTarget.current = 1
  }

  const prev = () => {
    progressTarget.current = 0
  }


  return (
    <div className='appContainer'>
      <div id="canvas-container">
        <Canvas>
          <Plane progressSpeed={progressSpeed} progressTarget={progressTarget}/>
          <ambientLight intensity={0.1} />
          <directionalLight position={[0, 0, 5]} color="red" />
          <OrbitControls />
          <axesHelper />
        </Canvas>
      </div>
      <div className='buttonContainer'>
        <button onClick={prev}>-</button>
        <button onClick={next}>+</button>
      </div>
    </div>
  )
}
