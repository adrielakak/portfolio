

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="footer" className="relative border-t border-white/10 py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-10">
        {/* Bloc texte */}
        <div className="text-center md:text-left">
          <p className="text-sm md:text-base">
            <span className="font-medium">Adriel Kourlate</span> — développe en <span className="font-medium">React</span> & <span className="font-medium">Tailwind</span>
          </p>
          <p className="text-xs text-muted/80 mt-1">© {year} — Tous droits réservés.</p>
        </div>

    
      </div>
    </footer>
  );
}
