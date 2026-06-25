import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Resets scroll to top on every route change.
 * Runs synchronously (useLayoutEffect) and again on the next animation frame
 * so it overrides smooth-scroll libraries (e.g. Lenis) that may have synced
 * to a non-zero offset during the route transition.
 */
export const ScrollToTop = () => {
    const { pathname } = useLocation();
    useLayoutEffect(() => {
        const reset = () => {
            window.__geoLenis?.scrollTo?.(0, { immediate: true, force: true });
            window.scrollTo(0, 0);
            if (document.documentElement) document.documentElement.scrollTop = 0;
            if (document.body) document.body.scrollTop = 0;
        };
        if ("scrollRestoration" in window.history) {
            window.history.scrollRestoration = "manual";
        }
        reset();
        const r1 = requestAnimationFrame(reset);
        const r2 = requestAnimationFrame(() => requestAnimationFrame(reset));
        const t = setTimeout(reset, 50);
        return () => {
            cancelAnimationFrame(r1);
            cancelAnimationFrame(r2);
            clearTimeout(t);
        };
    }, [pathname]);
    return null;
};
