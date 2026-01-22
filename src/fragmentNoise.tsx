import { Canvas, useFrame } from '@react-three/fiber';
import vertexShader from './shaders/fragmentNoiseShaders/vertex.vert';
import fragmentShader from './shaders/fragmentNoiseShaders/fragment.frag';

import { OrbitControls, useTexture } from '@react-three/drei'
import "./App.css"
import { forwardRef, Suspense, useEffect, useRef, type RefObject, } from 'react'
import * as THREE from 'three'
import type { ThreeElements } from '@react-three/fiber';
import Carousel from './Carousel';

// type FlagUniforms = {
//   u_time: { value: number };
//   u_intensity: { value: number };
// }



type PlaneUniforms = {
    u_time: { value: number };
    u_progress: { value: number };
    u_texture: { value: THREE.Texture | null }
    u_noiseImage: { value: THREE.Texture | null }
    u_ImageWear: { value: THREE.Texture | null }
}

type CustomMeshProps = ThreeElements['mesh'] & {
    // Add your own custom props here
    isActive?: boolean;
    image: string
};

// type planeProps = {
//     progressSpeed: number;
//     progressTarget: RefObject<number>;
// }


const Plane = forwardRef<THREE.Mesh, CustomMeshProps>(({ image, ...props }, meshRef ) => {

    const uniforms = useRef<PlaneUniforms>({
        u_time: { value: 0 },
        u_progress: { value: 0 },
        u_texture: { value: null },
        u_noiseImage: { value: null },
        u_ImageWear: { value: null }
    })




    const material = useRef<THREE.ShaderMaterial | null>(null)
    const image1 = useTexture(`/textures/${image}`)
    const noiseImage = useTexture("/textures/noise.png")
    const ImageWear = useTexture("/textures/edgeWear.jpg")

    useEffect(() => {
        uniforms.current.u_texture.value = image1;
        uniforms.current.u_noiseImage.value = noiseImage;
        uniforms.current.u_ImageWear.value = ImageWear;
    }, [])

    useFrame(({ clock }) => {
        if (!material.current) return;
        material.current.uniforms.u_time.value = clock.getElapsedTime();
    })
    return (
        <mesh rotation={[0, 0, 0]} {...props} ref={meshRef}>
            <planeGeometry args={[2, 2, 16, 16]} />
            <shaderMaterial ref={material} transparent
                depthWrite={false} fragmentShader={fragmentShader} vertexShader={vertexShader} side={THREE.DoubleSide} uniforms={uniforms.current} />

        </mesh>
    )
})

const images: string[] = [
    "image1.jpg", "image2.jpg", "image3.jpg","image1.jpg", "image2.jpg", "image3.jpg"
]


export default function FragMentNoise() {
    return (
        <div className='appContainer'>
            <Canvas camera={{position:[0,0,3]}}>
                <Suspense fallback={null}>
                    <Carousel images={images} gap={1.4} position={[0, -1, 0]} />
                </Suspense>
            </Canvas>
        </div>
    )

}