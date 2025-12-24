import { motion } from "framer-motion";

export const LightningZap = () => {
    // 5s cycle: Long pause, then rapid-fire burst
    const cycle = {
        duration: 5,
        repeat: Infinity,
        ease: "linear",
        times: [0, 0.85, 0.87, 0.89, 0.91, 0.93, 0.95, 1]
    };

    return (
        <div className="relative w-6 h-6 flex items-center justify-center">
            {/* 1. Ambient Storm Cloud Glow */}
            <motion.div
                className="absolute inset-0 bg-yellow-400/50 rounded-full blur-[8px]"
                animate={{
                    opacity: [0.3, 0.3, 0.8, 0.4, 1, 0.5, 0.3, 0.3], // Always visible glow
                    scale: [0.8, 0.8, 1.5, 1.2, 2, 1, 0.8, 0.8]
                }}
                transition={cycle}
            />

            {/* 2. Main Bolt - Layered Core & Stroke */}
            <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="relative z-10 w-full h-full drop-shadow-[0_0_8px_rgba(234,179,8,0.6)]"
            >
                {/* Inner Core: Solid Gold Fill */}
                <motion.path
                    d="M13 2L6 12h6l-2 10 11-13h-7l4-7z"
                    fill="currentColor"
                    stroke="none"
                    className="text-yellow-400"
                />

                {/* Outer Boundary: Rotating White Electricity */}
                <motion.path
                    d="M13 2L6 12h6l-2 10 11-13h-7l4-7z"
                    fill="none"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{
                        pathLength: [0.1, 0.3, 0.1], // Pulse length
                        pathOffset: [0, 1], // Rotate around the shape
                        opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
            </motion.svg>

            {/* 3. Inner White Core (Arc) */}
            <motion.svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="absolute inset-0 z-20 text-white mix-blend-overlay"
                animate={{ opacity: [0, 0, 1, 0, 1, 0, 1, 0] }}
                transition={cycle}
            >
                <path d="M13 2L6 12h6l-2 10 11-13h-7l4-7z" />
            </motion.svg>
        </div>
    );
};
