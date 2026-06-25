import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowDown } from "lucide-react";
import { HomeScene3D } from "@/components/HomeScene3D";

export const HomeHero = () => {
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
            data-testid="home-hero"
            className="relative min-h-screen w-full overflow-hidden bg-[#F5F5F0]"
        >
            <div className="absolute inset-0 z-0">
                <HomeScene3D />
            </div>

            <div className="grain-overlay z-10" />
            <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#F5F5F0] to-transparent z-10 pointer-events-none" />

            <motion.div
                style={{ y, opacity }}
                className="relative z-20 max-w-[1500px] mx-auto px-6 md:px-12 lg:px-16 pt-40 pb-24 min-h-screen flex flex-col justify-between pointer-events-none"
            >
                {/* Top tagline */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="flex items-center gap-3 text-xs tracking-[0.3em] uppercase text-[#5B7059] pointer-events-auto"
                >
                    <span className="w-8 h-px bg-[#5B7059]" />
                    <span>Mineral chemistry · For walls & for steel</span>
                </motion.div>

                {/* Headline */}
                <div className="max-w-6xl pointer-events-auto">
                    <motion.h1
                        initial={{ opacity: 0, y: 60 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, delay: 0.2, ease: [0.86, 0, 0.07, 1] }}
                        className="font-heading font-extralight tracking-tighter leading-[0.92] text-[#1A1A1A] text-5xl sm:text-7xl md:text-8xl lg:text-[8rem] text-balance"
                    >
                        Mineral chemistry<span className="text-[#C05A45]">.</span>
                        <br />
                        <span className="italic font-light text-[#3A4538]">Made</span> permanent.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.7 }}
                        className="mt-10 max-w-xl text-base md:text-lg text-[#5B7059] leading-relaxed"
                    >
                        GeoCoat builds two industrial-grade mineral silicate systems —
                        one for architecture, one for steel. Both engineered to outlast
                        the surfaces they protect.
                    </motion.p>
                </div>

                {/* Bottom row */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.3, duration: 1 }}
                    className="flex items-end justify-start gap-6 pointer-events-auto"
                >
                    <div className="flex items-center gap-2 text-xs tracking-widest uppercase text-[#1A1A1A]">
                        <ArrowDown size={14} className="animate-bounce" />
                        <span>Two systems below</span>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
};
