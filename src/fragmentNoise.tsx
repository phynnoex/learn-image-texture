import { Canvas, } from '@react-three/fiber';

import "./App.css"
import { Suspense, useRef, useState, } from 'react'

import type { ThreeEvent } from '@react-three/fiber';

import Carroussel from './Caroussel2';

// type FlagUniforms = {
//   u_time: { value: number };
//   u_intensity: { value: number };
// }



// type PlaneUniforms = {
//     u_time: { value: number };
//     u_progress: { value: number };
//     u_texture: { value: THREE.Texture | null }
//     u_noiseImage: { value: THREE.Texture | null }
//     u_ImageWear: { value: THREE.Texture | null }
// }

// type CustomMeshProps = ThreeElements['mesh'] & {
//     // Add your own custom props here
//     isActive?: boolean;
//     image: string
// };

// type planeProps = {
//     progressSpeed: number;
//     progressTarget: RefObject<number>;
// }


// const Plane = forwardRef<THREE.Mesh, CustomMeshProps>(({ image, ...props }, meshRef) => {

//     const uniforms = useRef<PlaneUniforms>({
//         u_time: { value: 0 },
//         u_progress: { value: 0 },
//         u_texture: { value: null },
//         u_noiseImage: { value: null },
//         u_ImageWear: { value: null }
//     })




//     const material = useRef<THREE.ShaderMaterial | null>(null)
//     const image1 = useTexture(`/textures/${image}`)
//     const noiseImage = useTexture("/textures/noise.png")
//     const ImageWear = useTexture("/textures/edgeWear.jpg")

//     useEffect(() => {
//         uniforms.current.u_texture.value = image1;
//         uniforms.current.u_noiseImage.value = noiseImage;
//         uniforms.current.u_ImageWear.value = ImageWear;
//     }, [])

//     useFrame(({ clock }) => {
//         if (!material.current) return;
//         material.current.uniforms.u_time.value = clock.getElapsedTime();
//     })
//     return (
//         <mesh rotation={[0, 0, 0]} {...props} ref={meshRef}>
//             <planeGeometry args={[2, 2, 16, 16]} />
//             <shaderMaterial ref={material} transparent
//                 depthWrite={false} fragmentShader={fragmentShader} vertexShader={vertexShader} side={THREE.DoubleSide} uniforms={uniforms.current} />

//         </mesh>
//     )
// })



const designData: { image: string, link: string }[] = [
    { image: "image1.jpg", link: "design1" },
    { image: "image2.jpg", link: "design2" },
    { image: "image1.jpg", link: "design1" },
    { image: "image2.jpg", link: "design2" }
]


export default function FragMentNoise() {
    const divRef = useRef<HTMLDivElement>(null)
    const [visible, setVisible] = useState(false);
    const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
        if (!divRef.current) return;
        divRef.current.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
    }

    return (
        <div className='appContainer'>
            <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
                <ambientLight intensity={0.9} />
                <directionalLight position={[10, 10, 10]} intensity={1} />
                <Suspense fallback={null}>
                    <Carroussel designObjects={designData} pointerMoveHandler={handlePointerMove} handleVisible={setVisible} />
                </Suspense>
                {/* <OrbitControls /> */}
                <axesHelper />
                <gridHelper />
            </Canvas>
            {visible && <div ref={divRef} style={{
                background: 'green',
                position: 'fixed',
                top: 0,
                left: 0,
                width: 50,
                height: 50,
                zIndex: 9999

            }}>

            </div>}
        </div>
    )

}