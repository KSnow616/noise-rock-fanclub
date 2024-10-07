

import * as THREE from 'three'
import { useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Image, Environment, ScrollControls, useScroll, useTexture, OrbitControls, Sky, Text } from '@react-three/drei'
import { easing } from 'maath'
import './util'

import { EffectComposer, Selection, Outline, N8AO, TiltShift2, ToneMapping } from "@react-three/postprocessing"

export const App = () => (
  <Canvas camera={{ position: [0, 0, 10], fov: 15 }}>
    <fog attach="fog" args={['#a79', 8.5, 12]} />
    <Sky/>
    <OrbitControls enableZoom={false} enablePan={false}/>
    <Carousel />
    <Label renderOrder={1}/>
    <Effects/>
  </Canvas>
)

function Carousel({ radius = 2, count = 8 }) {
  return Array.from({ length: count }, (_, i) => (
    <Card
      key={i}
      url={`/img${Math.floor(i % 10) + 1}_.jpg`}
      position={[Math.sin((i / count) * Math.PI * 2) * radius, 0, Math.cos((i / count) * Math.PI * 2) * radius]}
      rotation={[0, Math.PI + (i / count) * Math.PI * 2, 0]}
    />
  ))
}

function Label(...props){
  const objectRef = useRef();
  const state = useThree();

  useFrame(({ camera }) => {
    const cameraPosition = camera.position;
    camera.getWorldPosition(cameraPosition);
    //objectRef.current.position.set(0,0,-10);
    const objectPosition = new THREE.Vector3(1,0,0);

    const lookAtVector = new THREE.Vector3();
    lookAtVector.subVectors(cameraPosition, objectPosition).normalize();

    objectRef.current.lookAt(lookAtVector);
   // const newPosition = objectRef.current.position.clone().add(lookAtVector.clone().multiplyScalar(1));


    //objectRef.current.position.set(Math.max(Math.min(camera.rotation.x,1),0,0));
    //objectRef.current.position.set(1,0,0);
    
    console.log(objectRef.current.position)

  });
  const fontSize = state.size.height / 20
    return <Text ref={objectRef} fontSize={0.8} font='nexa-bold-webfont.woff'  >

  <meshStandardMaterial attach="material" textAlign={'center'} opacity={0.5} {...props}/>
  NOISE{'\n'} ROCK{'\n'} FANCLUB
    </Text >
}

function Card({ url, ...props }) {
  const ref = useRef()
  const [hovered, hover] = useState(false)
  const pointerOver = (e) => (e.stopPropagation(), hover(true))
  const pointerOut = () => hover(false)
  useFrame((state, delta) => {
    easing.damp3(ref.current.scale, hovered ? 1.55 : 1.3, 0.1, delta)
    easing.damp(ref.current.material, 'radius', hovered ? 0.25 : 0.1, 0.2, delta)
    easing.damp(ref.current.material, 'zoom', hovered ? 1 : 1.5, 0.2, delta)
  })
  return (
    <Image ref={ref} url={url} transparent side={THREE.DoubleSide} onPointerOver={pointerOver} onPointerOut={pointerOut}  {...props}>
      <bentPlaneGeometry args={[0.1, 1, 1, 20, 20]} />
    </Image>
  )
}



function Effects() {
  const { size } = useThree()
  return (
    <EffectComposer stencilBuffer disableNormalPass autoClear={false} multisampling={4}>
      <N8AO halfRes aoSamples={5} aoRadius={0.4} distanceFalloff={0.75} intensity={1} />
      <Outline visibleEdgeColor="white" hiddenEdgeColor="white" blur width={size.width} edgeStrength={10} />
      <TiltShift2 samples={5} blur={0.1} />
      <ToneMapping />
    </EffectComposer>
  )
}