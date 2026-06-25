import { useEffect } from "react";
import Lenis from "lenis";

export const SmoothScroll = ({ children }) => {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.4,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            wheelMultiplier: 1,
        });
        window.__geoLenis = lenis;

        let frameId;
        function raf(time) {
            lenis.raf(time);
            frameId = requestAnimationFrame(raf);
        }
        frameId = requestAnimationFrame(raf);
        return () => {
            cancelAnimationFrame(frameId);
            if (window.__geoLenis === lenis) {
                delete window.__geoLenis;
            }
            lenis.destroy();
        };
    }, []);

    return <>{children}</>;
};
