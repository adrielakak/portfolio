// src/App.tsx
import { useEffect } from "react";

// Sections
import Hero from "./styles/components/Hero";
import Bento from "./styles/components/Bento";
import About from "./styles/components/About";
import Contact from "./styles/components/Contact";
import Footer from "./styles/components/Footer";

// UI
import CardNav from "./styles/components/nav/CardNav";
import Silk from "./styles/components/bg/Silk";


// --- Chemin vers ton logo (mets /public/images/logo.svg)
const logoUrl = "/images/logo.svg";

// --- Items de navigation (cartes du menu)
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
      { label: "GitHub", href: "https://github.com/ton-compte", ariaLabel: "Ouvrir GitHub (nouvel onglet)" },
      { label: "LinkedIn", href: "https://linkedin.com/in/ton-profil", ariaLabel: "Ouvrir LinkedIn (nouvel onglet)" },
      { label: "CV (PDF)", href: "/files/CV.pdf", ariaLabel: "Télécharger CV (PDF)" },
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

// --- Logos (mets tes fichiers dans /public/images/brands/)
const logos = [
  { src: "/images/brands/react.svg", alt: "React", href: "https://react.dev" },
  { src: "/images/brands/typescript.svg", alt: "TypeScript", href: "https://www.typescriptlang.org" },
  { src: "/images/brands/vite.svg", alt: "Vite", href: "https://vitejs.dev" },
  { src: "/images/brands/tailwind.svg", alt: "Tailwind CSS", href: "https://tailwindcss.com" },
  { src: "/images/brands/framer.svg", alt: "Framer Motion", href: "https://www.framer.com/motion/" },
];

export default function App() {
  // Active le grain global (voir globals.css pour .grain::before)
  useEffect(() => {
    document.documentElement.classList.add("grain");
  }, []);

  return (
    <div className="relative isolate min-h-screen font-sans antialiased bg-bg text-fg">
      {/* === Fond animé Silk (plein écran, derrière le contenu) === */}
      <div aria-hidden className="absolute inset-0 z-0 pointer-events-none">
        <Silk
          speed={5}
          scale={1}
          color="#7B7481"       // Essaie #A78BFA / #84A2FF pour un rendu plus marqué
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
        <Hero />
        <Bento />
        <About />
        <Contact />
      </main>

      
      <Footer />
    </div>
  );
}