import { forwardRef, useEffect, useMemo, useRef, useState } from "react"
import * as THREE from "three"
import { useTexture } from "@react-three/drei"
import { useLenis } from "lenis/react"
import vertexShader from './shaders/vertex.vert'
import fragmentShader from './shaders/fragment.frag'
import { useFrame } from "@react-three/fiber"
import { Link, useNavigate } from "react-router-dom"




const radius = 5
const height = 1.2
const segmentAngle = 3.1415 / 10
const gap = 0.01

type SlideProps = {
    img: string
    index: number
    link: string
}


type ImageUniforms = {
    u_image: { value: THREE.Texture | null };
    u_scrollSpeed: { value: number };
};
const Slide = forwardRef<THREE.Mesh, SlideProps>(
    ({ img, index, link }, meshRef) => {
        const uniforms = useRef<ImageUniforms>({
            u_image: { value: null },
            u_scrollSpeed: { value: 0 }
        });
        const texture = useTexture(`/textures/${img}`)
        const material = useRef<THREE.ShaderMaterial | null>(null);

        const geometry = useMemo(() => {
            return new THREE.CylinderGeometry(
                radius,
                radius,
                height,
                64,
                24,
                true,
                index * segmentAngle + gap,
                segmentAngle - gap * 2
            )
        }, [index])

        useEffect(() => {
            uniforms.current.u_image.value = texture;
            texture.colorSpace = THREE.SRGBColorSpace;
        }, [texture]);

        const navigate = useNavigate();




        return (
            <mesh geometry={geometry} ref={meshRef} key={index} onClick={() => navigate(`/design/${link}`)}>
                <shaderMaterial
                    ref={material}
                    uniforms={uniforms.current}
                    vertexShader={vertexShader}
                    fragmentShader={fragmentShader}
                    side={THREE.DoubleSide}
                     />
            </mesh>
        )
    })

type CarouselProps = {
    designObjects: { image: string, link: string }[]
}

export default function Carroussel({ designObjects }: CarouselProps) {
    const groupRef = useRef<THREE.Group>(null);
    const scrollRef = useRef(0);
    const imageRefs = useRef<THREE.Mesh[]>([]);


    useLenis((lenis) => {
        const velocity = lenis.velocity;
        scrollRef.current = velocity;
        imageRefs.current.forEach((ref) => {
            if (ref) {
                const material = ref.material as THREE.ShaderMaterial
                material.uniforms.u_scrollSpeed.value = velocity * 0.1;
            }
        });

    })



    useFrame(() => {
        if (groupRef.current) {
            // Smoothly rotate based on Lenis velocity
            groupRef.current.rotation.y += scrollRef.current * 0.0008
        }
    })
    return (
        <group ref={groupRef} rotation-y={3.142 / 1.2} position={[0, 0, 13]}>
            {designObjects.map((img, index) => (
                <Slide key={index} ref={(el) => { if (el) imageRefs.current[index] = el; }} img={img.image} index={index} link={img.link} />
            ))}
        </group>
    )
}