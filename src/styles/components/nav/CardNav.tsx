import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { GoArrowUpRight } from "react-icons/go";
import { scrollToId } from "../../../lib/scrollTo"; // <-  helper
import "./CardNav.css";

type LinkItem = {
  label: string;
  href: string;
  ariaLabel?: string;
};

type CardItem = {
  label: string;
  bgColor?: string;
  textColor?: string;
  links?: LinkItem[];
};

type Props = {
  logo: string;
  logoAlt?: string;
  items: CardItem[];
  className?: string;
  ease?: string;            // ex: 'power3.out'
  baseColor?: string;       // background du bloc nav
  menuColor?: string;       // couleur de l'icône hamburger
  buttonBgColor?: string;   // background CTA
  buttonTextColor?: string; // texte CTA
  ctaLabel?: string;        // libellé CTA
  ctaHref?: string;         // lien CTA
};

export default function CardNav({
  logo,
  logoAlt = "Logo",
  items,
  className = "",
  ease = "power3.out",
  baseColor = "#fff",
  menuColor = "#000",
  buttonBgColor = "#111",
  buttonTextColor = "#fff",
  ctaLabel = "Get Started",
  ctaHref = "#contact",
}: Props) {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const navRef = useRef<HTMLDivElement | null>(null);
  const contentId = "card-nav-content";
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  /* ---------- Utils ---------- */
  const getNavOffset = (): number => {
    const h = navRef.current?.getBoundingClientRect().height ?? 60;
    return Math.round(h) + 28; // petite marge pour respirer
  };

  const isExternal = (href: string) =>
    /^https?:\/\//i.test(href) || href.startsWith("//");

  /* ---------- Mesure & timeline ---------- */
  const calculateHeight = (): number => {
    const navEl = navRef.current;
    if (!navEl) return 260;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) {
      const contentEl = navEl.querySelector(".card-nav-content") as HTMLDivElement | null;
      if (contentEl) {
        // sauvegarde styles
        const was = {
          visibility: contentEl.style.visibility,
          pointerEvents: contentEl.style.pointerEvents,
          position: contentEl.style.position,
          height: contentEl.style.height,
        };
        // force la mesure
        contentEl.style.visibility = "visible";
        contentEl.style.pointerEvents = "auto";
        contentEl.style.position = "static";
        contentEl.style.height = "auto";
        void contentEl.offsetHeight; // reflow
        const topBar = 60;
        const padding = 16;
        const contentHeight = contentEl.scrollHeight;
        // restore
        contentEl.style.visibility = was.visibility;
        contentEl.style.pointerEvents = was.pointerEvents;
        contentEl.style.position = was.position;
        contentEl.style.height = was.height;

        return topBar + contentHeight + padding;
      }
    }
    return 260;
  };

  const createTimeline = (): gsap.core.Timeline | null => {
    const navEl = navRef.current;
    if (!navEl) return null;

    gsap.set(navEl, { height: 60, overflow: "hidden" });
    gsap.set(cardsRef.current, { y: 50, opacity: 0 });

    const tl = gsap.timeline({ paused: true });
    tl.to(navEl, { height: calculateHeight, duration: 0.4, ease });
    tl.to(cardsRef.current, { y: 0, opacity: 1, duration: 0.4, ease, stagger: 0.08 }, "-=0.1");
    return tl;
  };

  useLayoutEffect(() => {
    const tl = createTimeline();
    tlRef.current = tl;
    return () => {
      tl?.kill();
      tlRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ease, items]);

  useLayoutEffect(() => {
    const handleResize = () => {
      const tl = tlRef.current;
      const navEl = navRef.current;
      if (!tl || !navEl) return;

      if (isExpanded) {
        const newHeight = calculateHeight();
        gsap.set(navEl, { height: newHeight });
        tl.kill();
        const newTl = createTimeline();
        if (newTl) {
          newTl.progress(1); // conserver l'état ouvert
          tlRef.current = newTl;
        }
      } else {
        tl.kill();
        const newTl = createTimeline();
        if (newTl) tlRef.current = newTl;
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpanded]);

  /* ---------- Actions ---------- */
  const openMenu = () => {
    const tl = tlRef.current;
    if (!tl) return;
    setIsHamburgerOpen(true);
    setIsExpanded(true);
    tl.play(0);
  };

  const closeMenu = () => {
    const tl = tlRef.current;
    if (!tl) return;
    setIsHamburgerOpen(false);
    tl.eventCallback("onReverseComplete", () => {
      setIsExpanded(false); // retourne void
    });
    tl.reverse();
  };

  const toggleMenu = () => {
    if (isExpanded) closeMenu();
    else openMenu();
  };

  const onHamburgerKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleMenu();
    }
  };

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const href = (e.currentTarget.getAttribute("href") || "").trim();
    if (!href) return;

    if (href.startsWith("#")) {
      e.preventDefault();
      const id = decodeURIComponent(href.slice(1));
      scrollToId(id, getNavOffset());
      if (isExpanded) closeMenu();
    } else if (isExternal(href)) {
      // liens externes -> nouvel onglet
      e.currentTarget.setAttribute("target", "_blank");
      e.currentTarget.setAttribute("rel", "noopener noreferrer");
      if (isExpanded) closeMenu();
    } else {
      // lien interne non-ancre (autre page) : on ferme le menu quand même
      if (isExpanded) closeMenu();
    }
  };

  const setCardRef =
    (i: number) =>
    (el: HTMLDivElement | null) => {
      if (el) cardsRef.current[i] = el;
    };

  /* ---------- Render ---------- */
  return (
    <div className={`card-nav-container ${className}`}>
      <nav
        ref={navRef}
        className={`card-nav ${isExpanded ? "open" : ""}`}
        style={{ backgroundColor: baseColor }}
        aria-label="Primary"
        aria-expanded={isExpanded}
      >
        {/* Top bar */}
        <div className="card-nav-top">
          <div
            className={`hamburger-menu ${isHamburgerOpen ? "open" : ""}`}
            onClick={toggleMenu}
            onKeyDown={onHamburgerKeyDown}
            role="button"
            aria-label={isExpanded ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={isExpanded}
            aria-controls={contentId}
            tabIndex={0}
            style={{ color: menuColor }}
          >
            <div className="hamburger-line" />
            <div className="hamburger-line" />
          </div>

          <div className="logo-container">
            <img src={logo} alt={logoAlt} className="logo" />
          </div>

          <a
            href={ctaHref}
            className="card-nav-cta-button"
            style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
            onClick={handleAnchorClick}
          >
            {ctaLabel}
          </a>
        </div>

        {/* Cards */}
        <div
          id={contentId}
          className="card-nav-content"
          aria-hidden={!isExpanded}
        >
          {(items || []).slice(0, 3).map((item, idx) => (
            <div
              key={`${item.label}-${idx}`}
              className="nav-card"
              ref={setCardRef(idx)}
              style={{ backgroundColor: item.bgColor ?? "#0b0b0b", color: item.textColor ?? "#fff" }}
            >
              <div className="nav-card-label">{item.label}</div>

              <div className="nav-card-links">
                {item.links?.map((lnk, i) => (
                  <a
                    key={`${lnk.label}-${i}`}
                    className="nav-card-link"
                    href={lnk.href}
                    aria-label={lnk.ariaLabel ?? lnk.label}
                    onClick={handleAnchorClick}
                  >
                    <GoArrowUpRight className="nav-card-link-icon" aria-hidden="true" />
                    {lnk.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
}