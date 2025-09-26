import { useRef, useEffect, useCallback, useState, CSSProperties } from "react";
import { gsap } from "gsap";
import { useInView, useMotionValue, animate } from "framer-motion";
import "./MagicBento.css";

const DEFAULT_PARTICLE_COUNT = 12;
const DEFAULT_SPOTLIGHT_RADIUS = 300;
const DEFAULT_GLOW_COLOR = "132, 0, 255";
const MOBILE_BREAKPOINT = 768;
const DEFAULT_CARD_BG = "#0b0b0d";

export type MagicBentoCard = {
  color?: string;
  title?: string;
  description?: string;
  label?: string;
  image?: string;
  href?: string;
  external?: boolean;
  span?: "2x2" | "2x1" | "1x2";
  stat?: {
    value: number;
    suffix?: string;
    label?: string;
    decimals?: number;
  };
  /** ✅ Vidéo en background */
  video?: {
    src: string;
    poster?: string;
    autoplay?: boolean; // défaut true
    loop?: boolean;     // défaut true
    muted?: boolean;    // défaut true
    playbackRate?: number; // ex: 0.75
  };
};

type ParticleCardProps = {
  children: React.ReactNode;
  className?: string;
  style?: CSSProperties;
  particleCount?: number;
  glowColor?: string;
  enableTilt?: boolean;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
  disableAnimations?: boolean;
};

type GlobalSpotlightProps = {
  gridRef: React.RefObject<HTMLDivElement>;
  disableAnimations?: boolean;
  enabled?: boolean;
  spotlightRadius?: number;
  glowColor?: string;
};

type MagicBentoProps = {
  cards?: MagicBentoCard[];
  textAutoHide?: boolean;
  enableStars?: boolean;
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  disableAnimations?: boolean;
  spotlightRadius?: number;
  particleCount?: number;
  enableTilt?: boolean;
  glowColor?: string;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
  className?: string;
};

const createParticleElement = (x: number, y: number, color = DEFAULT_GLOW_COLOR) => {
  const el = document.createElement("div");
  el.className = "particle";
  el.style.cssText = `
    position: absolute;
    width: 4px; height: 4px; border-radius: 50%;
    background: rgba(${color}, 1);
    box-shadow: 0 0 6px rgba(${color}, 0.6);
    pointer-events: none; z-index: 2;
    left: ${x}px; top: ${y}px;
  `;
  return el;
};

const calculateSpotlightValues = (radius: number) => ({
  proximity: radius * 0.5,
  fadeDistance: radius * 0.75,
});

const updateCardGlowProperties = (
  card: HTMLElement,
  mouseX: number,
  mouseY: number,
  glow: number,
  radius: number
) => {
  const rect = card.getBoundingClientRect();
  const relativeX = ((mouseX - rect.left) / rect.width) * 100;
  const relativeY = ((mouseY - rect.top) / rect.height) * 100;
  card.style.setProperty("--glow-x", `${relativeX}%`);
  card.style.setProperty("--glow-y", `${relativeY}%`);
  card.style.setProperty("--glow-intensity", glow.toString());
  card.style.setProperty("--glow-radius", `${radius}px`);
};

/* --------- Compteur animé pour les cartes "stat" ---------- */

function StatContent({
  value,
  suffix,
  label,
  decimals = 0,
  description,
}: {
  value: number;
  suffix?: string;
  label?: string;
  decimals?: number;
  description?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const mv = useMotionValue(0);
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, value, {
      duration: 1.4,
      ease: "easeOut",
      onUpdate: (latest) => setDisplay(Number(latest).toFixed(decimals)),
    });
    return () => controls.stop();
  }, [inView, value, decimals, mv]);

  return (
    <div ref={ref} className="stat">
      <div className="stat__value">
        <span className="stat__number">{display}</span>
        {suffix ? <span className="stat__suffix">{suffix}</span> : null}
      </div>
      {label ? <div className="stat__label">{label}</div> : null}
      {description ? <div className="stat__sub">{description}</div> : null}
    </div>
  );
}

/* --------------------- ParticleCard ---------------------- */

const ParticleCard = ({
  children,
  className = "",
  style,
  particleCount = DEFAULT_PARTICLE_COUNT,
  glowColor = DEFAULT_GLOW_COLOR,
  enableTilt = true,
  clickEffect = false,
  enableMagnetism = false,
  disableAnimations = false,
}: ParticleCardProps) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);
  const timeoutsRef = useRef<number[]>([]);
  const isHoveredRef = useRef(false);
  const memoizedParticles = useRef<HTMLDivElement[]>([]);
  const particlesInitialized = useRef(false);
  const magnetismAnimationRef = useRef<gsap.core.Tween | null>(null);

  const initializeParticles = useCallback(() => {
    if (particlesInitialized.current || !cardRef.current) return;
    const { width, height } = cardRef.current.getBoundingClientRect();
    memoizedParticles.current = Array.from({ length: particleCount }, () =>
      createParticleElement(Math.random() * width, Math.random() * height, glowColor)
    ) as HTMLDivElement[];
    particlesInitialized.current = true;
  }, [particleCount, glowColor]);

  const clearAllParticles = useCallback(() => {
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current = [];
    magnetismAnimationRef.current?.kill();

    particlesRef.current.forEach((p) => {
      gsap.to(p, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: "back.in(1.7)",
        onComplete: () => {
          if (p.parentNode) p.parentNode.removeChild(p);
        },
      });
    });
    particlesRef.current = [];
  }, []);

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current) return;
    if (!particlesInitialized.current) initializeParticles();

    memoizedParticles.current.forEach((particle, index) => {
      const timeoutId = window.setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return;

        const clone = particle.cloneNode(true) as HTMLDivElement;
        cardRef.current!.appendChild(clone);
        particlesRef.current.push(clone);

        gsap.fromTo(
          clone,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" }
        );

        gsap.to(clone, {
          x: (Math.random() - 0.5) * 100,
          y: (Math.random() - 0.5) * 100,
          rotation: Math.random() * 360,
          duration: 2 + Math.random() * 2,
          ease: "none",
          repeat: -1,
          yoyo: true,
        });

        gsap.to(clone, {
          opacity: 0.3,
          duration: 1.5,
          ease: "power2.inOut",
          repeat: -1,
          yoyo: true,
        });
      }, index * 100);

      timeoutsRef.current.push(timeoutId);
    });
  }, [initializeParticles]);

  useEffect(() => {
    if (disableAnimations || !cardRef.current) return;
    const el = cardRef.current;

    const onEnter = () => {
      isHoveredRef.current = true;
      animateParticles();
      if (enableTilt) {
        gsap.to(el, {
          rotateX: 5,
          rotateY: 5,
          duration: 0.3,
          ease: "power2.out",
          transformPerspective: 1000,
        });
      }
    };

    const onLeave = () => {
      isHoveredRef.current = false;
      clearAllParticles();
      if (enableTilt) {
        gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.3, ease: "power2.out" });
      }
      if (enableMagnetism) {
        gsap.to(el, { x: 0, y: 0, duration: 0.3, ease: "power2.out" });
      }
    };

    const onMove = (e: MouseEvent) => {
      if (!enableTilt && !enableMagnetism) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;

      if (enableTilt) {
        const rotateX = ((y - cy) / cy) * -10;
        const rotateY = ((x - cx) / cx) * 10;
        gsap.to(el, {
          rotateX,
          rotateY,
          duration: 0.1,
          ease: "power2.out",
          transformPerspective: 1000,
        });
      }
      if (enableMagnetism) {
        const magnetX = (x - cx) * 0.05;
        const magnetY = (y - cy) * 0.05;
        magnetismAnimationRef.current = gsap.to(el, {
          x: magnetX,
          y: magnetY,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    };

    const onClick = (e: MouseEvent) => {
      if (!clickEffect) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const maxD = Math.max(
        Math.hypot(x, y),
        Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height),
        Math.hypot(x - rect.width, y - rect.height)
      );

      const ripple = document.createElement("div");
      ripple.style.cssText = `
        position: absolute;
        width: ${maxD * 2}px; height: ${maxD * 2}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(${glowColor}, 0.4) 0%, rgba(${glowColor}, 0.2) 30%, transparent 70%);
        left: ${x - maxD}px; top: ${y - maxD}px;
        pointer-events: none; z-index: 1;
      `;
      el.appendChild(ripple);

      gsap.fromTo(
        ripple,
        { scale: 0, opacity: 1 },
        {
          scale: 1,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          onComplete: () => ripple.remove(),
        }
      );
    };

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    el.addEventListener("mousemove", onMove);
    el.addEventListener("click", onClick);

    return () => {
      isHoveredRef.current = false;
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("click", onClick);
      clearAllParticles();
    };
  }, [animateParticles, clearAllParticles, disableAnimations, enableTilt, enableMagnetism, clickEffect, glowColor]);

  return (
    <div
      ref={cardRef}
      className={`${className} particle-container`}
      style={{ ...style, position: "relative", overflow: "hidden" }}
    >
      {children}
    </div>
  );
};

/* -------------------- GlobalSpotlight -------------------- */

const GlobalSpotlight = ({
  gridRef,
  disableAnimations = false,
  enabled = true,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  glowColor = DEFAULT_GLOW_COLOR,
}: GlobalSpotlightProps) => {
  const spotlightRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (disableAnimations || !gridRef?.current || !enabled) return;

    const spotlight = document.createElement("div");
    spotlight.className = "global-spotlight";
    spotlight.style.cssText = `
      position: fixed; width: 800px; height: 800px; border-radius: 50%;
      pointer-events: none; z-index: 200; opacity: 0; transform: translate(-50%, -50%);
      background: radial-gradient(circle,
        rgba(${glowColor}, 0.15) 0%,
        rgba(${glowColor}, 0.08) 15%,
        rgba(${glowColor}, 0.04) 25%,
        rgba(${glowColor}, 0.02) 40%,
        rgba(${glowColor}, 0.01) 65%,
        transparent 70%
      );
      mix-blend-mode: screen;
    `;
    document.body.appendChild(spotlight);
    spotlightRef.current = spotlight;

    const handleMouseMove = (e: MouseEvent) => {
      if (!spotlightRef.current || !gridRef.current) return;

      const section = gridRef.current.closest(".bento-section") as HTMLElement | null;
      const rect = section?.getBoundingClientRect();
      const inside =
        !!rect &&
        e.clientX >= rect.left && e.clientX <= rect.right &&
        e.clientY >= rect.top && e.clientY <= rect.bottom;

      const cards = gridRef.current.querySelectorAll<HTMLElement>(".card");
      if (!inside) {
        gsap.to(spotlightRef.current, { opacity: 0, duration: 0.3, ease: "power2.out" });
        cards.forEach((c) => c.style.setProperty("--glow-intensity", "0"));
        return;
      }

      const { proximity, fadeDistance } = calculateSpotlightValues(spotlightRadius);
      let minD = Infinity;

      cards.forEach((card) => {
        const r = card.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const d = Math.hypot(e.clientX - cx, e.clientY - cy) - Math.max(r.width, r.height) / 2;
        const eff = Math.max(0, d);
        minD = Math.min(minD, eff);

        let glow = 0;
        if (eff <= proximity) glow = 1;
        else if (eff <= fadeDistance) glow = (fadeDistance - eff) / (fadeDistance - proximity);

        updateCardGlowProperties(card, e.clientX, e.clientY, glow, spotlightRadius);
      });

      gsap.to(spotlightRef.current, { left: e.clientX, top: e.clientY, duration: 0.1, ease: "power2.out" });

      const targetOpacity =
        minD <= proximity ? 0.8 :
        minD <= fadeDistance ? ((fadeDistance - minD) / (fadeDistance - proximity)) * 0.8 : 0;

      gsap.to(spotlightRef.current, {
        opacity: targetOpacity,
        duration: targetOpacity > 0 ? 0.2 : 0.5,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gridRef.current?.querySelectorAll<HTMLElement>(".card").forEach((c) => c.style.setProperty("--glow-intensity", "0"));
      if (spotlightRef.current) {
        gsap.to(spotlightRef.current, { opacity: 0, duration: 0.3, ease: "power2.out" });
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      if (spotlightRef.current?.parentNode) {
        spotlightRef.current.parentNode.removeChild(spotlightRef.current);
      }
    };
  }, [gridRef, disableAnimations, enabled, spotlightRadius, glowColor]);

  return null;
};

/* ---------------------- layout grid ---------------------- */

const BentoCardGrid = ({
  children,
  gridRef,
}: {
  children: React.ReactNode;
  gridRef: React.RefObject<HTMLDivElement>;
}) => (
  <div className="card-grid bento-section" ref={gridRef}>
    {children}
  </div>
);

/* ------------------ responsive detection ----------------- */

const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
};

/* ----------------------- main comp ----------------------- */

export default function MagicBento({
  cards,
  textAutoHide = true,
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  disableAnimations = false,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  particleCount = DEFAULT_PARTICLE_COUNT,
  enableTilt = false,
  glowColor = DEFAULT_GLOW_COLOR,
  clickEffect = true,
  enableMagnetism = true,
  className,
}: MagicBentoProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobileDetection();
  const shouldDisable = disableAnimations || isMobile;

  const data: MagicBentoCard[] =
    cards ??
    [
      { color: "#060010", title: "Analytics", description: "Track user behavior", label: "Insights" },
      { color: "#060010", title: "Dashboard", description: "Centralized data view", label: "Overview" },
      { color: "#060010", title: "Collaboration", description: "Work together seamlessly", label: "Teamwork" },
      { color: "#060010", title: "Automation", description: "Streamline workflows", label: "Efficiency" },
      { color: "#060010", title: "Integration", description: "Connect favorite tools", label: "Connectivity" },
      { color: "#060010", title: "Security", description: "Enterprise-grade protection", label: "Protection" },
    ];

  return (
    <div className={className}>
      {enableSpotlight && (
        <GlobalSpotlight
          gridRef={gridRef}
          disableAnimations={shouldDisable}
          enabled={enableSpotlight}
          spotlightRadius={spotlightRadius}
          glowColor={glowColor}
        />
      )}

      <BentoCardGrid gridRef={gridRef}>
        {data.map((card, i) => {
          const spanClass =
            card.span === "2x2"
              ? "card--span-2x2"
              : card.span === "2x1"
              ? "card--span-2x1"
              : card.span === "1x2"
              ? "card--span-1x2"
              : "";

          const baseClass = `card ${spanClass} ${textAutoHide ? "card--text-autohide" : ""} ${
            enableBorderGlow ? "card--border-glow" : ""
          }`;

          const style: CSSProperties = {
            backgroundColor: card.color ?? DEFAULT_CARD_BG,
            ["--glow-color" as any]: glowColor,
          };

          const content = card.stat ? (
            <StatContent
              value={card.stat.value}
              suffix={card.stat.suffix}
              label={card.stat.label}
              decimals={card.stat.decimals}
              description={card.description}
            />
          ) : (
            <>
              <div className="card__header">
                <div className="card__label">{card.label}</div>
              </div>
              {card.image && (
                <div className="card__media">
                  <img src={card.image} alt={card.title || ""} loading="lazy" />
                </div>
              )}
              <div className="card__content">
                {card.title && <h2 className="card__title">{card.title}</h2>}
                {card.description && <p className="card__description">{card.description}</p>}
              </div>
            </>
          );

          const overlay =
            card.href && (
              <a
                className="card__overlay"
                href={card.href}
                target={card.external ? "_blank" : undefined}
                rel={card.external ? "noopener noreferrer" : undefined}
                aria-label={`Ouvrir ${card.stat?.label || card.title || "carte"}`}
              />
            );

          const bgVideo =
            card.video && (
              <div className="card__bg" aria-hidden>
                <video
                  className="card__bg-media"
                  src={card.video.src}
                  poster={card.video.poster}
                  autoPlay={card.video.autoplay ?? true}
                  loop={card.video.loop ?? true}
                  muted={card.video.muted ?? true}
                  playsInline
                  preload="metadata"
                  onLoadedMetadata={(e) => {
                    if (card.video?.playbackRate) {
                      e.currentTarget.playbackRate = card.video.playbackRate;
                    }
                  }}
                />
                <div className="card__scrim" />
              </div>
            );

          if (enableStars) {
            return (
              <ParticleCard
                key={i}
                className={baseClass}
                style={style}
                disableAnimations={shouldDisable}
                particleCount={particleCount}
                glowColor={glowColor}
                enableTilt={enableTilt}
                clickEffect={clickEffect}
                enableMagnetism={enableMagnetism}
              >
                {bgVideo}
                {content}
                {overlay}
              </ParticleCard>
            );
          }

          return (
            <div key={i} className={baseClass} style={style}>
              {bgVideo}
              {content}
              {overlay}
            </div>
          );
        })}
      </BentoCardGrid>
    </div>
  );
}
