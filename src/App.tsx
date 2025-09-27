// src/App.tsx
import { useEffect, useMemo } from "react";

// Sections
import Hero from "./styles/components/Hero";
import Bento from "./styles/components/Bento";
import About from "./styles/components/About";
import Contact from "./styles/components/Contact";
import Footer from "./styles/components/Footer";

// UI
import CardNav from "./styles/components/nav/CardNav";
import Silk from "./styles/components/bg/Silk";

/* ---------------------------------- */
/*            ASSETS PATHS            */
/* ---------------------------------- */
// Utilise la base Vite => compatible Cloudflare/Pages sous sous-répertoire
const base = import.meta.env.BASE_URL ?? "/";

// Logo nav
const logoUrl = `${base}images/logo.svg`;

// Items de navigation (cartes du menu)
const navItems = [
  {
    label: "Parcourir",
    bgColor: "#0b0b0e",
    textColor: "#ffffff",
    links: [
      { label: "Showcase", href: "#bento", ariaLabel: "Voir le bento de projets" },
      { label: "À propos", href: "#about", ariaLabel: "Aller à la section à propos" },
      { label: "Contact", href: "#contact", ariaLabel: "Aller à la section contact" },
    ],
  },
  {
    label: "Réseaux",
    bgColor: "#0b0b10",
    textColor: "#ffffff",
    links: [
      { label: "GitHub", href: "https://github.com/adrielakak", ariaLabel: "Ouvrir GitHub (nouvel onglet)" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/adriel-kourlate-28033032b/", ariaLabel: "Ouvrir LinkedIn (nouvel onglet)" },
      { label: "CV (PDF)", href: `${base}cv/adriel-kourlate-cv.pdf`, ariaLabel: "Télécharger CV (PDF)" },
    ],
  },
  {
    label: "Ressources",
    bgColor: "#0a0a12",
    textColor: "#ffffff",
    links: [
      { label: "Email", href: "#contact", ariaLabel: "Me contacter" },
      { label: "Tech stack", href: "#about", ariaLabel: "Voir ma stack technique" },
      { label: "Mentions", href: "#footer", ariaLabel: "Mentions légales" },
    ],
  },
];

// Logos (si tu utilises LogoLoop quelque part)
export const logos = [
  { src: `${base}images/brands/react.svg`, alt: "React", href: "https://react.dev" },
  { src: `${base}images/brands/typescript.svg`, alt: "TypeScript", href: "https://www.typescriptlang.org" },
  { src: `${base}images/brands/vite.svg`, alt: "Vite", href: "https://vitejs.dev" },
  { src: `${base}images/brands/tailwind.svg`, alt: "Tailwind CSS", href: "https://tailwindcss.com" },
  { src: `${base}images/brands/framer.svg`, alt: "Framer Motion", href: "https://www.framer.com/motion/" },
];

/* ---------------------------------- */
/*      SMOOTH SCROLL + OFFSET JS     */
/* ---------------------------------- */
/**
 * Calcule dynamiquement un offset pour éviter que la section
 * arrive cachée sous la nav. Tente d’utiliser la hauteur de .card-nav,
 * sinon fallback 88px.
 */
function getNavOffset(): number {
  const nav = document.querySelector<HTMLElement>(".card-nav");
  const h = nav?.getBoundingClientRect().height;
  // marge supplémentaire pour respirer
  return (h ? Math.round(h) : 60) + 28; // ex: 60 + 28 = 88
}

/** Respecte le prefers-reduced-motion */
function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Scroll lisse vers un id, en appliquant l’offset nav */
function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const offset = getNavOffset();
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({
    top,
    behavior: prefersReducedMotion() ? "auto" : "smooth",
  });
}

export default function App() {
  // Active le grain global (voir globals.css pour .grain::before)
  useEffect(() => {
    document.documentElement.classList.add("grain");
  }, []);

  // Intercepte les clics sur <a href="#..."> pour forcer un scroll fluide + offset
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const a = target?.closest?.("a") as HTMLAnchorElement | null;
      if (!a) return;

      const href = a.getAttribute("href") || "";
      // On ne gère que les ancres internes de cette page
      if (!href.startsWith("#") || href === "#") return;

      // Ne casse pas CTRL/Cmd+click (nouvel onglet)
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;

      e.preventDefault();
      const id = decodeURIComponent(href.slice(1));
      scrollToId(id);
    };

    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  // Si la page est chargée avec un hash, scrolle vers la section avec offset
  useEffect(() => {
    if (location.hash && location.hash.length > 1) {
      const id = decodeURIComponent(location.hash.slice(1));
      // Delay pour laisser la nav mesurer sa hauteur
      const t = setTimeout(() => scrollToId(id), 0);
      return () => clearTimeout(t);
    }
  }, []);

  // Classe utilitaire pour ajouter du scroll-margin-top côté CSS (en plus du JS)
  // Cela améliore le comportement si quelqu'un accède via lien direct sans JS.
  const sectionOffsetClass = useMemo(() => "scroll-mt-28 md:scroll-mt-32", []);

  return (
    <div className="relative isolate min-h-screen font-sans antialiased bg-bg text-fg">
      {/* Skip link accessibilité */}
      <a href="#hero" className="skip-link">Aller au contenu principal</a>

      {/* === Fond animé Silk (plein écran, derrière le contenu) === */}
      <div aria-hidden className="absolute inset-0 z-0 pointer-events-none">
        <Silk
          speed={5}
          scale={1}
          color="#7B7481"         // Essaie #A78BFA / #84A2FF pour un rendu plus marqué
          noiseIntensity={1.4}
          rotation={0.2}
        />
      </div>

      {/* === Navigation en cartes (au-dessus du fond) === */}
      <CardNav
        logo={logoUrl}
        items={navItems}
        baseColor="rgba(255,255,255,0.06)"
        menuColor="#ffffff"
        buttonBgColor="#ffffff"
        buttonTextColor="#000000"
      />

      {/* === Contenu principal === */}
      <main className="relative z-10">
        <section id="hero" className={sectionOffsetClass}>
          <Hero />
        </section>

        <section id="bento" className={sectionOffsetClass}>
          <Bento />
        </section>

        <section id="about" className={sectionOffsetClass}>
          <About />
        </section>

        <section id="contact" className={sectionOffsetClass}>
          <Contact />
        </section>
      </main>

      <footer id="footer" className={sectionOffsetClass}>
        <Footer />
      </footer>
    </div>
  );
}
