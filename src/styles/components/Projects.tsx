import { motion } from "framer-motion";

const projects = [
  { title: "NightPulse", desc: "CRM / ticketing supersonique.", year: "2025" },
  { title: "Lazy Pirate", desc: "Site événementiel animé.", year: "2025" },
  { title: "TBA — The Borring App", desc: "App sociale, rencontres d’activités.", year: "2025" },
];

export default function Projects() {
  return (
    <section id="work" className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20">
      <div className="mb-8 flex items-end justify-between">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Travaux récents</h2>
        <p className="text-sm text-muted">Sélection</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {projects.map((p, i) => (
          <motion.article
            key={p.title}
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: i * 0.05, duration: .5 }}
            className="group rounded-2xl border border-white/10 bg-white/[.02] hover:bg-white/[.04] transition p-5 relative overflow-hidden shadow-soft"
          >
            {/* Placeholder pour insérer une “Tilted Card” ou “Fluid Glass” de React Bits */}
            <div className="aspect-[16/10] rounded-xl bg-gradient-to-br from-white/10 to-transparent mb-4" />
            <h3 className="text-lg font-medium">{p.title}</h3>
            <p className="text-sm text-muted mt-1">{p.desc}</p>
            <span className="absolute top-4 right-5 text-xs text-muted">{p.year}</span>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

