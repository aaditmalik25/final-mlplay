import { motion } from "framer-motion";

export const BurningFlame = () => {
    return (
        <div className="relative w-10 h-12 flex items-center justify-center">
            {/* 1. Base Glow (Pulsing Orange Aura) */}
            <motion.div
                className="absolute inset-x-0 bottom-0 h-3/4 bg-orange-500/30 blur-[15px] rounded-full"
                animate={{
                    scale: [0.8, 1.1, 0.9, 1.2, 0.8],
                    opacity: [0.5, 0.8, 0.5]
                }}
                transition={{ duration: 2, repeat: Infinity }}
            />

            {/* 2. Main Flame Core (Sharp & Bordered) */}
            <motion.svg
                viewBox="0 0 24 24"
                className="relative z-10 w-full h-full drop-shadow-[0_0_5px_rgba(249,115,22,0.5)]"
                animate={{
                    scaleY: [1, 1.1, 0.95, 1.05, 1],
                    filter: [
                        "drop-shadow(0 0 2px rgba(249,115,22,0.5))", // Crisp shadow for sharpness
                        "drop-shadow(0 0 8px rgba(249,115,22,0.8))",
                        "drop-shadow(0 0 2px rgba(249,115,22,0.5))"
                    ]
                }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
            >
                <path
                    d="M12 1C12 1 14.5 5.5 15.5 8.5C16.5 11.5 16 12.5 16 12.5C16 12.5 18 10 18 10C18 10 19.5 13.5 19.5 16C19.5 19.5 16.5 22.5 13 22.5C9.5 22.5 6.5 19.5 6.5 16C6.5 13.5 8 10 8 10C8 10 7.5 12.5 6.5 12.5C5.5 12.5 8.5 5.5 12 1Z"
                    fill="#f97316" // Orange-500
                    stroke="#c2410c" // Orange-700 Border (Darker for definition)
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </motion.svg>

            {/* 3. Inner Core (Sharp & Bordered) */}
            <motion.svg
                viewBox="0 0 24 24"
                className="absolute z-20 w-full h-full mix-blend-normal"
                animate={{
                    scale: [0.6, 0.7, 0.5, 0.65, 0.6],
                }}
                transition={{ duration: 0.4, repeat: Infinity, ease: "linear" }}
            >
                <path
                    d="M12 6C12 6 13.5 9 14 11C14.5 13 14 14 14 14C14 14 15.5 12.5 15.5 12.5C15.5 12.5 16 14.5 16 16C16 18 14.5 20 12.5 20C10.5 20 9 18 9 16C9 14.5 10 12.5 10 12.5C10 12.5 9.5 14 9 14C8.5 14 10.5 9 12 6Z"
                    fill="#fde047" // Yellow-300
                    stroke="#f97316" // Orange-500 Border (Connects to outer)
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </motion.svg>

            {/* 4. Rising Sparks (Particles) */}
            {[...Array(3)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute z-0 w-1 h-1 bg-yellow-200 rounded-full"
                    initial={{ opacity: 0, y: 10, x: 0 }}
                    animate={{
                        opacity: [0, 1, 0],
                        y: -20, // Float up
                        x: Math.random() * 10 - 5 // Drift left/right
                    }}
                    transition={{
                        duration: 1 + Math.random(),
                        repeat: Infinity,
                        delay: Math.random() * 2,
                        ease: "easeOut"
                    }}
                />
            ))}
        </div>
    );
};
