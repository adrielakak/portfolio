// src/styles/components/Hero.tsx
import { motion } from "framer-motion";
import Magnetic from "./ui/Magnetic";
import TextType from "./ui/TextType";
import "./ui/typing-lock.css";

const PHRASE = "Des expériences web élégantes, rapides, mémorables.";

export default function Hero() {
  return (
    <section id="hero" className="relative isolate overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(600px 300px at 20% 20%, rgba(255,255,255,.06), transparent 60%), radial-gradient(800px 400px at 80% 10%, rgba(255,255,255,.05), transparent 60%)",
          }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-28 md:py-36">
        {/* Titre animé SANS tremblement (ghost réserve la hauteur) */}
        <motion.h1
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05]"
        >
          <div className="typing-wrap md:whitespace-nowrap">
            <span className="typing-ghost block">{PHRASE}</span>
            <TextType
              as="span"
              className="typing-live block"
              text={[PHRASE, PHRASE]}   // boucle tape/efface
              typingSpeed={48}
              deletingSpeed={24}
              pauseDuration={1500}
              variableSpeed={{ min: 28, max: 65 }}
              showCursor
              loop
              textColors={["#ffffff", "#e8ebf5", "#cfd6ff"]}
            />
          </div>
        </motion.h1>

        <motion.p
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.8, ease: "easeOut" }}
          className="mt-6 text-lg text-muted max-w-2xl"
        >
          Je conçois et développe des interfaces premium avec React,
          animations subtiles et performances dignes d’un produit Apple.
        </motion.p>

        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.8, ease: "easeOut" }}
          className="mt-10 flex items-center gap-4"
        >
          <Magnetic>
            <a
              href="#contact"
              className="rounded-full px-6 py-3 bg-white text-black text-sm font-medium hover:bg-white/90 transition"
            >
              Me contacter
            </a>
          </Magnetic>
          <a href="#about" className="text-sm text-muted hover:text-fg">
            En savoir plus
          </a>
        </motion.div>
      </div>
    </section>
  );
}
