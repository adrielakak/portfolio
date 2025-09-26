import React from "react";
import "./ShinyText.css";

type Props = {
  text: string;
  /** Désactive l’animation (utile mobile / reduced-motion) */
  disabled?: boolean;
  /** Durée d’un passage en secondes (par défaut 5s) */
  speed?: number;
  /** Classe Tailwind/custom en plus */
  className?: string;
};

export default function ShinyText({
  text,
  disabled = false,
  speed = 5,
  className = "",
}: Props) {
  // On passe la durée via CSS var pour animer côté CSS
  const style = { ["--shine-duration" as any]: `${speed}s` };

  return (
    <span
      className={`shiny-wrap ${disabled ? "is-disabled" : ""} ${className}`}
      style={style}
      data-text={text}
    >
      {/* Couche base : couleur lisible en continu */}
      <span className="shiny-base">{text}</span>

      {/* Couche gloss (dupliquée) : rayon animé par-dessus */}
      <span className="shiny-gloss" aria-hidden="true">
        {text}
      </span>
    </span>
  );
}