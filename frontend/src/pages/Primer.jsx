import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, Sparkles, Cylinder, Sphere } from "@react-three/drei";
import {
    Shield,
    Layers,
    Droplets,
    Thermometer,
    Zap,
    ArrowDown,
    Anchor,
    Waves,
    CheckCircle2,
    Download,
} from "lucide-react";

import { SmoothScroll } from "@/components/SmoothScroll";
import { Navigation } from "@/components/Navigation";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

/* ---------- 3D scene: exploded three-layer coating system ----------
   Cylindrical discs slightly tilted + a steel sphere emerging from beneath. */
function LayerDisc({ position, color, rotationSpeed = 0.2, scale = 1 }) {
    const ref = useRef();
    useFrame((_, delta) => {
        if (ref.current) ref.current.rotation.y += delta * rotationSpeed;
    });
    return (
        <Float speed={0.6} rotationIntensity={0.18} floatIntensity={0.6}>
            <Cylinder
                ref={ref}
                args={[1.7, 1.7, 0.18, 64]}
                position={position}
                rotation={[Math.PI / 14, 0, Math.PI / 22]}
                scale={scale}
            >
                <meshStandardMaterial color={color} roughness={0.85} metalness={0.25} flatShading />
            </Cylinder>
        </Float>
    );
}

function SteelCore({ position }) {
    const ref = useRef();
    useFrame((_, delta) => {
        if (ref.current) ref.current.rotation.y += delta * 0.18;
    });
    return (
        <Float speed={0.4} rotationIntensity={0.1} floatIntensity={0.35}>
            <Sphere ref={ref} args={[1.05, 64, 64]} position={position}>
                <meshStandardMaterial color="#26241F" roughness={0.35} metalness={0.95} />
            </Sphere>
        </Float>
    );
}

function PrimerScene() {
    return (
        <Canvas
            data-testid="primer-3d-canvas"
            camera={{ position: [3.4, 2.1, 6], fov: 42 }}
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true }}
        >
            <Suspense fallback={null}>
                <ambientLight intensity={0.55} />
                <directionalLight position={[5, 6, 4]} intensity={1.35} color="#FFE9C8" />
                <directionalLight position={[-4, -2, -3]} intensity={0.4} color="#3A4538" />
                <pointLight position={[1, 3, 3]} intensity={0.55} color="#DDA74F" />

                {/* Three exploded layer discs above */}
                <LayerDisc position={[3.4, 2.2, 0]} color="#3A4538" rotationSpeed={0.15} scale={1.05} />
                <LayerDisc position={[3.4, 1.55, 0]} color="#C89F5D" rotationSpeed={0.2} scale={0.98} />
                <LayerDisc position={[3.4, 0.9, 0]} color="#5C5751" rotationSpeed={0.25} scale={0.94} />

                {/* Steel core sphere emerging from below the stack */}
                <SteelCore position={[3.4, -0.45, 0]} />

                <Sparkles count={50} scale={[8, 6, 5]} size={2} speed={0.3} color="#DDA74F" opacity={0.7} />
                <Environment preset="warehouse" />
                <fog attach="fog" args={["#F5F5F0", 8, 18]} />
            </Suspense>
        </Canvas>
    );
}

/* ---------- Hero ---------- */
function PrimerHero() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });
    const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
    const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

    return (
        <section
            ref={ref}
            data-testid="primer-hero"
            className="relative min-h-screen w-full overflow-hidden bg-[#F5F5F0]"
        >
            <div className="absolute inset-0 z-0">
                <PrimerScene />
            </div>
            <div className="grain-overlay z-10" />
            <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#F5F5F0] to-transparent z-10 pointer-events-none" />

            <motion.div
                style={{ y, opacity }}
                className="relative z-20 max-w-[1500px] mx-auto px-6 md:px-12 lg:px-16 pt-40 pb-24 min-h-screen flex flex-col justify-between pointer-events-none"
            >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="flex items-center gap-3 text-xs tracking-[0.3em] uppercase text-[#5B7059] pointer-events-auto"
                >
                    <span className="w-8 h-px bg-[#5B7059]" />
                    <span>Marine · Offshore · Splash zone</span>
                </motion.div>

                <div className="max-w-5xl pointer-events-auto">
                    <motion.h1
                        initial={{ opacity: 0, y: 60 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, delay: 0.2, ease: [0.86, 0, 0.07, 1] }}
                        className="font-heading font-extralight tracking-tighter leading-[0.95] text-[#1A1A1A] text-5xl sm:text-7xl md:text-8xl lg:text-[8rem] text-balance"
                    >
                        Steel that
                        <br />
                        <span className="italic font-light text-[#3A4538]">outlasts</span> the sea
                        <span className="text-[#C05A45]">.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.7 }}
                        className="mt-10 max-w-xl text-base md:text-lg text-[#5B7059] leading-relaxed"
                    >
                        A three-layer mineral silicate anti-corrosion system engineered for
                        marine, offshore, and splash-zone steel. Sacrificial zinc, lamellar
                        barrier, polyurethane topcoat — total protection.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1 }}
                        className="mt-12 flex flex-wrap items-center gap-4"
                    >
                        <a
                            href="#system"
                            data-testid="primer-cta-primary"
                            className="group inline-flex items-center gap-3 bg-[#3A4538] text-[#F5F5F0] px-8 py-4 rounded-sm hover:bg-[#1F2A1F] transition-all duration-300 hover:-translate-y-0.5"
                        >
                            <span className="text-sm tracking-wide uppercase">See the System</span>
                            <span className="w-6 h-px bg-[#F5F5F0] group-hover:w-10 transition-all" />
                        </a>
                        <a
                            href="#performance"
                            data-testid="primer-cta-secondary"
                            className="inline-flex items-center gap-2 text-[#1A1A1A] px-2 py-4 hover:text-[#C05A45] transition-colors"
                        >
                            <span className="text-sm tracking-wide uppercase border-b border-[#1A1A1A] hover:border-[#C05A45] pb-1">
                                Performance Data
                            </span>
                        </a>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4, duration: 1 }}
                    className="flex flex-wrap items-end justify-between gap-6 pointer-events-auto"
                >
                    <div className="flex items-center gap-2 text-xs tracking-widest uppercase text-[#1A1A1A]">
                        <ArrowDown size={14} className="animate-bounce" />
                        <span>Scroll</span>
                    </div>
                    <div className="flex flex-wrap gap-x-10 gap-y-4 font-heading font-light bg-[#F5F5F0]/85 backdrop-blur-md border border-[#D1CEC5] px-6 py-4 rounded-sm">
                        {[
                            { k: "10,000+ h", v: "Salt spray" },
                            { k: "15 yr", v: "Warranty" },
                            { k: ">15 MPa", v: "Adhesion" },
                            { k: "-40 / 150 °C", v: "Range" },
                        ].map((stat) => (
                            <div key={stat.k} data-testid={`primer-stat-${stat.k.replace(/[^a-z0-9]/gi, "")}`}>
                                <div className="text-2xl text-[#1A1A1A]">{stat.k}</div>
                                <div className="text-[11px] uppercase tracking-[0.2em] text-[#3A4538] mt-1 font-semibold">
                                    {stat.v}
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
}

/* ---------- System Layers ---------- */
const layers = [
    {
        n: "01",
        title: "Zinc-Rich Primer",
        body: "High zinc content (90 % in dry film) provides sacrificial corrosion protection at the steel interface.",
        icon: Shield,
        accent: "#5C5751",
    },
    {
        n: "02",
        title: "Micaceous Iron Oxide",
        body: "Lamellar barrier layer of platelet pigments blocks moisture and UV while allowing inspection.",
        icon: Layers,
        accent: "#C89F5D",
    },
    {
        n: "03",
        title: "Polyurethane Topcoat",
        body: "Chemical and abrasion-resistant finish, color-stable for 15+ years in atmospheric service.",
        icon: Droplets,
        accent: "#3A4538",
    },
];

function SystemSection() {
    return (
        <section
            id="system"
            data-testid="system-section"
            className="relative bg-[#F5F5F0] py-24 md:py-32 lg:py-40"
        >
            <div className="max-w-[1500px] mx-auto px-6 md:px-12 lg:px-16">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="grid grid-cols-12 gap-8 mb-16 md:mb-20"
                >
                    <div className="col-span-12 lg:col-span-3 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-[#C05A45]">
                        <span className="w-8 h-px bg-[#C05A45]" />
                        <span>The System</span>
                    </div>
                    <h2 className="col-span-12 lg:col-span-9 font-heading text-4xl md:text-6xl lg:text-7xl font-extralight tracking-tight leading-[0.95] text-[#1A1A1A] text-balance">
                        Three layers<span className="text-[#C05A45]">.</span>{" "}
                        <span className="italic text-[#3A4538]">Total</span> protection.
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                    {layers.map((l, i) => {
                        const Icon = l.icon;
                        return (
                            <motion.div
                                key={l.n}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.7, delay: i * 0.1 }}
                                data-testid={`primer-layer-${l.n}`}
                                className="group relative bg-[#FFFFFF] border border-[#D1CEC5] p-8 md:p-10 hover:-translate-y-1 transition-all duration-500 overflow-hidden"
                            >
                                <div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                                    style={{ background: `radial-gradient(circle at 0% 0%, ${l.accent}1a, transparent 60%)` }}
                                />
                                <div className="relative flex flex-col gap-10 h-full">
                                    <div className="flex items-start justify-between">
                                        <div
                                            className="w-12 h-12 grid place-items-center border border-[#D1CEC5]"
                                            style={{ color: l.accent }}
                                        >
                                            <Icon size={22} strokeWidth={1.2} />
                                        </div>
                                        <div className="font-mono text-3xl text-[#5B7059]/40 font-light">
                                            {l.n}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-heading text-2xl md:text-3xl font-light text-[#1A1A1A] mb-3">
                                            {l.title}
                                        </h3>
                                        <p className="text-sm text-[#5B7059] leading-relaxed max-w-md">
                                            {l.body}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

/* ---------- Performance Table ---------- */
const performance = [
    { property: "Salt Spray", standard: "ASTM B117", result: "10,000+ hrs", notes: "No undercutting at scribe", icon: Waves },
    { property: "Adhesion", standard: "ISO 4624", result: "> 15 MPa", notes: "Cohesive failure in substrate", icon: Anchor },
    { property: "Temperature", standard: "—", result: "−40 °C to 150 °C", notes: "Continuous service", icon: Thermometer },
    { property: "Humidity", standard: "ISO 6270", result: "4,000+ hrs", notes: "No blistering", icon: Droplets },
    { property: "Impact", standard: "ASTM D2794", result: "160 in-lb", notes: "Direct / reverse", icon: Zap },
];

function PerformanceSection() {
    return (
        <section
            id="performance"
            data-testid="performance-section"
            className="relative bg-[#EAE6DA] py-24 md:py-32 lg:py-40 overflow-hidden"
        >
            <div className="grain-overlay" />

            <div className="relative max-w-[1500px] mx-auto px-6 md:px-12 lg:px-16">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="grid grid-cols-12 gap-8 mb-16"
                >
                    <div className="col-span-12 lg:col-span-3 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-[#C05A45]">
                        <span className="w-8 h-px bg-[#C05A45]" />
                        <span>Performance</span>
                    </div>
                    <h2 className="col-span-12 lg:col-span-9 font-heading text-4xl md:text-6xl lg:text-7xl font-extralight tracking-tight leading-[0.95] text-[#1A1A1A] text-balance">
                        Tested to <span className="italic text-[#3A4538]">extremes</span>.
                    </h2>
                </motion.div>

                <div className="bg-[#F5F5F0] border border-[#D1CEC5] overflow-hidden">
                    <div className="hidden md:grid grid-cols-12 px-8 py-5 border-b border-[#D1CEC5] text-[10px] uppercase tracking-[0.25em] text-[#5B7059] font-semibold bg-[#EAE6DA]/40">
                        <div className="col-span-4">Property</div>
                        <div className="col-span-3">Standard</div>
                        <div className="col-span-2">Result</div>
                        <div className="col-span-3">Notes</div>
                    </div>
                    {performance.map((p, i) => {
                        const Icon = p.icon;
                        return (
                            <motion.div
                                key={p.property}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.5, delay: i * 0.05 }}
                                className="grid grid-cols-12 gap-4 md:gap-0 px-6 md:px-8 py-6 md:py-7 border-b border-[#D1CEC5] last:border-b-0 hover:bg-[#EAE6DA]/30 transition-colors group items-center"
                                data-testid={`performance-row-${p.property.toLowerCase().replace(/\s/g, "-")}`}
                            >
                                <div className="col-span-12 md:col-span-4 flex items-center gap-4">
                                    <div className="w-9 h-9 grid place-items-center border border-[#D1CEC5] text-[#C05A45] group-hover:border-[#C05A45] transition-colors">
                                        <Icon size={16} strokeWidth={1.3} />
                                    </div>
                                    <div className="font-heading text-xl md:text-2xl font-light text-[#1A1A1A]">
                                        {p.property}
                                    </div>
                                </div>
                                <div className="col-span-6 md:col-span-3 text-xs font-mono uppercase tracking-[0.2em] text-[#5B7059]">
                                    {p.standard}
                                </div>
                                <div className="col-span-6 md:col-span-2 font-heading text-lg md:text-xl font-medium text-[#3A4538]">
                                    {p.result}
                                </div>
                                <div className="col-span-12 md:col-span-3 text-sm text-[#5B7059] leading-relaxed">
                                    {p.notes}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Warranty block */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
                    data-testid="primer-warranty-block"
                >
                    {[
                        { k: "15-YEAR", v: "Primer warranty", icon: Shield },
                        { k: "25+", v: "Years formulating", icon: CheckCircle2 },
                        { k: "100%", v: "VOC-free mineral system", icon: Droplets },
                    ].map((b) => {
                        const Icon = b.icon;
                        return (
                            <div
                                key={b.k}
                                className="bg-[#1A1A1A] text-[#F5F5F0] p-8 md:p-10 flex items-center justify-between gap-4"
                            >
                                <div>
                                    <div className="font-heading text-4xl md:text-5xl font-extralight">
                                        {b.k}
                                    </div>
                                    <div className="text-xs uppercase tracking-[0.25em] text-[#DDA74F] mt-2">
                                        {b.v}
                                    </div>
                                </div>
                                <Icon size={36} strokeWidth={1} className="text-[#DDA74F] opacity-70" />
                            </div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}

/* ---------- Applications ---------- */
const applications = [
    {
        tag: "01 / Marine",
        title: "Hulls, decks, ballast tanks",
        body: "Long-term protection for ocean-going steel exposed to constant immersion, salt and abrasion.",
        img: "https://images.unsplash.com/photo-1604506522146-316c8bedd874?fm=jpg&q=80&w=1400&auto=format&fit=crop",
        span: "col-span-12 md:col-span-7",
        aspect: "aspect-[16/10]",
    },
    {
        tag: "02 / Offshore",
        title: "Platforms & risers",
        body: "A coating system specified for splash-zone and atmospheric service on offshore structures.",
        img: "https://images.unsplash.com/photo-1585713181935-d5f622cc2415?fm=jpg&q=80&w=1200&auto=format&fit=crop",
        span: "col-span-12 md:col-span-5",
        aspect: "aspect-[4/5]",
    },
    {
        tag: "03 / Industrial",
        title: "Bridges & infrastructure",
        body: "High-performance corrosion protection for steel bridges, pipelines, and heavy infrastructure.",
        img: "https://images.pexels.com/photos/37582309/pexels-photo-37582309.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=1200",
        span: "col-span-12 md:col-span-5",
        aspect: "aspect-[4/5]",
    },
    {
        tag: "04 / Energy",
        title: "Wind towers & substations",
        body: "Designed for renewable-energy structures where 25-year-plus maintenance cycles are essential.",
        img: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?fm=jpg&q=80&w=1400&auto=format&fit=crop",
        span: "col-span-12 md:col-span-7",
        aspect: "aspect-[16/10]",
    },
];

function PrimerApplications() {
    return (
        <section
            id="applications"
            data-testid="primer-applications-section"
            className="relative bg-[#1A1A1A] text-[#F5F5F0] py-24 md:py-32 lg:py-40 overflow-hidden"
        >
            <div className="grain-overlay opacity-[0.08]" />
            <div className="relative max-w-[1500px] mx-auto px-6 md:px-12 lg:px-16">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="grid grid-cols-12 gap-8 mb-20"
                >
                    <div className="col-span-12 lg:col-span-3 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-[#DDA74F]">
                        <span className="w-8 h-px bg-[#DDA74F]" />
                        <span>Applications</span>
                    </div>
                    <h2 className="col-span-12 lg:col-span-9 font-heading text-4xl md:text-6xl lg:text-7xl font-extralight tracking-tight leading-[0.95] text-[#F5F5F0] text-balance">
                        Engineered for the{" "}
                        <span className="italic text-[#DDA74F]">harshest</span> environments
                        on earth.
                    </h2>
                </motion.div>

                <div className="grid grid-cols-12 gap-6 md:gap-8">
                    {applications.map((a, i) => (
                        <motion.div
                            key={a.title}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ duration: 0.8, delay: i * 0.08 }}
                            className={`${a.span} group`}
                            data-testid={`primer-app-${a.tag.split(" / ")[1].toLowerCase()}`}
                        >
                            <div className={`relative ${a.aspect} overflow-hidden mb-6`}>
                                <img
                                    src={a.img}
                                    alt={a.title}
                                    className="w-full h-full object-cover transition-transform duration-[1.6s] group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/40 to-transparent" />
                                <div className="absolute top-4 left-4 text-xs uppercase tracking-[0.3em] text-[#F5F5F0]/80 font-mono">
                                    {a.tag}
                                </div>
                            </div>
                            <h3 className="font-heading text-2xl md:text-3xl font-light mb-3 text-[#F5F5F0]">
                                {a.title}
                            </h3>
                            <p className="text-sm text-[#EAE6DA]/70 leading-relaxed max-w-md">
                                {a.body}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ---------- Process ---------- */
const steps = [
    { n: "01", title: "Site survey", body: "Substrate inspection — degree of corrosion, salt contamination, profile depth, project environment." },
    { n: "02", title: "Surface preparation", body: "Abrasive blast to Sa 2½ (ISO 8501-1) with 50-75 µm profile, immediately before primer application." },
    { n: "03", title: "Zinc-rich primer", body: "Spray-applied at 75 µm DFT. Provides sacrificial cathodic protection to base steel." },
    { n: "04", title: "MIO intermediate", body: "Lamellar barrier coat at 125 µm DFT. Blocks moisture, UV, and chemical attack." },
    { n: "05", title: "Polyurethane topcoat", body: "Final 75 µm DFT for color, gloss, and chemical / abrasion resistance. Cure 7 days." },
];

function PrimerProcess() {
    return (
        <section
            id="process"
            data-testid="primer-process-section"
            className="relative bg-[#F5F5F0] py-24 md:py-32 lg:py-40"
        >
            <div className="max-w-[1500px] mx-auto px-6 md:px-12 lg:px-16">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="grid grid-cols-12 gap-8 mb-20"
                >
                    <div className="col-span-12 lg:col-span-3 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-[#C05A45]">
                        <span className="w-8 h-px bg-[#C05A45]" />
                        <span>Application Process</span>
                    </div>
                    <h2 className="col-span-12 lg:col-span-9 font-heading text-4xl md:text-6xl lg:text-7xl font-extralight tracking-tight leading-[0.95] text-[#1A1A1A] text-balance">
                        Five steps from{" "}
                        <span className="italic text-[#3A4538]">spec</span> to service life.
                    </h2>
                </motion.div>

                <div className="grid grid-cols-12 gap-6 md:gap-8">
                    <div className="col-span-12 lg:col-span-5">
                        <div className="lg:sticky lg:top-32">
                            <div className="aspect-[4/5] overflow-hidden mb-6">
                                <img
                                    src="https://images.unsplash.com/photo-1708894462826-ba3fa93b41b7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODB8MHwxfHNlYXJjaHwxfHxtaW5lcmFsJTIwcGFpbnQlMjB0ZXh0dXJlfGVufDB8fHx8MTc4MjExMTgwOHww&ixlib=rb-4.1.0&q=85"
                                    alt="Industrial steel surface preparation"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <p className="text-sm text-[#5B7059] leading-relaxed max-w-md">
                                Every primer application is supervised by a GeoCoat-certified
                                inspector. Substrate, environment, and cure are continuously
                                monitored against the spec.
                            </p>
                        </div>
                    </div>

                    <div className="col-span-12 lg:col-span-7 lg:pl-8">
                        <div className="relative">
                            {steps.map((s, i) => (
                                <motion.div
                                    key={s.n}
                                    initial={{ opacity: 0, x: 40 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: "-80px" }}
                                    transition={{ duration: 0.7, delay: i * 0.08 }}
                                    className="relative pl-12 pb-12 last:pb-0 border-l border-[#D1CEC5] last:border-l last:border-l-transparent"
                                    data-testid={`primer-process-step-${s.n}`}
                                >
                                    <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-[#F5F5F0] border border-[#3A4538] grid place-items-center">
                                        <div className="w-2 h-2 rounded-full bg-[#C05A45]" />
                                    </div>
                                    <div className="font-mono text-xs text-[#5B7059] uppercase tracking-[0.3em] mb-2">
                                        Step {s.n}
                                    </div>
                                    <h3 className="font-heading text-2xl md:text-3xl font-light text-[#1A1A1A] mb-3">
                                        {s.title}
                                    </h3>
                                    <p className="text-base text-[#5B7059] leading-relaxed max-w-lg">
                                        {s.body}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ---------- CTA strip ---------- */
function PrimerCTA() {
    return (
        <section
            data-testid="primer-cta-section"
            className="relative bg-[#EAE6DA] py-20 md:py-28"
        >
            <div className="max-w-[1500px] mx-auto px-6 md:px-12 lg:px-16">
                <div className="grid grid-cols-12 gap-8 items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="col-span-12 lg:col-span-7"
                    >
                        <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl font-extralight tracking-tight leading-[1] text-[#1A1A1A] text-balance">
                            Protect your{" "}
                            <span className="italic text-[#3A4538]">next</span> project.
                        </h2>
                        <p className="mt-5 text-base md:text-lg text-[#5B7059] max-w-xl leading-relaxed">
                            Get specifications, samples, and a fixed-price quote from our
                            coatings team within 48 hours.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="col-span-12 lg:col-span-5 flex flex-col md:flex-row gap-3 lg:justify-end"
                    >
                        <a
                            href="#contact"
                            data-testid="primer-quote-btn"
                            className="group inline-flex items-center justify-center gap-3 bg-[#3A4538] text-[#F5F5F0] px-8 py-4 rounded-sm hover:bg-[#C05A45] transition-all duration-300"
                        >
                            <span className="text-sm tracking-wide uppercase">Request a Quote</span>
                            <span>→</span>
                        </a>
                        <a
                            href="#contact"
                            data-testid="primer-techsheet-btn"
                            className="group inline-flex items-center justify-center gap-3 bg-[#F5F5F0] border border-[#3A4538] text-[#1A1A1A] px-8 py-4 rounded-sm hover:bg-[#3A4538] hover:text-[#F5F5F0] transition-all duration-300"
                        >
                            <Download size={16} />
                            <span className="text-sm tracking-wide uppercase">Tech Sheet</span>
                        </a>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

/* ---------- Page composition ---------- */
export default function Primer() {
    return (
        <SmoothScroll>
            <main data-testid="primer-page" className="relative bg-[#F5F5F0] text-[#1A1A1A]">
                <Navigation variant="primer" />
                <PrimerHero />
                <SystemSection />
                <PerformanceSection />
                <PrimerApplications />
                <PrimerProcess />
                <PrimerCTA />
                <Contact />
                <Footer />
            </main>
        </SmoothScroll>
    );
}
