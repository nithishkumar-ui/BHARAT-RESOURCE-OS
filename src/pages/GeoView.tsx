import { useRef, useMemo, useState, Component, type ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Float, Html } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe2, AlertTriangle } from 'lucide-react';
import { stateDetails } from '../lib/stateData';
import type { StateDetail } from '../lib/stateData';
import StateDetailPanel from '../components/StateDetailPanel';

function getHeatColor(heat: number): string {
  if (heat >= 0.9) return '#00c853';
  if (heat >= 0.75) return '#ffc107';
  if (heat >= 0.6) return '#ff6b00';
  return '#ff1744';
}

/* ─── State Node (3D sphere + HTML label) ────────────────────── */
function StateNode({
  data,
  isHovered,
  isSelected,
  onHover,
  onUnhover,
  onClick,
}: {
  data: StateDetail;
  isHovered: boolean;
  isSelected: boolean;
  onHover: () => void;
  onUnhover: () => void;
  onClick: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const color = getHeatColor(data.heat);

  useFrame((state) => {
    if (meshRef.current) {
      const base = isSelected ? 1.3 : isHovered ? 1.2 : 1;
      const pulse = Math.sin(state.clock.elapsedTime * 2 + data.pos[0]) * 0.05;
      meshRef.current.scale.setScalar(base + (isSelected ? 0 : pulse));
    }
  });

  return (
    <Float speed={1} rotationIntensity={0} floatIntensity={0.3}>
      <group position={data.pos}>
        <mesh
          ref={meshRef}
          onPointerEnter={(e) => { e.stopPropagation(); onHover(); }}
          onPointerLeave={onUnhover}
          onClick={(e) => { e.stopPropagation(); onClick(); }}
        >
          <sphereGeometry args={[data.size, 32, 32]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={isSelected ? 1.0 : isHovered ? 0.8 : 0.4}
            roughness={0.3}
            metalness={0.6}
            transparent
            opacity={isSelected ? 1 : isHovered ? 1 : 0.85}
          />
        </mesh>
        {/* Glow ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[data.size + 0.02, data.size + 0.06, 64]} />
          <meshBasicMaterial color={color} transparent opacity={isSelected ? 0.7 : isHovered ? 0.5 : 0.2} side={THREE.DoubleSide} />
        </mesh>
        {/* Selection ring */}
        {isSelected && (
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[data.size + 0.08, data.size + 0.12, 64]} />
            <meshBasicMaterial color={color} transparent opacity={0.4} side={THREE.DoubleSide} />
          </mesh>
        )}
        {/* HTML label */}
        <Html position={[0, data.size + 0.18, 0]} center distanceFactor={6} style={{ pointerEvents: 'none' }}>
          <div
            style={{
              fontSize: 11, fontWeight: 600, color: '#f0f0f5', whiteSpace: 'nowrap',
              textShadow: '0 1px 4px rgba(0,0,0,0.8)',
              fontFamily: "'DM Sans', sans-serif",
              opacity: isSelected ? 1 : isHovered ? 1 : 0.75,
              transition: 'opacity 0.2s',
            }}
          >
            {data.name}
          </div>
        </Html>
        {/* Tooltip on hover (not when selected) */}
        {isHovered && !isSelected && (
          <Html position={[0, data.size + 0.45, 0]} center distanceFactor={6}>
            <div
              style={{
                background: 'rgba(10,10,15,0.92)', border: `1px solid ${color}33`,
                borderRadius: 10, padding: '8px 14px', whiteSpace: 'nowrap',
                backdropFilter: 'blur(8px)', fontFamily: "'DM Sans', sans-serif",
                cursor: 'pointer',
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, color: '#f0f0f5', marginBottom: 4 }}>
                {data.name}
              </div>
              <div style={{ fontSize: 11, color: color, fontWeight: 600 }}>
                ₹{data.budget} Cr • {Math.round(data.heat * 100)}% utilization
              </div>
              <div style={{ fontSize: 10, color: '#8a8a9a', marginTop: 4 }}>
                Click for full details →
              </div>
            </div>
          </Html>
        )}
      </group>
    </Float>
  );
}

/* ─── Fund Flow Particles ───────────────────────────────────── */
function FundFlowParticles() {
  const count = 200;
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      const posArr = ref.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        posArr[i * 3 + 1] += Math.sin(state.clock.elapsedTime + i) * 0.002;
      }
      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#ff6b00" transparent opacity={0.3} sizeAttenuation />
    </points>
  );
}

/* ─── Grid Plane ────────────────────────────────────────────── */
function GridPlane() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
      <planeGeometry args={[20, 20, 40, 40]} />
      <meshBasicMaterial color="#ff6b00" wireframe transparent opacity={0.04} />
    </mesh>
  );
}

/* ─── Connection Lines between states ───────────────────────── */
function ConnectionLines() {
  const lines = useMemo(() => {
    const pairs = [
      [0, 3], [0, 11], [3, 2], [1, 4], [1, 12], [5, 7],
      [6, 1], [8, 5], [8, 0], [9, 2], [10, 12], [13, 4], [14, 6],
    ];
    const points: THREE.Vector3[] = [];
    pairs.forEach(([a, b]) => {
      points.push(new THREE.Vector3(...stateDetails[a].pos));
      points.push(new THREE.Vector3(...stateDetails[b].pos));
    });
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    return geo;
  }, []);

  return (
    <lineSegments geometry={lines}>
      <lineBasicMaterial color="#ff6b00" transparent opacity={0.08} />
    </lineSegments>
  );
}

/* ─── Responsive Camera ─────────────────────────────────────── */
function ResponsiveCamera() {
  const { camera, size } = useThree();
  useMemo(() => {
    if (size.width < 800) {
      camera.position.set(0, 0, 9);
    } else {
      camera.position.set(0, 0, 7);
    }
  }, [camera, size.width]);
  return null;
}

/* ─── 3D India Scene ────────────────────────────────────────── */
function IndiaScene({
  hoveredState,
  selectedState,
  setHoveredState,
  onStateClick,
}: {
  hoveredState: string | null;
  selectedState: string | null;
  setHoveredState: (s: string | null) => void;
  onStateClick: (name: string) => void;
}) {
  return (
    <>
      <ResponsiveCamera />
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#fff5ee" />
      <pointLight position={[-3, -3, 5]} intensity={0.4} color="#1a73e8" />

      {stateDetails.map((s) => (
        <StateNode
          key={s.name}
          data={s}
          isHovered={hoveredState === s.name}
          isSelected={selectedState === s.name}
          onHover={() => setHoveredState(s.name)}
          onUnhover={() => setHoveredState(null)}
          onClick={() => onStateClick(s.name)}
        />
      ))}
      <FundFlowParticles />
      <ConnectionLines />
      <GridPlane />
      <Stars radius={50} depth={30} count={800} factor={2} saturation={0} fade speed={0.5} />
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={4}
        maxDistance={12}
        autoRotate
        autoRotateSpeed={0.4}
      />
    </>
  );
}

/* ─── Error Boundary for Canvas ─────────────────────────────── */
interface ErrorBoundaryState { hasError: boolean; error?: string }

class CanvasErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            height: '100%', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 16,
            color: 'var(--color-text-muted)',
          }}
        >
          <AlertTriangle size={40} color="#ff6b00" />
          <div style={{ fontSize: 16, fontWeight: 600 }}>3D Engine Unavailable</div>
          <div style={{ fontSize: 12, maxWidth: 360, textAlign: 'center', lineHeight: 1.6 }}>
            WebGL rendering failed. Check browser GPU acceleration settings.
          </div>
          <code style={{ fontSize: 10, color: '#ff1744', maxWidth: 400, wordBreak: 'break-all' }}>
            {this.state.error}
          </code>
        </div>
      );
    }
    return this.props.children;
  }
}

/* ─── Main GeoView Page ─────────────────────────────────────── */
export default function GeoView() {
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const totalBudget = stateDetails.reduce((s, d) => s + d.budget, 0);
  const avgUtilization = Math.round(stateDetails.reduce((s, d) => s + d.heat, 0) / stateDetails.length * 100);
  const topState = [...stateDetails].sort((a, b) => b.budget - a.budget)[0];

  const selectedData = selectedState ? stateDetails.find(s => s.name === selectedState) ?? null : null;

  const handleStateClick = (name: string) => {
    setSelectedState(prev => prev === name ? null : name);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Summary Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: 'Total Coverage', value: `₹${(totalBudget / 1000).toFixed(1)}K Cr`, color: 'var(--color-saffron)' },
          { label: 'States Tracked', value: `${stateDetails.length}`, color: 'var(--color-chakra-glow)' },
          { label: 'Avg. Utilization', value: `${avgUtilization}%`, color: avgUtilization >= 75 ? '#00c853' : '#ffc107' },
          { label: 'Top Allocation', value: topState.name, color: getHeatColor(topState.heat) },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-base"
            style={{ padding: 16, textAlign: 'center' }}
          >
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 6 }}>{stat.label}</div>
            <div className="font-display" style={{ fontSize: 20, fontWeight: 700, color: stat.color }}>
              {stat.value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* 3D Map */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="card-base"
        style={{ height: 520, padding: 0, overflow: 'hidden', position: 'relative' }}
      >
        <CanvasErrorBoundary>
          <Canvas
            camera={{ position: [0, 0, 7], fov: 50 }}
            gl={{ alpha: true, antialias: true }}
            onCreated={({ gl }) => {
              gl.setClearColor(new THREE.Color('#0a0a0f'), 1);
            }}
          >
            <IndiaScene
              hoveredState={hoveredState}
              selectedState={selectedState}
              setHoveredState={setHoveredState}
              onStateClick={handleStateClick}
            />
          </Canvas>
        </CanvasErrorBoundary>

        {/* Overlay Title */}
        <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <Globe2 size={20} color="var(--color-saffron)" />
            <h3 className="font-display" style={{ fontSize: 18, fontWeight: 700 }}>
              Geo Strategic View
            </h3>
          </div>
          <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginLeft: 30 }}>
            Click any state for full analytics & budget details • Drag to rotate
          </p>
        </div>

        {/* Legend */}
        <div
          className="glass-panel"
          style={{ position: 'absolute', bottom: 20, right: 20, zIndex: 10, padding: '12px 16px' }}
        >
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 8 }}>
            Utilization Rate
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[
              { color: '#00c853', label: '≥90% Excellent' },
              { color: '#ffc107', label: '75-89% Good' },
              { color: '#ff6b00', label: '60-74% Fair' },
              { color: '#ff1744', label: '<60% Critical' },
            ].map((l) => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: l.color }} />
                <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hovered State Quick Info */}
        <AnimatePresence>
          {hoveredState && !selectedState && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="glass-panel"
              style={{ position: 'absolute', bottom: 20, left: 20, zIndex: 10, padding: '12px 18px' }}
            >
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{hoveredState}</div>
              <div className="font-mono" style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-saffron)' }}>
                ₹{stateDetails.find((s) => s.name === hoveredState)?.budget} Cr
              </div>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>
                {Math.round((stateDetails.find((s) => s.name === hoveredState)?.heat ?? 0) * 100)}% utilization
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* State Data Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
        {stateDetails.map((s, i) => (
          <motion.div
            key={s.name}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="card-base"
            style={{
              padding: 14, textAlign: 'center', cursor: 'pointer',
              border: selectedState === s.name
                ? `1px solid ${getHeatColor(s.heat)}88`
                : hoveredState === s.name
                  ? `1px solid ${getHeatColor(s.heat)}44`
                  : undefined,
              boxShadow: selectedState === s.name ? `0 0 20px ${getHeatColor(s.heat)}22` : undefined,
              transition: 'all 0.2s',
            }}
            onClick={() => handleStateClick(s.name)}
            onMouseEnter={() => setHoveredState(s.name)}
            onMouseLeave={() => setHoveredState(null)}
          >
            <div
              style={{
                width: 32, height: 32, borderRadius: 8,
                background: `${getHeatColor(s.heat)}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 8px',
              }}
            >
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: getHeatColor(s.heat) }} />
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 2 }}>{s.name}</div>
            <div className="font-mono" style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-saffron)' }}>
              ₹{s.budget} Cr
            </div>
            <div className="font-mono" style={{ fontSize: 10, color: 'var(--color-text-muted)', marginTop: 2 }}>
              {Math.round(s.heat * 100)}% util
            </div>
          </motion.div>
        ))}
      </div>

      {/* State Detail Slide-Out Panel */}
      <AnimatePresence>
        {selectedData && (
          <StateDetailPanel state={selectedData} onClose={() => setSelectedState(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
