import MagicBento, { type MagicBentoCard } from "./bits/MagicBento";

const cards: MagicBentoCard[] = [
  {
    label: "KPI",
    stat: { value: 96, suffix: "%", label: "Satisfaction", decimals: 0 },
    description: "Feedback clients",
    href: "#contact",
  },
  {
    label: "KPI",
    stat: { value: 4, label: "Stacks front", decimals: 0 },
    description: "React • TS • Motion • Tailwind",
  },
  //  GRAND (2x2) avec vidéo
  {
    label: "KPI",
    stat: { value: 106, suffix: "+", label: "Composants créatifs", decimals: 0 },
    description: "Grandit chaque semaine",
    span: "2x2",
    href: "https://github.com/adrielakak",
    external: true,
    video: {
      src: "/videos/nebula.mp4",
      poster: "/videos/nebula.jpg",
      autoplay: true,
      loop: true,
      muted: true,
      playbackRate: 0.8,
    },
  },
  //  LARGE (2x1) avec vidéo
  {
    label: "KPI",
    stat: { value: 12, suffix: "k", label: "Utilisateurs touchés", decimals: 0 },
    description: "à travers mes projets",
    span: "2x1",
    video: {
      src: "/videos/248691_small.mp4",
      poster: "/videos/flow.jpg",
      autoplay: true,
      loop: true,
      muted: true,
      playbackRate: 0.9,
    },
  },
  { label: "KPI", stat: { value: 28, suffix: "+", label: "Projets livrés", decimals: 0 }, description: "Du POC au prod" },
  { label: "KPI", stat: { value: 3, suffix: "j", label: "Time-to-MVP", decimals: 0 }, description: "en moyenne" },
];

export default function Bento() {
  return (
    <section id="bento" className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20">
      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-8">Main Figures</h2>
      <MagicBento
        cards={cards}
        textAutoHide
        enableStars
        enableSpotlight
        enableBorderGlow
        spotlightRadius={320}
        particleCount={10}
        enableTilt
        glowColor="132, 0, 255"
        clickEffect
        enableMagnetism
      />
    </section>
  );
}
