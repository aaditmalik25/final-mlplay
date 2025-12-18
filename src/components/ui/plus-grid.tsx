import { useEffect, useRef, useState, useMemo } from "react";

interface PlusGridProps {
    spacing?: number;
    radius?: number;
    color?: string;
}

export function PlusGrid({ spacing = 40, radius = 100, color = "#94a3b8" }: PlusGridProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const refs = useRef<(HTMLDivElement | null)[]>([]);
    const mouse = useRef({ x: -9999, y: -9999 });
    const [size, setSize] = useState({
        w: typeof window !== "undefined" ? window.innerWidth : 0,
        h: typeof document !== "undefined" ? document.documentElement.scrollHeight : 0,
    });

    // update size on resize and scroll (scroll affects document height if content changes)
    useEffect(() => {
        const updateSize = () => {
            const w = window.innerWidth;
            // full document height (covers entire page)
            const h = Math.max(document.documentElement.scrollHeight, window.innerHeight);
            setSize({ w, h });
        };

        updateSize();
        window.addEventListener("resize", updateSize);
        window.addEventListener("scroll", updateSize); // update if content/layout changes on scroll

        return () => {
            window.removeEventListener("resize", updateSize);
            window.removeEventListener("scroll", updateSize);
        };
    }, []);

    const points = useMemo(() => {
        const pts: { x: number; y: number }[] = [];
        const cols = Math.ceil(size.w / spacing) + 1;
        const rows = Math.ceil(size.h / spacing) + 1;
        // optional center offset so grid lines align with your tiled SVG if you use one:
        const xOffset = spacing / 2;
        const yOffset = spacing / 2;
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                pts.push({ x: c * spacing + xOffset, y: r * spacing + yOffset });
            }
        }
        return pts;
    }, [size.w, size.h, spacing]);

    useEffect(() => {
        let raf = 0;
        let running = false;

        const animate = () => {
            running = true;
            const mx = mouse.current.x;
            const my = mouse.current.y + window.scrollY;

            for (let i = 0; i < refs.current.length; i++) {
                const el = refs.current[i];
                if (!el) continue;

                const px = Number(el.dataset.x);
                const py = Number(el.dataset.y);
                const dx = px - mx;
                const dy = py - my;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const proximity = Math.max(0, (radius - dist) / radius);

                const scale = 1 + proximity * 0.6;
                const brightness = 0.6 + proximity * 1.4;
                const opacity = 0.3 + proximity * 0.4;

                el.style.transform = `translate(${px}px, ${py}px) translate(-50%,-50%) scale(${scale})`;
                el.style.filter = `brightness(${brightness})`;
                el.style.opacity = opacity.toString();
            }

            raf = requestAnimationFrame(animate);
        };

        // ⭐ START THE LOOP IMMEDIATELY — FIXES FIRST-TIME LAG
        raf = requestAnimationFrame(animate);
        running = true;

        const onMove = (e: MouseEvent) => {
            mouse.current.x = e.clientX;
            mouse.current.y = e.clientY;
        };

        window.addEventListener("mousemove", onMove);

        return () => {
            window.removeEventListener("mousemove", onMove);
            cancelAnimationFrame(raf);
        };
    }, [radius]);


    return (
        // container covers entire document height so pluses are placed across the full page
        <div
            ref={containerRef}
            className="pointer-events-none"
            style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: "100%",
                height: size.h, // crucial: set container height to document height
                overflow: "hidden",
            }}
        >
            {points.map((p, i) => (
                <div
                    key={i}
                    ref={(el) => (refs.current[i] = el)}
                    data-x={p.x}
                    data-y={p.y}
                    style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        width: 18,
                        height: 18,
                        transform: `translate(${p.x}px, ${p.y}px) translate(-50%, -50%)`,
                        opacity: 0.2,
                        transition: "transform 120ms linear, filter 120ms linear, opacity 120ms linear",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <line x1="6" y1="1" x2="6" y2="11" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
                        <line x1="1" y1="6" x2="11" y2="6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </div>
            ))}
        </div>
    );
}
