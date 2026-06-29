import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const systems = [
    {
        slug: "paint",
        to: "/paint",
        tag: "Architectural",
        title: "Mineral Silicate Paint",
        body: "Vapour-permeable, UV-stable coating for concrete and mineral facades. Bonds chemically with the substrate — no peeling, no blistering.",
        bullets: ["8 mineral hues", "60+ yr color fastness", "Heritage approved"],
        cover: "https://images.unsplash.com/photo-1761476267514-ffec14e7af84?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA3MDB8MHwxfHNlYXJjaHwzfHxzdG9uZSUyMGZhY2FkZSUyMGJ1aWxkaW5nfGVufDB8fHx8MTc4MjExMTgwOHww&ixlib=rb-4.1.0&q=85",
        swatch: "#C89F5D",
    },
    {
        slug: "primer",
        to: "/primer",
        tag: "Industrial",
        title: "Mineral Silicate Anti-Corrosion Primer",
        body: "A mineral silicate based primer engineered for steel structure, atmospheric conditions, splash zones and industrial applications. This primer requires topcoat for total protection.",
        bullets: ["10,000+ hrs salt spray", "15-yr primer warranty", "−40 °C to 150 °C"],
        cover: "https://images.pexels.com/photos/31616703/pexels-photo-31616703.jpeg",
        swatch: "#3A4538",
    },
];

export const TwoSystems = () => {
    return (
        <section
            id="systems"
            data-testid="two-systems-section"
            className="relative bg-[#1A1A1A] text-[#F5F5F0] py-24 md:py-32 lg:py-40 overflow-hidden"
        >
            <div className="grain-overlay opacity-[0.08]" />

            <div className="relative max-w-[1500px] mx-auto px-6 md:px-12 lg:px-16">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16 md:mb-24"
                >
                    <h2 className="font-heading text-5xl md:text-7xl lg:text-8xl font-extralight tracking-tight leading-[0.95] text-[#F5F5F0] text-balance">
                        Two systems<span className="text-[#DDA74F]">.</span>{" "}
                        <span className="italic">One standard.</span>
                    </h2>
                    <p className="mt-8 max-w-2xl mx-auto text-base md:text-lg text-[#EAE6DA]/70 leading-relaxed">
                        Both products share the same uncompromising mineral chemistry. One tailored for architectural purposes and another tailored for anti-corrosion purposes.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {systems.map((s, i) => (
                        <motion.div
                            key={s.slug}
                            initial={{ opacity: 0, y: 60 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ duration: 0.8, delay: i * 0.12 }}
                            data-testid={`system-card-${s.slug}`}
                        >
                            <Link
                                to={s.to}
                                className="group flex flex-col h-full relative bg-[#1F2A1F]/40 border border-[#3A4538] hover:border-[#DDA74F] transition-all duration-500 hover:-translate-y-1"
                            >
                                <div className="relative aspect-[16/10] overflow-hidden">
                                    <img
                                        src={s.cover}
                                        alt={s.title}
                                        className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-[1.4s]"
                                    />
                                    <div
                                        className="absolute inset-0"
                                        style={{
                                            background: `linear-gradient(to top, ${s.swatch}33, transparent 70%)`,
                                        }}
                                    />
                                    <div className="absolute top-5 left-5 right-5 flex justify-between items-start">
                                        <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#F5F5F0]/80 bg-[#1A1A1A]/40 backdrop-blur px-3 py-1.5 border border-[#F5F5F0]/20">
                                            {s.tag}
                                        </div>
                                        <div
                                            className="w-10 h-10 rounded-full border border-[#F5F5F0]/30 grid place-items-center bg-[#1A1A1A]/40 backdrop-blur group-hover:bg-[#DDA74F] group-hover:border-[#DDA74F] group-hover:rotate-45 transition-all duration-500"
                                        >
                                            <ArrowUpRight
                                                size={18}
                                                className="text-[#F5F5F0] group-hover:text-[#1A1A1A] group-hover:rotate-[-45deg] transition-all duration-500"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 md:p-10 flex-1 flex flex-col">
                                    <h3 className="font-heading text-3xl md:text-4xl font-light text-[#F5F5F0] mb-4 leading-tight">
                                        {s.title}
                                    </h3>
                                    <p className="text-sm md:text-base text-[#EAE6DA]/70 leading-relaxed max-w-md">
                                        {s.body}
                                    </p>

                                    <div className="mt-auto pt-10 flex items-center justify-between border-t border-[#3A4538] group-hover:border-[#DDA74F] transition-colors">
                                        <span className="text-sm uppercase tracking-[0.25em] text-[#F5F5F0]">
                                            Explore the system
                                        </span>
                                        <span className="text-sm text-[#DDA74F] group-hover:translate-x-1 transition-transform">
                                            →
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
