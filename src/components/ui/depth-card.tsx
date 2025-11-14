import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export interface DepthCardProps extends Omit<HTMLMotionProps<"div">, "onAnimationStart" | "onDrag" | "onDragEnd" | "onDragStart"> {
  depth?: "sm" | "md" | "lg";
  hoverLift?: boolean;
  tiltEffect?: boolean;
  glassEffect?: boolean;
}

const depthStyles = {
  sm: "shadow-md hover:shadow-lg",
  md: "shadow-lg hover:shadow-xl",
  lg: "shadow-xl hover:shadow-2xl",
};

export const DepthCard = React.forwardRef<HTMLDivElement, DepthCardProps>(
  ({ className, depth = "md", hoverLift = true, tiltEffect = false, glassEffect = false, children, onMouseMove, onMouseLeave, ...props }, ref) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
    const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7.5deg", "-7.5deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7.5deg", "7.5deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (tiltEffect) {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);
      }
      onMouseMove?.(e);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
      if (tiltEffect) {
        x.set(0);
        y.set(0);
      }
      onMouseLeave?.(e);
    };

    const glassClasses = glassEffect
      ? "bg-card/80 backdrop-blur-xl border-border/50"
      : "bg-card border-border";

    return (
      <motion.div
        ref={ref}
        className={cn(
          "rounded-lg border text-card-foreground",
          depthStyles[depth],
          glassClasses,
          "transition-all duration-300",
          hoverLift && "hover:-translate-y-1",
          className
        )}
        style={
          tiltEffect
            ? {
                rotateX,
                rotateY,
                transformStyle: "preserve-3d" as const,
              }
            : undefined
        }
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={hoverLift ? { scale: 1.02 } : undefined}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

DepthCard.displayName = "DepthCard";

export const DepthCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  )
);
DepthCardHeader.displayName = "DepthCardHeader";

export const DepthCardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
  )
);
DepthCardTitle.displayName = "DepthCardTitle";

export const DepthCardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  )
);
DepthCardDescription.displayName = "DepthCardDescription";

export const DepthCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
);
DepthCardContent.displayName = "DepthCardContent";

export const DepthCardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  )
);
DepthCardFooter.displayName = "DepthCardFooter";
