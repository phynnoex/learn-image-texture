import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useFrame, type ThreeElements } from "@react-three/fiber";
import { forwardRef, useEffect, useRef } from 'react';
import vertexShader from '../shaders/vertex.vert';
import fragmentShader from '../shaders/fragment.frag';


type GLImageUniforms = {
  u_progress: { value: number };
  u_time: { value: number };
  u_image: { value: THREE.Texture | null };
  u_seed: { value: number };
  u_scrollSpeed: { value: number };
};

type GLImageProps = ThreeElements["mesh"] & {
  image: string;
};

const GLimage = forwardRef<THREE.Mesh, GLImageProps>(
  ({ image, ...props }, meshRef) => {
    const uniforms = useRef<GLImageUniforms>({
      u_progress: { value: 0 },
      u_time: { value: 0 },
      u_image: { value: null },
      u_seed: { value: 0 },
      u_scrollSpeed: { value: 0 },
    });

    const image1 = useTexture(`/textures/${image}`);
    const material = useRef<THREE.ShaderMaterial | null>(null);
    useFrame(({ clock }) => {
      if (!material.current) return;
      material.current.uniforms.u_time.value = clock.getElapsedTime();
    });
    useEffect(() => {
      uniforms.current.u_image.value = image1;
      image1.colorSpace = THREE.SRGBColorSpace;
    }, [image1]);

    useEffect(() => {
      uniforms.current.u_seed.value = Math.random();
    }, []);

    return (
      <mesh {...props} ref={meshRef}>
        <planeGeometry args={[1, 1.2, 32, 32]} />
        <shaderMaterial
          ref={material}
          uniforms={uniforms.current}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          side={THREE.DoubleSide}
        />
      </mesh>
    );
  }
);

export default GLimage;