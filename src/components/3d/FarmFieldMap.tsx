import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'
import { animated, useSpring } from 'react-spring'

// Simple animated marker
function Marker({ position, label }: { position: [number, number, number], label: string }) {
  const mesh = useRef()
  useFrame(() => {
    if (mesh.current) {
      // Animate marker bounce
      mesh.current.position.y = 1 + Math.sin(Date.now() * 0.002) * 0.2
    }
  })
  return (
    <mesh ref={mesh} position={position}>
      <sphereGeometry args={[0.3, 32, 32]} />
      <meshStandardMaterial color="orange" />
      <Html center>
  <div className="farm-label">{label}</div>
      </Html>
    </mesh>
  )
}

export default function FarmFieldMap({ markers = [] }: { markers?: Array<{ position: [number, number, number], label: string }> }) {
  // Camera animation example (could use react-spring for smooth transitions)
  // For now, OrbitControls for pan/zoom
  return (
  <div className="farm-map-container">
      <Canvas camera={{ position: [0, 5, 10], fov: 50 }} shadows>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
        {/* Simple terrain */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#7ec850" />
        </mesh>
        {/* Markers for groups/tasks */}
        {markers.map((m, i) => (
          <Marker key={i} position={m.position} label={m.label} />
        ))}
        <OrbitControls enablePan enableZoom enableRotate />
      </Canvas>
    </div>
  )
}
