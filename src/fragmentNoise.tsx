import { Canvas, } from '@react-three/fiber';

import "./App.css"
import { Suspense, useRef, useState, } from 'react'

import type { ThreeEvent } from '@react-three/fiber';
import ArrowUp from './assets/arrowUp.svg?react';
import * as animationData from './assets/animationData.json';
import Lottie from 'lottie-react';

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



const designData: { image: string, link: string, title: string, description: string }[] = [
    { image: "image1.jpg", link: "design1", title: "Web Portfolio", description: "lorem ipsum dolor sit amet consecteur adispiscing" },
    { image: "image2.jpg", link: "design2", title: 'FanSurvey', description: "lorem ipsum dolor sit amet consecteur adispiscing" },
    { image: "image1.jpg", link: "design1", title: "Web Portfolio", description: "lorem ipsum dolor sit amet consecteur adispiscing" },
    { image: "image2.jpg", link: "design2", title: 'FanSurvey', description: "lorem ipsum dolor sit amet consecteur adispiscing" },
]


export default function FragMentNoise() {
    const divRef = useRef<HTMLDivElement>(null)
    const [visible, setVisible] = useState(false);
    const [displayIndex, setDisplayIndex] = useState(0);
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
                    <Carroussel handleDisplayIndex={setDisplayIndex} designObjects={designData} pointerMoveHandler={handlePointerMove} handleVisible={setVisible} />
                </Suspense>
                {/* <OrbitControls /> */}
                <axesHelper />
                <gridHelper />
            </Canvas>
            {visible && <div className='tooltip' ref={divRef} >
                <div className='tooltip_title'><div className='title_text'><span>Web Design</span>{designData[displayIndex % 2].title} </div><button><ArrowUp stroke='white' /></button></div>
                <div className='tooltip_description'>{designData[displayIndex % 2].description} <div className='tooltip_button'>
                    <div>click to view my process</div>
                    <Lottie animationData={JSON.parse(JSON.stringify(animationData))} loop autoplay={true} style={{ height: 30, width: 30 }} />
                </div></div>

            </div>}
        </div>
    )

}