import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { forwardRef, useEffect, useRef } from "react";
import * as THREE from 'three'
import vertexShader from '../shaders/fragmentNoiseShaders/vertex.vert';
import fragmentShader from '../shaders/fragmentNoiseShaders/fragment.frag';
import type { ThreeElements } from '@react-three/fiber';
import { useLenis } from "lenis/react";



type carouselProps = {
    gap: number;
    position: [number, number, number];
    images: string[]
}

type GLImageUniforms = {
    u_progress: { value: number };
    u_time: { value: number };
    u_image: { value: THREE.Texture | null }
    u_seed: { value: number };
}

type GLImageProps = ThreeElements['mesh'] & {
    image: string
}

const GLimage = forwardRef<THREE.Mesh, GLImageProps>(({ image, ...props }, meshRef) => {

    const uniforms = useRef<GLImageUniforms>({
        u_progress: { value: 0 },
        u_time: { value: 0 },
        u_image: { value: null },
        u_seed: { value: 0 },
    })

    const image1 = useTexture(`/textures/${image}`)
    const material = useRef<THREE.ShaderMaterial | null>(null)
    useFrame(({ clock }) => {
        if (!material.current) return
        material.current.uniforms.u_time.value = clock.getElapsedTime();
    })
    useEffect(() => {
        uniforms.current.u_image.value = image1;
        image1.colorSpace = THREE.SRGBColorSpace;
    }, [image1])

    useEffect(() => {
        uniforms.current.u_seed.value = Math.random()
    }, [])

    return (
        <mesh {...props} ref={meshRef}>
            <planeGeometry args={[1, 1.2, 32, 32]} />
            <shaderMaterial ref={material} uniforms={uniforms.current} vertexShader={vertexShader} fragmentShader={fragmentShader} />
        </mesh>
    )
})

export default function Carousel({ gap, position, images }: carouselProps) {

    const imageRefs = useRef<THREE.Mesh[]>([]);
    const totalHeight = images.length * 1.2 + gap;

    function mod(n: number, m: number) {
        return ((n % m) + m) % m;
    }

    useFrame(() => {

        imageRefs.current.forEach((ref) => {
            if (!ref) return;
            ref.position.x =
                mod(ref.position.x + totalHeight / 2, totalHeight) - totalHeight / 2;
        });
    });

    useLenis((lenis) => {
        const velocity = lenis.velocity
        imageRefs.current.forEach((ref) => {
            if (ref) {
                ref.position.x -= velocity * 0.01
                if (ref.material instanceof THREE.ShaderMaterial) {
                    ref.material.uniforms.u_progress.value = velocity * 0.01
                }
            }
        });
    })

    return (
        <group>
            {images.map((url, index) => (
                <GLimage image={url} key={index} position={[position[0] + index * gap, position[1], position[2]]} ref={(el) => { if (el) imageRefs.current[index] = el; }} />
            ))}
        </group>
    )
}