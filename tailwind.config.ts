import type { Config } from "tailwindcss";

export default {
  content: ["./index.html","./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        fg: "var(--fg)",
        muted: "var(--muted)",
        glass: "var(--glass)"
      },
      backdropBlur: { xs: "2px" },
      boxShadow: {
        soft: "0 0 0 1px var(--ring) inset, 0 8px 30px rgba(0,0,0,.35)"
      },
      fontFamily: {
        sans: [
          "SF Pro Text","SF Pro Display","-apple-system","system-ui",
          "Segoe UI","Roboto","Inter","Helvetica Neue","Arial","sans-serif"
        ]
      }
    }
  },
  plugins: []
} satisfies Config;

