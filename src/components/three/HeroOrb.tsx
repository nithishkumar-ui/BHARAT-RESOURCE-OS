import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, Stars } from '@react-three/drei';
import * as THREE from 'three';

function AnimatedOrb() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.15;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={1.5}>
      <Sphere ref={meshRef} args={[1.8, 128, 128]}>
        <MeshDistortMaterial
          color="#ff6b00"
          emissive="#ff4500"
          emissiveIntensity={0.4}
          roughness={0.2}
          metalness={0.8}
          distort={0.35}
          speed={2}
        />
      </Sphere>
    </Float>
  );
}

function OrbitalRings() {
  const group = useRef<THREE.Group>(null);

  const ringGeometry = useMemo(() => {
    return new THREE.RingGeometry(2.5, 2.55, 128);
  }, []);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.z = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={group}>
      <mesh geometry={ringGeometry} rotation={[Math.PI / 3, 0, 0]}>
        <meshBasicMaterial color="#ff6b00" transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={ringGeometry} rotation={[Math.PI / 2.5, Math.PI / 4, 0]}>
        <meshBasicMaterial color="#1a73e8" transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function ParticleField() {
  const count = 500;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#ff6b00" transparent opacity={0.4} sizeAttenuation />
    </points>
  );
}

export default function HeroOrb() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} color="#ff8c38" />
        <pointLight position={[-5, -5, 5]} intensity={0.5} color="#1a73e8" />
        <AnimatedOrb />
        <OrbitalRings />
        <ParticleField />
        <Stars radius={100} depth={50} count={1000} factor={3} saturation={0} fade speed={1} />
      </Canvas>
    </div>
  );
}
