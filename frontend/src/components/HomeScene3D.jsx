import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, Sparkles, Icosahedron, Sphere } from "@react-three/drei";
import { useRef, useMemo, useLayoutEffect, Suspense } from "react";
import * as THREE from "three";

/* =========================================================
   Scientific scene: silicate diffusion → in-pore nucleation
   --------------------------------------------------------- */

const SUBSTRATE_CENTER = [4.5, 0.3, 0];
const SUBSTRATE_RADIUS = 1.55;

/* ---------- Porous mineral substrate ----------
   A semi-translucent low-poly icosahedron suggests a stone surface with
   irregular facets / pores. An inner skin gives parallax / depth so the
   internal lattice reads as "beneath the surface". */
function PorousSubstrate() {
    const outerRef = useRef();
    const innerRef = useRef();
    useFrame((_, delta) => {
        if (outerRef.current) outerRef.current.rotation.y += delta * 0.04;
        if (innerRef.current) {
            innerRef.current.rotation.y -= delta * 0.03;
            innerRef.current.rotation.x += delta * 0.015;
        }
    });
    return (
        <group position={SUBSTRATE_CENTER}>
            {/* Outer skin – the porous surface */}
            <Icosahedron ref={outerRef} args={[SUBSTRATE_RADIUS, 1]}>
                <meshStandardMaterial
                    color="#B8AE9C"
                    roughness={1}
                    metalness={0}
                    transparent
                    opacity={0.18}
                    side={THREE.DoubleSide}
                    flatShading
                />
            </Icosahedron>
            {/* Inner skin – sub-surface void */}
            <Icosahedron ref={innerRef} args={[SUBSTRATE_RADIUS * 0.88, 0]}>
                <meshStandardMaterial
                    color="#C9C0AE"
                    transparent
                    opacity={0.1}
                    side={THREE.DoubleSide}
                    flatShading
                />
            </Icosahedron>
        </group>
    );
}

/* ---------- A single silicate particle diffusing toward a pore ----------
   Travels along a curved path from outside → into the substrate, then
   shrinks and fades to zero as it "bonds" chemically. Recycles on loop. */
function SilicateParticle({ startPos, targetPos, delay, duration, color = "#D9CDB5" }) {
    const meshRef = useRef();
    const matRef = useRef();
    const start = useMemo(() => new THREE.Vector3(...startPos), [startPos]);
    const target = useMemo(() => new THREE.Vector3(...targetPos), [targetPos]);

    useFrame((state) => {
        if (!meshRef.current) return;
        const elapsed = (state.clock.elapsedTime + delay) % duration;
        const t = elapsed / duration; // 0 → 1

        // Brownian wobble that fades as the particle gets close
        const wobble = 0.15 * (1 - t);
        const px = THREE.MathUtils.lerp(start.x, target.x, t) +
            Math.sin(elapsed * 1.7 + delay) * wobble;
        const py = THREE.MathUtils.lerp(start.y, target.y, t) +
            Math.cos(elapsed * 1.3 + delay) * wobble;
        const pz = THREE.MathUtils.lerp(start.z, target.z, t) +
            Math.sin(elapsed * 1.1 + delay * 0.5) * wobble;

        meshRef.current.position.set(px, py, pz);

        // Shrink + fade as bond completes (last 30% of trajectory)
        const fade = t < 0.7 ? 1 : 1 - (t - 0.7) / 0.3;
        const scale = 0.06 * fade;
        meshRef.current.scale.setScalar(Math.max(scale, 0.0001));
        if (matRef.current) matRef.current.opacity = 0.7 * fade;
    });

    return (
        <mesh ref={meshRef} position={startPos}>
            <icosahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
                ref={matRef}
                color={color}
                roughness={0.85}
                metalness={0.05}
                transparent
                opacity={0.7}
            />
        </mesh>
    );
}

/* ---------- Internal crystalline lattice (nucleation) ----------
   A small tetrahedral silicate network living inside the substrate.
   Its visibility breathes slowly so the network reads as "gradually
   appearing beneath the surface". */
function Bond({ from, to, thickness = 0.014, color = "#C89F5D" }) {
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
            <cylinderGeometry args={[thickness, thickness, 1, 8]} />
            <meshStandardMaterial
                color={color}
                roughness={0.6}
                metalness={0.2}
                transparent
                opacity={0.4}
            />
        </mesh>
    );
}

function CrystallineCore() {
    const groupRef = useRef();

    // Two interlocking silicate tetrahedra (small, inside the substrate)
    const r = 0.55;
    const verticesA = useMemo(
        () => [
            [0, 0, 0],
            [r, r, r],
            [r, -r, -r],
            [-r, r, -r],
            [-r, -r, r],
        ],
        [r]
    );
    const verticesB = useMemo(
        () => [
            [0.35, 0.1, -0.15],
            [r + 0.35, -r + 0.1, r - 0.15],
            [r + 0.35, r + 0.1, -r - 0.15],
            [-r + 0.35, -r + 0.1, -r - 0.15],
            [-r + 0.35, r + 0.1, r - 0.15],
        ],
        [r]
    );

    useFrame((state, delta) => {
        if (!groupRef.current) return;
        groupRef.current.rotation.y += delta * 0.08;
        groupRef.current.rotation.x += delta * 0.025;

        // Slow breathing reveal of the entire network
        const t = state.clock.elapsedTime;
        const opacity = 0.22 + (Math.sin(t * 0.25) + 1) * 0.22; // 0.22 → 0.66
        groupRef.current.traverse((obj) => {
            if (obj.isMesh && obj.material && obj.material.transparent) {
                // Scale per-element so atoms are slightly more visible than bonds
                const factor = obj.geometry.type === "CylinderGeometry" ? 0.7 : 1;
                obj.material.opacity = opacity * factor;
            }
        });
    });

    return (
        <group ref={groupRef} position={SUBSTRATE_CENTER}>
            {/* Tetrahedron A */}
            {verticesA.map((v, i) => (
                <Sphere key={`a-${i}`} args={[i === 0 ? 0.12 : 0.07, 16, 16]} position={v}>
                    <meshStandardMaterial
                        color={i === 0 ? "#9D8F76" : "#E5DCC4"}
                        roughness={0.55}
                        metalness={0.15}
                        emissive={i === 0 ? "#C89F5D" : "#000000"}
                        emissiveIntensity={i === 0 ? 0.18 : 0}
                        transparent
                        opacity={0.5}
                    />
                </Sphere>
            ))}
            {verticesA.slice(1).map((v, i) => (
                <Bond key={`ab-${i}`} from={verticesA[0]} to={v} />
            ))}

            {/* Tetrahedron B (interlocked) */}
            {verticesB.map((v, i) => (
                <Sphere key={`b-${i}`} args={[i === 0 ? 0.11 : 0.065, 16, 16]} position={v}>
                    <meshStandardMaterial
                        color={i === 0 ? "#9D8F76" : "#E5DCC4"}
                        roughness={0.55}
                        metalness={0.15}
                        emissive={i === 0 ? "#C89F5D" : "#000000"}
                        emissiveIntensity={i === 0 ? 0.16 : 0}
                        transparent
                        opacity={0.5}
                    />
                </Sphere>
            ))}
            {verticesB.slice(1).map((v, i) => (
                <Bond key={`bb-${i}`} from={verticesB[0]} to={v} thickness={0.012} />
            ))}

            {/* Bridge between the two centers */}
            <Bond from={verticesA[0]} to={verticesB[0]} thickness={0.01} color="#DDA74F" />
        </group>
    );
}

/* ---------- Scene ---------- */
export const HomeScene3D = () => {
    // Generate a cloud of particle trajectories. Random spherical starts
    // at radius 4-5 around substrate, targets near substrate surface.
    const particles = useMemo(() => {
        const arr = [];
        const center = new THREE.Vector3(...SUBSTRATE_CENTER);
        const seeded = (i) => (Math.sin(i * 12.9898) * 43758.5453) % 1; // deterministic pseudo-random
        const rnd = (i) => Math.abs(seeded(i));
        for (let i = 0; i < 36; i++) {
            const ang = (i / 36) * Math.PI * 2 + rnd(i * 3) * 0.6;
            const elev = (rnd(i * 7) - 0.5) * 3.2;
            const dist = 4 + rnd(i * 11) * 1.5;
            const startPos = [
                center.x + Math.cos(ang) * dist,
                center.y + elev,
                Math.sin(ang) * dist * 0.45,
            ];

            // Target: a point just inside the substrate skin
            const theta = rnd(i * 17) * Math.PI * 2;
            const phi = Math.acos(2 * rnd(i * 19) - 1);
            const tr = SUBSTRATE_RADIUS * (0.55 + rnd(i * 23) * 0.35);
            const targetPos = [
                center.x + tr * Math.sin(phi) * Math.cos(theta),
                center.y + tr * Math.sin(phi) * Math.sin(theta),
                tr * Math.cos(phi),
            ];
            arr.push({
                startPos,
                targetPos,
                delay: rnd(i * 29) * 6,
                duration: 5.5 + rnd(i * 31) * 2.5,
                color: rnd(i * 37) > 0.85 ? "#CFA17A" : "#E5DCC4",
            });
        }
        return arr;
    }, []);

    return (
        <Canvas
            data-testid="home-3d-canvas"
            camera={{ position: [0, 0.4, 8.4], fov: 45 }}
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true }}
            style={{ background: "transparent" }}
        >
            <Suspense fallback={null}>
                <ambientLight intensity={0.75} />
                <directionalLight position={[5, 6, 5]} intensity={0.6} color="#FFE9C8" />
                <pointLight position={[4.5, 0.3, 2.5]} intensity={0.35} color="#DDA74F" />

                {/* Porous substrate skin */}
                <PorousSubstrate />

                {/* Crystalline network nucleating inside */}
                <Float speed={0.4} rotationIntensity={0.05} floatIntensity={0.2}>
                    <CrystallineCore />
                </Float>

                {/* Diffusing silicate particles */}
                {particles.map((p, i) => (
                    <SilicateParticle key={i} {...p} />
                ))}

                {/* Ambient mineral dust */}
                <Sparkles
                    count={36}
                    position={SUBSTRATE_CENTER}
                    scale={[5, 4, 4]}
                    size={1}
                    speed={0.18}
                    color="#CFA17A"
                    opacity={0.28}
                />

                <Environment preset="apartment" />
                <fog attach="fog" args={["#F5F5F0", 9, 22]} />
            </Suspense>
        </Canvas>
    );
};
