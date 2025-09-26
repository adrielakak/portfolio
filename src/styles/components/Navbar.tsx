import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import Magnetic from "./ui/Magnetic";

const links = [
  { href: "#work", label: "Projets" },
  { href: "#about", label: "À propos" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-glass/40 border-b border-white/5">
      <nav className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="#" className="text-lg font-semibold tracking-tight">
          Adriel<span className="text-muted">.dev</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <a key={l.href} href={l.href} className="text-sm text-muted hover:text-fg transition">
              {l.label}
            </a>
          ))}
          <Magnetic>
            <a
              href="#contact"
              className="rounded-full px-4 py-2 text-sm border border-white/10 bg-white/5 hover:bg-white/10 transition shadow-soft"
            >
              Me contacter
            </a>
          </Magnetic>
        </div>

        <button className="md:hidden p-2 rounded-lg hover:bg-white/5" onClick={() => setOpen(v => !v)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Drawer mobile */}
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        className="md:hidden overflow-hidden border-t border-white/5 bg-black/60 backdrop-blur"
      >
        <div className="px-4 py-3 space-y-2">
          {links.map(l => (
            <a key={l.href} href={l.href} className="block text-sm py-2 text-muted hover:text-fg">
              {l.label}
            </a>
          ))}
        </div>
      </motion.div>
    </header>
  );
}

