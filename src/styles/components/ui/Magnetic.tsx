import { useRef } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

type Props = {
  children: React.ReactNode;
  strength?: number;
  className?: string;
};

export default function Magnetic({ children, strength = 0.25, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  // Motion values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // ✅ calcule la rotation à partir de x et y sans destructuration qui casse le typage
  const rotate = useTransform([x, y], (latest: number[]) => {
    const lx = latest[0] ?? 0;
    const ly = latest[1] ?? 0;
    return (lx + ly) * 0.02;
  });

  const handleMove = (clientX: number, clientY: number) => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const relX = clientX - (rect.left + rect.width / 2);
    const relY = clientY - (rect.top + rect.height / 2);

    x.set(relX * strength);
    y.set(relY * strength);
  };

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    // on ne bouge que pour souris/stylet (évite le scroll sur mobile)
    if (e.pointerType === "mouse" || e.pointerType === "pen") {
      handleMove(e.clientX, e.clientY);
    }
  }

  function onPointerLeave() {
    animate(x, 0, { type: "spring", stiffness: 300, damping: 20 });
    animate(y, 0, { type: "spring", stiffness: 300, damping: 20 });
  }

  return (
    <motion.div
      ref={ref}
      style={{ x, y, rotate }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={className}
    >
      {children}
    </motion.div>
  );
}