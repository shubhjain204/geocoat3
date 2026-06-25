import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, Sparkles, Octahedron, Torus, MeshDistortMaterial } from "@react-three/drei";
import { useRef, Suspense } from "react";

/* Central mineral monolith — a slowly rotating dark green diamond. */
function Monolith() {
    const ref = useRef();
    useFrame((_, delta) => {
        if (ref.current) {
            ref.current.rotation.y += delta * 0.18;
            ref.current.rotation.x += delta * 0.04;
        }
    });
    return (
        <Float speed={0.6} rotationIntensity={0.15} floatIntensity={0.7}>
            <Octahedron ref={ref} args={[1.7, 0]} position={[2.6, 0, 0]}>
                <MeshDistortMaterial
                    color="#3A4538"
                    roughness={0.92}
                    metalness={0.04}
                    distort={0.08}
                    speed={0.7}
                    flatShading
                />
            </Octahedron>
        </Float>
    );
}

/* Gyroscopic orbit ring rotating on a chosen axis. */
function OrbitRing({ radius, tube, color, axis, speed = 0.3 }) {
    const ref = useRef();
    useFrame((_, delta) => {
        if (!ref.current) return;
        if (axis === "x") ref.current.rotation.x += delta * speed;
        if (axis === "y") ref.current.rotation.y += delta * speed;
        if (axis === "z") ref.current.rotation.z += delta * speed;
    });
    return (
        <Torus
            ref={ref}
            args={[radius, tube, 32, 100]}
            position={[2.6, 0, 0]}
            rotation={
                axis === "x"
                    ? [Math.PI / 3, 0, 0]
                    : axis === "z"
                      ? [0, 0, Math.PI / 4]
                      : [0, 0, 0]
            }
        >
            <meshStandardMaterial color={color} roughness={0.7} metalness={0.3} flatShading />
        </Torus>
    );
}

/* Small mineral flecks orbiting at outer radii. */
function MineralFleck({ position, color, scale }) {
    const ref = useRef();
    useFrame((_, delta) => {
        if (ref.current) ref.current.rotation.y += delta * 0.4;
    });
    return (
        <Float speed={1.4} rotationIntensity={0.6} floatIntensity={1.2}>
            <Octahedron ref={ref} args={[1, 0]} position={position} scale={scale}>
                <meshStandardMaterial color={color} roughness={0.85} metalness={0.05} flatShading />
            </Octahedron>
        </Float>
    );
}

export const HomeScene3D = () => {
    return (
        <Canvas
            data-testid="home-3d-canvas"
            camera={{ position: [0, 0.5, 7], fov: 45 }}
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true }}
            style={{ background: "transparent" }}
        >
            <Suspense fallback={null}>
                <ambientLight intensity={0.55} />
                <directionalLight position={[5, 6, 4]} intensity={1.3} color="#FFE9C8" />
                <directionalLight position={[-4, -3, -3]} intensity={0.5} color="#C05A45" />
                <pointLight position={[3, 0, 3]} intensity={0.6} color="#DDA74F" />

                {/* Central green diamond */}
                <Monolith />

                {/* Three gyroscopic rings on different axes */}
                <OrbitRing radius={2.4} tube={0.04} color="#DDA74F" axis="x" speed={0.25} />
                <OrbitRing radius={2.85} tube={0.025} color="#C05A45" axis="z" speed={0.18} />
                <OrbitRing radius={3.3} tube={0.018} color="#5B7059" axis="y" speed={0.22} />

                {/* Mineral flecks orbiting */}
                <MineralFleck position={[4.8, 1.4, -0.5]} color="#C05A45" scale={0.18} />
                <MineralFleck position={[0.1, -1.8, -1]} color="#DDA74F" scale={0.22} />
                <MineralFleck position={[5.4, -0.5, 0.5]} color="#EAE6DA" scale={0.15} />

                <Sparkles count={60} scale={[10, 6, 5]} size={2} speed={0.25} color="#DDA74F" opacity={0.7} />

                <Environment preset="apartment" />
                <fog attach="fog" args={["#F5F5F0", 9, 20]} />
            </Suspense>
        </Canvas>
    );
};
