import './ThreeDOrb.css';
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshWobbleMaterial, OrbitControls } from '@react-three/drei';

function AnimatedOrb({ hovered }: { hovered: boolean }) {
  const mesh = useRef<any>();
  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.y += 0.01;
      mesh.current.rotation.x += hovered ? 0.02 : 0.005;
      mesh.current.scale.setScalar(hovered ? 1.15 : 1);
    }
  });
  return (
    <mesh ref={mesh} castShadow>
      <sphereGeometry args={[1, 32, 32]} />
      <MeshWobbleMaterial
        color={hovered ? '#00e6d3' : '#4f8cff'}
        speed={hovered ? 2 : 1}
        factor={hovered ? 0.6 : 0.3}
        envMapIntensity={0.8}
      />
    </mesh>
  );
}

export default function ThreeDOrb({ onClick }: { onClick?: () => void }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div className="three-d-orb-container"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title="Open Assistant"
    >
      <Canvas shadows camera={{ position: [0, 0, 3.5], fov: 50 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[2, 2, 2]} intensity={0.7} />
        <AnimatedOrb hovered={hovered} />
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </Canvas>
    </div>
  );
}
