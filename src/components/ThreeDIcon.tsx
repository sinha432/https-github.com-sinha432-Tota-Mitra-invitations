
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

function ThreeDIconMesh({ icon, color = '#4f8cff', hoveredColor = '#00e6d3', size = 1, hovered = false }: {
  icon: 'plus' | 'feedback' | 'weather',
  color?: string,
  hoveredColor?: string,
  size?: number,
  hovered?: boolean
}) {
  const mesh = useRef<any>();
  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.y += 0.02;
      mesh.current.rotation.x += hovered ? 0.03 : 0.01;
      mesh.current.scale.setScalar(hovered ? size * 1.15 : size);
    }
  });

  let geometry;
  if (icon === 'plus') geometry = <boxGeometry args={[0.7, 0.7, 0.7]} />;
  else if (icon === 'feedback') geometry = <torusGeometry args={[0.5, 0.2, 16, 100]} />;
  else geometry = <sphereGeometry args={[0.6, 32, 32]} />;

  return (
    <mesh ref={mesh} castShadow>
      {geometry}
      <meshStandardMaterial color={hovered ? hoveredColor : color} metalness={0.5} roughness={0.3} />
    </mesh>
  );
}

export default function ThreeDIcon(props: {
  icon: 'plus' | 'feedback' | 'weather',
  color?: string,
  hoveredColor?: string,
  size?: number,
  hovered?: boolean
}) {
  return (
    <Canvas style={{ width: 40, height: 40 }} camera={{ position: [0, 0, 2.5], fov: 50 }}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[2, 2, 2]} intensity={0.7} />
      <ThreeDIconMesh {...props} />
      <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
    </Canvas>
  );
}
