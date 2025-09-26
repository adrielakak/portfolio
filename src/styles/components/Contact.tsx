import Magnetic from "./ui/Magnetic";

export default function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-24">
      <div className="rounded-3xl border border-white/10 bg-white/[.03] backdrop-blur-md p-8 md:p-12 shadow-soft">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Travaillons ensemble</h2>
        <p className="mt-3 text-muted max-w-2xl">
          Un projet à lancer, une refonte “Apple-like”, ou besoin d’animations propres ?
          Envoie-moi un message et je reviens vers toi rapidement.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Magnetic>
            <a href="mailto:Adriel.kourlate5@audencia.com" className="rounded-full px-6 py-3 bg-white text-black text-sm font-medium hover:bg-white/90 transition">
              Adriel.kourlate5@audencia.com
            </a>
          </Magnetic>
          <a href="https://www.linkedin.com" className="https://www.linkedin.com/in/adriel-kourlate">LinkedIn</a>
          <a href="https://github.com/adrielakak" className="text-sm text-muted hover:text-fg">GitHub</a>
        </div>
      </div>
    </section>
  );
}
