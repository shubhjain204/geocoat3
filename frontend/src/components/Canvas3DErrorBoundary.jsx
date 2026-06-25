import { Component, useEffect, useState } from "react";

// Detect WebGL once per session and cache result
let _webglSupport = null;
export function detectWebGL() {
    if (_webglSupport !== null) return _webglSupport;
    try {
        const canvas = document.createElement("canvas");
        const gl =
            canvas.getContext("webgl2") ||
            canvas.getContext("webgl") ||
            canvas.getContext("experimental-webgl");
        if (!gl) {
            _webglSupport = false;
            return false;
        }
        // Try to actually use it
        const ext = gl.getExtension("WEBGL_lose_context");
        if (ext) ext.loseContext();
        _webglSupport = true;
        return true;
    } catch (e) {
        _webglSupport = false;
        return false;
    }
}

export const useWebGL = () => {
    const [supported, setSupported] = useState(() => {
        if (typeof window === "undefined") return false;
        return detectWebGL();
    });
    useEffect(() => {
        setSupported(detectWebGL());
    }, []);
    return supported;
};

/**
 * Error boundary around any 3D / Canvas tree.
 * If WebGL fails for any reason, render the supplied fallback (an <img> + overlay).
 */
export class Canvas3DErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError() {
        return { hasError: true };
    }
    componentDidCatch(error) {
        // Swallow — we render a fallback. Log for dev visibility only.
        if (typeof console !== "undefined") {
            console.warn("[Canvas3DErrorBoundary] disabled WebGL scene:", error?.message);
        }
    }
    render() {
        if (this.state.hasError) return this.props.fallback || null;
        return this.props.children;
    }
}
