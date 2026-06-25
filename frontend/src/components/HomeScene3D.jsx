import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, Sparkles, Sphere } from "@react-three/drei";
import { useRef, useLayoutEffect, useMemo, Suspense } from "react";
import * as THREE from "three";

/* ---------- Atomic bond cylinder ---------- */
function Bond({ from, to, color = "#D9CDB5", thickness = 0.025 }) {
    const ref = useRef();
    useLayoutEffect(() => {
        if (!ref.current) return;
        const a = new THREE.Vector3(...from);
        const b = new THREE.Vector3(...to);
        const mid = a.clone().add(b).multiplyScalar(0.5);
        const dir = b.clone().sub(a);
        const len = dir.length();
        ref.current.position.copy(mid);
        ref.current.scale.set(1, len, 1);
        ref.current.quaternion.setFromUnitVectors(
            new THREE.Vector3(0, 1, 0),
            dir.clone().normalize()
        );
    }, [from, to]);
    return (
        <mesh ref={ref}>
            <cylinderGeometry args={[thickness, thickness, 1, 16]} />
            <meshStandardMaterial color={color} roughness={0.95} metalness={0} transparent opacity={0.3} />
        </mesh>
    );
}

/* ---------- Atom (sphere) ---------- */
function Atom({ position, color, radius = 0.45, roughness = 0.95, metalness = 0, opacity = 0.32 }) {
    return (
        <Sphere args={[radius, 48, 48]} position={position}>
            <meshStandardMaterial
                color={color}
                roughness={roughness}
                metalness={metalness}
                transparent
                opacity={opacity}
            />
        </Sphere>
    );
}

/* ---------- Silicate tetrahedron + extended bonding lattice ---------- */
function SilicateLattice() {
    const groupRef = useRef();
    useFrame((_, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.12;
            groupRef.current.rotation.x += delta * 0.025;
        }
    });

    // Silicon-oxygen tetrahedron vertices, scaled
    const s = 1.1;
    const vertices = useMemo(
        () => [
            [s, s, s],
            [s, -s, -s],
            [-s, s, -s],
            [-s, -s, s],
        ],
        []
    );

    // Secondary bonded silicate at +x for extended lattice feel
    const offset = 1.7;
    const offsetCenter = [offset, 0, 0];
    const offsetVertices = vertices.map(([x, y, z]) => [x + offset, y, z]);

    return (
        <group ref={groupRef} position={[4.5, 0.3, 0]} scale={0.85}>
            {/* Central silicon */}
            <Atom position={[0, 0, 0]} color="#B8AE9C" radius={0.42} />

            {/* Tetrahedral oxygens */}
            {vertices.map((v, i) => (
                <Atom key={`o-${i}`} position={v} color="#EAE6DA" radius={0.28} />
            ))}

            {/* Bonds: center to each oxygen */}
            {vertices.map((v, i) => (
                <Bond key={`b-${i}`} from={[0, 0, 0]} to={v} />
            ))}

            {/* Secondary silicon */}
            <Atom position={offsetCenter} color="#B8AE9C" radius={0.38} />

            {/* Shared bridging oxygen between the two silicons */}
            <Atom position={[offset / 2, 0, 0]} color="#C89F5D" radius={0.24} opacity={0.38} />
            <Bond from={[0, 0, 0]} to={[offset / 2, 0, 0]} />
            <Bond from={[offset / 2, 0, 0]} to={offsetCenter} />

            {/* Three remaining oxygens on secondary silicon */}
            {offsetVertices.slice(1).map((v, i) => (
                <Atom key={`o2-${i}`} position={v} color="#EAE6DA" radius={0.24} />
            ))}
            {offsetVertices.slice(1).map((v, i) => (
                <Bond key={`b2-${i}`} from={offsetCenter} to={v} thickness={0.02} />
            ))}
        </group>
    );
}

/* ---------- Drifting free atoms (joining the lattice) ---------- */
function FreeAtom({ position, color, scale = 0.18 }) {
    const ref = useRef();
    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.y += delta * 0.4;
            ref.current.position.y =
                position[1] + Math.sin(state.clock.elapsedTime * 0.6 + position[0]) * 0.2;
        }
    });
    return (
        <Float speed={1.0} rotationIntensity={0.3} floatIntensity={0.6}>
            <Sphere ref={ref} args={[1, 32, 32]} position={position} scale={scale}>
                <meshStandardMaterial color={color} roughness={0.95} metalness={0} transparent opacity={0.32} />
            </Sphere>
        </Float>
    );
}

export const HomeScene3D = () => {
    return (
        <Canvas
            data-testid="home-3d-canvas"
            camera={{ position: [0, 0.4, 8], fov: 45 }}
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true }}
            style={{ background: "transparent" }}
        >
            <Suspense fallback={null}>
                <ambientLight intensity={0.7} />
                <directionalLight position={[5, 6, 5]} intensity={0.85} color="#FFE9C8" />
                <directionalLight position={[-5, -2, -3]} intensity={0.25} color="#C9A28A" />
                <pointLight position={[2, 1, 3]} intensity={0.25} color="#E8C99A" />

                <SilicateLattice />

                {/* Free atoms drifting toward the lattice */}
                <FreeAtom position={[-3.4, 1.4, 0]} color="#E8E0CC" scale={0.3} />
                <FreeAtom position={[-3.0, -1.8, 0.5]} color="#CFA17A" scale={0.22} />
                <FreeAtom position={[4.6, 1.8, -0.5]} color="#E8E0CC" scale={0.28} />
                <FreeAtom position={[5.0, -1.5, 0]} color="#CFA17A" scale={0.24} />

                <Sparkles count={50} scale={[12, 7, 5]} size={1.5} speed={0.2} color="#CFA17A" opacity={0.35} />

                <Environment preset="apartment" />
                <fog attach="fog" args={["#F5F5F0", 9, 22]} />
            </Suspense>
        </Canvas>
    );
};
