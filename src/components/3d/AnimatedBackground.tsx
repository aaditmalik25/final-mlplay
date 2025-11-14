import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function PlusGrid({ spacing = 40, radius = 120, color = "#cbd5e1" }: { spacing?: number; radius?: number; color?: string }) {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const refs = useRef<HTMLDivElement[]>([]);
	const mouse = useRef({ x: -9999, y: -9999 });

	const [size, setSize] = useState({ w: typeof window !== "undefined" ? window.innerWidth : 0, h: typeof window !== "undefined" ? window.innerHeight : 0 });

	useEffect(() => {
		const onResize = () => setSize({ w: window.innerWidth, h: window.innerHeight });
		window.addEventListener("resize", onResize);
		return () => window.removeEventListener("resize", onResize);
	}, []);

	const points = useMemo(() => {
		const pts: { x: number; y: number }[] = [];
		const cols = Math.ceil(size.w / spacing) + 1;
		const rows = Math.ceil(size.h / spacing) + 1;
		for (let r = 0; r < rows; r++) {
			for (let c = 0; c < cols; c++) {
				pts.push({ x: c * spacing, y: r * spacing });
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
			const my = mouse.current.y;
			const r = radius;
			for (let i = 0; i < refs.current.length; i++) {
				const el = refs.current[i];
				if (!el) continue;
				const px = el.dataset.x ? Number(el.dataset.x) : 0;
				const py = el.dataset.y ? Number(el.dataset.y) : 0;
				const dx = px - mx;
				const dy = py - my;
				const dist = Math.sqrt(dx * dx + dy * dy);
				const proximity = Math.max(0, (r - dist) / r); // 0..1
				const scale = 1 + proximity * 0.6;
				const brightness = 1 + proximity * 1.4;
				el.style.transform = `translate(${px}px, ${py}px) translate(-50%,-50%) scale(${scale})`;
				el.style.filter = `brightness(${brightness})`;
				el.style.opacity = `${0.3 + proximity * 0.4}`;
			}
			raf = requestAnimationFrame(animate);
		};

		const onMove = (e: MouseEvent) => {
			mouse.current.x = e.clientX;
			mouse.current.y = e.clientY;
			if (!running) raf = requestAnimationFrame(animate);
		};

		window.addEventListener("mousemove", onMove);
		return () => {
			window.removeEventListener("mousemove", onMove);
			cancelAnimationFrame(raf);
			running = false;
		};
	}, [radius]);

	return (
		<div ref={containerRef} style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
			{points.map((p, i) => (
				<div
					key={i}
					ref={(el) => (refs.current[i] = el as HTMLDivElement)}
					data-x={p.x}
					data-y={p.y}
					style={{
						position: "absolute",
						left: 0,
						top: 0,
						width: 18,
						height: 18,
						transform: `translate(${p.x}px, ${p.y}px) translate(-50%,-50%)`,
						transition: "transform 120ms linear, filter 120ms linear, opacity 120ms linear",
						opacity: 0.3,
						pointerEvents: "none",
						willChange: "transform, filter, opacity",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
						<line x1="6" y1="1" x2="6" y2="11" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
						<line x1="1" y1="6" x2="11" y2="6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
					</svg>
				</div>
			))}
		</div>
	);
}

function FloatingOrb({ position, color, speed }: { position: [number, number, number]; color: string; speed: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.5;
    meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.2;
    meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.3;
  });

  return (
    <Sphere ref={meshRef} args={[1, 32, 32]} position={position}>
      <MeshDistortMaterial
        color={color}
        attach="material"
        distort={0.4}
        speed={1.5}
        roughness={0.2}
        metalness={0.8}
        transparent
        opacity={0.6}
      />
    </Sphere>
  );
}

export function AnimatedBackground() {
	const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	if (prefersReducedMotion) {
		return (
			<div className="absolute inset-0 overflow-hidden z-0">
				<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
				<div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
			</div>
		);
	}

	return (
		<div className="absolute inset-0 overflow-hidden z-0">
			{/* If you still want a Canvas for 3D objects, keep it here. For "previous pattern only", the overlay below renders the plus grid. */}
			<PlusGrid spacing={40} radius={120} color="#94a3b8" />
		</div>
	);
}