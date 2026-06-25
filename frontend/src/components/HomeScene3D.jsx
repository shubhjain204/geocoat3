import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, MeshDistortMaterial, Icosahedron, Sparkles, TorusKnot } from "@react-three/drei";
import { useRef, Suspense } from "react";

function FloatingCrystal({ position, color, scale, speed = 1, distort = 0.25 }) {
    const ref = useRef();
    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x += delta * 0.12 * speed;
            ref.current.rotation.y += delta * 0.18 * speed;
        }
    });
    return (
        <Float speed={1 * speed} rotationIntensity={0.5} floatIntensity={1.4}>
            <Icosahedron ref={ref} args={[1, 1]} position={position} scale={scale}>
                <MeshDistortMaterial
                    color={color}
                    roughness={0.85}
                    metalness={0.05}
                    distort={distort}
                    speed={1.2}
                    flatShading
                />
            </Icosahedron>
        </Float>
    );
}

function OrbitingRing({ position, color, scale }) {
    const ref = useRef();
    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x += delta * 0.2;
            ref.current.rotation.z += delta * 0.25;
        }
    });
    return (
        <Float speed={0.8} rotationIntensity={0.4} floatIntensity={0.8}>
            <TorusKnot ref={ref} args={[0.9, 0.18, 100, 16, 2, 3]} position={position} scale={scale}>
                <meshStandardMaterial color={color} roughness={0.8} metalness={0.15} flatShading />
            </TorusKnot>
        </Float>
    );
}

export const HomeScene3D = () => {
    return (
        <Canvas
            data-testid="home-3d-canvas"
            camera={{ position: [0, 0, 6.5], fov: 45 }}
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true }}
            style={{ background: "transparent" }}
        >
            <Suspense fallback={null}>
                <ambientLight intensity={0.55} />
                <directionalLight position={[5, 6, 4]} intensity={1.2} color="#FFE9C8" />
                <directionalLight position={[-4, -3, -3]} intensity={0.5} color="#3A4538" />
                <pointLight position={[0, 0, 4]} intensity={0.5} color="#DDA74F" />

                {/* Two distinct mineral pieces representing two product systems */}
                <FloatingCrystal position={[-1.8, 0.4, 0]} color="#EAE6DA" scale={1.3} speed={0.9} distort={0.2} />
                <FloatingCrystal position={[1.9, -0.3, 0]} color="#3A4538" scale={1.1} speed={1.05} distort={0.25} />

                {/* Connecting halo */}
                <OrbitingRing position={[0, 0.1, -0.5]} color="#DDA74F" scale={0.55} />

                <FloatingCrystal position={[0, 1.7, -1.5]} color="#C05A45" scale={0.4} speed={1.2} distort={0.35} />
                <FloatingCrystal position={[-0.2, -1.8, -1]} color="#DDA74F" scale={0.35} speed={1.1} distort={0.4} />

                <Sparkles count={50} scale={[10, 6, 5]} size={2} speed={0.25} color="#DDA74F" opacity={0.7} />

                <Environment preset="apartment" />
                <fog attach="fog" args={["#F5F5F0", 9, 20]} />
            </Suspense>
        </Canvas>
    );
};
