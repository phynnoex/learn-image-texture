import { forwardRef, useEffect, useMemo, useRef } from "react"
import * as THREE from "three"
import { useTexture } from "@react-three/drei"
import { useLenis } from "lenis/react"
import vertexShader from './shaders/vertex.vert'
import fragmentShader from './shaders/fragment.frag'
import { useFrame, type ThreeEvent } from "@react-three/fiber"
import { useNavigate } from "react-router-dom"




const radius = 5
const height = 1.2
const segmentAngle = 3.1415 / 10
const gap = 0.01

type SlideProps = {
    img: string
    index: number
    link: string
    handleVisible: React.Dispatch<React.SetStateAction<boolean>>
    handleDisplayIndex: React.Dispatch<React.SetStateAction<number>>
    pointerHandler: (e: ThreeEvent<PointerEvent>) => void;
}


type ImageUniforms = {
    u_image: { value: THREE.Texture | null };
    u_scrollSpeed: { value: number };
};
const Slide = forwardRef<THREE.Mesh, SlideProps>(
    ({ img, index, link, handleDisplayIndex, handleVisible, pointerHandler }, meshRef) => {
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
            <mesh geometry={geometry} ref={meshRef} key={index} onPointerLeave={() => handleVisible(false)} onPointerEnter={() => { handleDisplayIndex(index); handleVisible(true) }} onPointerMove={(e) => pointerHandler(e)} onClick={() => navigate(`/design/${link}`)}>
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
    designObjects: { image: string, link: string, title: string, description: string }[]
    pointerMoveHandler: (e: ThreeEvent<PointerEvent>) => void
    handleVisible: React.Dispatch<React.SetStateAction<boolean>>
    handleDisplayIndex: React.Dispatch<React.SetStateAction<number>>
}

export default function Carroussel({ designObjects, handleDisplayIndex, handleVisible, pointerMoveHandler }: CarouselProps) {
    const groupRef = useRef<THREE.Group>(null);
    const scrollRef = useRef(0);
    const imageRefs = useRef<THREE.Mesh[]>([]);


    useLenis((lenis) => {
        const velocity = lenis.velocity;
        scrollRef.current = velocity;
        imageRefs.current.forEach((ref) => {
            if (ref) {
                const material = ref.material as THREE.ShaderMaterial
                material.uniforms.u_scrollSpeed.value = (velocity) * 0.5;
            }
        });

    })


    const maxVelocity = 30;

    useFrame(() => {
        if (!groupRef.current) return;
        const rawVelocity = scrollRef.current;
        const clampedVelocity = Math.max(
            -maxVelocity,
            Math.min(maxVelocity, rawVelocity)
        );
        groupRef.current.rotation.y += clampedVelocity * 0.0008;
    });




    return (
        <>
            <group ref={groupRef} rotation-y={3.142 / 1.2} position={[0, 0, 13]}>

                {designObjects.map((img, index) => (

                    <Slide handleDisplayIndex={handleDisplayIndex} handleVisible={handleVisible} pointerHandler={pointerMoveHandler} key={index} ref={(el) => { if (el) imageRefs.current[index] = el; }} img={img.image} index={index} link={img.link} />

                ))}

            </group>

        </>
    )
}