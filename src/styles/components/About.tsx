// src/styles/components/About.tsx
import ProfileCard from "./ProfileCard";

export default function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20">
      <h2 className="text-3xl md:text-4xl font-semibold mb-6">À propos</h2>

      <p className="text-muted max-w-3xl">
        Je suis un développeur orienté produit : j’aime les détails, les animations subtiles,
        et les interfaces qui “sentent” la qualité. Mon stack : React, TypeScript, Tailwind,
        Framer Motion, Supabase. J’intègre facilement des composants animés pour transformer
        une page en expérience.
      </p>

      {/* Carte centrée */}
      <div className="mt-12 grid place-items-center">
        <ProfileCard
          name="Adriel Kourlate"
          title="Front-end Engineer"
          handle="adrielakak"
          status="Disponible"
          contactText="Me contacter"
          avatarUrl="/images/me.jpg"
          miniAvatarUrl="/images/me.jpg"
          showUserInfo
          enableTilt
          enableMobileTilt={false}
        />
      </div>
    </section>
  );
}
